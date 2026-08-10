/**
 * Purpose: model service coverage as configurable geography rather than hard-coded city checks.
 */
export interface ServiceArea {
  readonly id: string;
  readonly cityId: string;
  readonly name: string;
  readonly active: boolean;
  readonly polygonRef?: string;
}

export interface CoveragePolicy {
  readonly serviceAreaId: string;
  readonly services: readonly ('ride' | 'delivery' | 'pickup')[];
  readonly active: boolean;
}

export function supportsService(policy: CoveragePolicy, service: CoveragePolicy['services'][number]): boolean {
  return policy.active && policy.services.includes(service);
}
