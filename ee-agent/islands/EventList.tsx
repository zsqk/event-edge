import { EventEdge, EventEdgeState } from "event-edge/common/types.ts";

type EventListProps = {
  data: Pick<
    EventEdge,
    "num" | "type" | "afterAt" | "interval" | "updatedAt" | "state" | "handler"
  >[];
};

// 计划执行时间 要体现出是否循环

/**
 * 事件列表
 * @returns
 */
export default function EventList(props: EventListProps) {
  const { data } = props;

  const dataList = data.map((v) => {
    /** 计划执行时间 */
    let next = "";
    if (v.state === EventEdgeState.等待中) {
      let nextTime = Date.now();
      // 应用 最早执行时间
      if (v.afterAt) {
        const next = v.afterAt;
        if (next > nextTime) {
          nextTime = next;
        }
      }
      // 应用 循环时间
      if (v.interval !== -1) {
        const next = v.updatedAt;
        if (next > nextTime) {
          nextTime = next;
        }
      }
      next = new Date(nextTime).toLocaleString();
    }
    return (
      <tr key={v.num}>
        <td>{v.num}</td>
        <td>{v.type}</td>
        <td>{next}</td>
        <td>{v.updatedAt}</td>
        <td>{v.handler}</td>
        <td>{v.state}</td>
      </tr>
    );
  });

  return (
    <table class="table-auto">
      <thead>
        <tr>
          <th>event 编号</th>
          <th>event 类型</th>
          <th>计划执行时间</th>
          <th>最后更新时间</th>
          <th>最后处理者</th>
          <th>当前状态</th>
        </tr>
      </thead>
      <tbody>{dataList}</tbody>
    </table>
  );
}
