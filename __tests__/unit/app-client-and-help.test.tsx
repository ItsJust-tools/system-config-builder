import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import type { ReactNode } from 'react';
import ToolClient from '@/app/tool-client';
import ToolClientWrapper from '@/app/tool-client-wrapper';

vi.mock('next/link', () => ({
  default: ({ href, children, ...props }: { href: string; children: ReactNode }) => (
    <a href={href} {...props}>
      {children}
    </a>
  ),
}));

vi.mock('next/dynamic', () => ({
  default: () => () => <div data-testid="dynamic-tool-client">dynamic-tool-client</div>,
}));

const mockSetData = vi.fn();
const mockExportTo = vi.fn();
const mockDownloadShareFile = vi.fn();
const mockShareViaWeb = vi.fn();

vi.mock('@itsjust/core', () => ({
  useToolState: () => ({
    data: {
      type: 'docker-compose',
      title: 'my-app',
      description: 'My application stack',
      services: [{ name: 'web', image: 'nginx:alpine', ports: [80] }],
      network: 'bridge',
      volumeDriver: 'local',
      notes: '',
    },
    setData: mockSetData,
    isDirty: false,
    lastSaved: 'just now',
  }),
  useExport: () => ({
    exportTo: mockExportTo,
    isExporting: false,
  }),
  useShare: () => ({
    downloadShareFile: mockDownloadShareFile,
    shareViaWeb: mockShareViaWeb,
  }),
}));

vi.mock('@/tool', () => ({
  toolConfig: {
    id: 'system-config-builder',
    name: 'System Config Builder',
    version: '1.0.0',
    features: { sidebar: true },
    theme: { brand: 'System Config Builder' },
  },
  configBuilderTool: {
    serialize: (state: unknown) => JSON.stringify(state),
    deserialize: () => ({
      success: true,
      data: { type: 'docker-compose', title: 'test', description: 'desc', services: [] },
    }),
  },
  ToolCanvas: () => <div data-testid="mock-canvas">canvas</div>,
  ToolToolbar: ({ onTypeChange }: { onTypeChange: (type: string) => void }) => (
    <div>
      <button type="button" data-testid="type-btn" onClick={() => onTypeChange('nginx')}>
        Change Type
      </button>
    </div>
  ),
  ToolSidebar: () => <div data-testid="mock-sidebar">sidebar</div>,
}));

describe('app client and help page', () => {
  beforeEach(() => {
    mockSetData.mockReset();
    Object.defineProperty(navigator, 'clipboard', {
      writable: true,
      value: { writeText: vi.fn().mockResolvedValue(undefined) },
    });
    Object.defineProperty(navigator, 'share', {
      writable: true,
      value: vi.fn().mockResolvedValue(undefined),
    });
  });

  it('renders dynamic tool client wrapper', () => {
    render(<ToolClientWrapper />);
    expect(screen.getByTestId('dynamic-tool-client')).toBeInTheDocument();
  });

  it('renders tool client components', () => {
    render(<ToolClient />);
    expect(screen.getByTestId('mock-canvas')).toBeInTheDocument();
    expect(screen.getByTestId('mock-sidebar')).toBeInTheDocument();
  });

  it('handles type change in toolbar', () => {
    render(<ToolClient />);
    fireEvent.click(screen.getByTestId('type-btn'));
    expect(mockSetData).toHaveBeenCalled();
  });

  it('renders share and download buttons', () => {
    render(<ToolClient />);
    expect(screen.getByText('⬇️ Download .itsjust.json')).toBeInTheDocument();
    expect(screen.getByText('🔗 Share')).toBeInTheDocument();
  });
});