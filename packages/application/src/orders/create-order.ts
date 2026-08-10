/**
 * Purpose: execute the first transactional order creation use case.
 * Transport adapters must call this service instead of creating database records directly.
 */
import type { OrderRepository } from '../ports/repositories';
import { orderId, type Order } from '../../../domain/src/orders/order';

export interface CreateOrderInput {
  id: string;
  customerId: string;
  cityId: string;
  kind: Order['kind'];
  stops: Order['stops'];
}

export class CreateOrder {
  constructor(private readonly orders: OrderRepository) {}

  async execute(input: CreateOrderInput): Promise<Order> {
    if (input.stops.length < 2) throw new Error('An order requires at least two stops');

    const order: Order = {
      id: orderId(input.id),
      customerId: input.customerId,
      cityId: input.cityId,
      kind: input.kind,
      stops: input.stops,
      status: 'draft',
      createdAt: new Date(),
    };

    await this.orders.save(order);
    return order;
  }
}
