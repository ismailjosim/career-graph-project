import { Polar } from "@polar-sh/sdk";

export const DEFAULT_POLAR_PRODUCTS: Record<string, string> = {
  "Starter Pack": "8257b10e-414d-47b3-a1f6-b60928fbf606",
  "Pro Pack": "7956bd4f-a476-408a-a6ee-945a373539c0",
  "Ultra Career Pack": "0c29dce4-a185-49fb-9368-fa2c46dc32f8",
};

/**
 * Returns a configured Polar client instance using POLAR_PAYMENT_TOKEN.
 * Defaults to 'sandbox' environment if not specified.
 */
export function getPolarClient(): Polar {
  const token =
    process.env.POLAR_PAYMENT_TOKEN || process.env.POLAR_ACCESS_TOKEN;

  if (!token) {
    throw new Error(
      "Missing POLAR_PAYMENT_TOKEN in environment variables. Please check your .env.local file.",
    );
  }

  const server =
    (process.env.POLAR_SERVER as "sandbox" | "production") || "sandbox";

  return new Polar({
    accessToken: token,
    server,
  });
}

/**
 * Automatically creates a product in Polar via the API.
 * Used when an admin creates a new token package.
 */
export async function createPolarProduct({
  name,
  price,
  description,
}: {
  name: string;
  price: number; // in USD
  description?: string;
}): Promise<string | null> {
  try {
    const polar = getPolarClient();
    const product = await polar.products.create({
      name: name.trim(),
      description: description?.trim() || undefined,
      prices: [
        {
          amountType: "fixed",
          priceAmount: Math.round(price * 100), // in cents
          priceCurrency: "usd",
        },
      ],
    });

    return product.id;
  } catch (error) {
    console.error("Failed to automatically create Polar product:", error);
    return null;
  }
}

/**
 * Automatically archives a product in Polar via the API.
 * Used when an admin deletes or deactivates a token package.
 */
export async function archivePolarProduct(productId: string): Promise<boolean> {
  try {
    if (!productId) return false;
    const polar = getPolarClient();
    await polar.products.update({
      id: productId,
      productUpdate: {
        isArchived: true,
      },
    });
    return true;
  } catch (error) {
    console.error("Failed to archive Polar product:", error);
    return false;
  }
}

/**
 * Resolves the Polar Product ID for a given package.
 * 1. Checks if package already has a polarProductId stored.
 * 2. Checks default product mappings by name.
 * 3. Fallback: Creates product in Polar dynamically.
 */
export async function resolvePolarProductId(pkg: {
  _id?: string;
  name: string;
  price: number;
  description?: string;
  polarProductId?: string;
}): Promise<string | null> {
  if (pkg.polarProductId) {
    return pkg.polarProductId;
  }

  const mappedId = DEFAULT_POLAR_PRODUCTS[pkg.name];
  if (mappedId) {
    return mappedId;
  }

  // Create on Polar dynamically
  const createdId = await createPolarProduct({
    name: pkg.name,
    price: pkg.price,
    description: pkg.description,
  });

  return createdId;
}
