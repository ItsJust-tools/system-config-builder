"use client";

import { useCallback } from "react";

interface ToolToolbarProps {
  type: string;
  onTypeChange?: (type: string) => void;
  onExport?: () => void;
}

export function ToolToolbar({
  type,
  onTypeChange,
  onExport,
}: ToolToolbarProps) {
  const actions = useCallback(() => {
    return (
      <>
        {/* Type Selector */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "0.5rem",
            margin: "0.5rem",
          }}
        >
          <label style={{ fontSize: "0.75rem" }}>Config Type:</label>
          <select
            value={type}
            onChange={(e) => onTypeChange?.(e.target.value)}
            style={{
              padding: "0.375rem 0.5rem",
              border: "1px solid var(--border)",
              borderRadius: "var(--radius)",
              background: "var(--card)",
              color: "var(--foreground)",
              fontSize: "0.75rem",
              minWidth: "12rem",
            }}
            aria-label="Select config type"
          >
            <option value="docker-compose">Docker Compose</option>
            <option value="dockerfile">Dockerfile</option>
            <option value="systemd">Systemd Unit</option>
            <option value="nginx">NGINX Config</option>
            <option value="wireguard">WireGuard</option>
            <option value="supervisor">Supervisor</option>
            <option value="traefik">Traefik</option>
          </select>
        </div>

        {/* Export Button */}
        <button
          type="button"
          onClick={onExport}
          aria-label="Export configuration"
          style={{
            fontSize: "0.8125rem",
            fontWeight: 500,
            padding: "0.375rem 0.75rem",
            border: "1px solid var(--border)",
            borderRadius: "var(--radius)",
            background: "var(--card)",
            color: "var(--foreground)",
            cursor: "pointer",
            fontFamily: "inherit",
            marginRight: "0.5rem",
            display: "flex",
            alignItems: "center",
            gap: "0.375rem",
          }}
        >
          Download Config
        </button>
      </>
    );
  }, [type, onTypeChange, onExport]);

  return (
    <div
      className="config-toolbar"
      style={{ padding: "0.5rem", display: "flex", justifyContent: "flex-end" }}
    >
      {actions()}
    </div>
  );
}
