import { describe, it, expect } from "vitest";
import { configBuilderTool } from "@/tool/tool-definition";
import type { SystemConfigState } from "@/tool/types";

const defaultState: SystemConfigState = {
  type: "docker-compose",
  title: "my-app",
  description: "My application stack",
  services: [
    {
      name: "web",
      image: "nginx:alpine",
      ports: [80, 443],
      volumes: ["/var/www/html:/usr/share/nginx/html:ro"],
    },
  ],
  network: "bridge",
  volumeDriver: "local",
  notes: "",
};

describe("Config builder tool definition", () => {
  it("initializes with default state", () => {
    const state = configBuilderTool.initialState;
    expect(state.type).toBe("docker-compose");
    expect(state.title).toBe("my-app");
    expect(state.description).toBe("My application stack");
    expect(state.services).toHaveLength(1);
    expect(state.services[0].name).toBe("web");
    expect(state.network).toBe("bridge");
    expect(state.volumeDriver).toBe("local");
    expect(state.notes).toBe("");
  });

  it("has correct metadata", () => {
    expect(configBuilderTool.id).toBe("system-config-builder");
    expect(configBuilderTool.name).toBe("System Config Builder");
    expect(configBuilderTool.version).toBeDefined();
  });

  it("serializes state to JSON string", () => {
    const json = configBuilderTool.serialize(defaultState);
    expect(() => JSON.parse(json)).not.toThrow();
    const parsed = JSON.parse(json);
    expect(parsed.type).toBe("docker-compose");
    expect(parsed.title).toBe("my-app");
    expect(parsed.services).toHaveLength(1);
    expect(parsed.services[0].ports).toEqual([80, 443]);
  });

  it("serializes state with all service fields", () => {
    const state: SystemConfigState = {
      ...defaultState,
      type: "systemd",
      title: "my-service",
      description: "Systemd unit",
      services: [
        {
          name: "app",
          image: "myapp:latest",
          ports: [8080],
          volumes: ["/data:/data"],
          environment: { FOO: "bar" },
          dependsOn: ["db"],
          restart: "always",
        },
      ],
      network: "bridge",
      volumeDriver: "local",
      notes: "Important",
    };

    const json = configBuilderTool.serialize(state);
    const parsed = JSON.parse(json);
    expect(parsed.services[0].environment).toEqual({ FOO: "bar" });
    expect(parsed.services[0].dependsOn).toEqual(["db"]);
    expect(parsed.services[0].restart).toBe("always");
    expect(parsed.notes).toBe("Important");
  });

  it("deserializes valid config state with all fields", () => {
    const result = configBuilderTool.deserialize({
      type: "nginx",
      title: "My NGINX Config",
      description: "My nginx setup",
      services: [
        {
          name: "proxy",
          image: "nginx:latest",
          ports: [80, 443],
          volumes: [],
        },
      ],
      network: "host",
      volumeDriver: "local",
      notes: "Production config",
    });
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.type).toBe("nginx");
      expect(result.data.title).toBe("My NGINX Config");
      expect(result.data.services).toHaveLength(1);
      expect(result.data.services[0].name).toBe("proxy");
      expect(result.data.network).toBe("host");
      expect(result.data.notes).toBe("Production config");
    }
  });

  it("deserializes config state without optional fields", () => {
    const result = configBuilderTool.deserialize({
      type: "docker-compose",
      title: "test",
      description: "desc",
      services: [],
    });
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.network).toBe("bridge");
      expect(result.data.volumeDriver).toBe("local");
      expect(result.data.notes).toBe("");
    }
  });

  it("rejects JSON string (only accepts plain objects)", () => {
    const result = configBuilderTool.deserialize(JSON.stringify(defaultState));
    expect(result.success).toBe(false);
  });

  it("rejects null data", () => {
    const result = configBuilderTool.deserialize(null);
    expect(result.success).toBe(false);
  });

  it("rejects non-object data", () => {
    const result = configBuilderTool.deserialize("not-an-object");
    expect(result.success).toBe(false);
  });

  it("rejects object without type", () => {
    const result = configBuilderTool.deserialize({
      title: "test",
      description: "desc",
      services: [],
    });
    expect(result.success).toBe(false);
  });

  it("rejects object without title", () => {
    const result = configBuilderTool.deserialize({
      type: "docker-compose",
      description: "desc",
      services: [],
    });
    expect(result.success).toBe(false);
  });

  it("rejects object without description", () => {
    const result = configBuilderTool.deserialize({
      type: "docker-compose",
      title: "test",
      services: [],
    });
    expect(result.success).toBe(false);
  });

  it("rejects non-array services", () => {
    const result = configBuilderTool.deserialize({
      type: "docker-compose",
      title: "test",
      description: "desc",
      services: "not-an-array",
    });
    expect(result.success).toBe(false);
  });

  it("rejects non-string type", () => {
    const result = configBuilderTool.deserialize({
      type: 123,
      title: "test",
      description: "desc",
      services: [],
    });
    expect(result.success).toBe(false);
  });

  it("accepts service with non-string name (no deep validation)", () => {
    const result = configBuilderTool.deserialize({
      type: "docker-compose",
      title: "test",
      description: "desc",
      services: [{ name: 42, image: "nginx:latest" }],
    });
    expect(result.success).toBe(true);
  });

  it("rejects invalid JSON string", () => {
    const result = configBuilderTool.deserialize("{invalid}");
    expect(result.success).toBe(false);
  });

  it("has correct exporters configured", () => {
    const exporters = configBuilderTool.exporters ?? [];
    expect(exporters).toHaveLength(3);
    const formats = exporters.map((e) => e.format);
    expect(formats).toContain("png");
    expect(formats).toContain("webp");
    expect(formats).toContain("pdf");
  });

  it("has correct tool config", () => {
    expect(configBuilderTool.config.id).toBe("system-config-builder");
    expect(configBuilderTool.config.name).toBe("System Config Builder");
    expect(configBuilderTool.config.exportFormats).toContain("json");
    expect(configBuilderTool.config.features.export).toBe(true);
    expect(configBuilderTool.config.theme!.accent).toBe("#6366f1");
  });
});
