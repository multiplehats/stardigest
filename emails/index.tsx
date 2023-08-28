import {
	Body,
	Button,
	Container,
	Head,
	Heading,
	Html,
	Img,
	Link,
	Column,
	Preview,
	Row,
	Section,
	Tailwind,
	Text
} from '@react-email/components';
import * as React from 'react';
import { UserStar } from '../src/lib/services/github/types';
import { fauxStars } from './email-config';

interface GithubStarredRepoEmailProps {
	username: string;
	starredRepos: UserStar[];
}

export const GithubStarredRepoEmail = ({
	username = 'multiplehats',
	starredRepos = fauxStars
}: GithubStarredRepoEmailProps) => {
	const previewText = `Most recent Github repos ${username} has starred`;

	return (
		<Html>
			<Head />
			<Preview>{previewText}</Preview>
			<Tailwind>
				<Body className="bg-[#121212] my-auto mx-auto font-sans">
					<Container className="my-[40px] mx-auto p-[20px] max-w-[580px] w-full">
						<Section>
							<Heading className="text-white text-[18px] font-bold text-center p-0 mb-[30px] mt-[18px] mx-0">
								Here's your star digest {username}
							</Heading>

							{starredRepos.map((repo) => (
								<Section
									key={repo.id}
									className="bg-[#1e1e1e] border-solid rounded-md border border-[#424241] w-auto px-4 py-3 mb-[30px]"
								>
									<Row className="mx-auto mb-[10px] align-top">
										<Column align="left" className="align-top">
											<Heading className="text-white text-[22px] mt-[0px] mb-[0px]">
												{repo.owner}/{repo.repo}
											</Heading>

											<Text className="text-gray-400 max-w-[400px] text-[14px] mt-[0px] mb-[0px] leading-[24px]">
												{repo.description}
											</Text>
										</Column>

										<Column align="right" className="align-top">
											<Text className="text-gray-400 text-[14px] mt-[0px] mb-[0px]">
												⭐️ {repo.stars}
											</Text>
										</Column>
									</Row>

									<Img
										width={480}
										className="w-full h-auto rounded-sm overflow-hidden mb-[20px]"
										src="https://opengraph.githubassets.com/3b3e1c4b4b4b4b4b4b4b4b4b4b4b4b4b/multiplehats/stardrip"
									/>

									<Button
										pX={16}
										pY={8}
										className="bg-[#d3ac5b] rounded text-white text-[12px] font-semibold no-underline text-center"
										href={repo.url}
									>
										Hop back in
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
