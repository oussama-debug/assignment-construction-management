import type { NextRequest } from "next/server";
import { fetchRequestHandler } from "@trpc/server/adapters/fetch";
import { appRouter, createContext } from "@civalgo/gateway";

const handler = (req: NextRequest) =>
  fetchRequestHandler({
    endpoint: `/api/trpc`,
    req,
    router: appRouter as any,
    createContext: () => {
      return createContext({ headers: req.headers });
    },
    onError: ({ path, error, type, ctx, input }) => {},
  });

export { handler as GET, handler as POST };
