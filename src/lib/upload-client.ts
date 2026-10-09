import axios from "axios";

export interface UploadResponse {
  success: boolean;
  url: string;
  publicId: string;
  fileName: string;
  fileSize: number;
  format: string;
  extractedText?: string;
}

export type UploadProgressCallback = (
  percentage: number,
  loadedBytes: number,
  totalBytes: number,
) => void;

/**
 * Client-side file upload utility using Axios for real-time progress tracking
 */
export async function uploadFileWithProgress(
  file: File,
  type: "avatar" | "resume" | "document" = "avatar",
  onProgress?: UploadProgressCallback,
): Promise<UploadResponse> {
  const formData = new FormData();
  formData.append("file", file);
  formData.append("type", type);

  try {
    const response = await axios.post<UploadResponse>("/api/upload", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
      onUploadProgress: (progressEvent) => {
        if (progressEvent.total) {
          const percentage = Math.round(
            (progressEvent.loaded * 100) / progressEvent.total,
          );
          onProgress?.(percentage, progressEvent.loaded, progressEvent.total);
        }
      },
    });

    return response.data;
  } catch (err: unknown) {
    if (axios.isAxiosError(err) && err.response?.data) {
      const errorData = err.response.data as {
        error?: string;
        message?: string;
        code?: string;
      };
      const serverError = errorData.error || errorData.message;
      if (serverError) {
        const enhancedError = new Error(serverError);
        (enhancedError as unknown as { code?: string }).code = errorData.code;
        (enhancedError as unknown as { response?: unknown }).response =
          err.response;
        throw enhancedError;
      }
    }
    throw err;
  }
}

/**
 * Delete a file from Cloudinary storage
 */
export async function deleteUploadedFile(
  publicId: string,
  resourceType: "image" | "raw" = "image",
  isAvatar: boolean = false,
): Promise<boolean> {
  const response = await axios.delete<{ success: boolean }>("/api/upload", {
    data: {
      publicId,
      resourceType,
      isAvatar,
    },
  });
  return response.data.success;
}
