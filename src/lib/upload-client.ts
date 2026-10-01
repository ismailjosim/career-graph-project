import axios from "axios";

export interface UploadResponse {
  success: boolean;
  url: string;
  publicId: string;
  fileName: string;
  fileSize: number;
  format: string;
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
