/**
 * Purpose: keep customer/driver communication behind a channel-neutral application port.
 */
export type NotificationChannel = 'push' | 'sms' | 'email' | 'telegram' | 'whatsapp' | 'webhook';

export interface NotificationMessage {
  readonly recipientId: string;
  readonly template: string;
  readonly variables: Readonly<Record<string, string | number>>;
  readonly channels: readonly NotificationChannel[];
  readonly idempotencyKey: string;
}

export interface NotificationService {
  send(message: NotificationMessage): Promise<void>;
}
