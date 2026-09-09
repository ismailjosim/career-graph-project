import { type NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import { TokenPackage } from "@/lib/models";
import {
  blockedAccountResponse,
  getSessionUser,
  grantUserTokens,
  unauthorizedResponse,
} from "@/lib/server-auth";

export async function POST(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const user = await getSessionUser();
    if (!user) {
      return unauthorizedResponse();
    }
    if (user.status === "blocked") {
      return blockedAccountResponse();
    }

    const { id } = await params;
    await connectDB();

    const pkg = await TokenPackage.findById(id);
    if (!pkg) {
      return NextResponse.json(
        { error: "Token package not found" },
        { status: 404 },
      );
    }

    if (!pkg.isActive) {
      return NextResponse.json(
        { error: "This package is currently inactive or unavailable" },
        { status: 400 },
      );
    }

    const result = await grantUserTokens({
      userId: user.id,
      amount: pkg.tokens,
      type: "package_purchase",
      description: `Purchased ${pkg.name} (${pkg.tokens} tokens for $${pkg.price})`,
      packageId: pkg._id.toString(),
      metadata: {
        packageName: pkg.name,
        packageTokens: pkg.tokens,
        packagePrice: pkg.price,
        purchasedAt: new Date().toISOString(),
      },
    });

    if (!result.success) {
      return NextResponse.json(
        { error: result.error || "Failed to process token purchase" },
        { status: 500 },
      );
    }

    return NextResponse.json({
      success: true,
      message: `Successfully added ${pkg.tokens} tokens to your account!`,
      tokensAdded: pkg.tokens,
      newBalance: result.newBalance,
      package: {
        id: pkg._id.toString(),
        name: pkg.name,
        price: pkg.price,
      },
    });
  } catch (error) {
    console.error("Error purchasing package:", error);
    return NextResponse.json(
      { error: "Failed to complete package purchase" },
      { status: 500 },
    );
  }
}
