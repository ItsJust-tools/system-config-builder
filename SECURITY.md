# Security Policy

This tool runs entirely client-side in the browser. No configuration data is sent to any server.

## Supported Versions

| Version | Supported          |
| ------- | ------------------ |
| 1.x     | ✅ Fully supported |

## Reporting a Vulnerability

Please open an issue on GitHub for any security concerns. Since this is a client-side tool with no server component, the main security considerations are:

1. **Dependencies** — We keep dependencies up to date to avoid known vulnerabilities
2. **XSS** — All configuration output is generated client-side and rendered in `<pre>` blocks
3. **Data privacy** — No data is transmitted; everything stays in your browser

For critical issues, please contact the repository maintainers directly via GitHub.
