import { MAX_URL_LENGTH, ALLOWED_PROTOCOLS } from "./config.js";
import { ProbeError } from "./errors.js";

export function assertValidUrl(url) {
  // Must actually be a string of text
  if (!url || typeof url !== "string") {
    throw new ProbeError("Invalid URL", "INVALID_URL");
  }

  // Don't let someone send a massive string just to waste resources
  if (url.length > MAX_URL_LENGTH) {
    throw new ProbeError("URL too long", "INVALID_URL");
  }

  // Try to parse it as a real URL — if it's garbage, this throws
  let parsed;
  try {
    parsed = new URL(url);
  } catch {
    throw new ProbeError("Invalid URL format", "INVALID_URL");
  }

  // Only allow normal web links, not file:// or other protocols
  if (!ALLOWED_PROTOCOLS.includes(parsed.protocol)) {
    throw new ProbeError("Only http/https URLs are allowed", "INVALID_URL");
  }

  // Block sneaky URLs like http://user:pass@evil.com
  if (parsed.username || parsed.password) {
    throw new ProbeError("URLs with embedded credentials are not allowed", "INVALID_URL");
  }
}