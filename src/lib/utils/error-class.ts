import type { ErrCode } from '$lib/types';

export class ErrorCode extends Error {
	public status: ErrCode;

	constructor(status: ErrCode, message: string) {
		super(message);
		this.status = status;
	}
}
