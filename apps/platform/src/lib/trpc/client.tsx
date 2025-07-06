"use client";

import { useState, type ReactNode } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { createTRPCReact } from "@trpc/react-query";
import { httpBatchLink, loggerLink } from "@trpc/client";
import superjson from "superjson";

import type { AppRouter } from "@civalgo/gateway";

export const trpc = createTRPCReact<AppRouter>();

function getUrl() {
  const base = (() => {
    if (typeof window !== "undefined") return "";
    if (process.env.NEXT_PUBLIC_VERCEL_URL)
      return `https://${process.env.NEXT_PUBLIC_VERCEL_URL}`;
    return "http://localhost:3000";
  })();
  return `${base}/api/trpc`;
}

interface TRPCReactProviderProps {
  children: ReactNode;
}

export function TRPCReactProvider(props: Readonly<TRPCReactProviderProps>) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: 30 * 1000,
          },
        },
      })
  );

  const [trpcClient] = useState(() =>
    trpc.createClient({
      links: [
        loggerLink({
          enabled: (op) =>
            process.env.NODE_ENV === "development" ||
            (op.direction === "down" && op.result instanceof Error),
        }),
        httpBatchLink({
          url: getUrl(),
          transformer: superjson,
          headers() {
            return {
              "x-trpc-source": "nextjs-react",
            };
          },
        }),
      ],
    })
  );

  return (
    <trpc.Provider client={trpcClient} queryClient={queryClient}>
      <QueryClientProvider client={queryClient}>
        {props.children}
      </QueryClientProvider>
    </trpc.Provider>
  );
}
