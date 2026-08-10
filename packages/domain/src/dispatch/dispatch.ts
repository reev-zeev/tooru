/**
 * Purpose: define dispatch decisions and eligibility contracts without binding dispatch to a map vendor or channel.
 */
export type DispatchCandidate = {
  readonly driverId: string;
  readonly distanceMeters: number;
  readonly available: boolean;
  readonly eligible: boolean;
};

export type DispatchDecision = {
  readonly jobId: string;
  readonly candidates: readonly DispatchCandidate[];
  readonly strategy: 'nearest' | 'balanced' | 'priority';
};

export function eligibleCandidates(candidates: readonly DispatchCandidate[]): DispatchCandidate[] {
  return candidates
    .filter((candidate) => candidate.available && candidate.eligible)
    .sort((a, b) => a.distanceMeters - b.distanceMeters);
}
