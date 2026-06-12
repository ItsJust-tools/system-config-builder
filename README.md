# System Config Builder

[![CI](https://github.com/ItsJust-tools/system-config-builder/actions/workflows/ci.yml/badge.svg)](https://github.com/ItsJust-tools/system-config-builder/actions/workflows/ci.yml)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)
[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg)](https://github.com/ItsJust-tools/system-config-builder/pulls)

A client-side tool for generating system configuration files. Create Docker Compose, systemd units, NGINX configs, WireGuard configs, and more — all from your browser, no server needed.

**Live at:** [system-config-builder.itsjust.tools](https://system-config-builder.itsjust.tools)

## Features

- 🐳 **Docker Compose** — Generate `docker-compose.yml` files with services, networks, volumes, environment variables, and dependency ordering
- 📦 **Dockerfile** — Modern multi-stage Dockerfile templates (Node.js 22 Alpine)
- 📋 **Systemd Units** — Generate systemd `.service` unit files
- 🌐 **NGINX Config** — Build NGINX configuration files with proxy pass support
- 🔐 **WireGuard** — Create WireGuard VPN configuration templates
- 📺 **Supervisor** — Generate Supervisor process manager configs
- 🚢 **Traefik** — Create Traefik reverse proxy configurations (modern YAML format)
- ✏️ **Full service editor** — Edit service name, image, ports (with host:container mapping), volumes, environment variables, restart policy, and dependencies
- 📋 **Copy to clipboard** — One-click copy of generated configs
- ⬇️ **Download** — Download configuration files with proper extensions
- 📤 **Export** — Export as PNG, WebP, or PDF
- 🔗 **Share** — Share your configuration via URL
- 🌙 **Dark mode** — System-aware theme with high contrast support
- ♿ **Accessible** — ARIA labels, keyboard navigation, screen reader support

## Configuration Types

| Type           | Description                  | File Extension |
| -------------- | ---------------------------- | -------------- |
| Docker Compose | Container orchestration      | `compose.yml`  |
| Dockerfile     | Container build instructions | `Dockerfile`   |
| Systemd        | System service units         | `.service`     |
| NGINX          | Web server configuration     | `.conf`        |
| WireGuard      | VPN configuration            | `.conf`        |
| Supervisor     | Process manager config       | `.ini`         |
| Traefik        | Reverse proxy config (YAML)  | `.yml`         |

## Usage

```bash
git clone https://github.com/ItsJust-tools/system-config-builder.git
cd system-config-builder

# Install dependencies
npm install

# Development
npm run dev

# Production build
npm run build

# Run tests
npm test
```

### Quick Start

1. Open the tool in your browser
2. Type a project name in the sidebar
3. Click **+ Add** to create a service
4. Pick a **Config Type** from the toolbar dropdown
5. Copy or download the generated configuration

## Service Editor Fields

Each service can be configured with:

| Field              | Description                                        | Example                                           |
| ------------------ | -------------------------------------------------- | ------------------------------------------------- |
| **Name**           | Service identifier                                 | `web`                                             |
| **Image**          | Docker/container image                             | `nginx:alpine`                                    |
| **Ports**          | Comma-separated, supports host:container mapping   | `80, 443, 8080:80`                                |
| **Restart policy** | Container restart behavior                         | `always`, `on-failure`                            |
| **Volumes**        | Comma-separated bind mounts or named volumes       | `./data:/data`, `pgdata:/var/lib/postgresql/data` |
| **Env vars**       | Key=value pairs, one per line or comma-separated   | `NODE_ENV=production`                             |
| **Depends on**     | Comma-separated service names for startup ordering | `db, redis`                                       |

## Keyboard Shortcuts

| Shortcut       | Action                          |
| -------------- | ------------------------------- |
| `Ctrl+Shift+C` | Copy configuration to clipboard |
| `Ctrl+Shift+D` | Download configuration file     |

## Accessibility

- **Keyboard navigation** — All interactive elements are keyboard-accessible
- **Screen reader support** — ARIA labels and live regions for dynamic content
- **High contrast** — Fully supports high-contrast mode (`data-contrast="more"`)
- **Reduced motion** — Respects `prefers-reduced-motion`
- **Focus indicators** — Clear `:focus-visible` outlines on all interactive elements

## Development

```bash
# Install dependencies
npm install

# Run dev server (Turbopack)
npm run dev

# Run unit tests
npm test

# Run E2E tests (requires dev server)
npm run test:e2e

# Lint
npm run lint

# Format code
npm run format
```

## Tech Stack

- **Framework:** Next.js 16 with App Router
- **UI:** React 19 + TypeScript
- **Styling:** Tailwind CSS v4 + custom CSS variables for theming
- **Testing:** Vitest + Playwright
- **Package Manager:** npm workspaces

## Project Structure

```
src/
├── app/              # Next.js app router pages and layout
│   ├── globals.css   # Theme variables and global styles
│   ├── layout.tsx    # Root layout with theme provider
│   ├── page.tsx      # Main page entry
│   └── tool-client.tsx  # Client-side tool logic and state binding
├── tool/
│   ├── components/   # Canvas, sidebar, and toolbar components
│   ├── exporters/    # Export implementations (PNG, WebP, PDF)
│   ├── tool.config.ts     # Tool configuration and metadata
│   ├── tool-definition.ts # Tool state definition and serialization
│   ├── types.ts      # TypeScript type definitions and labels
│   └── template-metadata.ts # SEO and template metadata
└── lib/              # Shared utilities (SEO, helpers)
```

## Contributing

Contributions are welcome! Here's how to get started:

1. **Fork** the repository
2. **Create a feature branch**: `git checkout -b feat/my-feature`
3. **Make your changes**
4. **Run tests**: `npm test`
5. **Run the linter**: `npm run lint`
6. **Commit** with a descriptive message
7. **Push** and open a Pull Request

### Guidelines

- Keep the tool **single-purpose** — configuration generation, done well
- Maintain **accessibility** — all interactive elements need ARIA labels
- Support **dark mode** — use CSS variables from the theme
- Write **tests** for new functionality
- Use **TypeScript** with strict mode
- Keep **bundle size** small — avoid unnecessary dependencies

## License

MIT — See [LICENSE](LICENSE) for details.

## Support

- Open an issue on [GitHub](https://github.com/ItsJust-tools/system-config-builder/issues) for bugs
- Discuss features in the issues

---

Built with ❤️ for developers who deploy things.
