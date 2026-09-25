import { NextResponse } from "next/server";
import { getUserPlanUsage } from "@/lib/plan-limits";
import { getSessionUser, unauthorizedResponse } from "@/lib/server-auth";

export async function GET() {
  try {
    const user = await getSessionUser();
    if (!user) {
      return unauthorizedResponse();
    }

    const usage = await getUserPlanUsage(user.id);
    return NextResponse.json(usage);
  } catch (error) {
    console.error("Error fetching plan usage:", error);
    return NextResponse.json(
      { error: "Failed to fetch plan usage limits" },
      { status: 500 },
    );
  }
}
