/**
 * Purpose: define the channel-independent identity types used by the platform.
 * This file intentionally contains no database, HTTP, Telegram, or UI dependency.
 */
export type ActorId = string & { readonly __brand: 'ActorId' };

export type ActorRole = 'customer' | 'driver' | 'merchant' | 'enterprise' | 'operator' | 'admin';

export interface Actor {
  readonly id: ActorId;
  readonly role: ActorRole;
  readonly displayName: string;
  readonly active: boolean;
}

export function actorId(value: string): ActorId {
  const normalized = value.trim();
  if (!normalized) throw new Error('ActorId cannot be empty');
  return normalized as ActorId;
}
