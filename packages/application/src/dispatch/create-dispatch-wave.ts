/**
 * Purpose: orchestrate a dispatch wave without owning transport, database, or map-provider details.
 */
import { eligibleCandidates } from '../../../domain/src/dispatch/dispatch';
import type { DriverRepository, DispatchNotifier } from '../ports/repositories';

export interface CreateDispatchWaveInput {
  jobId: string;
  cityId: string;
  latitude: number;
  longitude: number;
  radiusMeters: number;
  limit: number;
  expiresAt: Date;
}

export class CreateDispatchWave {
  constructor(
    private readonly drivers: DriverRepository,
    private readonly notifier: DispatchNotifier,
  ) {}

  async execute(input: CreateDispatchWaveInput): Promise<number> {
    const nearby = await this.drivers.findEligibleNearby(input);
    const candidates = eligibleCandidates(nearby.map((driver) => ({
      ...driver,
      available: true,
      eligible: true,
    }))).slice(0, input.limit);

    await Promise.all(
      candidates.map((candidate) =>
        this.notifier.sendOffer({
          driverId: candidate.driverId,
          jobId: input.jobId,
          expiresAt: input.expiresAt,
        }),
      ),
    );

    return candidates.length;
  }
}
