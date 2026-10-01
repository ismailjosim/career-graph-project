import { ObjectId } from "mongodb";
import { type NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import { TokenTransaction } from "@/lib/models";
import { requireAdminUser } from "@/lib/server-auth";

function getUserQuery(id: string): Record<string, unknown> {
  try {
    return {
      $or: [{ _id: new ObjectId(id) }, { _id: id }, { id: id }],
    };
  } catch {
    return {
      $or: [{ _id: id }, { id: id }],
    };
  }
}

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const authResult = await requireAdminUser();
    if ("response" in authResult) {
      return authResult.response;
    }
    const operator = authResult.user;

    const { id } = await params;
    const body = await request.json();
    const { amount, reason, action = "add" } = body;

    const parsedAmount = Number(amount);
    if (Number.isNaN(parsedAmount) || parsedAmount === 0) {
      return NextResponse.json(
        { error: "Please enter a valid non-zero number of tokens" },
        { status: 400 },
      );
    }

    const mongoose = await connectDB();
    const db = mongoose.connection.db;
    if (!db) {
      return NextResponse.json(
        { error: "Database unavailable" },
        { status: 500 },
      );
    }

    const userCollection = db.collection<Record<string, unknown>>("user");
    const query = getUserQuery(id);
    const targetUser = await userCollection.findOne(query);

    if (!targetUser) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const currentTokens =
      typeof targetUser.tokens === "number" ? targetUser.tokens : 50;

    let newBalance = currentTokens;
    let delta = parsedAmount;

    if (action === "set") {
      if (parsedAmount < 0) {
        return NextResponse.json(
          { error: "Token balance cannot be negative" },
          { status: 400 },
        );
      }
      newBalance = parsedAmount;
      delta = newBalance - currentTokens;
    } else {
      // action === "add" (or negative for deduct)
      newBalance = currentTokens + parsedAmount;
      if (newBalance < 0) {
        return NextResponse.json(
          {
            error: `Cannot deduct ${Math.abs(parsedAmount)} tokens. User only has ${currentTokens} tokens.`,
          },
          { status: 400 },
        );
      }
      delta = parsedAmount;
    }

    await userCollection.updateOne(query, {
      $set: {
        tokens: newBalance,
        updatedAt: new Date(),
      },
    });

    const reasonText =
      typeof reason === "string" && reason.trim()
        ? reason.trim()
        : delta > 0
          ? `Admin manual grant by ${operator.name || operator.email}`
          : `Admin manual adjustment by ${operator.name || operator.email}`;

    try {
      await TokenTransaction.create({
        userId: targetUser._id.toString(),
        amount: delta,
        balanceAfter: newBalance,
        type: "admin_grant",
        description: reasonText,
        metadata: {
          operatorId: operator.id,
          operatorEmail: operator.email,
          previousBalance: currentTokens,
          action,
        },
        createdAt: new Date(),
      });
    } catch (txErr) {
      console.error("Failed to record admin token transaction:", txErr);
    }

    return NextResponse.json({
      success: true,
      message: `Successfully updated token balance to ${newBalance} tokens.`,
      newBalance,
      userId: targetUser._id.toString(),
    });
  } catch (error) {
    console.error("Error adjusting user tokens:", error);
    return NextResponse.json(
      { error: "Failed to adjust user tokens" },
      { status: 500 },
    );
  }
}
