import { headers } from "next/headers";
import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";

export async function getSessionUser() {
  try {
    const reqHeaders = await headers();
    const session = await auth.api.getSession({
      headers: reqHeaders,
    });
    return session?.user || null;
  } catch (error) {
    console.error("Failed to get session:", error);
    return null;
  }
}

export function unauthorizedResponse() {
  return NextResponse.json(
    { error: "Unauthorized: Please sign in to access this resource" },
    { status: 401 },
  );
}
