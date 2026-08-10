/**
 * Purpose: define application-layer persistence ports. Concrete SQL/ORM implementations belong in infrastructure.
 */

export interface OrderRepository {
  getById(orderId: string): Promise<unknown | null>;
  save(order: unknown): Promise<void>;
}

export interface DriverRepository {
  findEligibleNearby(input: {
    cityId: string;
    latitude: number;
    longitude: number;
    radiusMeters: number;
    limit: number;
  }): Promise<readonly { driverId: string; distanceMeters: number }[]>;

  /**
   * Atomically claims a dispatchable job for a driver.
   * Implementations must make this operation concurrency-safe and idempotent.
   */
  claimJob(input: { jobId: string; driverId: string; idempotencyKey: string }): Promise<'claimed' | 'already_claimed' | 'not_available'>;
}

export interface DispatchNotifier {
  sendOffer(input: { driverId: string; jobId: string; expiresAt: Date }): Promise<void>;
}
