import { type NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import { AnalyticsEvent } from "@/lib/models";
import { getSessionUser } from "@/lib/server-auth";
import { analyticsEventSchema } from "@/lib/validation";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json().catch(() => null);
    if (!body) {
      return NextResponse.json(
        { error: "Invalid JSON request body" },
        { status: 400 },
      );
    }
    const validated = analyticsEventSchema.safeParse(body);

    if (!validated.success) {
      return NextResponse.json(
        {
          error: "Invalid analytics payload",
          details: validated.error.format(),
        },
        { status: 400 },
      );
    }

    await connectDB();
    const user = await getSessionUser();

    const event = await AnalyticsEvent.create({
      eventType: validated.data.eventType,
      userId: user?.id || validated.data.userId,
      resourceId: validated.data.resourceId,
      metadata: validated.data.metadata || {},
    });

    return NextResponse.json({
      success: true,
      eventId: event._id.toString(),
    });
  } catch (error) {
    console.error("Error logging analytics event:", error);
    return NextResponse.json(
      {
        error: "Failed to record event",
        message: error instanceof Error ? error.message : String(error),
      },
      { status: 500 },
    );
  }
}
