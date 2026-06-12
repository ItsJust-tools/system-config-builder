"use client";

import { configTypeLabels, type ConfigType } from "../types";

/** Props for the config-type toolbar selector. */
interface ToolToolbarProps {
  type: string;
  onTypeChange?: (type: string) => void;
}

/**
 * ToolToolbar renders the config-type selector and keyboard shortcut hints.
 * Options are sourced from the shared `configTypeLabels` mapping to keep
 * labels consistent across the application.
 *
 * @param props - Component props
 * @param props.type - Current configuration type
 * @param props.onTypeChange - Callback when the config type changes
 */
export function ToolToolbar({
  type,
  onTypeChange,
}: ToolToolbarProps) {
  const configOptions = Object.entries(configTypeLabels) as [ConfigType, string][];

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
        {configOptions.map(([value, label]) => (
          <option key={value} value={value}>
            {label}
          </option>
        ))}
      </select>

      <span className="config-toolbar-separator" aria-hidden="true" />

      {/* Shortcut hints */}
      <span className="config-toolbar-label config-toolbar-label-secondary">
        Shortcuts:
      </span>
      <kbd className="config-toolbar-kbd">Ctrl+Shift+C</kbd>
      <span className="config-toolbar-label config-toolbar-label-sm">Copy</span>
      <kbd className="config-toolbar-kbd">Ctrl+Shift+D</kbd>
      <span className="config-toolbar-label config-toolbar-label-sm">Download</span>
    </div>
  );
}

ToolToolbar.displayName = "ToolToolbar";
