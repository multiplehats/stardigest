import { customAlphabet } from 'nanoid';

// An ID collision is when the same ID is generated twice. If this happens seldomly, it’s not a big deal.
// The application can detect a collision, auto-generate a new ID, and move on. If this is happening often though, it can be a huge problem.
// The longer and more complex the ID, the less likely it is to happen. Determining the complexity needed for the ID depends on the application.
// In our case, we used the NanoID collision tool and decided to use 12 character long IDs with the alphabet of 0123456789abcdefghijklmnopqrstuvwxyz.
// This gives us a 1% probability of a collision in the next ~35 years if we are generating 1,000 IDs per hour.
// If we ever need to increase this, the change would be as simple as increasing the length in our ID generator and updating our database schema to accept the new size.
const ALPHABET = '0123456789abcdefghijklmnopqrstuvwxyz';
const ID_LENGTH = 12;

const prefixes: Record<string, string> = {
	user: 'user'
} as const;
// Max length of id will be 12 (id length) + 1 (underscore) + 9 (prefix length) = 22

export function newId(prefix: keyof typeof prefixes): string {
	const nanoid = customAlphabet(ALPHABET, ID_LENGTH);

	return `${prefixes[prefix]}_${nanoid()}`;
}
