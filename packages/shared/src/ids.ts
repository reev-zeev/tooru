export type Brand<T, B extends string> = T & { readonly __brand: B };

export type CountryCode = Brand<string, "CountryCode">;
export type CityId = Brand<string, "CityId">;
export type ServiceAreaId = Brand<string, "ServiceAreaId">;
export type ActorId = Brand<string, "ActorId">;
export type JobId = Brand<string, "JobId">;
export type DriverId = Brand<string, "DriverId">;
export type CustomerId = Brand<string, "CustomerId">;
export type MerchantId = Brand<string, "MerchantId">;
export type MoneyMinor = Brand<bigint, "MoneyMinor">;

export const countryCode = (value: string): CountryCode => value.trim().toUpperCase() as CountryCode;
export const cityId = (value: string): CityId => value.trim().toLowerCase() as CityId;
export const moneyMinor = (value: bigint): MoneyMinor => value as MoneyMinor;
