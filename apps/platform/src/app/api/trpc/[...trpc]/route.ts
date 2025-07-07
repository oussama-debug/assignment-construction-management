import type { NextRequest } from "next/server";
import { fetchRequestHandler } from "@trpc/server/adapters/fetch";
import { appRouter } from "@civalgo/gateway";
import { createTRPCContext } from "@civalgo/gateway/trpc";

const handler = (req: NextRequest) =>
  fetchRequestHandler({
    endpoint: `/api/trpc`,
    req,
    router: appRouter as any,
    createContext: () => {
      return createTRPCContext({ headers: req.headers });
    },
    onError: ({ path, error, type, ctx, input }) => {},
  });

export { handler as GET, handler as POST };
