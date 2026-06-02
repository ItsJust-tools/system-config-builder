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
      <div className="config-toolbar-inner">
        {/* Type Selector */}
        <span className="config-toolbar-label">Config Type:</span>
        <select
          value={type}
          onChange={(e) => onTypeChange?.(e.target.value)}
          className="config-toolbar-select"
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

        {/* Export Button */}
        <button
          type="button"
          className="config-btn config-btn-secondary config-btn-sm"
          onClick={onExport}
          aria-label="Export configuration"
        >
          Download Config
        </button>
      </div>
    );
  }, [type, onTypeChange, onExport]);

  return <>{actions()}</>;
}
