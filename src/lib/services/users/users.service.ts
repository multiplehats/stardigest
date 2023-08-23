import { schema } from '$lib/server/drizzle';
import { db } from '$lib/server/drizzle/db';
import { eq } from 'drizzle-orm';
import { Policy, type Resources, type GRID, type TPolicy } from '$lib/auth/policies';
import type { User } from 'lucia';
import { fail } from '@sveltejs/kit';
import { ErrCode } from '$lib/types';
import { ErrorCode } from '$lib/utils/error-class';

export class UserService {
	private user: User;
	private policy: TPolicy | null;

	constructor(user: User) {
		this.user = user;
		this.policy = this.getPolicy();
	}

	private getPolicy() {
		return this.user.policy ? Policy.parse<Resources, GRID>(this.user.policy) : null;
	}

	private async canUpdate() {
		const grid: GRID = `xx::user::${this.user.id}`;

		if (!this.policy) {
			throw new ErrorCode(ErrCode.Unauthorized, 'User has no policy.');
		}

		const { error } = this.policy.validate('user:update', grid);

		if (error) {
			throw new ErrorCode(ErrCode.Unauthorized, error);
		}

		return true;
	}

	public async getUser() {
		return await db.query.users.findFirst({
			where: eq(schema.users.id, this.user.id),
			with: {
				companies: {
					with: {
						members: true
					}
				},
				candidate: true
			}
		});
	}

	public async updateUser(data: Partial<typeof schema.users.$inferInsert>) {
		await this.canUpdate();

		return await db
			.update(schema.users)
			.set({
				...data
			})
			.where(eq(schema.users.id, this.user.id));
	}
}
