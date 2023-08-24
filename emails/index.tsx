import {
	Body,
	Button,
	Container,
	Column,
	Head,
	Heading,
	Hr,
	Html,
	Img,
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
	username = 'Anonymous',
	starredRepos = [
		{
			id: 1234,
			description: 'Default Repository',
			language: 'None',
			updatedAt: new Date().toISOString(),
			stars: 0,
			url: 'https://github.com',
			owner: 'Anonymous',
			repo: 'Default_Repo'
		}
	]
}: GithubStarredRepoEmailProps) => {
	const previewText = `Most recent Github repos ${username} has starred`;

	return (
		<Html>
			<Head />
			<Preview>{previewText}</Preview>
			<Tailwind>
				<Body>
					<Container>
						<Section>
							<Heading>Most recent Github repos starred by {username}</Heading>
							{starredRepos.map((repo) => (
								<Section key={repo.id}>
									<Heading>
										{repo.owner}/{repo.repo}
									</Heading>
									<Text>{repo.description}</Text>
									<Text>Language: {repo.language}</Text>
									<Text>Stars: {repo.stars}</Text>
									<Button>
										<Link href={repo.url}>View on Github</Link>
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
