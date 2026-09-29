/**
 * Next.js Instrumentation hook.
 * Runs once when the Next.js server boots up.
 */
export async function register() {
  if (process.env.NEXT_RUNTIME === "nodejs") {
    try {
      const { ensureSuperAdminExists } = await import("@/lib/server-auth");
      await ensureSuperAdminExists();
    } catch (err) {
      console.error(
        "[INSTRUMENTATION] Super admin verification failed on startup:",
        err,
      );
    }
  }
}
