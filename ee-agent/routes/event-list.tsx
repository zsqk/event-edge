import { Head } from '$fresh/runtime.ts';
import { Handlers, PageProps } from '$fresh/server.ts';
import { EventEdge } from 'event-edge/common/types.ts';
import EventList from '../islands/EventList.tsx';
import { getEvents } from '../data/event.ts';

type Data = Pick<
  EventEdge,
  'num' | 'type' | 'afterAt' | 'interval' | 'updatedAt' | 'state' | 'handler'
>[];

export const handler: Handlers<Data> = {
  async GET(_req, ctx) {
    const res = await getEvents([
      'num',
      'type',
      'afterAt',
      'interval',
      'updatedAt',
      'state',
      'handler',
    ]);
    return ctx.render(res);
  },
};

export default function (props: PageProps<Data>) {
  return (
    <>
      <Head>
        <title>Event List</title>
      </Head>
      <div class='p-4 mx-auto max-w-screen-xl'>
        <EventList data={props.data} />
      </div>
    </>
  );
}
