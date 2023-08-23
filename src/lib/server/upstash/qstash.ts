import {
	UPSTASH_QSTASH_CURRENT_SIGNING_KEY,
	UPSTASH_QSTASH_NEXT_SIGNING_KEY,
	UPSTASH_QSTASH_TOKEN
} from '$env/static/private';
import { Client, Receiver } from '@upstash/qstash';

export const qstash = new Client({
	token: UPSTASH_QSTASH_TOKEN
});

const qstashReceiver = new Receiver({
	currentSigningKey: UPSTASH_QSTASH_CURRENT_SIGNING_KEY,
	nextSigningKey: UPSTASH_QSTASH_NEXT_SIGNING_KEY
});

export const validateQstashSignature = async (request: Request) => {
	const signature = request.headers.get('upstash-signature');

	if (!signature) {
		return false;
	}

	// read the body into a string
	const body = await request.clone().text();

	return await qstashReceiver.verify({
		signature: signature,
		body: body
	});
};
