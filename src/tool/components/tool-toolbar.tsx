"use client";

/** Props for the config-type toolbar selector. */
interface ToolToolbarProps {
  type: string;
  onTypeChange?: (type: string) => void;
}

export function ToolToolbar({
  type,
  onTypeChange,
}: ToolToolbarProps) {
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
    </div>
  );
}

ToolToolbar.displayName = "ToolToolbar";