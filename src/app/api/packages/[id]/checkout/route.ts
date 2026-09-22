import { type NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import { TokenPackage } from "@/lib/models";
import { getPolarClient, resolvePolarProductId } from "@/lib/polar";
import {
  blockedAccountResponse,
  getSessionUser,
  unauthorizedResponse,
} from "@/lib/server-auth";

export async function POST(
  request: NextRequest,
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

    // Resolve or dynamically create product on Polar
    const polarProductId = await resolvePolarProductId(pkg);
    if (!polarProductId) {
      return NextResponse.json(
        {
          error:
            "Could not connect this package to a Polar product. Please check your Polar configuration.",
        },
        { status: 500 },
      );
    }

    // Persist polarProductId to package if it was resolved/created dynamically
    if (!pkg.polarProductId) {
      pkg.polarProductId = polarProductId;
      await pkg.save();
    }

    // Determine return base URL
    const origin =
      request.nextUrl.origin ||
      process.env.NEXT_PUBLIC_APP_URL ||
      "http://localhost:3000";

    const polar = getPolarClient();

    // Only prefill customerEmail if it's a real email format and not a mock/example domain
    const isMockDomain =
      !user.email ||
      user.email.endsWith("@example.com") ||
      user.email.endsWith("@test.com") ||
      !user.email.includes("@");

    const checkout = await polar.checkouts.create({
      products: [polarProductId],
      customerEmail: isMockDomain ? undefined : user.email,
      customerName: user.name || undefined,
      metadata: {
        userId: user.id,
        userEmail: user.email,
        packageId: pkg._id.toString(),
        packageName: pkg.name,
        tokens: String(pkg.tokens),
        price: String(pkg.price),
      },
      successUrl: `${origin}/pricing?checkout_id={CHECKOUT_ID}&status=success`,
    });

    return NextResponse.json({
      success: true,
      checkoutUrl: checkout.url,
      checkoutId: checkout.id,
    });
  } catch (error) {
    console.error("Error creating Polar checkout session:", error);
    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "Failed to initiate payment checkout",
      },
      { status: 500 },
    );
  }
}
