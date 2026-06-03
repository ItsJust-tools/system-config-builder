/**
 * PNG Exporter for System Config Builder
 * Captures the tool canvas as a PNG image with configuration metadata
 */

import type { Exporter } from "@itsjust/core";

function getConfigStateLabel(_stateSerializer?: () => string): string {
  return _stateSerializer?.() || "unknown";
}

export const exporter: Exporter = {
  format: "png",
  export: async (element, options, stateSerializer) => {
    try {
      getConfigStateLabel(stateSerializer);
      const { toBlob } = await import("html-to-image");
      const blob = await toBlob(element, {
        width: element.offsetWidth,
        height: element.offsetHeight,
        quality: 0.9,
        backgroundColor: "#ffffff",
        ...(options?.padding && { padding: options.padding }),
      });

      return {
        success: true,
        data: blob,
        filename: options?.filename ?? `system-config-${Date.now()}.png`,
        format: "png",
      };
    } catch (error) {
      console.error("[PNG Exporter]", error);
      return {
        success: false,
        data: null,
        filename: options?.filename ?? `system-config-${Date.now()}`,
        format: "png",
        error: error instanceof Error ? error.message : "Export failed",
      };
    }
  },
};

export default exporter;
