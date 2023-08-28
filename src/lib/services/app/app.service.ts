export abstract class AppService {
	/**
	 * The interface that defines event.locals, which can be accessed in hooks (handle, and handleError), server-only load functions, and +server.js files.
	 */
	protected locals: App.Locals;
	/**
	 * The current request
	 */
	protected request: Request;

	constructor(request: Request, locals: App.Locals) {
		this.locals = locals;
		this.request = request;
	}

	/**
	 * Taken from:
	 * @see https://github.com/scopsy/await-to-js
	 */
	protected async to<T, U = Error>(
		promise: Promise<T>,
		errorExt?: object
	): Promise<[U, undefined] | [null, T]> {
		return promise
			.then<[null, T]>((data: T) => [null, data])
			.catch<[U, undefined]>((err: U) => {
				if (errorExt) {
					const parsedError = Object.assign({}, err, errorExt);
					return [parsedError, undefined];
				}

				return [err, undefined];
			});
	}

	public log(...args: unknown[]) {
		console.log(...args);
	}
}
