import { type NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import { TokenPackage, TokenTransaction } from "@/lib/models";
import { getPolarClient } from "@/lib/polar";
import { getSessionUser, grantUserTokens } from "@/lib/server-auth";

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const checkoutId = searchParams.get("checkout_id");

    if (!checkoutId) {
      return NextResponse.json(
        { error: "Missing checkout_id parameter" },
        { status: 400 },
      );
    }

    await connectDB();

    // 1. Check idempotency in TokenTransaction database
    const existingTx = await TokenTransaction.findOne({
      "metadata.polarCheckoutId": checkoutId,
    });

    if (existingTx) {
      return NextResponse.json({
        success: true,
        alreadyProcessed: true,
        message: "This payment has already been credited to your account.",
        tokensAdded: existingTx.amount,
        newBalance: existingTx.balanceAfter,
        packageName:
          (existingTx.metadata as Record<string, unknown>)?.packageName ||
          "Token Package",
      });
    }

    // 2. Fetch checkout details directly from Polar API
    const polar = getPolarClient();
    let checkout: Awaited<ReturnType<typeof polar.checkouts.get>>;
    try {
      checkout = await polar.checkouts.get({ id: checkoutId });
    } catch (fetchErr) {
      console.error("Failed to retrieve checkout from Polar:", fetchErr);
      return NextResponse.json(
        { error: "Could not find checkout session on Polar." },
        { status: 404 },
      );
    }

    if (!checkout) {
      return NextResponse.json(
        { error: "Checkout session not found." },
        { status: 404 },
      );
    }

    // Check payment status
    if (checkout.status !== "succeeded") {
      return NextResponse.json(
        {
          success: false,
          status: checkout.status,
          error: `Payment status is currently '${checkout.status}'. Tokens are only credited upon completed payment.`,
        },
        { status: 400 },
      );
    }

    // 3. Authenticate session user and verify ownership
    const sessionUser = await getSessionUser();
    if (!sessionUser) {
      return NextResponse.json(
        { error: "Unauthorized: Please sign in to verify this payment." },
        { status: 401 },
      );
    }

    const checkoutUserId = checkout.metadata?.userId as string | undefined;

    // Strict ownership check: Only the buyer or an admin may verify this checkout
    if (
      checkoutUserId &&
      checkoutUserId !== sessionUser.id &&
      sessionUser.role !== "admin" &&
      sessionUser.role !== "super_admin"
    ) {
      return NextResponse.json(
        { error: "Access denied: You do not own this checkout session." },
        { status: 403 },
      );
    }

    const userId = checkoutUserId || sessionUser.id;

    let tokens = Number(checkout.metadata?.tokens);
    let packageName =
      (checkout.metadata?.packageName as string) || "Token Package";
    const packageId = checkout.metadata?.packageId as string;

    if (!tokens || Number.isNaN(tokens)) {
      if (packageId) {
        const pkg = await TokenPackage.findById(packageId);
        if (pkg) {
          tokens = pkg.tokens;
          packageName = pkg.name;
        }
      }
    }

    // Fallback if still unknown
    if (!tokens || Number.isNaN(tokens)) {
      tokens = 500;
    }

    // 4. Grant tokens to user account atomically
    const grantResult = await grantUserTokens({
      userId,
      amount: tokens,
      type: "package_purchase",
      description: `Purchased ${packageName} (${tokens} tokens via Polar)`,
      packageId,
      metadata: {
        polarCheckoutId: checkout.id,
        polarProductId: checkout.productId,
        polarStatus: checkout.status,
        polarCurrency: checkout.currency,
        polarTotalAmount: checkout.totalAmount,
        packageName,
        purchasedAt: new Date().toISOString(),
      },
    });

    if (!grantResult.success) {
      return NextResponse.json(
        { error: grantResult.error || "Failed to credit tokens to account." },
        { status: 500 },
      );
    }

    return NextResponse.json({
      success: true,
      newBalance: grantResult.newBalance,
      tokensAdded: tokens,
      packageName,
      message: `Successfully added ${tokens.toLocaleString()} tokens to your account!`,
    });
  } catch (error) {
    console.error("Error verifying Polar checkout:", error);
    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "Failed to verify checkout session",
      },
      { status: 500 },
    );
  }
}
