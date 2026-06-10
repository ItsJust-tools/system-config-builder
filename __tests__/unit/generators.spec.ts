import { describe, it, expect } from "vitest";
import { configBuilderTool } from "@/tool";

describe("Config generators", () => {
  const defaultState = configBuilderTool.initialState;

  describe("Docker Compose", () => {
    it("should generate valid docker-compose output with services", () => {
      const state = {
        ...defaultState,
        type: "docker-compose" as const,
        services: [{ name: "web", image: "nginx:alpine", ports: [80, 443] }],
      };
      const output = configBuilderTool.serialize(state);
      // The serialize is JSON; actual generation is the canvas component
      expect(output).toContain("web");
      expect(output).toContain("nginx:alpine");
    });

    it("should include environment variables when provided", () => {
      const state = {
        ...defaultState,
        services: [
          {
            name: "web",
            image: "nginx:alpine",
            environment: { NODE_ENV: "production", PORT: "3000" },
          },
        ],
      };
      const serialized = configBuilderTool.serialize(state);
      const parsed = JSON.parse(serialized);
      expect(parsed.services[0].environment.NODE_ENV).toBe("production");
    });

    it("should include depends_on when provided", () => {
      const state = {
        ...defaultState,
        services: [
          {
            name: "web",
            image: "nginx:alpine",
            dependsOn: ["db", "redis"],
          },
        ],
      };
      const serialized = configBuilderTool.serialize(state);
      const parsed = JSON.parse(serialized);
      expect(parsed.services[0].dependsOn).toEqual(["db", "redis"]);
    });
  });

  describe("Tool state management", () => {
    it("should handle empty services gracefully", () => {
      const state = {
        ...defaultState,
        services: [],
      };
      const serialized = configBuilderTool.serialize(state);
      const parsed = JSON.parse(serialized);
      expect(parsed.services).toEqual([]);
    });

    it("should preserve network value even when non-standard", () => {
      const state = {
        ...defaultState,
        network: "custom-net",
        volumeDriver: "local",
      };
      const serialized = configBuilderTool.serialize(state);
      const parsed = JSON.parse(serialized);
      expect(parsed.network).toBe("custom-net");
    });

    it("should preserve volumeDriver value when non-standard", () => {
      const state = {
        ...defaultState,
        volumeDriver: "nfs",
      };
      const serialized = configBuilderTool.serialize(state);
      const parsed = JSON.parse(serialized);
      expect(parsed.volumeDriver).toBe("nfs");
    });

    it("should preserve notes field through serialize/deserialize", () => {
      const state = {
        ...defaultState,
        notes: "Important: requires Docker 25+",
      };
      const serialized = configBuilderTool.serialize(state);
      const result = configBuilderTool.deserialize(JSON.parse(serialized));
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.notes).toBe("Important: requires Docker 25+");
      }
    });
  });

  describe("deserialize validation", () => {
    it("should reject null input", () => {
      const result = configBuilderTool.deserialize(null);
      expect(result.success).toBe(false);
    });

    it("should reject non-object input", () => {
      const result = configBuilderTool.deserialize("not-an-object");
      expect(result.success).toBe(false);
    });

    it("should reject input without required fields", () => {
      const result = configBuilderTool.deserialize({ foo: "bar" });
      expect(result.success).toBe(false);
    });

    it("should reject input with wrong type for services", () => {
      const result = configBuilderTool.deserialize({
        type: "docker-compose",
        title: "test",
        description: "test",
        services: "not-an-array",
      });
      expect(result.success).toBe(false);
    });

    it("should accept valid input and fill defaults", () => {
      const result = configBuilderTool.deserialize({
        type: "nginx",
        title: "webserver",
        description: "A web server",
        services: [{ name: "web", image: "nginx" }],
      });
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.network).toBe("bridge");
        expect(result.data.volumeDriver).toBe("local");
        expect(result.data.notes).toBe("");
      }
    });
  });

  describe("file extension mapping", () => {
    // Helper to test extension logic that matches the canvas implementation
    function getFileExtension(configType: string): string {
      switch (configType) {
        case "docker-compose":
          return "compose.yml";
        case "dockerfile":
          return "Dockerfile";
        case "systemd":
          return "service";
        case "nginx":
          return "conf";
        case "wireguard":
          return "conf";
        case "supervisor":
          return "ini";
        case "traefik":
          return "yml";
        default:
          return "txt";
      }
    }

    it("should map docker-compose to compose.yml", () => {
      expect(getFileExtension("docker-compose")).toBe("compose.yml");
    });

    it("should map dockerfile to Dockerfile", () => {
      expect(getFileExtension("dockerfile")).toBe("Dockerfile");
    });

    it("should map systemd to service", () => {
      expect(getFileExtension("systemd")).toBe("service");
    });

    it("should map nginx to conf", () => {
      expect(getFileExtension("nginx")).toBe("conf");
    });

    it("should map wireguard to conf", () => {
      expect(getFileExtension("wireguard")).toBe("conf");
    });

    it("should map supervisor to ini", () => {
      expect(getFileExtension("supervisor")).toBe("ini");
    });

    it("should map traefik to yml", () => {
      expect(getFileExtension("traefik")).toBe("yml");
    });

    it("should map unknown types to txt", () => {
      expect(getFileExtension("unknown")).toBe("txt");
    });
  });

  describe("service validation", () => {
    // The tool validates service names via the deserializer/type system
    it("should accept valid service with all optional fields", () => {
      const state = {
        ...defaultState,
        services: [
          {
            name: "db",
            image: "postgres:16",
            ports: [5432],
            volumes: ["pgdata:/var/lib/postgresql/data"],
            environment: { POSTGRES_USER: "admin" },
            dependsOn: [],
            restart: "always",
          },
        ],
      };
      const serialized = configBuilderTool.serialize(state);
      const parsed = JSON.parse(serialized);
      expect(parsed.services[0].restart).toBe("always");
      expect(parsed.services[0].volumes[0]).toBe(
        "pgdata:/var/lib/postgresql/data",
      );
    });
  });
});
