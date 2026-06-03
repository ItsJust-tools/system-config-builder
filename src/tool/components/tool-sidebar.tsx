"use client";

import type { SystemService } from "../types";

interface ToolSidebarProps {
  title: string;
  services: SystemService[];
}

function ServiceCard({ service }: { service: SystemService }) {
  return (
    <div className="config-service-card">
      <div className="config-service-header">
        <span className="config-service-name">{service.name}</span>
        <span className="config-service-image">{service.image}</span>
      </div>
      {service.ports && service.ports.length > 0 && (
        <div className="config-service-meta">
          Ports: {service.ports.join(", ")}
        </div>
      )}
      {service.volumes && service.volumes.length > 0 && (
        <div className="config-service-meta">
          Volumes: {service.volumes.length}
        </div>
      )}
      {service.restart && (
        <div className="config-service-meta">
          Restart: {service.restart}
        </div>
      )}
    </div>
  );
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
          {services.length === 0 ? (
            <p className="config-empty-message">No services added yet.</p>
          ) : (
            services.map((s, i) => (
              <ServiceCard key={i} service={s} />
            ))
          )}
        </div>
      </div>

      {/* Tips */}
      <div className="sidebar-section">
        <h3>Tips</h3>
        <div className="config-tips">
          <p>Use environment variables for sensitive data</p>
          <p>Add health checks for better orchestration</p>
          <p>
            Switch config types in the toolbar to see different output formats
          </p>
        </div>
      </div>
    </div>
  );
}
