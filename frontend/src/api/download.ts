import api from "./client";
import { DownloadRequest } from "../types";

// download a video, audio or subtitle file
// response is a binary blob — we trigger a browser save dialog
export async function downloadFile(
  data: DownloadRequest,
  onProgress?: (percent: number) => void
): Promise<void> {
  try {
    const response = await api.post("/download", data, {
      responseType: "blob",
      timeout: 60 * 60 * 1000,
      onDownloadProgress: (progressEvent) => {
        if (progressEvent.total && onProgress) {
          const percent = Math.round(
            (progressEvent.loaded * 100) / progressEvent.total
          );
          onProgress(percent);
        }
      },
    });

    const disposition = response.headers["content-disposition"];
    let filename = "download";
    if (disposition) {
      const rfc5987Match = disposition.match(/filename\*=UTF-8''([^;\s]+)/i);
      if (rfc5987Match) {
        filename = decodeURIComponent(rfc5987Match[1]);
      } else {
        const regularMatch = disposition.match(/filename="([^"]+)"/);
        if (regularMatch) {
          filename = regularMatch[1];
        }
      }
    }

    if (!(response.data instanceof Blob)) {
      throw new Error("Invalid download response");
    }

    const url = URL.createObjectURL(response.data);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", filename);
    document.body.appendChild(link);
    link.click();
    link.remove();
    URL.revokeObjectURL(url);
  } catch (error) {
    console.error("[download]", error);
    throw error;
  }
}