import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import {
  copyTextToClipboard,
  execCommandCopy,
} from "../../src/utils/clipboard";

describe("clipboard utils", () => {
  const originalNavigatorClipboard = navigator.clipboard;
  const originalDocumentExecCommand = document.execCommand;

  // jsdom does not implement document.execCommand; provide a stub so we can
  // spy on it.
  function ensureExecCommand() {
    if (typeof document.execCommand !== "function") {
      document.execCommand = () => false;
    }
  }

  beforeEach(() => {
    ensureExecCommand();
  });

  afterEach(() => {
    Object.defineProperty(navigator, "clipboard", {
      value: originalNavigatorClipboard,
      configurable: true,
    });
    document.execCommand = originalDocumentExecCommand;
    vi.restoreAllMocks();
  });

  describe("copyTextToClipboard", () => {
    it("uses the async Clipboard API when available", async () => {
      const writeText = vi.fn().mockResolvedValue(undefined);
      Object.defineProperty(navigator, "clipboard", {
        value: { writeText },
        configurable: true,
      });
      const execSpy = vi.spyOn(document, "execCommand");

      const result = await copyTextToClipboard("hello");

      expect(result).toBe(true);
      expect(writeText).toHaveBeenCalledWith("hello");
      expect(execSpy).not.toHaveBeenCalled();
    });

    it("falls back to execCommand when Clipboard API rejects", async () => {
      const writeText = vi.fn().mockRejectedValue(new Error("Not allowed"));
      Object.defineProperty(navigator, "clipboard", {
        value: { writeText },
        configurable: true,
      });
      const execSpy = vi.spyOn(document, "execCommand").mockReturnValue(true);

      const result = await copyTextToClipboard("fallback");

      expect(result).toBe(true);
      expect(writeText).toHaveBeenCalledWith("fallback");
      expect(execSpy).toHaveBeenCalledWith("copy");
    });

    it("falls back to execCommand when Clipboard API is unavailable", async () => {
      Object.defineProperty(navigator, "clipboard", {
        value: undefined,
        configurable: true,
      });
      const execSpy = vi.spyOn(document, "execCommand").mockReturnValue(true);

      const result = await copyTextToClipboard("no-clipboard");

      expect(result).toBe(true);
      expect(execSpy).toHaveBeenCalledWith("copy");
    });

    it("returns false when both methods fail and no async error", async () => {
      Object.defineProperty(navigator, "clipboard", {
        value: undefined,
        configurable: true,
      });
      vi.spyOn(document, "execCommand").mockReturnValue(false);

      const result = await copyTextToClipboard("fail");

      expect(result).toBe(false);
    });

    it("throws the original error when async API rejects and fallback fails", async () => {
      const writeText = vi
        .fn()
        .mockRejectedValue(new Error("Clipboard blocked"));
      Object.defineProperty(navigator, "clipboard", {
        value: { writeText },
        configurable: true,
      });
      vi.spyOn(document, "execCommand").mockReturnValue(false);

      await expect(copyTextToClipboard("fail")).rejects.toThrow(
        "Clipboard blocked",
      );
    });
  });

  describe("execCommandCopy", () => {
    it("creates an off-screen textarea and copies", () => {
      const appendSpy = vi.spyOn(document.body, "appendChild");
      const removeSpy = vi.spyOn(document.body, "removeChild");
      const execSpy = vi.spyOn(document, "execCommand").mockReturnValue(true);

      const result = execCommandCopy("some text");

      expect(result).toBe(true);
      expect(execSpy).toHaveBeenCalledWith("copy");
      expect(appendSpy).toHaveBeenCalled();
      expect(removeSpy).toHaveBeenCalled();
    });

    it("returns false when execCommand throws", () => {
      vi.spyOn(document, "execCommand").mockImplementation(() => {
        throw new Error("copy blocked");
      });

      const result = execCommandCopy("boom");

      expect(result).toBe(false);
    });
  });
});
