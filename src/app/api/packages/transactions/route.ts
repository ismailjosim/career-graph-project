import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import { TokenTransaction } from "@/lib/models";
import { getSessionUser, unauthorizedResponse } from "@/lib/server-auth";

export async function GET() {
  try {
    const user = await getSessionUser();
    if (!user) {
      return unauthorizedResponse();
    }

    await connectDB();

    const transactions = await TokenTransaction.find({
      userId: user.id,
    })
      .sort({ createdAt: -1 })
      .limit(50);

    return NextResponse.json({
      transactions,
    });
  } catch (error) {
    console.error("Error fetching token transactions:", error);
    return NextResponse.json(
      { error: "Failed to fetch transactions" },
      { status: 500 },
    );
  }
}
