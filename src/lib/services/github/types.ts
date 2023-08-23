import type { Endpoints } from '@octokit/types';

export type OctokitStarsResponse = Endpoints['GET /user/starred']['response'];
export type OcotokitStarsResponseStars = OctokitStarsResponse['data'];
export type OcotokitStarsResponseStar = OcotokitStarsResponseStars[0];

export type UserStar = Pick<OcotokitStarsResponseStar, 'id' | 'description' | 'language'> & {
	updatedAt: string | null;
	stars: number;
	url: string;
	owner: string;
	repo: string;
};
