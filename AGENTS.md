<!-- BEGIN:nextjs-agent-rules -->

## This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

## Project rules

- All content lives in /content as JSON. Content is data, not code: engines in /src/lib render it.
- All shared types live in /src/contracts/types.ts. Never modify this file without explicit request.
- Features are isolated: a feature in /src/features/<name> must not import from other features.
- Do not introduce new dependencies without explicit request.
- Progress storage: localStorage only, no server-side user data.
