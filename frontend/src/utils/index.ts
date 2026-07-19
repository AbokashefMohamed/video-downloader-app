// formats an ISO date string to a readable local date and time
export function formatDate(dateStr: string | null | undefined): string {
  if (!dateStr) {
    return "";
  }

  const date = new Date(dateStr);

  // Fail gracefully if string is not a valid timestamp format
  if (isNaN(date.getTime())) {
    return "";
  }
  try {
    return date.toLocaleDateString(undefined, {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  } catch {
    return dateStr.split("T")[0] || "";
  }
}
