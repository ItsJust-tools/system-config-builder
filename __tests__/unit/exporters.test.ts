import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import pngExporter from '@/tool/exporters/png';
import webpExporter from '@/tool/exporters/webp';
import pdfExporter from '@/tool/exporters/pdf';
import type { ExportOptions } from '@itsjust/core';

const toBlobMock = vi.fn();

vi.mock('html-to-image', () => ({
  toBlob: (...args: unknown[]) => toBlobMock(...args),
}));

describe('exporters', () => {
  const makeOptions = (overrides: Partial<ExportOptions> = {}): ExportOptions => ({
    format: 'png',
    ...overrides,
  });

  beforeEach(() => {
    toBlobMock.mockReset();
    document.body.innerHTML = '';
  });

  afterEach(() => {
    document.body.innerHTML = '';
    vi.restoreAllMocks();
  });

  describe('pngExporter', () => {
    it('exports successfully', async () => {
      const el = document.createElement('div');
      el.className = 'notepad-canvas';
      el.textContent = 'System Config Builder';
      document.body.appendChild(el);

      toBlobMock.mockResolvedValue(new Blob(['fake-image'], { type: 'image/png' }));

      const result = await pngExporter.export(el, makeOptions({ format: 'png', filename: 'test.png' }));
      expect(result.success).toBe(true);
      expect(result.filename).toBe('test.png');
    });

    it('uses default filename when not provided', async () => {
      const el = document.createElement('div');
      el.className = 'notepad-canvas';
      document.body.appendChild(el);

      toBlobMock.mockResolvedValue(new Blob(['fake-image'], { type: 'image/png' }));

      const result = await pngExporter.export(el, makeOptions({ format: 'png' }));
      expect(result.success).toBe(true);
      expect(result.filename).toMatch(/^system-config-\d+\.png$/);
    });
  });

  describe('webpExporter', () => {
    it('exports successfully', async () => {
      const el = document.createElement('div');
      el.className = 'notepad-canvas';
      document.body.appendChild(el);

      toBlobMock.mockResolvedValue(new Blob(['fake-webp'], { type: 'image/webp' }));

      const result = await webpExporter.export(el, makeOptions({ format: 'webp', filename: 'test.webp' }));
      expect(result.success).toBe(true);
      expect(result.filename).toBe('test.webp');
    });
  });

  describe('pdfExporter', () => {
    it('exports pdf successfully', async () => {
      const el = document.createElement('div');
      el.textContent = 'System Configuration';

      const result = await pdfExporter.export(el, makeOptions({ format: 'pdf', filename: 'report.pdf' }));
      expect(result.success).toBe(true);
      expect(result.filename).toBe('report.pdf');
      expect(result.format).toBe('pdf');
      expect(result.data).toBeInstanceOf(Blob);
    });

    it('uses default filename with timestamp', async () => {
      const el = document.createElement('div');

      const result = await pdfExporter.export(el, makeOptions({ format: 'pdf' }));
      expect(result.success).toBe(true);
      expect(result.filename).toMatch(/^system-config-report-\d+\.pdf$/);
    });
  });
});