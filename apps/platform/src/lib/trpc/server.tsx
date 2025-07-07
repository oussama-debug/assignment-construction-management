import "server-only";

import { cache, type ReactNode } from "react";
import { headers } from "next/headers";
import { HydrationBoundary, dehydrate } from "@tanstack/react-query";
import {
  TRPCQueryOptions,
  createTRPCOptionsProxy,
} from "@trpc/tanstack-react-query";

import { appRouter } from "@civalgo/gateway";
import { createTRPCContext } from "@civalgo/gateway/trpc";
import { makeQueryClient } from "./query";

export const getQueryClient = cache(makeQueryClient);

const ctx = async () => {
  const headersList = await headers();
  return createTRPCContext({ headers: headersList as any });
};

export const trpc = createTRPCOptionsProxy({
  ctx,
  router: appRouter,
  queryClient: getQueryClient,
});

export async function getCaller() {
  return appRouter.createCaller(
    await createTRPCContext({
      headers: await headers(),
    })
  );
}

export function HydrateClient(props: { children: ReactNode }) {
  const queryClient = getQueryClient();

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      {props.children}
    </HydrationBoundary>
  );
}

export function prefetch<T extends ReturnType<TRPCQueryOptions<any>>>(
  queryOptions: T
) {
  const queryClient = getQueryClient();
  if (queryOptions.queryKey[1]?.type === "infinite") {
    void queryClient.prefetchInfiniteQuery(queryOptions as any);
  } else {
    void queryClient.prefetchQuery(queryOptions);
  }
}
