import { Octokit } from 'octokit';
import type { Redis } from '@upstash/redis';
import { redis } from '$lib/server/upstash';
import type { OcotokitStarsResponseStars, UserStar } from './types';
import { RequestError } from '@octokit/request-error';

export class GithubService {
	private apiVersion = '2022-11-28';
	private octokit: Octokit;
	private redis: Redis;
	private userId: string;
	private lastPage = /(.*)page=(.*)>; rel="last"/;

	constructor(private accessToken: string, userId: string) {
		this.octokit = new Octokit({ auth: accessToken });
		this.redis = redis;
		this.userId = userId;
	}

	private getStarsKey() {
		return `user:${this.userId}:stars`;
	}

	private defaultHeaders = {
		'X-GitHub-Api-Version': this.apiVersion,
		accept: 'application/vnd.github+json'
	};

	private addStar(owner: string, repo: string) {
		return this.redis.sadd(this.getStarsKey(), `${owner}/${repo}`);
	}

	private removeStar(owner: string, repo: string) {
		return this.redis.srem(this.getStarsKey(), `${owner}/${repo}`);
	}

	private isStarred(owner: string, repo: string) {
		return this.redis.sismember(this.getStarsKey(), `${owner}/${repo}`);
	}

	private async getRepoById(repoId: number) {
		const repo = await this.octokit.request('GET /repositories/{id}', {
			headers: this.defaultHeaders,
			id: repoId
		});

		return repo.data;
	}

	private async getRandomStarsPage() {
		const stars = await this.octokit.request('GET /user/starred', {
			headers: this.defaultHeaders,
			per_page: 100,
			sort: 'created',
			direction: 'desc'
		});

		if (stars.headers.link) {
			const pages = stars.headers.link.replace(this.lastPage, '$2');
			return Math.floor(Math.random() * Number(pages)) + 1;
		}

		return 1;
	}

	private formatStars(stars: OcotokitStarsResponseStars): UserStar[] {
		return stars.map((star) => {
			return {
				owner: star.owner.login,
				repo: star.name,
				id: star.id,
				updatedAt: star.updated_at,
				url: star.html_url,
				description: star.description,
				language: star.language,
				stars: star.stargazers_count
			} satisfies UserStar;
		});
	}

	private async getRandomStars(perPage = 8) {
		const page = await this.getRandomStarsPage();

		const stars = await this.octokit.request('GET /user/starred', {
			headers: this.defaultHeaders,
			per_page: perPage,
			page
		});

		return this.formatStars(stars.data);
	}

	async getUniqueRandomStars(perPage = 5): Promise<UserStar[]> {
		try {
			const stars = await this.getRandomStars(perPage);
			const uniqueStars: UserStar[] = [];
			const duplicateStars: UserStar[] = [];

			for (const star of stars) {
				const isStarred = await this.isStarred(star.owner, star.repo);

				if (isStarred) {
					duplicateStars.push(star);
				} else {
					uniqueStars.push(star);
					await this.addStar(star.owner, star.repo);
				}
			}

			if (uniqueStars.length < perPage) {
				const remainingStars = await this.getUniqueRandomStars(perPage - uniqueStars.length);
				uniqueStars.push(...remainingStars);
			}

			for (const star of duplicateStars) {
				await this.removeStar(star.owner, star.repo);
			}

			return uniqueStars;
		} catch (error) {
			if (error instanceof RequestError) {
				console.error('Octokit request error', error.message);
			} else if (error instanceof Error) {
				console.error('Error occurred:', error.message);
			}

			return Promise.reject(error);
		}
	}
}
