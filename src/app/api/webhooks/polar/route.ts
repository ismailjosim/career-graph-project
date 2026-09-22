import { type NextRequest, NextResponse } from "next/server";
import { validateEvent } from "@polar-sh/sdk/webhooks";
import { connectDB } from "@/lib/db";
import { TokenPackage, TokenTransaction } from "@/lib/models";
import { grantUserTokens } from "@/lib/server-auth";

interface PolarWebhookEvent {
  type: string;
  data?: {
    id?: string;
    status?: string;
    product_id?: string;
    checkout_id?: string;
    customer?: { external_id?: string };
    product?: { name?: string };
    metadata?: {
      userId?: string;
      packageId?: string;
      packageName?: string;
      tokens?: string | number;
      [key: string]: unknown;
    };
  };
}

export async function POST(request: NextRequest) {
  try {
    const rawBody = await request.text();
    const webhookSecret = process.env.POLAR_WEBHOOK_SECRET;

    let event: PolarWebhookEvent | undefined;

    if (webhookSecret) {
      try {
        const headers: Record<string, string> = {};
        request.headers.forEach((val, key) => {
          headers[key.toLowerCase()] = val;
        });

        event = validateEvent(rawBody, headers, webhookSecret) as unknown as PolarWebhookEvent;
      } catch (validationErr) {
        console.error(
          "Polar webhook signature validation failed:",
          validationErr,
        );
        return new NextResponse("Invalid webhook signature", { status: 403 });
      }
    } else {
      if (process.env.NODE_ENV === "production") {
        console.error(
          "CRITICAL: POLAR_WEBHOOK_SECRET is not configured in production. Rejecting unverified request.",
        );
        return new NextResponse("Webhook secret unconfigured", { status: 500 });
      }

      // In local development, parse body but note requirement
      try {
        event = JSON.parse(rawBody);
      } catch {
        return new NextResponse("Invalid JSON body", { status: 400 });
      }
    }

    if (!event || !event.type) {
      return new NextResponse("Missing event type", { status: 400 });
    }

    await connectDB();

    const eventType = event.type;
    const data = event.data;

    // Handle checkout.updated when status is 'succeeded'
    if (eventType === "checkout.updated" && data?.status === "succeeded") {
      const checkoutId = data.id;
      const metadata = data.metadata || {};
      const userId = metadata.userId;

      if (userId && checkoutId) {
        // Check if already credited
        const existingTx = await TokenTransaction.findOne({
          "metadata.polarCheckoutId": checkoutId,
        });

        if (!existingTx) {
          let tokens = Number(metadata.tokens);
          let packageName = metadata.packageName || "Token Package";
          const packageId = metadata.packageId;

          if (!tokens || Number.isNaN(tokens)) {
            if (packageId) {
              const pkg = await TokenPackage.findById(packageId);
              if (pkg) {
                tokens = pkg.tokens;
                packageName = pkg.name;
              }
            }
          }

          if (tokens && !Number.isNaN(tokens)) {
            await grantUserTokens({
              userId,
              amount: tokens,
              type: "package_purchase",
              description: `Purchased ${packageName} (${tokens} tokens via Polar)`,
              packageId,
              metadata: {
                polarCheckoutId: checkoutId,
                polarProductId: data.product_id,
                source: "webhook_checkout_updated",
                purchasedAt: new Date().toISOString(),
              },
            });
          }
        }
      }
    }

    // Handle order.created or order.paid
    if ((eventType === "order.created" || eventType === "order.paid") && data) {
      const orderId = data.id;
      const checkoutId = data.checkout_id;
      const metadata = data.metadata || {};
      const userId = metadata.userId || data.customer?.external_id;

      if (userId && (checkoutId || orderId)) {
        const query: Record<string, unknown> = {};
        if (checkoutId) {
          query["metadata.polarCheckoutId"] = checkoutId;
        } else {
          query["metadata.polarOrderId"] = orderId;
        }

        const existingTx = await TokenTransaction.findOne(query);

        if (!existingTx) {
          let tokens = Number(metadata.tokens);
          let packageName =
            metadata.packageName || data.product?.name || "Token Package";
          const packageId = metadata.packageId;

          if (!tokens || Number.isNaN(tokens)) {
            if (packageId) {
              const pkg = await TokenPackage.findById(packageId);
              if (pkg) {
                tokens = pkg.tokens;
                packageName = pkg.name;
              }
            }
          }

          if (tokens && !Number.isNaN(tokens)) {
            await grantUserTokens({
              userId,
              amount: tokens,
              type: "package_purchase",
              description: `Purchased ${packageName} (${tokens} tokens via Polar)`,
              packageId,
              metadata: {
                polarOrderId: orderId,
                polarCheckoutId: checkoutId,
                polarProductId: data.product_id,
                source: "webhook_order",
                purchasedAt: new Date().toISOString(),
              },
            });
          }
        }
      }
    }

    return new NextResponse("Webhook processed successfully", { status: 200 });
  } catch (error) {
    console.error("Error processing Polar webhook:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
