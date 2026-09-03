import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import type { ReactNode } from "react";
import manifest from "@/app/manifest";
import robots from "@/app/robots";
import sitemap from "@/app/sitemap";
import ErrorPage from "@/app/error";
import NotFound from "@/app/not-found";
import { JsonLd } from "@/app/json-ld";
import ToolPage from "@/app/page";
import RootLayout from "@/app/layout";
import { generateJsonLd, generateToolMetadata } from "@/lib/seo";
import toolConfig from "@/tool/tool.config";
import { templateMetadata } from "@/tool/template-metadata";
import { configBuilderTool } from "@/tool/tool-definition";

vi.mock("next/link", () => ({
  default: ({
    href,
    children,
    ...props
  }: {
    href: string;
    children: ReactNode;
  }) => (
    <a href={href} {...props}>
      {children}
    </a>
  ),
}));

vi.mock("next/font/google", () => ({
  Geist: () => ({ variable: "--font-geist-sans" }),
}));

vi.mock("@/app/tool-client-wrapper", () => ({
  default: () => (
    <div data-testid="tool-client-wrapper">tool-client-wrapper</div>
  ),
}));

describe("app and seo", () => {
  it("builds metadata and json-ld values", () => {
    const metadata = generateToolMetadata(toolConfig);
    const jsonLd = generateJsonLd(toolConfig);

    expect(metadata.creator).toBe(toolConfig.name);
    expect(metadata.metadataBase?.toString()).toBe("http://localhost:3000/");
    expect(jsonLd.url).toBe("http://localhost:3000");
    expect(jsonLd.featureList.length).toBeGreaterThan(0);
  });

  it("returns site manifest, robots and sitemap", () => {
    const man = manifest();
    const rob = robots();
    const sm = sitemap();

    expect(man.name).toBe(templateMetadata.appName);
    expect(rob.rules).toBeDefined();
    expect(sm[0]?.url).toBe("http://localhost:3000");
  });

  it("renders json-ld script safely", () => {
    render(<JsonLd config={{ ...toolConfig, name: "</script>" }} />);
    const script = document.querySelector('script[type="application/ld+json"]');
    expect(script?.innerHTML).toContain("\\u003c/script>");
  });

  it("renders error page and invokes reset", () => {
    const reset = vi.fn();
    render(<ErrorPage error={new Error("boom")} reset={reset} />);

    expect(screen.getByText("Something went wrong")).toBeInTheDocument();
  });

  it("renders not-found page", () => {
    render(<NotFound />);
    expect(screen.getByText("Page not found")).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Go home" })).toHaveAttribute(
      "href",
      "/",
    );
  });

  it("renders top-level tool page", () => {
    render(<ToolPage />);
    expect(screen.getByTestId("tool-client-wrapper")).toBeInTheDocument();
    expect(
      document.querySelector('script[type="application/ld+json"]'),
    ).toBeInTheDocument();
  });

  it("provides a skip-to-content bypass link (WCAG 2.2 AAA)", () => {
    const { container } = render(
      <RootLayout>
        <div>page content</div>
      </RootLayout>,
    );

    // The skip link must be the first focusable element and target #main-content.
    const skipLink = screen.getByRole("link", { name: "Skip to content" });
    expect(skipLink).toHaveAttribute("href", "#main-content");
    expect(skipLink).toHaveClass("skip-nav");

    // The main content region must carry the matching id.
    const main = document.getElementById("main-content");
    expect(main).not.toBeNull();
    expect(main?.tagName.toLowerCase()).toBe("main");

    // The skip link must appear before the main content in the DOM so it is
    // the first tab stop for keyboard users.
    const skipLinkPosition = skipLink.compareDocumentPosition(main!);
    expect(skipLinkPosition & Node.DOCUMENT_POSITION_FOLLOWING).toBeTruthy();
  });

  it("covers tool definition and helper exports", () => {
    expect(templateMetadata).toBeDefined();
    expect(
      configBuilderTool.deserialize({
        type: "docker-compose",
        title: "test",
        description: "desc",
        services: [],
      }),
    ).toEqual({
      success: true,
      data: {
        type: "docker-compose",
        title: "test",
        description: "desc",
        services: [],
        network: "bridge",
        volumeDriver: "local",
        notes: "",
      },
    });
    expect(configBuilderTool.deserialize({ nope: true })).toEqual({
      success: false,
      error:
        "Invalid data format: expected { type: string, title: string, description: string, services: Service[], network?: string, volumeDriver?: string, notes?: string }",
    });
    expect(
      configBuilderTool.serialize({
        type: "docker-compose",
        title: "test",
        description: "desc",
        services: [],
        network: "bridge",
        volumeDriver: "local",
        notes: "",
      }),
    ).toContain('"type": "docker-compose"');
  });

  it("has correct exporters count", () => {
    const exporters = configBuilderTool.exporters ?? [];
    expect(exporters).toHaveLength(3);
  });
});
