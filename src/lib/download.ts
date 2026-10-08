import { apiClient } from "@/lib/api-client";

/** Extracts the filename from a Content-Disposition header, if present. */
const filenameFromDisposition = (header: unknown): string | undefined => {
  if (typeof header !== "string") return undefined;
  const match = /filename\*?=(?:UTF-8'')?"?([^";]+)"?/i.exec(header);
  return match ? decodeURIComponent(match[1]) : undefined;
};

/** Saves a Blob to the user's device under the given filename. */
export const saveBlob = (blob: Blob, filename: string) => {
  const url = window.URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  link.remove();
  window.URL.revokeObjectURL(url);
};

/**
 * Downloads a file from the API and saves it. Uses the server's filename when it sends one
 * (e.g. official document references), otherwise `fallbackName`. Returns the saved filename.
 */
export const downloadFile = async (
  url: string,
  { fallbackName, params }: { fallbackName: string; params?: object },
): Promise<string> => {
  const response = await apiClient.get<Blob>(url, { params, responseType: "blob" });
  const filename = filenameFromDisposition(response.headers["content-disposition"]) ?? fallbackName;
  saveBlob(response.data, filename);
  return filename;
};
