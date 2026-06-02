# System Config Builder

[![CI](https://github.com/ItsJust-tools/system-config-builder/actions/workflows/ci.yml/badge.svg)](https://github.com/ItsJust-tools/system-config-builder/actions/workflows/ci.yml)
[![Version](https://img.shields.io/badge/Version-1.0.0-blue.svg)](https://github.com/ItsJust-tools/system-config-builder)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg)](https://github.com/ItsJust-tools/system-config-builder/pulls)

A client-side tool for generating system configuration files. Create Docker Compose, systemd units, NGINX configs, WireGuard configs, and more.

## Features

- 🐳 **Docker Compose**: Generate `docker-compose.yml` files
- 📦 **Dockerfile**: Create Dockerfile templates
- 📋 **Systemd Units**: Generate systemd service units
- 🌐 **NGINX Config**: Build NGINX configuration files
- 🔐 **WireGuard**: Create WireGuard VPN configs
- 📺 **Supervisor**: Generate supervisor config files
- 🚢 **Traefik**: Create Traefik reverse proxy configs

## Usage

```bash
git clone https://github.com/ItsJust-tools/system-config-builder.git
cd system-config-builder

# Development
npm run dev

# Production build
npm run build

# Run tests
npm test
```

## Usage Examples

### Docker Compose

```yaml
version: "3.8"

services:
  web:
    image: nginx:alpine
    ports:
      - "80:80"
    volumes:
      - ./html:/usr/share/nginx/html:ro
```

### Dockerfile

```dockerfile
FROM node:18-alpine

WORKDIR /app

COPY package*.json ./
RUN npm ci --only=production

COPY . .

EXPOSE 3000

CMD ["npm", "start"]
```

### NGINX Config

```nginx
server {
    listen 80;
    server_name example.com;

    location / {
        root /var/www/html;
        index index.html;
    }
}
```

## Configuration Types

| Type           | Description                  |
| -------------- | ---------------------------- |
| docker-compose | Container orchestration      |
| dockerfile     | Container build instructions |
| systemd        | System service units         |
| nginx          | Web server configuration     |
| wireguard      | VPN configuration            |
| supervisor     | Process manager config       |
| traefik        | Reverse proxy config         |

## Environment Variables

```bash
# For production deployment
NEXT_PUBLIC_URL=https://system-config-builder.itsjust.tools
```

## Accessibility

This tool respects accessibility:

- Keyboard-only navigation
- Screen reader support
- High contrast UI
- ARIA labels for all interactive elements

## Development

```bash
# Install dependencies
npm install

# Run dev server
npm run dev

# Run tests
npm test

# Run E2E tests
npm run test:e2e
```

## License

MIT - See LICENSE file for details.

## Contributing

Contributions welcome! Please read the contributing guidelines before submitting pull requests.

## Support

- Open an issue on GitHub for bugs
- Discuss features in the issues

---

Built with ❤️ for developers.
