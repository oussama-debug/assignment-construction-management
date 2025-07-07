import { user } from "@civalgo/database/schema";
import { eq } from "drizzle-orm";
import { createTRPCContext } from "@civalgo/gateway";
import { headers } from "next/headers";
import type { User } from "./types";

export async function getCurrentUserRole(): Promise<User | null> {
  try {
    const context = await createTRPCContext({
      headers: await headers(),
    });

    if (!context.user) return null;

    const [user_ifexist] = await context.db
      .select()
      .from(user)
      .where(eq(user.id, context.user.id))
      .limit(1);

    return user_ifexist ? user_ifexist : null;
  } catch (error) {
    console.error("Error getting user role:", error);
    return null;
  }
}
