# ARCHITECTURE (LLM/Agent context)

- **Project:** LocalMark (package name `pocker`). Local-first bookmark manager; fork of Cloudmark.
- **Access model:** No login. User identity via mnemonic.
- **Bookmarklet flow:** `javascript:` URL opens `{baseUrl}/api/add?title=&url=` with current page; handler creates bookmark.

---

## Stack

- **Build:** Vite 6, TypeScript, React 19.
- **Routing:** wouter (`Route`, `Switch`, `Link`, `useRoute`, `useSearchParams`, `useLocation`).
- **i18n:** react-i18next, i18next-browser-languagedetector; `src/i18n/en.json`, `es.json`, `zh.json`.
- **Data:** Evolu (`@evolu/common`, `@evolu/react`, `@evolu/react-web`). Local-first; config in `src/lib/evolu.ts`; secrets in `src/lib/constants.ts` (`EVOLU_INSTANCE`, `APP_OWNER_MNEMONIC`).
- **Validation:** Zod; schemas in `src/lib/schema.ts`.
- **UI:** Radix (Dialog, DropdownMenu, Label, Select, Slot), react-hook-form + @hookform/resolvers, lucide-react, date-fns, clsx/tailwind-merge/class-variance-authority. Primitives in `src/components/ui/`.
- **Deploy:** Wrangler, @cloudflare/vite-plugin; `wrangler.jsonc`, `vite.config.ts`.

---

## Directory layout

- `src/main.tsx` — Entry: EvoluProvider, ToastProvider, i18n init, mounts App.
- `src/App.tsx` — Layout: header (logo + Navigation), `<Switch>` routes, footer.
- `src/routes/` — Route components: Landing, Doc, ApiAddHandler, BookmarksPage.
- `src/components/` — Feature components + `ui/` (Radix/shadcn-style primitives).
- `src/hooks/` — use-bookmarks.ts (Evolu queries and mutations).
- `src/lib/` — evolu.ts, schema.ts, types.ts, utils.ts, constants.ts, demo_data.ts.
- `public/` — Favicons, icon1.svg, placeholder.svg, OG images.
- `index.html` — Single root div.

---

## Key concepts

- **URL storage:** Stored without protocol (`stripUrlProtocol` in `src/lib/utils.ts`). Display/navigation uses `addUrlProtocol` (default https). Use both when reading/writing bookmark URLs.
- **Soft delete:** Bookmarks hidden via `isDeleted: true` in Evolu; never hard-deleted in app code.
- **Base URL:** `getBaseUrl()` in utils — `window.location.origin` or localhost fallback. Used for bookmarklet and redirects.

---

## Routes

| Path | Component | Purpose |
|------|-----------|--------|
| `/` | `src/routes/BookmarksPage.tsx` | When no bookmarks data: shows Landing (hero, features, i18n, links to /doc and external demo). Else: BookmarkUI. Uses `useBookmarks()`, `getCategories`, `getBaseUrl`; optional `?status=&message=` for toast. |
| `/doc` | `src/routes/Doc.tsx` | Bookmarklet setup: mark input/generate, bookmarklet code (opens `/api/add?mark=&title=&url=`), copy, instructions |
| `/api/add` | `src/routes/ApiAddHandler.tsx` | GET; query params `mark`, `title`, `url`. Validates URL, calls `useCreateBookmark()`, then loading/success/error UI and redirect to `/{mark}` |
| `/sync` | `src/routes/Sync.tsx` | Sync / Evolu sync UI |
| (default) | — | 404 |

---

## Data layer

- **Evolu schema** (`src/lib/evolu.ts`):
  - `bookmark`: id, mark, url, title, favicon (nullable), description (nullable), category; Evolu adds isDeleted, timestamps, etc. Field types: NonEmptyString100/1000, nullOr where applicable.
- **Zod** (`src/lib/schema.ts`): baseSchema (url, title, description?, category), insertSchema (+ mark), updateSchema/deleteSchema, bookmarkInstanceSchema (full instance with id, createdAt, updatedAt).
- **Types** (`src/lib/types.ts`): `BookmarkInstance`, `BookmarksData` (bookmarks array).

---

## Hooks (`src/hooks/use-bookmarks.ts`)

- `useBookmarks()`:
  - Evolu query on `bookmark` where `isDeleted` is null, orderBy updatedAt desc, limit 100. Returns `{ bookmarks }` or null.
- `useCreateBookmark()`: Returns callback(bookmark). Strips URL protocol; empty description omitted for Evolu. Insert then return created row shape.
- `useUpdateBookmark()`: Callback(bookmark). Strips URL protocol. Update by id; empty description handled.
- `useDeleteBookmark()`: Callback({ mark, id }). Update bookmark set isDeleted true.

---

## Components

- **BookmarkUI** (`src/components/bookmark-ui.tsx`): Props: bookmarksData, categories, toast, baseUrl. Renders DemoBanner, title, ExportButton, DialogAdd, BookmarkletButton; per-category sections of BookmarkCards. Local state for list; callbacks add/update/delete.
- **BookmarkCard** (`src/components/bookmark-card.tsx`): Props: bookmark, categories, onBookmarkUpdated, onBookmarkDeleted. Favicon, title, domain, description (if any), category badge, relative time (date-fns), Visit button, DialogEdit, DialogDelete. Memoized.
- **DialogAdd / DialogEdit / DialogDelete**: Forms + useCreateBookmark / useUpdateBookmark / useDeleteBookmark.
- **BookmarkletButton**: Bookmarklet; copy/display.
- **ExportButton**: Exports bookmarksData.
- **FloatingNav**: Category-based nav; uses categories/bookmarksData.
- **Navigation**: Header links (e.g. Home, Doc) and language.
- **ToastProvider** + **useToast**: Toasts; BookmarksPage can pass status/message from query (e.g. post-/api/add redirect).
- **src/components/ui/**: Button, Card, Dialog, Input, Label, Select, Textarea, Badge, Form, DropdownMenu, Toast.

---

## Conventions / when editing

- **Adding a route:** Add `<Route path="..." component={...} />` in `App.tsx` Switch; ensure order (default last).
- **Bookmark URL:** Always strip before Evolu insert/update (`stripUrlProtocol`); add protocol for display/links (`addUrlProtocol`).
- **Evolu instance:** Single instance in `src/lib/evolu.ts`; hooks use `createUseEvolu(evoluInstance)` and `evoluInstance.createQuery`.
- **i18n:** Keys live in en/es/zh JSON; use `useTranslation()` and `t("key")` or `t("key", { ... })`.
- **Forms:** react-hook-form + Zod resolvers; use schemas from `src/lib/schema.ts` for validation.
