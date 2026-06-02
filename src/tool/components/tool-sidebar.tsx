"use client";

import type { SystemService } from "../types";

interface ToolSidebarProps {
  title: string;
  services: SystemService[];
}

export function ToolSidebar({ title, services }: ToolSidebarProps) {
  return (
    <div className="config-sidebar">
      {/* App Info */}
      <div className="sidebar-section">
        <h3>Application Info</h3>
        <div className="config-app-card">
          <span className="config-app-icon">📦</span>
          <div className="config-app-details">
            <span className="config-app-name">{title}</span>
            <span className="config-service-count">
              {services.length} service{services.length !== 1 ? "s" : ""}
            </span>
          </div>
        </div>
      </div>

      {/* Services */}
      <div className="sidebar-section">
        <h3>Services</h3>
        <div className="config-services-list">
          {services.map((s, i) => (
            <div key={i} className="config-service-card">
              <div className="config-service-header">
                <span className="config-service-name">{s.name}</span>
                <span className="config-service-image">{s.image}</span>
              </div>
              {s.ports && s.ports.length > 0 && (
                <div className="config-service-ports">
                  Ports: {s.ports.join(", ")}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Tips */}
      <div className="sidebar-section">
        <h3>Tips</h3>
        <div className="config-tips">
          <p>Use environment variables for sensitive data</p>
          <p>Add health checks for better orchestration</p>
        </div>
      </div>
    </div>
  );
}
