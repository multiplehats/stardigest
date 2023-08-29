import { dev } from '$app/environment';

export abstract class ApiService {
	protected baseUrl: string;
	protected apiKey: string;
	protected name: string;
	#debug = dev;

	constructor(apiKey: string, baseUrl: string, name: string) {
		this.apiKey = apiKey;
		this.baseUrl = baseUrl;
		this.name = name;
	}

	protected defaultHeaders() {
		return {
			Authorization: `Bearer ${this.apiKey}`,
			'Content-Type': 'application/json'
		};
	}

	protected async sendRequest<T>(endpoint: string, method: string, body?: unknown): Promise<T> {
		const perf = performance.now();

		const options: RequestInit = {
			method,
			headers: this.defaultHeaders()
		};

		if (body) {
			options.body = JSON.stringify(body);
		}

		const response = await fetch(`${this.baseUrl}/${endpoint}`, options);

		let responseData: unknown;

		const contentType = response.headers.get('content-type');

		if (contentType && contentType.indexOf('application/json') !== -1) {
			responseData = await response.json();
		} else {
			responseData = await response.text();
		}

		const perfEnd = performance.now();
		const perfDiff = (perfEnd - perf).toFixed(2);

		if (!response.ok) {
			if (this.#debug) {
				this.log(`[ERROR: ${this.name} - ${method} / ${endpoint} - ${perfDiff}ms]`, responseData);
			}

			throw new Error(`API error - ${response.status}: ${responseData}`);
		}

		if (this.#debug) {
			this.log(`[OK: ${this.name} - ${method} / ${endpoint} - ${perfDiff}ms]`);
		}

		return responseData as T;
	}

	protected log(...args: unknown[]) {
		if (this.#debug) {
			// eslint-disable-next-line no-console
			console.log(`[${this.name}]`, ...args);
		}
	}
}
