import type { Icons } from '$components/icons';

export enum PROVIDER_ID {
	GITHUB = 'github'
}

export enum STATE_COOKIE {
	GITHUB_OAUTH_STATE = 'github_oauth_state'
}

export type ProviderItem = {
	id: PROVIDER_ID;
	icon: typeof Icons.github;
	label: string;
};

export type GithubOAuthTokens =
	| {
			accessToken: string;
			accessTokenExpiresIn: null;
	  }
	| {
			accessToken: string;
			accessTokenExpiresIn: number;
			refreshToken: string;
			refreshTokenExpiresIn: number;
	  };
