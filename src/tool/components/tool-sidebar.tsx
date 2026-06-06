"use client";

import { useState, useCallback } from "react";
import type { SystemService } from "../types";

interface ToolSidebarProps {
  title: string;
  services: SystemService[];
  network: string;
  volumeDriver: string;
  onAddService: () => void;
  onRemoveService: (index: number) => void;
  onUpdateService: (index: number, service: SystemService) => void;
  onUpdateTitle: (title: string) => void;
  onUpdateNetwork: (network: string) => void;
  onUpdateVolumeDriver: (volumeDriver: string) => void;
}

function ServiceCard({
  service,
  index,
  onRemove,
  onUpdate,
}: {
  service: SystemService;
  index: number;
  onRemove: () => void;
  onUpdate: (service: SystemService) => void;
}) {
  const [editing, setEditing] = useState(false);
  const [editName, setEditName] = useState(service.name);
  const [editImage, setEditImage] = useState(service.image);
  const [editPorts, setEditPorts] = useState(
    service.ports?.join(", ") ?? "",
  );
  const [editRestart, setEditRestart] = useState(service.restart ?? "");

  const handleSave = useCallback(() => {
    onUpdate({
      ...service,
      name: editName.trim() || service.name,
      image: editImage.trim() || service.image,
      ports: editPorts
        ? editPorts
            .split(",")
            .map((p) => parseInt(p.trim(), 10))
            .filter((n) => !isNaN(n))
        : undefined,
      restart: editRestart.trim() || undefined,
    });
    setEditing(false);
  }, [
    service,
    editName,
    editImage,
    editPorts,
    editRestart,
    onUpdate,
  ]);

  if (editing) {
    return (
      <div className="config-service-card config-service-editing">
        <div className="config-service-edit-form">
          <label className="config-edit-label">
            Name
            <input
              type="text"
              value={editName}
              onChange={(e) => setEditName(e.target.value)}
              className="config-edit-input"
              aria-label="Service name"
            />
          </label>
          <label className="config-edit-label">
            Image
            <input
              type="text"
              value={editImage}
              onChange={(e) => setEditImage(e.target.value)}
              className="config-edit-input"
              aria-label="Service image"
            />
          </label>
          <label className="config-edit-label">
            Ports (comma-separated)
            <input
              type="text"
              value={editPorts}
              onChange={(e) => setEditPorts(e.target.value)}
              className="config-edit-input"
              placeholder="80, 443"
              aria-label="Service ports"
            />
          </label>
          <label className="config-edit-label">
            Restart policy
            <select
              value={editRestart}
              onChange={(e) => setEditRestart(e.target.value)}
              className="config-edit-select"
              aria-label="Restart policy"
            >
              <option value="">Default</option>
              <option value="always">Always</option>
              <option value="on-failure">On Failure</option>
              <option value="unless-stopped">Unless Stopped</option>
              <option value="no">No</option>
            </select>
          </label>
          <div className="config-edit-actions">
            <button
              type="button"
              className="config-btn config-btn-primary config-btn-xs"
              onClick={handleSave}
              aria-label="Save service changes"
            >
              💾 Save
            </button>
            <button
              type="button"
              className="config-btn config-btn-secondary config-btn-xs"
              onClick={() => setEditing(false)}
              aria-label="Cancel editing"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="config-service-card">
      <div className="config-service-header">
        <span className="config-service-name">{service.name}</span>
        <div className="config-service-actions">
          <button
            type="button"
            className="config-btn-icon"
            onClick={() => {
              setEditName(service.name);
              setEditImage(service.image);
              setEditPorts(service.ports?.join(", ") ?? "");
              setEditRestart(service.restart ?? "");
              setEditing(true);
            }}
            aria-label={`Edit service ${service.name}`}
            title="Edit service"
          >
            ✏️
          </button>
          <button
            type="button"
            className="config-btn-icon config-btn-icon-danger"
            onClick={onRemove}
            aria-label={`Remove service ${service.name}`}
            title="Remove service"
          >
            🗑️
          </button>
        </div>
      </div>
      <div className="config-service-image-text">{service.image}</div>
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

export function ToolSidebar({
  title,
  services,
  network,
  volumeDriver,
  onAddService,
  onRemoveService,
  onUpdateService,
  onUpdateTitle,
  onUpdateNetwork,
  onUpdateVolumeDriver,
}: ToolSidebarProps) {
  return (
    <div className="config-sidebar">
      {/* App Info / Title */}
      <div className="sidebar-section">
        <h3>Application</h3>
        <div className="config-app-card">
          <span className="config-app-icon">📦</span>
          <div className="config-app-details">
            <input
              type="text"
              value={title}
              onChange={(e) => onUpdateTitle(e.target.value)}
              className="config-app-title-input"
              aria-label="Application title"
              placeholder="my-app"
            />
            <span className="config-service-count">
              {services.length} service
              {services.length !== 1 ? "s" : ""}
            </span>
          </div>
        </div>
      </div>

      {/* Network Settings */}
      <div className="sidebar-section">
        <h3>Network</h3>
        <div className="config-sidebar-field">
          <label className="config-sidebar-label" htmlFor="sidebar-network">
            Network
          </label>
          <select
            id="sidebar-network"
            value={network}
            onChange={(e) => onUpdateNetwork(e.target.value)}
            className="config-edit-select"
            aria-label="Docker network"
          >
            <option value="bridge">Bridge (default)</option>
            <option value="host">Host</option>
            <option value="none">None</option>
            <option value="custom-net">Custom Network</option>
          </select>
        </div>
        <div className="config-sidebar-field">
          <label
            className="config-sidebar-label"
            htmlFor="sidebar-volume-driver"
          >
            Volume Driver
          </label>
          <select
            id="sidebar-volume-driver"
            value={volumeDriver}
            onChange={(e) => onUpdateVolumeDriver(e.target.value)}
            className="config-edit-select"
            aria-label="Volume driver"
          >
            <option value="local">Local</option>
            <option value="nfs">NFS</option>
            <option value="rbd">RBD (Ceph)</option>
          </select>
        </div>
      </div>

      {/* Services */}
      <div className="sidebar-section">
        <div className="sidebar-section-header">
          <h3>Services</h3>
          <button
            type="button"
            className="config-btn config-btn-primary config-btn-xs"
            onClick={onAddService}
            aria-label="Add a new service"
            title="Add service"
          >
            + Add
          </button>
        </div>
        <div className="config-services-list">
          {services.length === 0 ? (
            <p className="config-empty-message">
              No services added yet. Click &quot;+ Add&quot; to create one.
            </p>
          ) : (
            services.map((s, i) => (
              <ServiceCard
                key={`${s.name}-${i}`}
                service={s}
                index={i}
                onRemove={() => onRemoveService(i)}
                onUpdate={(updated) => onUpdateService(i, updated)}
              />
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