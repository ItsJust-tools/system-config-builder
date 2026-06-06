# Changelog

All notable changes to the System Config Builder will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.1.0] - 2026-06-06

### Added

- Interactive service management: add, edit (name/image/ports/restart), and remove services directly from sidebar
- Network settings (bridge/host/none/custom) and volume driver selection in sidebar
- Application title editing in sidebar
- ToolShell integration for consistent toolbar/sidebar/statusbar UX

### Fixed

- Added missing `webp` format to exportFormats (exporter already existed)
- Fixed URL revokeObjectURL timing in download handler
- Removed redundant onCopy/onDownload callback calls in button handlers

## [1.0.0] - 2026-05-24

### Added

- Initial release of System Config Builder
- Docker Compose generator
- Dockerfile template generator
- Systemd unit file generator
- NGINX configuration builder
- WireGuard config generator
- Supervisor config generator
- Traefik reverse proxy config generator
- Real-time configuration preview
- Export as PNG, WebP, PDF, and JSON
- Share functionality via `.itsjust.json` files
- Client-side processing for privacy-first operation

### Changed

- N/A

### Deprecated

- N/A

### Removed

- N/A

### Fixed

- N/A

### Security

- N/A
