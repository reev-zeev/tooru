import type { Coordinates } from "../../domain/geography/coordinates";
import type { Job, JobKind } from "../../domain/orders/job";

/**
 * Purpose: ports required by dispatch without coupling the use case to a
 * database, cache, map provider, queue, or messaging vendor.
 */
export interface DriverCandidate {
  readonly driverId: string;
  readonly distanceMeters: number;
  readonly available: boolean;
  readonly eligible: boolean;
}

export interface DriverLocator {
  nearby(point: Coordinates, radiusMeters: number, kind: JobKind): Promise<readonly DriverCandidate[]>;
}

export interface JobRepository {
  getById(jobId: string): Promise<Job | null>;
  moveToDispatching(jobId: string): Promise<boolean>;
  assignDriver(jobId: string, driverId: string): Promise<boolean>;
}

export interface DispatchClock {
  now(): Date;
}

export interface DispatchNotifier {
  offer(driverId: string, jobId: string): Promise<void>;
}
