import { describe, it, expect } from "vitest";
import type { SystemService } from "@/tool";
import {
  generateEnvFile,
  hasEnvironmentVariables,
  configBuilderTool,
} from "@/tool";

describe("Issue #46: Docker Compose .env file pairing", () => {
  const servicesWithEnv: SystemService[] = [
    {
      name: "web",
      image: "nginx:alpine",
      environment: { NODE_ENV: "production", API_KEY: "abc123", EMPTY: "" },
    },
    {
      name: "db",
      image: "postgres:16",
      environment: { POSTGRES_PASSWORD: "secret" },
    },
  ];

  describe("generateEnvFile", () => {
    it("returns null when no services have environment variables", () => {
      expect(
        generateEnvFile("app", [{ name: "web", image: "nginx:alpine" }]),
      ).toBeNull();
    });

    it("returns null for empty services array", () => {
      expect(generateEnvFile("app", [] as SystemService[])).toBeNull();
    });

    it("generates KEY=VALUE lines for all environment variables", () => {
      const output = generateEnvFile("app", servicesWithEnv)!;
      expect(output).toContain("NODE_ENV=production");
      expect(output).toContain("API_KEY=abc123");
      expect(output).toContain("POSTGRES_PASSWORD=secret");
      expect(output).toContain("EMPTY=");
    });

    it("groups variables under service name comments", () => {
      const output = generateEnvFile("app", servicesWithEnv)!;
      expect(output).toContain("# web");
      expect(output).toContain("# db");
      const webIdx = output.indexOf("# web");
      const dbIdx = output.indexOf("# db");
      expect(webIdx).toBeGreaterThanOrEqual(0);
      expect(dbIdx).toBeGreaterThan(webIdx);
    });

    it("includes title header", () => {
      const output = generateEnvFile("my-app", servicesWithEnv)!;
      expect(output).toContain("# my-app");
    });
  });

  describe("hasEnvironmentVariables", () => {
    it("returns false with no env vars", () => {
      expect(
        hasEnvironmentVariables([{ name: "web", image: "nginx:alpine" }]),
      ).toBe(false);
    });

    it("returns true when a service has env vars", () => {
      expect(hasEnvironmentVariables(servicesWithEnv)).toBe(true);
    });
  });

  describe("state serialize/deserialize round-trip", () => {
    it("defaults envFile to false in initial state", () => {
      expect(configBuilderTool.initialState.envFile).toBe(false);
    });

    it("defaults envFile to false when deserializing legacy data without envFile", () => {
      const result = configBuilderTool.deserialize({
        type: "docker-compose",
        title: "app",
        description: "d",
        services: [{ name: "web", image: "nginx:alpine" }],
      });
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.envFile).toBe(false);
      }
    });

    it("preserves envFile=true through serialize", () => {
      const state = {
        ...configBuilderTool.initialState,
        envFile: true,
        services: servicesWithEnv,
      };
      const parsed = JSON.parse(configBuilderTool.serialize(state));
      expect(parsed.envFile).toBe(true);
    });

    it("round-trips envFile=true through serialize + deserialize", () => {
      const state = {
        ...configBuilderTool.initialState,
        envFile: true,
      };
      const parsed = JSON.parse(configBuilderTool.serialize(state));
      const result = configBuilderTool.deserialize(parsed);
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.envFile).toBe(true);
      }
    });
  });

  describe("toggle behavior", () => {
    it("deserialized state with envFile=false keeps inline variables", () => {
      const parsed = JSON.parse(
        configBuilderTool.serialize({
          ...configBuilderTool.initialState,
          envFile: false,
          services: servicesWithEnv,
        }),
      );
      const result = configBuilderTool.deserialize(parsed);
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.envFile).toBe(false);
        expect(result.data.services[0]!.environment?.NODE_ENV).toBe(
          "production",
        );
      }
    });

    it("envFile state survives unknown extra properties in data", () => {
      const result = configBuilderTool.deserialize({
        type: "docker-compose",
        title: "app",
        description: "d",
        services: [],
        network: "bridge",
        volumeDriver: "local",
        notes: "",
        envFile: true,
        unknownField: "ignored",
      });
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.envFile).toBe(true);
      }
    });
  });
});
