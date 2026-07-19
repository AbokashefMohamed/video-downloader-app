import api from "./client";
import { DownloadRequest } from "../types";

// download a video, audio or subtitle file
// response is a binary blob — we trigger a browser save dialog
export async function downloadFile(data: DownloadRequest): Promise<void> {
  try {
    const response = await api.post("/download", data, {
      responseType: "blob", // tells axios to treat response as binary file not JSON
      timeout: 60 * 60 * 1000, // 1 hour timeout — large files take time
    });

    // temporary debug — remove after fixing
    console.log("headers:", response.headers);
    console.log(
      "content-disposition:",
      response.headers["content-disposition"],
    );

    // extract filename from Content-Disposition header
    const disposition = response.headers["content-disposition"];
    const filename =
      disposition?.match(/filename\*?=(?:UTF-8''|")?([^";]+)/)?.[1] ??
      "download";

    if (!(response.data instanceof Blob)) {
      throw new Error("Invalid download response");
    }
    // create a temporary download link and click it programmatically
    const url = URL.createObjectURL(response.data);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", decodeURIComponent(filename));
    document.body.appendChild(link);
    link.click();

    // clean up the temporary link and object URL
    link.remove();
    URL.revokeObjectURL(url);
  } catch (error) {
    console.error("[download]", error);
    throw error;
  }
}
