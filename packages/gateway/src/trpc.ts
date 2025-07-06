import { TRPCError, initTRPC } from "@trpc/server";
import superjson from "superjson";
import { ZodError } from "zod";
import { eq } from "drizzle-orm";

import { auth } from "@civalgo/authentication/server";
import db from "@civalgo/database";
import { user } from "@civalgo/database/schema";

export const createTRPCContext = async (opts: { headers: Headers }) => {
  const session = await auth.api.getSession({
    headers: opts.headers,
  });

  return {
    db,
    session: session?.session,
    user: session?.user,
    ...opts,
  };
};

export const t = initTRPC.context<typeof createTRPCContext>().create({
  transformer: superjson,
  errorFormatter({ shape, error }) {
    return {
      ...shape,
      data: {
        ...shape.data,
        zodError:
          error.cause instanceof ZodError ? error.cause.flatten() : null,
      },
    };
  },
});

export const createCallerFactory = t.createCallerFactory;

export const createTRPCRouter = t.router;

export const publicProcedure = t.procedure;

export const protectedProcedure = t.procedure.use(({ ctx, next }) => {
  if (!ctx.user) {
    throw new TRPCError({ code: "UNAUTHORIZED" });
  }

  return next({
    ctx: {
      ...ctx,
      session: { ...ctx.session },
      user: { ...ctx.user },
    },
  });
});

export const supervisorProcedure = t.procedure.use(async ({ ctx, next }) => {
  if (!ctx.user) {
    throw new TRPCError({ code: "UNAUTHORIZED" });
  }

  const [userData] = await ctx.db
    .select()
    .from(user)
    .where(eq(user.id, ctx.user.id));

  if (!userData || userData.role !== "supervisor") {
    throw new TRPCError({
      code: "FORBIDDEN",
      message: "Supervisor privileges required",
    });
  }

  return next({
    ctx: {
      ...ctx,
      user: userData,
    },
  });
});
