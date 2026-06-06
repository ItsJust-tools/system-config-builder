import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import type { ReactNode } from "react";
import ToolClient from "@/app/tool-client";
import ToolClientWrapper from "@/app/tool-client-wrapper";

vi.mock("next/link", () => ({
  default: ({
    href,
    children,
    ...props
  }: { href: string; children: ReactNode }) => (
    <a href={href} {...props}>
      {children}
    </a>
  ),
}));

vi.mock("next/dynamic", () => ({
  default:
    () =>
    () =>
      <div data-testid="dynamic-tool-client">dynamic-tool-client</div>,
}));

const mockSetData = vi.fn();
const mockHandleExport = vi.fn();

vi.mock("@itsjust/core", () => ({
  useTool: () => ({
    state: {
      data: {
        type: "docker-compose",
        title: "my-app",
        description: "My application stack",
        services: [
          { name: "web", image: "nginx:alpine", ports: [80] },
        ],
        network: "bridge",
        volumeDriver: "local",
        notes: "",
      },
      setData: mockSetData,
      undo: vi.fn(),
      redo: vi.fn(),
      canUndo: false,
      canRedo: false,
      isDirty: false,
      lastSaved: "just now",
    },
    toolbarActions: {
      onUndo: undefined,
      onRedo: undefined,
      canUndo: false,
      canRedo: false,
      onExport: mockHandleExport,
      onReset: vi.fn(),
      supportedFormats: ["json", "png", "pdf", "webp"],
    },
    importFromFile: vi.fn(),
    isImporting: false,
    isExporting: false,
    abortExport: vi.fn(),
    handleExport: mockHandleExport,
    supportedFormats: ["json", "png", "pdf", "webp"],
    toast: vi.fn(),
  }),
  ToolShell: ({
    toolbar,
    sidebar,
    children,
  }: {
    toolbar?: ReactNode;
    sidebar?: ReactNode;
    children: ReactNode;
  }) => (
    <div data-testid="mock-tool-shell">
      <div data-testid="mock-toolbar">{toolbar}</div>
      <div data-testid="mock-sidebar-container">{sidebar}</div>
      <div data-testid="mock-canvas-container">{children}</div>
    </div>
  ),
  ImportExport: () => <div data-testid="mock-import-export" />,
  ThemeProvider: ({ children }: { children: ReactNode }) => <>{children}</>,
  ToastProvider: ({ children }: { children: ReactNode }) => <>{children}</>,
  ThemeScript: () => null,
}));

vi.mock("@/tool", () => ({
  configBuilderTool: {
    id: "system-config-builder",
    name: "System Config Builder",
    version: "1.0.0",
    config: {
      id: "system-config-builder",
      name: "System Config Builder",
      features: { sidebar: true },
      theme: { brand: "System Config Builder" },
    },
    initialState: {
      type: "docker-compose",
      title: "my-app",
      description: "My application stack",
      services: [
        { name: "web", image: "nginx:alpine", ports: [80] },
      ],
      network: "bridge",
      volumeDriver: "local",
      notes: "",
    },
    serialize: (state: unknown) => JSON.stringify(state),
    deserialize: () => ({
      success: true,
      data: {
        type: "docker-compose",
        title: "test",
        description: "desc",
        services: [],
      },
    }),
  },
  ToolCanvas: () => <div data-testid="mock-canvas">canvas</div>,
  ToolToolbar: ({
    onTypeChange,
  }: {
    onTypeChange: (type: string) => void;
  }) => (
    <div>
      <button
        type="button"
        data-testid="type-btn"
        onClick={() => onTypeChange("nginx")}
      >
        Change Type
      </button>
    </div>
  ),
  ToolSidebar: () => <div data-testid="mock-sidebar">sidebar</div>,
}));

describe("app client and help page", () => {
  beforeEach(() => {
    mockSetData.mockReset();
    Object.defineProperty(navigator, "clipboard", {
      writable: true,
      value: { writeText: vi.fn().mockResolvedValue(undefined) },
    });
    Object.defineProperty(navigator, "share", {
      writable: true,
      value: vi.fn().mockResolvedValue(undefined),
    });
  });

  it("renders dynamic tool client wrapper", () => {
    render(<ToolClientWrapper />);
    expect(screen.getByTestId("dynamic-tool-client")).toBeInTheDocument();
  });

  it("renders tool client components inside ToolShell", () => {
    render(<ToolClient />);
    expect(screen.getByTestId("mock-tool-shell")).toBeInTheDocument();
    expect(screen.getByTestId("mock-toolbar")).toBeInTheDocument();
    expect(screen.getByTestId("mock-sidebar-container")).toBeInTheDocument();
    expect(screen.getByTestId("mock-canvas-container")).toBeInTheDocument();
    expect(screen.getByTestId("mock-sidebar")).toBeInTheDocument();
  });

  it("handles type change in toolbar", () => {
    render(<ToolClient />);
    // The toolbar slot renders inside ToolShell's mock-toolbar div
    const toolbar = screen.getByTestId("mock-toolbar");
    const btn = toolbar.querySelector('[data-testid="type-btn"]');
    expect(btn).not.toBeNull();
    fireEvent.click(btn!);
    expect(mockSetData).toHaveBeenCalled();
  });
});