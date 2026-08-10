/**
 * Purpose: expose the atomic driver-claim operation as a reusable application use case.
 * The repository implementation is responsible for database-level concurrency control.
 */
import type { DriverRepository } from '../ports/repositories';

export class ClaimJob {
  constructor(private readonly drivers: DriverRepository) {}

  execute(input: { jobId: string; driverId: string; idempotencyKey: string }) {
    return this.drivers.claimJob(input);
  }
}
