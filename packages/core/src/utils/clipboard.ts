/**
 * Clipboard helpers with graceful fallback for insecure origins and
 * permission rejections.
 *
 * `navigator.clipboard.writeText` is only available in secure contexts
 * (HTTPS or localhost) and can be rejected by browser permission policy
 * (e.g. when loaded in an unauthenticated iframe). When it is unavailable
 * or rejects, we fall back to the legacy `document.execCommand("copy")`
 * approach using an off-screen textarea.
 */

/**
 * Copy `text` to the clipboard.
 *
 * Tries the modern async Clipboard API first. If it is unavailable or
 * rejects (insecure origin, permission denied, iframe policy, etc.), falls
 * back to a synchronous `document.execCommand("copy")` using an off-screen
 * textarea.
 *
 * @returns `true` if the text was copied.
 * @throws The original error from the async Clipboard API when both the
 *   async API and the `execCommand` fallback fail, so callers can surface
 *   the real reason (e.g. permission denied).
 */
export async function copyTextToClipboard(text: string): Promise<boolean> {
  let asyncError: unknown;
  if (typeof navigator !== "undefined" && navigator.clipboard?.writeText) {
    try {
      await navigator.clipboard.writeText(text);
      return true;
    } catch (error) {
      asyncError = error;
      // Fall through to the execCommand fallback.
    }
  }
  if (execCommandCopy(text)) {
    return true;
  }
  if (asyncError !== undefined) {
    throw asyncError;
  }
  return false;
}

/**
 * Legacy fallback: copy `text` using `document.execCommand("copy")` with an
 * off-screen textarea. Works on insecure origins and when the async
 * Clipboard API is blocked by permission policy.
 *
 * @returns `true` if the copy command succeeded, `false` otherwise.
 */
export function execCommandCopy(text: string): boolean {
  if (typeof document === "undefined") {
    return false;
  }

  const textarea = document.createElement("textarea");
  textarea.value = text;
  // Keep the element off-screen and non-interactive so it never flashes or
  // steals focus from the user.
  textarea.setAttribute("readonly", "");
  textarea.style.position = "fixed";
  textarea.style.top = "-9999px";
  textarea.style.left = "-9999px";
  textarea.style.opacity = "0";
  textarea.style.width = "1px";
  textarea.style.height = "1px";

  document.body.appendChild(textarea);

  let success = false;
  try {
    textarea.select();
    textarea.setSelectionRange(0, textarea.value.length);
    success = document.execCommand("copy");
  } catch {
    success = false;
  } finally {
    document.body.removeChild(textarea);
  }

  return success;
}
