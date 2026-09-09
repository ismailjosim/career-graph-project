import { ObjectId } from "mongodb";
import { type NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import { forbiddenResponse, requireAdminUser } from "@/lib/server-auth";
import { updateUserProfileSchema } from "@/lib/validation";

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

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const authResult = await requireAdminUser();
    if ("response" in authResult) {
      return authResult.response;
    }

    const { id } = await params;
    const mongoose = await connectDB();
    const db = mongoose.connection.db;
    if (!db) {
      return NextResponse.json(
        { error: "Database unavailable" },
        { status: 500 },
      );
    }

    const userCollection = db.collection<Record<string, unknown>>("user");
    const user = await userCollection.findOne(getUserQuery(id));
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    return NextResponse.json({
      id: user._id.toString(),
      _id: user._id.toString(),
      name: user.name || "Unnamed User",
      email: user.email,
      emailVerified: Boolean(user.emailVerified),
      image: user.image || null,
      role: user.role || "job_seeker",
      createdAt: user.createdAt || new Date(),
      updatedAt: user.updatedAt || new Date(),
    });
  } catch (error) {
    console.error("Error fetching user:", error);
    return NextResponse.json(
      { error: "Failed to fetch user" },
      { status: 500 },
    );
  }
}

export async function PUT(
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
    const validatedData = updateUserProfileSchema.parse(body);

    const mongoose = await connectDB();
    const db = mongoose.connection.db;
    if (!db) {
      return NextResponse.json(
        { error: "Database unavailable" },
        { status: 500 },
      );
    }

    const userCollection = db.collection<Record<string, unknown>>("user");
    const targetUser = await userCollection.findOne(getUserQuery(id));

    if (!targetUser) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const targetUserId = targetUser._id.toString();
    const targetUserRole = targetUser.role || "job_seeker";

    // 1. Super Admin Protection: Non-super-admins cannot edit a Super Admin
    if (targetUserRole === "super_admin" && operator.role !== "super_admin") {
      return forbiddenResponse(
        "Only the Super Admin can edit the Super Admin account.",
      );
    }

    // 2. Admin Management Protection: Only Super Admin can promote/demote admins
    if (
      (targetUserRole === "admin" || validatedData.role === "admin") &&
      operator.role !== "super_admin" &&
      targetUserId !== operator.id
    ) {
      return forbiddenResponse(
        "Only the Super Admin can manage or assign the Admin role.",
      );
    }

    // 3. Super Admin Singleton Enforcement
    if (validatedData.role === "super_admin") {
      // Only existing super_admin can transfer super_admin role
      if (operator.role !== "super_admin") {
        return forbiddenResponse(
          "Only the Super Admin can assign or transfer the Super Admin role.",
        );
      }

      // If transferring to another user: demote current super admin to admin
      if (targetUserId !== operator.id) {
        await userCollection.updateOne(getUserQuery(operator.id), {
          $set: { role: "admin", updatedAt: new Date() },
        });
      }
    }

    // 4. Prevent demoting the Super Admin without transferring
    if (
      targetUserRole === "super_admin" &&
      validatedData.role &&
      validatedData.role !== "super_admin"
    ) {
      return forbiddenResponse(
        "There must always be a Super Admin. To change your role, transfer Super Admin to another user first.",
      );
    }

    // Prepare update payload
    const updatePayload: Record<string, unknown> = {
      updatedAt: new Date(),
    };
    if (validatedData.name) updatePayload.name = validatedData.name;
    if (validatedData.email) updatePayload.email = validatedData.email;
    if (validatedData.role) updatePayload.role = validatedData.role;

    await userCollection.updateOne(
      { _id: targetUser._id },
      { $set: updatePayload },
    );

    const updatedUser = await userCollection.findOne({ _id: targetUser._id });

    return NextResponse.json({
      id: updatedUser?._id.toString(),
      _id: updatedUser?._id.toString(),
      name: updatedUser?.name,
      email: updatedUser?.email,
      role: updatedUser?.role || "job_seeker",
      emailVerified: Boolean(updatedUser?.emailVerified),
      updatedAt: updatedUser?.updatedAt,
    });
  } catch (error) {
    console.error("Error updating user:", error);
    const err = error as { name?: string; errors?: unknown };
    if (err.name === "ZodError") {
      return NextResponse.json(
        { error: "Validation error", details: err.errors },
        { status: 400 },
      );
    }
    return NextResponse.json(
      { error: "Failed to update user profile" },
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
    const operator = authResult.user;

    const { id } = await params;
    const mongoose = await connectDB();
    const db = mongoose.connection.db;
    if (!db) {
      return NextResponse.json(
        { error: "Database unavailable" },
        { status: 500 },
      );
    }

    const userCollection = db.collection<Record<string, unknown>>("user");
    const targetUser = await userCollection.findOne(getUserQuery(id));

    if (!targetUser) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const targetUserId = targetUser._id.toString();
    const targetUserRole = targetUser.role || "job_seeker";

    // 1. Cannot delete self
    if (targetUserId === operator.id) {
      return NextResponse.json(
        { error: "You cannot delete your own account from the users manager." },
        { status: 400 },
      );
    }

    // 2. Cannot delete the Super Admin
    if (targetUserRole === "super_admin") {
      return forbiddenResponse("The system Super Admin cannot be deleted.");
    }

    // 3. Regular admin cannot delete other admins
    if (targetUserRole === "admin" && operator.role !== "super_admin") {
      return forbiddenResponse(
        "Only the Super Admin can delete admin accounts.",
      );
    }

    // Delete user and associated sessions
    await userCollection.deleteOne({ _id: targetUser._id });
    await db.collection("session").deleteMany({ userId: targetUserId });
    await db.collection("account").deleteMany({ userId: targetUserId });

    return NextResponse.json({
      message: `User ${targetUser.name || targetUser.email} was successfully deleted.`,
    });
  } catch (error) {
    console.error("Error deleting user:", error);
    return NextResponse.json(
      { error: "Failed to delete user" },
      { status: 500 },
    );
  }
}
