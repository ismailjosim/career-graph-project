import { type NextRequest, NextResponse } from "next/server";
import { runBatchMatchingForAllUsers } from "@/lib/job-match-engine";
import { requireAdminUser } from "@/lib/server-auth";
import { analyzeCandidateDemand } from "@/lib/user-demand-analyzer";

export async function GET() {
  try {
    const auth = await requireAdminUser();
    if ("response" in auth) {
      return auth.response;
    }

    const demandSummary = await analyzeCandidateDemand();
    return NextResponse.json({
      success: true,
      demand: demandSummary,
    });
  } catch (error) {
    console.error("Error analyzing candidate demand:", error);
    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "Failed to analyze candidate demand",
      },
      { status: 500 },
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const auth = await requireAdminUser();
    if ("response" in auth) {
      return auth.response;
    }

    const body = await request.json().catch(() => ({}));
    const action = body.action || "run_matching";

    if (action === "run_matching") {
      const result = await runBatchMatchingForAllUsers();
      return NextResponse.json({
        success: true,
        message: `Successfully matched scraped jobs for ${result.matchedUsersCount} candidates (${result.totalMatchesSaved} matches created).`,
        result,
      });
    }

    return NextResponse.json({ error: "Invalid action" }, { status: 400 });
  } catch (error) {
    console.error("Error in candidate demand action:", error);
    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "Failed to execute demand action",
      },
      { status: 500 },
    );
  }
}
