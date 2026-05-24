import { describe, it, expect } from "vitest";
import { configBuilderTool } from "@/tool";
import type { SystemConfigState } from "@/tool";

describe("System Config Builder Tool", () => {
  describe("initialState", () => {
    it("should have default values", () => {
      const state = configBuilderTool.initialState;
      expect(state.type).toBe("docker-compose");
      expect(state.title).toBe("my-app");
      expect(state.services).toHaveLength(1);
      expect(state.network).toBe("bridge");
    });
  });

  describe("serialize", () => {
    it("should serialize state correctly", () => {
      const state: SystemConfigState = {
        type: "docker-compose",
        title: "my-app",
        description: "Test app",
        services: [
          {
            name: "web",
            image: "nginx:alpine",
            ports: [80, 443],
          },
        ],
        network: "bridge",
        volumeDriver: "local",
        notes: "",
      };

      const serialized = configBuilderTool.serialize(state);
      const parsed = JSON.parse(serialized);

      expect(parsed.type).toBe("docker-compose");
      expect(parsed.title).toBe("my-app");
    });
  });

  describe("tool config", () => {
    it("should have correct tool ID", () => {
      expect(configBuilderTool.id).toBe("system-config-builder");
    });

    it("should have correct name", () => {
      expect(configBuilderTool.name).toBe("System Config Builder");
    });

    it("should have export formats configured", () => {
      expect(configBuilderTool.config.exportFormats).toContain("json");
      expect(configBuilderTool.config.exportFormats).toContain("png");
      expect(configBuilderTool.config.exportFormats).toContain("pdf");
    });
  });
});
