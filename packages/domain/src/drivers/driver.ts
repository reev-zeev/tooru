/**
 * Purpose: model the driver lifecycle and availability contract independently of transport and persistence.
 */
export type DriverStatus = 'pending_verification' | 'active' | 'suspended' | 'deactivated';
export type DriverAvailability = 'offline' | 'available' | 'busy';

export interface Driver {
  readonly id: string;
  readonly actorId: string;
  readonly cityId: string;
  readonly status: DriverStatus;
  readonly availability: DriverAvailability;
  readonly latitude?: number;
  readonly longitude?: number;
}

export function canAcceptJobs(driver: Driver): boolean {
  return driver.status === 'active' && driver.availability === 'available';
}
