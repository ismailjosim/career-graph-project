import {
  DeleteObjectCommand,
  PutObjectCommand,
  S3Client,
} from "@aws-sdk/client-s3";

/**
 * Cloudflare R2 Storage Adapter
 * Integrates Cloudflare R2 (S3-compatible, 10GB/month free tier) for cost-efficient
 * storage of user resumes, CVs, and documents.
 */

const R2_ACCOUNT_ID = process.env.R2_ACCOUNT_ID?.trim();
const R2_ACCESS_KEY_ID = process.env.R2_ACCESS_KEY_ID?.trim();
const R2_SECRET_ACCESS_KEY = process.env.R2_SECRET_ACCESS_KEY?.trim();
const R2_BUCKET_NAME =
  process.env.R2_BUCKET_NAME?.trim() || "career-graph-resumes";
const R2_PUBLIC_DOMAIN = process.env.R2_PUBLIC_DOMAIN?.trim(); // e.g. "https://resumes.careergraph.com" or r2.dev domain

let s3ClientInstance: S3Client | null = null;

export function isR2Configured(): boolean {
  return Boolean(R2_ACCOUNT_ID && R2_ACCESS_KEY_ID && R2_SECRET_ACCESS_KEY);
}

export function getR2Client(): S3Client {
  if (!s3ClientInstance) {
    if (!R2_ACCOUNT_ID || !R2_ACCESS_KEY_ID || !R2_SECRET_ACCESS_KEY) {
      throw new Error(
        "Cloudflare R2 credentials are not configured in environment variables.",
      );
    }

    s3ClientInstance = new S3Client({
      region: "auto",
      endpoint: `https://${R2_ACCOUNT_ID}.r2.cloudflarestorage.com`,
      credentials: {
        accessKeyId: R2_ACCESS_KEY_ID,
        secretAccessKey: R2_SECRET_ACCESS_KEY,
      },
    });
  }
  return s3ClientInstance;
}

export interface R2UploadResult {
  url: string;
  key: string;
  bucket: string;
  sizeBytes: number;
  contentType: string;
}

/**
 * Upload a document buffer to Cloudflare R2
 */
export async function uploadToR2(
  buffer: Buffer,
  options: {
    fileName: string;
    folder?: string;
    contentType?: string;
  },
): Promise<R2UploadResult> {
  const client = getR2Client();
  const folder = options.folder || "resumes";
  const sanitizedName = options.fileName.replace(/[^a-zA-Z0-9._-]/g, "_");
  const uniqueKey = `${folder}/${Date.now()}-${sanitizedName}`;
  const contentType = options.contentType || "application/pdf";

  const command = new PutObjectCommand({
    Bucket: R2_BUCKET_NAME,
    Key: uniqueKey,
    Body: buffer,
    ContentType: contentType,
  });

  await client.send(command);

  // Compute public URL
  let publicUrl: string;
  if (R2_PUBLIC_DOMAIN) {
    const domain = R2_PUBLIC_DOMAIN.replace(/\/+$/, "");
    publicUrl = `${domain}/${uniqueKey}`;
  } else {
    // Default R2 endpoint URL format
    publicUrl = `https://${R2_BUCKET_NAME}.${R2_ACCOUNT_ID}.r2.cloudflarestorage.com/${uniqueKey}`;
  }

  return {
    url: publicUrl,
    key: uniqueKey,
    bucket: R2_BUCKET_NAME,
    sizeBytes: buffer.length,
    contentType,
  };
}

/**
 * Delete an object from Cloudflare R2
 */
export async function deleteFromR2(key: string): Promise<void> {
  if (!isR2Configured()) return;
  const client = getR2Client();
  const command = new DeleteObjectCommand({
    Bucket: R2_BUCKET_NAME,
    Key: key,
  });
  await client.send(command);
}
