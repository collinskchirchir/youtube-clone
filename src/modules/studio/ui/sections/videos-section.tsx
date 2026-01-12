'use client';

import { Suspense } from 'react';

import { DEFAULT_LIMIT } from '@/constants';
import { trpc } from '@/trpc/client';
import Link from 'next/link';
import { ErrorBoundary } from 'react-error-boundary';

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow, } from '@/components/ui/table';
import { InfiniteScroll } from '@/components/infinite-scroll';

export const VideosSection = () => {
  return (
    <Suspense fallback={<p>Loading...</p>}>
      <ErrorBoundary fallback={<p>Error!</p>}>
        <VideoSectionSuspense />
      </ErrorBoundary>
    </Suspense>
  );
};

const VideoSectionSuspense = () => {
  const [videos, query] = trpc.studio.getMany.useSuspenseInfiniteQuery(
    { limit: DEFAULT_LIMIT },
    {
      getNextPageParam: (lastPage) => lastPage.nextCursor,
    }
  );
  return (
    <div>
      <div className='border-y'>
        <Table>
          <TableHeader>
            <TableRow className='[&_*]:w-[510px] [&_*]:pl-6'>
              <TableHead>Video</TableHead>
              <TableHead>Visibility</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Date</TableHead>
              <TableHead className={'text-right'}>Views</TableHead>
              <TableHead className={'text-right'}>Comments</TableHead>
              <TableHead className={'pr-6 text-right'}>Likes</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {videos.pages.flatMap((page) =>
              page.items.map((video) => (
                <Link
                  href={`studios/videos/${video.id}`}
                  key={video.id}
                  legacyBehavior
                >
                  <TableRow className='cursor-pointer'>
                    <TableCell>{video.title}</TableCell>
                    <TableCell>{video.visibility}</TableCell>
                    <TableCell>{video.muxStatus}</TableCell>
                    <TableCell>Date</TableCell>
                    <TableCell>Vies</TableCell>
                    <TableCell>comments</TableCell>
                    <TableCell>likes</TableCell>
                  </TableRow>
                </Link>
              ))
            )}
          </TableBody>
        </Table>
      </div>
      <InfiniteScroll
        // isManual
        hasNextPage={query.hasNextPage}
        isFetchingNextPage={query.isFetchingNextPage}
        fetchNextPage={query.fetchNextPage}
      />
    </div>
  );
};
