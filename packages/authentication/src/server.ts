import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { nextCookies } from "better-auth/next-js";
import db from "@civalgo/database";
import * as schema from "@civalgo/database/schema";

function getCookieDomain(): string | undefined {
  return process.env.COOKIE_DOMAIN || "localhost";
}

function getSecureCookies(): boolean {
  return process.env.NODE_ENV === "production";
}

const cookieDomain = getCookieDomain();
const useSecureCookies = getSecureCookies();

export const auth = betterAuth({
  database: drizzleAdapter(db, {
    provider: "pg",
    schema,
  }),
  emailAndPassword: {
    enabled: true,
    disableSignUp: false,
    requireEmailVerification: false,
    maxPasswordLength: 100,
    minPasswordLength: 8,
    revokeSessionsOnPasswordReset: true,
  },
  plugins: [nextCookies()],
  session: {
    expiresIn: 60 * 60 * 24 * 7,
    updateAge: 60 * 60 * 24,
    cookieCache: {
      enabled: true,
      maxAge: 60 * 5,
    },
  },
  socialProviders: {},
  trustedOrigins: [
    process.env.NEXTAUTH_URL || "http://localhost:3000",
    process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : "",
  ].filter(Boolean),
  advanced: {
    crossSubDomainCookies: {
      enabled: false,
    },
    cookiePrefix: "civalgo",
    useSecureCookies,
    generateId: () => {
      return crypto.randomUUID();
    },
  },
  rateLimit: {
    enabled: process.env.NODE_ENV === "production",
    storage: "memory",
    window: 60,
    max: 10,
  },
});

export type Auth = typeof auth;
