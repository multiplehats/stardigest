import {
	Body,
	Button,
	Container,
	Head,
	Heading,
	Html,
	Link,
	Preview,
	Row,
	Section,
	Tailwind,
	Text
} from '@react-email/components';
import * as React from 'react';
import { UserStar } from '../src/lib/services/github/types';

interface GithubStarredRepoEmailProps {
	username: string;
	starredRepos: UserStar[];
}

export const GithubStarredRepoEmail = ({
	username = 'multiplehats',
	starredRepos = [
		{
			id: 1234,
			description: 'web development, streamlined',
			language: 'Javascript',
			updatedAt: new Date().toISOString(),
			stars: 15900,
			url: 'https://github.com/sveltejs/kit',
			owner: 'sveltejskit',
			repo: 'kit'
		},
		// nextjs
		{
			id: 1235,
			description: 'The React Framework for Production',
			language: 'Javascript',
			updatedAt: new Date().toISOString(),
			stars: 69000,
			url: 'https://github.com/vercel/next.js',
			owner: 'vercel',
			repo: 'next.js'
		},
		{
			id: 1236,
			description: 'High performance node.js/PostgreSQL job queue',
			language: 'JavaScript',
			updatedAt: new Date().toISOString(),
			stars: 2000,
			url: 'https://github.com/graphile/worker',
			owner: 'graphile',
			repo: 'worker'
		},
		{
			id: 1237,
			description: 'Modern unit testing framework for JavaScript',
			language: 'JavaScript',
			updatedAt: new Date().toISOString(),
			stars: 34700,
			url: 'https://github.com/facebook/jest',
			owner: 'facebook',
			repo: 'jest'
		},
		{
			id: 1238,
			description: 'Fast and lightweight JavaScript library',
			language: 'JavaScript',
			updatedAt: new Date().toISOString(),
			stars: 55000,
			url: 'https://github.com/jquery/jquery',
			owner: 'jquery',
			repo: 'jquery'
		},
		{
			id: 1239,
			description: 'Visual primitive for React',
			language: 'JavaScript',
			updatedAt: new Date().toISOString(),
			stars: 20500,
			url: 'https://github.com/pmndrs/react-three-fiber',
			owner: 'pmndrs',
			repo: 'react-three-fiber'
		},
		{
			id: 1240,
			description: 'The world’s most popular framework for building responsive, mobile-first sites',
			language: 'JavaScript',
			updatedAt: new Date().toISOString(),
			stars: 152000,
			url: 'https://github.com/twbs/bootstrap',
			owner: 'twbs',
			repo: 'bootstrap'
		}
	]
}: GithubStarredRepoEmailProps) => {
	const previewText = `Most recent Github repos ${username} has starred`;

	return (
		<Html>
			<Head />
			<Preview>{previewText}</Preview>
			<Tailwind>
				<Body className="bg-black my-auto mx-auto font-sans">
					<Container className="border border-solid border-[#212020] rounded my-[40px] mx-auto p-[20px] w-[465px]">
						<Section>
							<Heading className="text-white text-[18px] font-bold text-center p-0 mb-[30px] mt-[18px] mx-0">
								Here's your star digest {username}
							</Heading>

							{starredRepos.map((repo) => (
								<Section key={repo.id} className="bg-[#020202] px-4 py-3 mb-[18px]">
									<Heading className="text-white text-[18px] mt-[0px] mb-[5px]">
										{repo.owner}/{repo.repo}
									</Heading>

									<Text className="text-gray-400 text-[14px] mt-[0px] mb-[10px] leading-[24px]">
										{repo.description}
									</Text>

									<Button
										pX={16}
										pY={8}
										className="bg-[#1b1b1b] rounded text-white text-[12px] font-semibold no-underline text-center"
										href={repo.url}
									>
										View on Github
									</Button>
								</Section>
							))}
						</Section>
					</Container>
				</Body>
			</Tailwind>
		</Html>
	);
};

export default GithubStarredRepoEmail;
