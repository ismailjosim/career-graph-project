import { ObjectId } from "mongodb";
import { type NextRequest, NextResponse } from "next/server";
import {
  deleteFromCloudinary,
  extractPublicIdFromUrl,
  uploadToCloudinary,
} from "@/lib/cloudinary";
import { connectDB } from "@/lib/db";
import { getSessionUser, unauthorizedResponse } from "@/lib/server-auth";

const MAX_IMAGE_SIZE_BYTES = 5 * 1024 * 1024; // 5MB
const MAX_DOC_SIZE_BYTES = 10 * 1024 * 1024; // 10MB

const ALLOWED_IMAGE_TYPES = new Set([
  "image/jpeg",
  "image/jpg",
  "image/png",
  "image/webp",
  "image/gif",
]);

const ALLOWED_DOC_TYPES = new Set(["application/pdf"]);

/**
 * POST /api/upload
 * Handles authenticated secure uploads to Cloudinary for avatars and PDF documents
 */
export async function POST(req: NextRequest) {
  try {
    const user = await getSessionUser();
    if (!user) {
      return unauthorizedResponse();
    }

    const formData = await req.formData();
    const file = formData.get("file") as File | null;
    const uploadType = (formData.get("type") as string) || "avatar";

    if (!file) {
      return NextResponse.json(
        { error: "No file provided in form data" },
        { status: 400 },
      );
    }

    const mimeType = file.type.toLowerCase();
    const fileSize = file.size;

    // Validate type & size
    if (uploadType === "avatar") {
      if (!ALLOWED_IMAGE_TYPES.has(mimeType)) {
        return NextResponse.json(
          {
            error:
              "Invalid image format. Only JPEG, PNG, WEBP, and GIF are allowed.",
          },
          { status: 400 },
        );
      }
      if (fileSize > MAX_IMAGE_SIZE_BYTES) {
        return NextResponse.json(
          { error: "Image size exceeds 5MB limit." },
          { status: 400 },
        );
      }
    } else {
      // Document / Resume upload
      if (
        !ALLOWED_DOC_TYPES.has(mimeType) &&
        !file.name.toLowerCase().endsWith(".pdf")
      ) {
        return NextResponse.json(
          { error: "Invalid document format. Only PDF files are allowed." },
          { status: 400 },
        );
      }
      if (fileSize > MAX_DOC_SIZE_BYTES) {
        return NextResponse.json(
          { error: "Document size exceeds 10MB limit." },
          { status: 400 },
        );
      }
    }

    // Convert file to Buffer
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    let extractedText = "";

    // For document/resume uploads, parse and validate content BEFORE storing
    if (uploadType !== "avatar") {
      try {
        const { extractTextFromPdfBuffer } = await import(
          "@/lib/resume-text-extractor"
        );
        extractedText = await extractTextFromPdfBuffer(buffer);
      } catch (err) {
        console.warn("Failed to extract text from uploaded PDF buffer:", err);
      }

      // Resume Content Verification
      const { validateResumeContent } = await import("@/lib/resume-validator");
      const validation = validateResumeContent(extractedText);

      if (!validation.isValid) {
        return NextResponse.json(
          {
            error:
              validation.reason ||
              "The uploaded document does not appear to be a valid resume or CV.",
            code: "INVALID_RESUME_DOCUMENT",
            validationScore: validation.score,
            matchedCategories: validation.matchedCategories,
          },
          { status: 400 },
        );
      }
    }

    // Determine storage provider: Cloudflare R2 or Cloudinary
    let fileUrl = "";
    let publicId = "";
    let storageProvider = "cloudinary";

    const { isR2Configured, uploadToR2 } = await import("@/lib/r2-storage");

    if (uploadType !== "avatar" && isR2Configured()) {
      // Store in Cloudflare R2
      const r2Result = await uploadToR2(buffer, {
        fileName: file.name,
        folder: "resumes",
        contentType: mimeType || "application/pdf",
      });
      fileUrl = r2Result.url;
      publicId = r2Result.key;
      storageProvider = "cloudflare-r2";
    } else {
      // Store in Cloudinary (default for avatars and fallback for documents)
      const folder =
        uploadType === "avatar"
          ? "career-graph/avatars"
          : "career-graph/documents";
      const resourceType = uploadType === "avatar" ? "image" : "auto";

      const uploadResult = await uploadToCloudinary(buffer, {
        folder,
        resourceType,
      });
      fileUrl = uploadResult.secureUrl;
      publicId = uploadResult.publicId;

      // If uploading an avatar, sync directly with Better-Auth user record
      if (uploadType === "avatar") {
        const mongoose = await connectDB();
        const db = mongoose.connection.db;

        if (db) {
          const userCollection = db.collection("user");
          const userQuery = {
            $or: [
              { email: user.email },
              ...(ObjectId.isValid(user.id)
                ? [{ _id: new ObjectId(user.id) }]
                : []),
            ],
          };

          // If user already had a previous Cloudinary avatar, delete it
          if (user.image) {
            const oldPublicId = extractPublicIdFromUrl(user.image);
            if (oldPublicId && oldPublicId !== uploadResult.publicId) {
              deleteFromCloudinary(oldPublicId, "image").catch((err) => {
                console.warn(
                  "Failed to delete previous avatar from Cloudinary:",
                  err,
                );
              });
            }
          }

          await userCollection.updateOne(userQuery, {
            $set: {
              image: uploadResult.secureUrl,
              updatedAt: new Date(),
            },
          });
        }
      }
    }

    return NextResponse.json({
      success: true,
      url: fileUrl,
      publicId,
      storageProvider,
      fileName: file.name,
      fileSize,
      extractedText: extractedText || undefined,
    });
  } catch (error) {
    console.error("Upload API error:", error);
    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "Failed to upload file to storage",
      },
      { status: 500 },
    );
  }
}

/**
 * DELETE /api/upload
 * Deletes a file from Cloudinary storage
 */
export async function DELETE(req: NextRequest) {
  try {
    const user = await getSessionUser();
    if (!user) {
      return unauthorizedResponse();
    }

    const body = await req.json().catch(() => ({}));
    const {
      publicId,
      resourceType = "image",
      isAvatar = false,
      storageProvider,
    } = body;

    if (!publicId) {
      return NextResponse.json(
        { error: "Public ID is required for deletion" },
        { status: 400 },
      );
    }

    if (
      storageProvider === "cloudflare-r2" ||
      publicId.startsWith("resumes/")
    ) {
      const { deleteFromR2 } = await import("@/lib/r2-storage");
      await deleteFromR2(publicId).catch((err) => {
        console.warn("Failed to delete from R2 storage:", err);
      });
    } else {
      await deleteFromCloudinary(
        publicId,
        resourceType as "image" | "raw",
      ).catch((err) => {
        console.warn("Failed to delete from Cloudinary storage:", err);
      });
    }

    // If deleting user's avatar, clear it from Better-Auth record
    if (isAvatar) {
      const mongoose = await connectDB();
      const db = mongoose.connection.db;
      if (db) {
        const userCollection = db.collection("user");
        const userQuery = {
          $or: [
            { email: user.email },
            ...(ObjectId.isValid(user.id)
              ? [{ _id: new ObjectId(user.id) }]
              : []),
          ],
        };
        await userCollection.updateOne(userQuery, {
          $set: {
            image: "",
            updatedAt: new Date(),
          },
        });
      }
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Delete upload API error:", error);
    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "Failed to delete file from storage",
      },
      { status: 500 },
    );
  }
}
