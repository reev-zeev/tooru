/**
 * Purpose: represent a validated geographic coordinate as a domain value object.
 * Keeping validation here prevents invalid latitude/longitude values from
 * leaking into dispatch, pricing, or persistence code.
 */
export interface Coordinates {
  readonly latitude: number;
  readonly longitude: number;
}

export function coordinates(latitude: number, longitude: number): Coordinates {
  if (!Number.isFinite(latitude) || latitude < -90 || latitude > 90) {
    throw new Error("Invalid latitude");
  }
  if (!Number.isFinite(longitude) || longitude < -180 || longitude > 180) {
    throw new Error("Invalid longitude");
  }
  return Object.freeze({ latitude, longitude });
}
