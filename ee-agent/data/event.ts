import { EventEdge } from 'event-edge/common/types.ts';
import {
  EVENT_EDGE_TABLE_MAP,
  EVENT_EDGE_TABLE_NAME,
} from 'event-edge/ee-store/constant.ts';
import { sql } from '../db.ts';

/**
 * [数据接口] 获取 event
 */
export async function getEvents<K extends keyof EventEdge>(
  keys: K[],
): Promise<Pick<EventEdge, K>[]> {
  const res = await sql`
SELECT
  ${select(keys, EVENT_EDGE_TABLE_MAP)}
FROM ${sql(EVENT_EDGE_TABLE_NAME)}
LIMIT 10`;

  return res.map((v: Partial<EventEdge>) => {
    if (v.afterAt !== undefined) {
      v.afterAt = Number(v.afterAt);
    }
    if (v.updatedAt !== undefined) {
      v.updatedAt = Number(v.updatedAt);
    }
    if (v.interval !== undefined) {
      v.interval = Number(v.interval);
    }
    return v as Pick<EventEdge, K>;
  });
}

/**
 * 将 SELECT 的 key 改为数据库的列名
 *
 * 功能点:
 *
 * 1. 专为 postgresjs 设计.
 *
 * @param k 需要的 keys
 * @param m 映射关系
 * @returns
 */
function select<T>(k: (keyof T)[], m: Record<keyof T, { k: string }>) {
  return k.reduce((pre, v, i) => {
    if (typeof v !== 'string') {
      return pre;
    }
    const sqlname = m[v].k;
    const jsname: string = v;
    const s = sql`${sql(sqlname)} as ${sql(jsname)}`;
    if (i === 0) {
      return s;
    }
    return sql`${pre}, ${s}`;
  }, sql``);
}
