import type { ToolConfig } from "@itsjust/core";
import packageJson from "../../package.json";

export const templateBaseVersion = packageJson.version;

const toolConfig = {
  id: "system-config-builder",
  name: "System Config Builder",
  description:
    "Generate system configuration files. Create Docker Compose, systemd units, NGINX configs, WireGuard configs, and more.",
  version: packageJson.version,
  exportFormats: ["json", "png", "pdf"],
  features: {
    export: true,
    autoSave: false,
    undoRedo: false,
    sidebar: true,
    statusBar: true,
    darkMode: true,
  },
  theme: {
    accent: "#6366f1",
    accentHover: "#4f46e5",
    accentSubtle: "rgba(99, 102, 241, 0.08)",
    brand: "System Config Builder",
    icon: "⚙️",
  },
  shortcuts: [
    {
      title: "System Config Builder",
      shortcuts: [
        {
          keys: "Ctrl+Shift+E",
          label: "Export",
          description: "export current config as JSON",
        },
      ],
    },
  ],
} satisfies ToolConfig;

export default toolConfig;
