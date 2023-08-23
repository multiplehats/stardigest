import { Policy as GenericPolicy } from '@chronark/access-policies/dist/index';

export type Resources = {
	user: ['create', 'read', 'update', 'delete'];
};

/**
 * Company member id
 */
type UserId = string;
type ResourceId = string;
type ResourceKey = keyof Resources;
export type GRID = `${UserId}::${keyof Resources | '*'}::${ResourceId | '*'}`;

export class Policy extends GenericPolicy<Resources, GRID> {
	toJSON() {
		return JSON.parse(this.toString());
	}

	static fromJSON(json: unknown) {
		return Policy.parse(JSON.stringify(json));
	}
}
export type TPolicy = GenericPolicy<Resources, GRID>;

export function getPolicyGridBreakdown(grid: string): {
	userIdOrCompanyId: string;
	resourceType: ResourceKey | '*';
	resourceId: string | '*';
} {
	const [userIdOrCompanyId, resourceType, resourceId] = grid.split('::') as [
		string,
		ResourceKey | '*',
		string
	];

	return {
		userIdOrCompanyId,
		resourceType,
		resourceId
	};
}

export function getPolicyResourceTypeName(_grid: string) {
	const grid = _grid as GRID;
	const { resourceType } = getPolicyGridBreakdown(grid);

	switch (resourceType) {
		case 'user':
			return `User`;
		case '*':
			return `All`;
		default:
			return `Unknown`;
	}
}

export function getPolicyResourceActions(_grid: string) {
	const grid = _grid as GRID;
	const { resourceType } = getPolicyGridBreakdown(grid);

	switch (resourceType) {
		case 'user':
			return ['create', 'read', 'update', 'delete'] satisfies Resources['user'];
		default:
			throw new Error(`Unknown resource type: ${resourceType}`);
	}
}

/**
 * Merge given policies into a single policy.
 *
 * @param policyOne The first policy object to merge.
 * @param policyTwo The second policy object to merge.
 * @returns A new policy object integrating both input policies.
 * @example
 * ```ts
 * import { mergePolicies } from "@chronark/access-policies";
 * import type { Resources, GRID } from "@your-lib/types";
 *
 * const policyOne = new Policy<Resources, GRID>({
 *   resources: {
 *     link: {
 *       "planetfall::link::*": ["create", "read"],
 *       "planetfall::link::1234": ["delete"],
 *     },
 *   },
 * });
 *
 * const policyTwo = new Policy<Resources, GRID>({
 *   resources: {
 *     team: {
 *       "vercel::team::xyz": ["create", "read", "addMember", "delete"],
 *     }
 *   },
 * });
 *
 * const mergedPolicy = mergePolicies<Resources, GRID>(policyOne, policyTwo);
 *
 * console.log(mergedPolicy.toString());
 *
 * // {
 * //   "version": "v1",
 * //   "statements": [
 * //     {
 * //       "resources": {
 * //         "link": {
 * //           "planetfall::link::*": ["create", "read"],
 * //           "planetfall::link::1234": ["delete"]
 * //         },
 * //         "team": {
 * //           "vercel::team::xyz": ["create", "read", "addMember", "delete"]
 * //         }
 * //       }
 * //     }
 * //   ]
 * // }
 * //
 * ```
 */
export const mergePolicies = <
	TResources extends Resources,
	TResourceIdentifier extends string = string
>(
	policyOne: GenericPolicy<TResources, TResourceIdentifier>,
	policyTwo: GenericPolicy<TResources, TResourceIdentifier>
): GenericPolicy<TResources, TResourceIdentifier> => {
	const map: Record<string, any> = {};

	[policyOne, policyTwo].forEach((policy) => {
		policy.statements.forEach((statement) => {
			for (const resourceType in statement.resources) {
				if (!map[resourceType]) {
					map[resourceType] = {};
				}
				for (const resourceId in statement.resources[resourceType]!) {
					// Non-null assertion added here
					const resourceActions = statement.resources[resourceType]![resourceId]; // Non-null assertions added here
					if (!map[resourceType][resourceId]) {
						map[resourceType][resourceId] = new Set(resourceActions);
					} else {
						resourceActions.forEach((action: any) => {
							(map[resourceType][resourceId] as Set<any>).add(action);
						});
					}
				}
			}
		});
	});

	// Transform Set back into an array
	for (const resourceType in map) {
		for (const resourceId in map[resourceType]) {
			map[resourceType][resourceId] = Array.from(map[resourceType][resourceId] as Set<any>);
		}
	}

	return new GenericPolicy<TResources, TResourceIdentifier>({ resources: map as any });
};
