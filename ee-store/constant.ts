import { EventEdge, SQLType } from '../common/types.ts';

export const EVENT_EDGE_TABLE_NAME = 'event_edge';

export const EVENT_EDGE_TABLE_MAP: Record<
  keyof EventEdge,
  { k: string; t: SQLType; nullable?: boolean }
> = {
  id: { k: 'id', t: 'bigint' },
  type: { k: 'type', t: 'text' },
  num: { k: 'num', t: 'text' },
  afterAt: { k: 'after_at', t: 'bigint', nullable: true },
  beforeAt: { k: 'before_at', t: 'bigint', nullable: true },
  maxRetry: { k: 'max_retry', t: 'bigint' },
  hadRetry: { k: 'had_retry', t: 'bigint' },
  interval: { k: 'interval', t: 'bigint' },
  payload: { k: 'payload', t: 'jsonb' },
  result: { k: 'result', t: 'jsonb' },
  createdAt: { k: 'created_at', t: 'bigint' },
  updatedAt: { k: 'updated_at', t: 'bigint' },
  state: { k: 'state', t: 'text' },
  handler: { k: 'handler', t: 'text', nullable: true },
};
