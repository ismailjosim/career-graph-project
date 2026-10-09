import { type NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import { TokenPackage } from "@/lib/models";
import { archivePolarProduct } from "@/lib/polar";
import { requireAdminUser } from "@/lib/server-auth";

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const authResult = await requireAdminUser();
    if ("response" in authResult) {
      return authResult.response;
    }

    const { id } = await params;
    const body = await request.json();
    const {
      name,
      tokens,
      price,
      description,
      badge,
      features,
      isPopular,
      isActive,
      sortOrder,
      category,
      polarProductId,
    } = body;

    await connectDB();

    const existing = await TokenPackage.findById(id);
    if (!existing) {
      return NextResponse.json({ error: "Package not found" }, { status: 404 });
    }

    const updates: Record<string, unknown> = {};
    if (name !== undefined) updates.name = String(name).trim();
    if (tokens !== undefined) {
      const parsedTokens = Number(tokens);
      if (Number.isNaN(parsedTokens) || parsedTokens <= 0) {
        return NextResponse.json(
          { error: "Tokens must be a positive number" },
          { status: 400 },
        );
      }
      updates.tokens = parsedTokens;
    }
    if (price !== undefined) {
      const parsedPrice = Number(price);
      if (Number.isNaN(parsedPrice) || parsedPrice < 0) {
        return NextResponse.json(
          { error: "Price must be a valid number" },
          { status: 400 },
        );
      }
      updates.price = parsedPrice;
    }
    if (description !== undefined)
      updates.description = String(description).trim();
    if (badge !== undefined) updates.badge = String(badge).trim();
    if (features !== undefined && Array.isArray(features)) {
      updates.features = features.filter(
        (f) => typeof f === "string" && f.trim(),
      );
    }
    if (isPopular !== undefined) updates.isPopular = Boolean(isPopular);
    if (isActive !== undefined) updates.isActive = Boolean(isActive);
    if (sortOrder !== undefined) updates.sortOrder = Number(sortOrder) || 0;
    if (category !== undefined) {
      updates.category = category === "token_only" ? "token_only" : "bundle";
    }
    if (polarProductId !== undefined) {
      updates.polarProductId =
        typeof polarProductId === "string" && polarProductId.trim()
          ? polarProductId.trim()
          : undefined;
    }

    const updatedPackage = await TokenPackage.findByIdAndUpdate(
      id,
      { $set: updates },
      { new: true },
    );

    return NextResponse.json({
      package: updatedPackage,
      message: "Package updated successfully",
    });
  } catch (error) {
    console.error("Error updating package:", error);
    return NextResponse.json(
      { error: "Failed to update package" },
      { status: 500 },
    );
  }
}

export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const authResult = await requireAdminUser();
    if ("response" in authResult) {
      return authResult.response;
    }

    const { id } = await params;
    await connectDB();

    const deleted = await TokenPackage.findByIdAndDelete(id);
    if (!deleted) {
      return NextResponse.json({ error: "Package not found" }, { status: 404 });
    }

    // Automatically archive in Polar if linked
    if (deleted.polarProductId) {
      archivePolarProduct(deleted.polarProductId).catch((err) =>
        console.warn("Could not archive product on Polar:", err),
      );
    }

    return NextResponse.json({
      message: "Package deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting package:", error);
    return NextResponse.json(
      { error: "Failed to delete package" },
      { status: 500 },
    );
  }
}
