'use client';

import { DEFAULT_LIMIT } from '@/constants';
import { trpc } from '@/trpc/client';

export function VideoSection() {
  const [data] = trpc.studio.getMany.useSuspenseInfiniteQuery(
    { limit: DEFAULT_LIMIT },
    {
      getNextPageParam: (lastPage) => lastPage.nextCursor,
    }
  );
  return (
    <div>
      Video Section Client Component
      <p>{JSON.stringify(data)}</p>
    </div>
  );
}
