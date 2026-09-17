import {
  v2 as cloudinary,
  type UploadApiErrorResponse,
  type UploadApiResponse,
} from "cloudinary";

// Configure Cloudinary with environment variables
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true,
});

export interface CloudinaryUploadResult {
  url: string;
  secureUrl: string;
  publicId: string;
  format: string;
  bytes: number;
  width?: number;
  height?: number;
}

export interface UploadOptions {
  folder?: string;
  resourceType?: "image" | "raw" | "auto";
  publicId?: string;
}

/**
 * Upload a file Buffer to Cloudinary using an upload stream.
 */
export async function uploadToCloudinary(
  buffer: Buffer,
  options: UploadOptions = {},
): Promise<CloudinaryUploadResult> {
  const {
    folder = "career-graph/uploads",
    resourceType = "auto",
    publicId,
  } = options;

  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      {
        folder,
        resource_type: resourceType,
        public_id: publicId,
        overwrite: true,
      },
      (error?: UploadApiErrorResponse, result?: UploadApiResponse) => {
        if (error || !result) {
          return reject(
            error || new Error("Cloudinary upload failed with empty result"),
          );
        }

        resolve({
          url: result.url,
          secureUrl: result.secure_url,
          publicId: result.public_id,
          format: result.format || "",
          bytes: result.bytes,
          width: result.width,
          height: result.height,
        });
      },
    );

    uploadStream.end(buffer);
  });
}

/**
 * Delete a resource from Cloudinary by public ID.
 */
export async function deleteFromCloudinary(
  publicId: string,
  resourceType: "image" | "raw" | "video" = "image",
): Promise<{ result: string }> {
  try {
    const res = await cloudinary.uploader.destroy(publicId, {
      resource_type: resourceType,
      invalidate: true,
    });
    return res;
  } catch (error) {
    console.error("Cloudinary deletion failed:", error);
    throw error;
  }
}

/**
 * Extract publicId from a Cloudinary URL if possible.
 */
export function extractPublicIdFromUrl(url: string): string | null {
  if (!url || !url.includes("cloudinary.com")) return null;
  try {
    // Pattern: .../upload/(v[0-9]+/)?(folder/subfolder/public_id)(.[a-z0-9]+)?
    const parts = url.split("/upload/");
    if (parts.length < 2) return null;
    let right = parts[1];

    // Remove transformation string if present (e.g., c_fill,w_300/...)
    // Transformations don't start with 'v' followed by numbers only
    const pathSegments = right.split("/");
    if (
      pathSegments[0].startsWith("v") &&
      /^\d+$/.test(pathSegments[0].slice(1))
    ) {
      right = pathSegments.slice(1).join("/");
    } else if (
      pathSegments.length > 1 &&
      pathSegments[1].startsWith("v") &&
      /^\d+$/.test(pathSegments[1].slice(1))
    ) {
      right = pathSegments.slice(2).join("/");
    }

    // Strip extension
    const lastDotIndex = right.lastIndexOf(".");
    if (lastDotIndex !== -1) {
      right = right.substring(0, lastDotIndex);
    }
    return right;
  } catch {
    return null;
  }
}

export default cloudinary;
