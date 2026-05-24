/**
 * WebP Exporter for System Config Builder
 * Captures the tool canvas as a WebP image with configuration metadata
 */

import type { Exporter } from '@itsjust/core';

export const exporter: Exporter = {
  format: 'webp',
  export: async (element, options, stateSerializer) => {
    try {
      const { exportElement } = await import('html-to-image');
      const blob = await exportElement(element, {
        width: element.offsetWidth,
        height: element.offsetHeight,
        quality: 0.85,
        backgroundColor: '#ffffff',
        ...(options?.padding && { padding: options.padding }),
      });

      return {
        success: true,
        data: blob,
        filename: options?.filename ?? `system-config-${Date.now()}.webp`,
        format: 'webp',
      };
    } catch (error) {
      console.error('[WebP Exporter]', error);
      return {
        success: false,
        data: null,
        filename: options?.filename ?? `system-config-${Date.now()}`,
        format: 'webp',
        error: error instanceof Error ? error.message : 'Export failed',
      };
    }
  },
};

export default exporter;
