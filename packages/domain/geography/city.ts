import type { CountryCode } from "./country";

/**
 * Purpose: canonical city identity and launch/runtime configuration boundary.
 * The six Saudi launch cities are ordinary city records, not special cases.
 */
export interface City {
  readonly id: string;
  readonly country: CountryCode;
  readonly nameEn: string;
  readonly nameAr: string;
  readonly timeZone: string;
  readonly currency: string;
  readonly enabled: boolean;
  readonly commercialLaunch: boolean;
}

export const SAUDI_LAUNCH_CITIES: readonly City[] = Object.freeze([
  { id: "sa-riyadh", country: "SA", nameEn: "Riyadh", nameAr: "الرياض", timeZone: "Asia/Riyadh", currency: "SAR", enabled: true, commercialLaunch: true },
  { id: "sa-jeddah", country: "SA", nameEn: "Jeddah", nameAr: "جدة", timeZone: "Asia/Riyadh", currency: "SAR", enabled: true, commercialLaunch: true },
  { id: "sa-makkah", country: "SA", nameEn: "Makkah", nameAr: "مكة المكرمة", timeZone: "Asia/Riyadh", currency: "SAR", enabled: true, commercialLaunch: true },
  { id: "sa-taif", country: "SA", nameEn: "Taif", nameAr: "الطائف", timeZone: "Asia/Riyadh", currency: "SAR", enabled: true, commercialLaunch: true },
  { id: "sa-madinah", country: "SA", nameEn: "Madinah", nameAr: "المدينة المنورة", timeZone: "Asia/Riyadh", currency: "SAR", enabled: true, commercialLaunch: true },
  { id: "sa-dammam", country: "SA", nameEn: "Dammam", nameAr: "الدمام", timeZone: "Asia/Riyadh", currency: "SAR", enabled: true, commercialLaunch: true },
]);
