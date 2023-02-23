import { EventEdge, EventEdgeState } from 'event-edge/common/types.ts';
import { PopoverText } from '../components/PopoverText.tsx';

type EventListProps = {
  data: Pick<
    EventEdge,
    'num' | 'type' | 'afterAt' | 'interval' | 'updatedAt' | 'state' | 'handler'
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
    let next = '';
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
    const popoverID = `popover-${v.num}`;
    let nextAppend = <></>;
    if (v.interval !== -1 && next === '') {
      next = '待定';
    }
    if (v.interval !== -1) {
      nextAppend = (
        <PopoverText
          id={popoverID}
          desc={`循环执行, 间隔时间 ${v.interval} ms`}
        />
      );
    }
    return (
      <tr
        key={v.num}
        class='bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600'
      >
        <td class='px-6 py-4'>{v.num}</td>
        <td class='px-6 py-4'>{v.type}</td>
        <td class='px-6 py-4'>
          <p class='flex items-center text-sm font-light'>
            {next}
            {nextAppend}
          </p>
        </td>
        <td class='px-6 py-4'>{new Date(v.updatedAt).toLocaleString()}</td>
        <td class='px-6 py-4'>{v.handler}</td>
        <td class='px-6 py-4'>{v.state}</td>
      </tr>
    );
  });

  return (
    <table class='table-auto w-full text-sm text-left text-gray-500 dark:text-gray-400'>
      <thead class='text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400'>
        <tr>
          <th scope='col' class='px-6 py-3'>event 编号</th>
          <th scope='col' class='px-6 py-3'>event 类型</th>
          <th scope='col' class='px-6 py-3'>计划执行时间</th>
          <th scope='col' class='px-6 py-3'>最后更新时间</th>
          <th scope='col' class='px-6 py-3'>最后处理者</th>
          <th scope='col' class='px-6 py-3'>当前状态</th>
        </tr>
      </thead>
      <tbody>{dataList}</tbody>
    </table>
  );
}
