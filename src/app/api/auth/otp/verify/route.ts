import { MongoClient } from "mongodb";
import { type NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import { OtpVerification } from "@/lib/models";

const MONGODB_URI =
  process.env.MONGODB_URI || "mongodb://localhost:27017/job-tracker";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, otp } = body;

    if (!email || typeof email !== "string") {
      return NextResponse.json(
        { error: "Email address is required" },
        { status: 400 },
      );
    }

    if (!otp || typeof otp !== "string" || otp.trim().length !== 6) {
      return NextResponse.json(
        { error: "Please provide a valid 6-digit verification code" },
        { status: 400 },
      );
    }

    const normalizedEmail = email.toLowerCase().trim();
    const inputOtp = otp.trim();

    await connectDB();

    const record = await OtpVerification.findOne({ email: normalizedEmail });

    if (!record) {
      return NextResponse.json(
        {
          error:
            "No active verification code found for this email. Please request a new code.",
        },
        { status: 400 },
      );
    }

    if (new Date(record.expiresAt).getTime() < Date.now()) {
      await OtpVerification.deleteOne({ email: normalizedEmail });
      return NextResponse.json(
        {
          error: "Verification code has expired. Please request a new code.",
        },
        { status: 400 },
      );
    }

    if (record.attempts >= 5) {
      await OtpVerification.deleteOne({ email: normalizedEmail });
      return NextResponse.json(
        {
          error:
            "Too many failed attempts. For security, please request a new code.",
        },
        { status: 400 },
      );
    }

    if (record.otp !== inputOtp) {
      await OtpVerification.updateOne(
        { email: normalizedEmail },
        { $inc: { attempts: 1 } },
      );
      return NextResponse.json(
        {
          error: "Invalid verification code. Please check and try again.",
        },
        { status: 400 },
      );
    }

    // OTP is valid! Mark user as verified in MongoDB
    const client = new MongoClient(MONGODB_URI);
    try {
      await client.connect();
      const db = client.db();
      const userCollection = db.collection("user");

      const updateResult = await userCollection.updateOne(
        { email: normalizedEmail },
        {
          $set: {
            emailVerified: true,
            updatedAt: new Date(),
          },
        },
      );

      // Clean up used OTP record
      await OtpVerification.deleteOne({ email: normalizedEmail });

      if (updateResult.matchedCount === 0) {
        console.warn(
          `[OTP Verify] Verified code, but no user record with email ${normalizedEmail} found yet.`,
        );
      }
    } finally {
      await client.close().catch(() => {});
    }

    return NextResponse.json({
      success: true,
      message:
        "Email verified successfully! You may now access your dashboard.",
    });
  } catch (err) {
    console.error("Failed to verify OTP:", err);
    return NextResponse.json(
      {
        error:
          err instanceof Error
            ? err.message
            : "An error occurred during verification",
      },
      { status: 500 },
    );
  }
}
