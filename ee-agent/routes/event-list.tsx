import { Head } from "$fresh/runtime.ts";
import { Handlers, PageProps } from "$fresh/server.ts";
import { EventEdge, SQLType } from "event-edge/common/types.ts";
import { sql } from "../db.ts";
import Counter from "../islands/Counter.tsx";
import EventList from "../islands/EventList.tsx";
import {
  EVENT_EDGE_TABLE_MAP,
  EVENT_EDGE_TABLE_NAME,
} from "event-edge/ee-store/constant.ts";

type Data = Pick<
  EventEdge,
  "num" | "type" | "afterAt" | "interval" | "updatedAt" | "state" | "handler"
>[];

export const handler: Handlers<Data> = {
  async GET(_req, ctx) {
    const res: Data = await sql`
SELECT
  ${select(
    ["num", "type", "afterAt", "interval", "updatedAt", 'state', 'handler'],
    EVENT_EDGE_TABLE_MAP
  )}
FROM ${sql(EVENT_EDGE_TABLE_NAME)}
LIMIT 10`;
    return ctx.render(res);
  },
};

export default function (props: PageProps<Data>) {
  console.log("props.data", props.data);
  return (
    <>
      <Head>
        <title>Event List</title>
      </Head>
      <div class="p-4 mx-auto max-w-screen-md">
        <EventList data={props.data} />
      </div>
    </>
  );
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
function select<T>(
  k: (keyof T)[],
  m: Record<keyof T, { k: string; }>
) {
  return k.reduce((pre, v, i) => {
    if (typeof v !== "string") {
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
