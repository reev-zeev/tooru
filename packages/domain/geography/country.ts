/**
 * Purpose: canonical country identity used by the platform domain.
 * Country data must not be embedded in channel handlers or UI code.
 */
export type CountryCode =
  | "SA"
  | "AE"
  | "BH"
  | "KW"
  | "OM"
  | "QA"
  | "YE"
  | "JO"
  | "LB"
  | "SY"
  | "IQ"
  | "TR"
  | "EG";

export interface Country {
  readonly code: CountryCode;
  readonly nameEn: string;
  readonly defaultCurrency: string;
  readonly defaultLocale: string;
  readonly defaultTimeZone: string;
  readonly enabled: boolean;
}
