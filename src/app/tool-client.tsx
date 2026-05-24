'use client';

import { useCallback, useRef } from 'react';
import { configBuilderTool, ToolCanvas, ToolToolbar, ToolSidebar } from '@/tool';
import type { ConfigType } from '@/tool';
import { useToolState, useExport, useShare } from '@itsjust/core';

export default function ToolClient() {
  const canvasRef = useRef<HTMLDivElement>(null);

  const toolConfig = configBuilderTool.config;

  const state = useToolState<typeof configBuilderTool.initialState>(configBuilderTool.initialState, {
    key: 'system-config-builder',
    maxHistoryEntries: 100,
    debounceMs: 0,
  });

  const { exportTo, supportedFormats, isExporting } = useExport(
    canvasRef,
    toolConfig,
    () => configBuilderTool.serialize(state.data),
  );

  const { downloadShareFile, shareViaWeb } = useShare();

  const handleExport = useCallback(async (format: 'png' | 'pdf' | 'json' | 'jpeg' | 'webp') => {
    await exportTo(format);
  }, [exportTo]);

  return (
    <>
      <ToolToolbar
        type={state.data.type}
        onTypeChange={(type) => state.setData((prev) => ({ ...prev, type: type as ConfigType }))}
        onExport={() => handleExport('json')}
      />
      <ToolCanvas
        title={state.data.title}
        services={state.data.services}
        network={state.data.network}
        volumeDriver={state.data.volumeDriver}
        type={state.data.type}
        canvasRef={canvasRef}
      />
      <ToolSidebar
        title={state.data.title}
        services={state.data.services}
        type={state.data.type}
      />
      {/* Share Actions */}
      <div style={{ display: 'flex', gap: '0.5rem', marginTop: '1rem' }}>
        <button
          type="button"
          onClick={async () => {
            await downloadShareFile({
              toolId: toolConfig.id,
              content: configBuilderTool.serialize(state.data),
              metadata: { schemaVersion: '1.0' },
            });
          }}
          disabled={isExporting}
          style={{
            padding: '0.375rem 0.75rem',
            border: '1px solid var(--border)',
            borderRadius: 'var(--radius)',
            background: 'var(--card)',
            color: 'var(--foreground)',
            cursor: isExporting ? 'not-allowed' : 'pointer',
            fontSize: '0.8125rem',
            fontWeight: 500,
            fontFamily: 'inherit',
          }}
          aria-disabled={isExporting}
        >
          Download .itsjust.json
        </button>
        <button
          type="button"
          onClick={async () => {
            await shareViaWeb({
              toolId: toolConfig.id,
              content: configBuilderTool.serialize(state.data),
              metadata: { schemaVersion: '1.0' },
            });
          }}
          disabled={isExporting}
          style={{
            padding: '0.375rem 0.75rem',
            border: '1px solid var(--border)',
            borderRadius: 'var(--radius)',
            background: 'var(--card)',
            color: 'var(--foreground)',
            cursor: isExporting ? 'not-allowed' : 'pointer',
            fontSize: '0.8125rem',
            fontWeight: 500,
            fontFamily: 'inherit',
          }}
          aria-disabled={isExporting}
        >
          Share
        </button>
      </div>
    </>
  );
}
