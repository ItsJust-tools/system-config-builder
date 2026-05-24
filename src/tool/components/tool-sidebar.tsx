'use client';

import type { SystemService } from '../types';

interface ToolSidebarProps {
  title: string;
  services: SystemService[];
  type: string;
}

export function ToolSidebar({ title, services, type }: ToolSidebarProps) {
  return (
    <div className="config-sidebar">
      {/* App Info */}
      <div className="sidebar-section">
        <h3>Application Info</h3>
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            padding: '0.75rem',
            background: 'var(--card)',
            borderRadius: 'var(--radius)',
            marginBottom: '0.5rem',
          }}
        >
          <span style={{ fontSize: '1.25rem' }}>📦</span>
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <span style={{ fontWeight: 600 }}>{title}</span>
            <span style={{ fontSize: '0.6875rem', color: 'var(--muted)' }}>
              {services.length} services
            </span>
          </div>
        </div>
      </div>

      {/* Services */}
      <div className="sidebar-section">
        <h3>Services</h3>
        <div
          style={{
            maxHeight: '300px',
            overflowY: 'auto',
            border: '1px solid var(--border)',
            borderRadius: 'var(--radius)',
            padding: '0.5rem',
          }}
        >
          {services.map((s, i) => (
            <div
              key={i}
              style={{
                padding: '0.5rem',
                marginBottom: '0.25rem',
                borderRadius: '4px',
                background: 'var(--card)',
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontWeight: 500 }}>{s.name}</span>
                <span style={{ fontSize: '0.6875rem', color: 'var(--muted)' }}>{s.image}</span>
              </div>
              {s.ports && (
                <div style={{ fontSize: '0.6875rem', color: 'var(--muted)', marginTop: '0.25rem' }}>
                  Ports: {s.ports?.join(', ')}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Tips */}
      <div className="sidebar-section">
        <h3>Tips</h3>
        <div style={{ fontSize: '0.6875rem', color: 'var(--muted)', lineHeight: '1.6' }}>
          <div style={{ marginBottom: '0.25rem' }}>
            Use environment variables for sensitive data
          </div>
          <div>
            Add health checks for better orchestration
          </div>
        </div>
      </div>
    </div>
  );
}
