import type { Tool } from '@itsjust/core';
import toolConfig from './tool.config';
import type { SystemConfigState } from './types';

function isSystemConfigState(value: unknown): value is SystemConfigState {
  if (typeof value !== 'object' || value === null) return false;
  const v = value as { type?: unknown; title?: unknown; description?: unknown; services?: unknown; network?: unknown; volumeDriver?: unknown; notes?: unknown };
  if (typeof v.type !== 'string') return false;
  if (typeof v.title !== 'string') return false;
  if (typeof v.description !== 'string') return false;
  if (!Array.isArray(v.services)) return false;
  return true;
}

export const configBuilderTool: Tool<SystemConfigState> = {
  id: toolConfig.id,
  name: toolConfig.name,
  version: toolConfig.version,
  config: toolConfig,
  initialState: {
    type: 'docker-compose',
    title: 'my-app',
    description: 'My application stack',
    services: [
      {
        name: 'web',
        image: 'nginx:alpine',
        ports: [80, 443],
        volumes: ['/var/www/html:/usr/share/nginx/html:ro'],
      },
    ],
    network: 'bridge',
    volumeDriver: 'local',
    notes: '',
  },
  serialize: (state) =>
    JSON.stringify({
      type: state.type,
      title: state.title,
      description: state.description,
      services: state.services,
      network: state.network,
      volumeDriver: state.volumeDriver,
      notes: state.notes,
    }, null, 2),
  deserialize: (data) => {
    if (isSystemConfigState(data)) {
      return {
        success: true,
        data: {
          type: data.type,
          title: data.title,
          description: data.description,
          services: data.services,
          network: data.network || 'bridge',
          volumeDriver: data.volumeDriver || 'local',
          notes: data.notes || '',
        },
      };
    }
    return {
      success: false,
      error: 'Invalid data format: expected { type: string, title: string, description: string, services: Service[], network?: string, volumeDriver?: string, notes?: string }',
    };
  },
  exporters: [
    { format: 'png', loader: () => import('./exporters/png') },
    { format: 'webp', loader: () => import('./exporters/webp') },
    { format: 'pdf', loader: () => import('./exporters/pdf') },
  ],
};
