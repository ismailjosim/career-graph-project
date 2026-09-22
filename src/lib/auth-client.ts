import { createAuthClient } from "better-auth/react";

export const authClient = createAuthClient({
  baseURL:
    typeof window !== "undefined"
      ? window.location.origin
      : process.env.NEXT_PUBLIC_APP_URL,
});

export const { signIn, signOut, signUp, useSession } = authClient;

// Better Auth exposes forgetPassword/resetPassword on the client instance but the base
// type definition doesn't declare them — cast via Record<string, unknown> to avoid `as any`
type AnyFn = (...args: unknown[]) => unknown;
const _client = authClient as Record<string, unknown>;

// biome-ignore lint/complexity/useLiteralKeys: accessing undeclared keys on Better Auth client
export const forgetPassword = _client["forgetPassword"] as AnyFn;
// biome-ignore lint/complexity/useLiteralKeys: accessing undeclared keys on Better Auth client
export const resetPassword = _client["resetPassword"] as AnyFn;
