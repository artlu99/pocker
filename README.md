# Pocker

[![AGPL LICENSE](https://img.shields.io/badge/LICENSE-AGPL-blue.svg)](https://www.gnu.org/licenses/agpl-3.0.html)
[![Try It Online](https://img.shields.io/badge/TryIt-Online-orange.svg)](https://getpocker.artlu.xyz)

## Introduction

Pocker is a fork + rewrite of Cloudmark by Wesley Yang, a universal cloud bookmark management tool that allows you to easily save and access your bookmarks from anywhere. No login or registration required - simply create your personalized bookmark collection and start using it right away.

Try the original online: [cloudmark.site](https://cloudmark.site)

Try the fork online: [getpocker.artlu.xyz](https://getpocker.artlu.xyz)

## Key Features

- 🔑 **No Registration**: Access your bookmark collection using a unique identifier
- 🔖 **One-Click Save**: Quickly save the current webpage using a bookmarklet
- 🏷️ **Category Management**: Add custom categories to your bookmarks for easy organization
- 🌐 **Cross-Device Access**: Access your bookmarks on any device
- 📝 **Detailed Descriptions**: Add personalized descriptions to your bookmarks
- 🌍 **Multi-Language Support**: English and Chinese interfaces available
- ✨ **Modern Interface**: Responsive design for all devices

## Quick Start

1. Visit [Pocker](https://getpocker.artlu.xyz)
2. Generate a unique identifier (mark) or use a custom one
3. Install the bookmarklet to your browser
4. Click the bookmarklet to save webpages while browsing
5. Visit `getpocker.artlu.xyz/your-mark` anytime to view and manage your bookmarks

## Local Development

### Prerequisites

- `bun`
- *temporarily*: Cloudflare account
- KV will become `Evolu`

### Install Dependencies

```bash
bun install
```

### Development Mode with HMR + Local Preview on Cloudflare Workers

```bash
bun dev
```

Visit [http://localhost:5173](http://localhost:5173) to see the result.

### Build and Deploy

```bash
bun run deploy
```

## Cloudflare Configuration

### KV Namespace

*Temporarily,* Pocker uses Cloudflare KV to store bookmark data. You need to:

1. Create a KV namespace in your Cloudflare Dashboard
2. Update the `wrangler.jsonc` file:

   ```json
   "kv_namespaces": [
      {
        "binding": "KV",
        "id": "your-kv-namespace-id"
      }
   ]
   ```

3. Re-run wrangler types

```bash
bun types
```

## Technology Stack

- [Vite 6](https://vite.dev) - The Build Tool for the Web
- [React 19](https://react.dev) - the library for web and native user interfaces
- [Cloudflare Workers](https://developers.cloudflare.com/workers) - serverless platform
- [Cloudflare KV](https://developers.cloudflare.com/kv) - global, low-latency, key-value data storage.
- [TailwindCSS v4](https://tailwindcss.com) - utility-first CSS framework
- [react-i18next](https://react.i18next.com) - powerful internationalization framework based on <code>i18next</code>
- [wouter](https://github.com/molefrog/wouter) - tiny modern router that relies on Hooks
- [TanStack Query v5](https://tanstack.com/query/v5) - data-fetching library for web applications

#### Fork and Rewrite

- [x] Vite + Cloudflare Workers + Wouter replace Next.js
- [x] React Query + `itty-fetcher` instead of `zsa` Next server actions
- [ ] local-first rather than cloud-first
- [ ] Evolu instead of Cloudflare KV
- [ ] PWA to save to Home Screen and persist

## License

This project remains open-sourced under the [AGPL-3.0](https://www.gnu.org/licenses/agpl-3.0.html) license.

## Contact

If you have any questions, please contact us through GitHub Issues.
