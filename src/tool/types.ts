export type ConfigType =
  | "docker-compose"
  | "systemd"
  | "nginx"
  | "wireguard"
  | "supervisor"
  | "traefik"
  | "dockerfile";

export interface SystemService {
  name: string;
  image: string;
  ports?: (number | string)[];
  volumes?: string[];
  environment?: Record<string, string>;
  dependsOn?: string[];
  restart?: string;
}

export interface SystemConfigState {
  type: ConfigType;
  title: string;
  description: string;
  services: SystemService[];
  network: string;
  volumeDriver: string;
  notes: string;
}

export const configTypeLabels: Record<ConfigType, string> = {
  "docker-compose": "Docker Compose",
  systemd: "Systemd Unit",
  nginx: "NGINX Config",
  wireguard: "WireGuard Config",
  supervisor: "Supervisor Config",
  traefik: "Traefik Config",
  dockerfile: "Dockerfile",
};
