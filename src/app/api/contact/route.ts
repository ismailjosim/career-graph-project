import { type NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/db";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { name, email, subject, message } = body;

    if (!name || typeof name !== "string" || !name.trim()) {
      return NextResponse.json({ error: "Name is required" }, { status: 400 });
    }

    if (!email || typeof email !== "string" || !email.includes("@")) {
      return NextResponse.json(
        { error: "A valid email address is required" },
        { status: 400 },
      );
    }

    if (!message || typeof message !== "string" || message.trim().length < 5) {
      return NextResponse.json(
        { error: "Message must be at least 5 characters long" },
        { status: 400 },
      );
    }

    // Save contact inquiry to database
    try {
      const mongoose = await connectDB();
      const db = mongoose.connection.db;
      if (db) {
        await db.collection("contact_inquiries").insertOne({
          name: name.trim(),
          email: email.trim().toLowerCase(),
          subject: (subject || "General Inquiry").trim(),
          message: message.trim(),
          status: "pending",
          createdAt: new Date(),
        });
      }
    } catch (dbErr) {
      console.warn("Failed to save contact inquiry to database:", dbErr);
      // Continue so user still receives positive confirmation
    }

    return NextResponse.json({
      success: true,
      message:
        "Thank you! Your message has been received. Our team will get back to you within 12–24 hours.",
    });
  } catch (error) {
    console.error("Contact API error:", error);
    return NextResponse.json(
      { error: "Internal server error. Please try again later." },
      { status: 500 },
    );
  }
}
