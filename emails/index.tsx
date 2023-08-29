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
} from '@react-email/components/dist/index';
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
	const now = Date.now();
	const ogHash = process.env.NODE_ENV === 'production' ? now : '123456789';

	return (
		<Html>
			<Head />
			<Preview>{previewText}</Preview>
			<Tailwind>
				<Body className="bg-[#121212] my-auto mx-auto font-sans">
					<Container className="my-[40px] mx-auto p-[20px] max-w-[580px] w-full">
						<Section>
							<a href="https://www.stardigest.app" target="_blank" rel="noreferrer">
								<Img
									src="https://www.stardigest.app/logo-email.png"
									className="mx-auto mb-[30px]"
									width="190"
									height="41"
									alt="Logo"
								/>
							</a>

							<Heading className="text-white text-[18px] font-bold text-center p-0 mb-[30px] mt-[18px] mx-0">
								Here's your star digest {username}
							</Heading>

							{starredRepos.map(({ id, owner, repo, description, stars, url }) => (
								<Section
									key={id}
									className="bg-[#1e1e1e] border-solid rounded-md border border-[#424241] w-auto px-4 py-6 mb-[30px]"
								>
									<Row className="mx-auto mb-[10px] align-center">
										<Column align="left" className="align-center">
											<a href={url} target="_blank" rel="noreferrer">
												<Heading className="text-white text-[22px] mt-[0px] mb-[0px]">
													{owner}/{repo}
												</Heading>
											</a>
										</Column>

										<Column align="right" className="align-center">
											<Text className="text-gray-400 text-[14px] mt-[0px] mb-[0px]">
												⭐️ {stars}
											</Text>
										</Column>
									</Row>

									<a href={url} target="_blank" rel="noreferrer">
										<Img
											width={480}
											className="w-full h-auto rounded-sm overflow-hidden mb-[20px]"
											src={`https://opengraph.githubassets.com/${ogHash}/${owner}/${repo}`}
										/>
									</a>

									<Text className="text-gray-400 text-[18px] mt-[0px] mb-[15px] leading-[26px]">
										{description}
									</Text>

									<Button
										pX={16}
										pY={8}
										className="bg-[#d3ac5b] rounded text-[#121212] text-[14px] font-semibold no-underline text-center"
										href={url}
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
