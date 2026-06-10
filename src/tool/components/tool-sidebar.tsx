"use client";

import { useState, useCallback } from "react";
import type { SystemService } from "../types";
import { configTypeLabels } from "../types";

/** Props for the full sidebar including app-level settings and service list. */
interface ToolSidebarProps {
  title: string;
  description: string;
  notes: string;
  services: SystemService[];
  network: string;
  volumeDriver: string;
  onAddService: () => void;
  onRemoveService: (index: number) => void;
  onUpdateService: (index: number, service: SystemService) => void;
  onUpdateTitle: (title: string) => void;
  onUpdateDescription: (description: string) => void;
  onUpdateNotes: (notes: string) => void;
  onUpdateNetwork: (network: string) => void;
  onUpdateVolumeDriver: (volumeDriver: string) => void;
}

/** Inline props for a single service card with editing and removal controls. */
function ServiceCard({
  service,
  onRemove,
  onUpdate,
}: {
  service: SystemService;
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
  const [editVolumes, setEditVolumes] = useState(
    service.volumes?.join(", ") ?? "",
  );
  const [editEnv, setEditEnv] = useState(
    service.environment
      ? Object.entries(service.environment)
          .map(([k, v]) => `${k}=${v}`)
          .join("\n")
      : "",
  );
  const [editDependsOn, setEditDependsOn] = useState(
    service.dependsOn?.join(", ") ?? "",
  );
  const [editContainerName, setEditContainerName] = useState(
    service.containerName ?? "",
  );
  const [editLabels, setEditLabels] = useState(
    service.labels
      ? Object.entries(service.labels)
          .map(([k, v]) => `${k}=${v}`)
          .join("\n")
      : "",
  );

  const handleSave = useCallback(() => {
    // Parse ports: support both plain numbers and "host:container" string format
    const parsedPorts = editPorts
      ? editPorts
          .split(",")
          .map((p) => p.trim())
          .filter((p) => p.length > 0)
          .map((p) => {
            // If it's a "host:container" format, keep as string
            if (p.includes(":")) return p;
            const num = parseInt(p, 10);
            return isNaN(num) ? p : num;
          })
      : undefined;

    // Parse environment variables (KEY=VALUE per line or comma-separated)
    let parsedEnv: Record<string, string> | undefined;
    const envLines = editEnv
      .split(/[\n,]/)
      .map((l) => l.trim())
      .filter((l) => l.length > 0 && l.includes("="));
    if (envLines.length > 0) {
      parsedEnv = {};
      for (const line of envLines) {
        const eqIdx = line.indexOf("=");
        const key = line.substring(0, eqIdx).trim();
        const val = line.substring(eqIdx + 1).trim();
        if (key) parsedEnv[key] = val;
      }
    }

    // Parse volumes (comma-separated)
    const parsedVolumes = editVolumes
      ? editVolumes
          .split(",")
          .map((v) => v.trim())
          .filter((v) => v.length > 0)
      : undefined;

    // Parse depends_on (comma-separated)
    const parsedDependsOn = editDependsOn
      ? editDependsOn
          .split(",")
          .map((d) => d.trim())
          .filter((d) => d.length > 0)
      : undefined;

    // Parse labels (KEY=VALUE per line)
    let parsedLabels: Record<string, string> | undefined;
    const labelLines = editLabels
      .split(/[\n,]/)
      .map((l) => l.trim())
      .filter((l) => l.length > 0 && l.includes("="));
    if (labelLines.length > 0) {
      parsedLabels = {};
      for (const line of labelLines) {
        const eqIdx = line.indexOf("=");
        const key = line.substring(0, eqIdx).trim();
        const val = line.substring(eqIdx + 1).trim();
        if (key) parsedLabels[key] = val;
      }
    }

    onUpdate({
      ...service,
      name: editName.trim() || service.name,
      image: editImage.trim() || service.image,
      ports: parsedPorts,
      volumes: parsedVolumes,
      environment: parsedEnv,
      dependsOn: parsedDependsOn,
      restart: editRestart.trim() || undefined,
      containerName: editContainerName.trim() || undefined,
      labels: parsedLabels,
    });
    setEditing(false);
  }, [
    service,
    editName,
    editImage,
    editPorts,
    editRestart,
    editVolumes,
    editEnv,
    editDependsOn,
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
            Ports (comma-separated, e.g. 80, 443 or 8080:80)
            <input
              type="text"
              value={editPorts}
              onChange={(e) => setEditPorts(e.target.value)}
              className="config-edit-input"
              placeholder="80, 443, 8080:80"
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
          <label className="config-edit-label">
            Volumes (comma-separated, e.g. ./data:/data)
            <input
              type="text"
              value={editVolumes}
              onChange={(e) => setEditVolumes(e.target.value)}
              className="config-edit-input"
              placeholder="./data:/data, pgdata:/var/lib/postgresql/data"
              aria-label="Service volumes"
            />
          </label>
          <label className="config-edit-label">
            Environment variables (KEY=VALUE, one per line)
            <textarea
              value={editEnv}
              onChange={(e) => setEditEnv(e.target.value)}
              className="config-edit-textarea"
              placeholder="NODE_ENV=production
DATABASE_URL=postgres://user:pass@db:5432/app"
              rows={3}
              aria-label="Environment variables"
            />
          </label>
          <label className="config-edit-label">
            Depends on (comma-separated service names)
            <input
              type="text"
              value={editDependsOn}
              onChange={(e) => setEditDependsOn(e.target.value)}
              className="config-edit-input"
              placeholder="db, redis"
              aria-label="Service dependencies"
            />
          </label>
          <label className="config-edit-label">
            Container name
            <input
              type="text"
              value={editContainerName}
              onChange={(e) => setEditContainerName(e.target.value)}
              className="config-edit-input"
              placeholder="my-app-container"
              aria-label="Container name"
            />
          </label>
          <label className="config-edit-label">
            Labels (KEY=VALUE, one per line)
            <textarea
              value={editLabels}
              onChange={(e) => setEditLabels(e.target.value)}
              className="config-edit-textarea"
              placeholder={'com.example.vendor=\"ACME\"\ncom.example.version=\"1.0\"'}
              rows={2}
              aria-label="Container labels"
            />
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
              setEditVolumes(service.volumes?.join(", ") ?? "");
              setEditEnv(
                service.environment
                  ? Object.entries(service.environment)
                      .map(([k, v]) => `${k}=${v}`)
                      .join("\n")
                  : "",
              );
              setEditDependsOn(service.dependsOn?.join(", ") ?? "");
              setEditContainerName(service.containerName ?? "");
              setEditLabels(
                service.labels
                  ? Object.entries(service.labels)
                      .map(([k, v]) => `${k}=${v}`)
                      .join("\n")
                  : "",
              );
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
      {service.environment && Object.keys(service.environment).length > 0 && (
        <div className="config-service-meta">
          Env vars: {Object.keys(service.environment).length}
        </div>
      )}
      {service.dependsOn && service.dependsOn.length > 0 && (
        <div className="config-service-meta">
          Depends on: {service.dependsOn.join(", ")}
        </div>
      )}
      {service.restart && (
        <div className="config-service-meta">
          Restart: {service.restart}
        </div>
      )}
      {service.containerName && (
        <div className="config-service-meta">
          Container: {service.containerName}
        </div>
      )}
      {service.labels && Object.keys(service.labels).length > 0 && (
        <div className="config-service-meta">
          Labels: {Object.keys(service.labels).length}
        </div>
      )}
    </div>
  );
}

ServiceCard.displayName = "ServiceCard";

export function ToolSidebar({
  title,
  description,
  notes,
  services,
  network,
  volumeDriver,
  onAddService,
  onRemoveService,
  onUpdateService,
  onUpdateTitle,
  onUpdateDescription,
  onUpdateNotes,
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
        <div className="config-sidebar-field">
          <label className="config-sidebar-label" htmlFor="sidebar-description">
            Description
          </label>
          <input
            id="sidebar-description"
            type="text"
            value={description}
            onChange={(e) => onUpdateDescription(e.target.value)}
            className="config-edit-input"
            placeholder="My application stack"
            aria-label="Application description"
          />
        </div>
        <div className="config-sidebar-field">
          <label className="config-sidebar-label" htmlFor="sidebar-notes">
            Notes
          </label>
          <textarea
            id="sidebar-notes"
            value={notes}
            onChange={(e) => onUpdateNotes(e.target.value)}
            className="config-edit-textarea"
            placeholder="Optional notes about this configuration"
            rows={2}
            aria-label="Configuration notes"
          />
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

ToolSidebar.displayName = "ToolSidebar";