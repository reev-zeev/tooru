/**
 * Purpose: define the canonical logistics order aggregate independently of any channel.
 * An order is the commercial request; execution is represented by a Job.
 */
export type OrderId = string & { readonly __brand: 'OrderId' };
export type OrderKind = 'delivery' | 'pickup' | 'ride';
export type OrderStatus = 'draft' | 'quoted' | 'confirmed' | 'assigned' | 'in_progress' | 'completed' | 'cancelled';

export interface OrderStop {
  readonly latitude: number;
  readonly longitude: number;
  readonly address?: string;
  readonly contactName?: string;
  readonly contactPhone?: string;
}

export interface Order {
  readonly id: OrderId;
  readonly kind: OrderKind;
  readonly customerId: string;
  readonly cityId: string;
  readonly stops: readonly OrderStop[];
  readonly status: OrderStatus;
  readonly createdAt: Date;
}

export function orderId(value: string): OrderId {
  const normalized = value.trim();
  if (!normalized) throw new Error('OrderId cannot be empty');
  return normalized as OrderId;
}

export function canTransitionOrder(from: OrderStatus, to: OrderStatus): boolean {
  const transitions: Record<OrderStatus, readonly OrderStatus[]> = {
    draft: ['quoted', 'cancelled'],
    quoted: ['confirmed', 'cancelled'],
    confirmed: ['assigned', 'cancelled'],
    assigned: ['in_progress', 'cancelled'],
    in_progress: ['completed', 'cancelled'],
    completed: [],
    cancelled: [],
  };
  return transitions[from].includes(to);
}
