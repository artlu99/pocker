# LocalMark

[![AGPL LICENSE](https://img.shields.io/badge/LICENSE-AGPL-blue.svg)](https://www.gnu.org/licenses/agpl-3.0.html)
[![Try It Online](https://img.shields.io/badge/TryIt-Online-orange.svg)](https://localmark.uk)

## Introduction

LocalMark is a fork + rewrite of Cloudmark by Wesley Yang, a universal cloud bookmark management tool that allows you to easily save and access your bookmarks from anywhere. No login or registration required - simply create your personalized bookmark collection and start using it right away.

Try the original online: [cloudmark.site](https://cloudmark.site)

Try the fork online: [localmark.uk](https://localmark.uk)

## Key Features

- 🔑 **No Registration**: Access your bookmark collection using a unique identifier
- 🔖 **One-Click Save**: Quickly save the current webpage using a bookmarklet
- 🏷️ **Category Management**: Add custom categories to your bookmarks for easy organization
- 🌐 **Cross-Device Access**: Access your bookmarks on any device
- 📝 **Detailed Descriptions**: Add personalized descriptions to your bookmarks
- 🌍 **Multi-Language Support**: English and Chinese interfaces available
- ✨ **Modern Interface**: Responsive design for all devices

## Quick Start

1. Visit [LocalMark](https://localmark.uk)
3. Install the bookmarklet to your browser
4. Click the bookmarklet to save webpages while browsing
5. Visit `localmark.uk/` anytime to view and manage your bookmarks
6. (optional) synchronize across multiple browsers and devices

## Local Development

### Prerequisites

- `bun`

### Install Dependencies

```bash
bun install
```

### Development Mode with HMR

```bash
bun dev
```

Visit [http://localhost:5173](http://localhost:5173) to see the result.

### Build and Deploy

```bash
bun run deploy
```

## Technology Stack

- [Vite 7](https://vite.dev) - The Build Tool for the Web
- [React 19](https://react.dev) - the library for web and native user interfaces
- [Evolu](https://evolu.dev) - privacy-focused local‑first platform that scales
- [TailwindCSS v4](https://tailwindcss.com) - utility-first CSS framework
- [react-i18next](https://react.i18next.com) - powerful internationalization framework based on <code>i18next</code>
- [wouter](https://github.com/molefrog/wouter) - tiny modern router that relies on Hooks

#### Fork and Rewrite

- [x] Vite + Wouter replace Next.js
- [x] no `zsa` Next server actions
- [x] local-first rather than cloud-first
- [x] Evolu instead of Cloudflare KV

## Attribution

OG Images generated with [Free OG Image Generator](https://ogimage.click/)

## License

This project remains open-sourced under the [AGPL-3.0](https://www.gnu.org/licenses/agpl-3.0.html) license.

## Contact

If you have any questions, please contact us through GitHub Issues.
