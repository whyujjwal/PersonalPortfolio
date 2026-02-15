# whyujjwal.com

Personal portfolio built with Next.js.

## Local development

```bash
npm run dev
```

App runs at [http://localhost:3000](http://localhost:3000).

## Dynamic content (no paid backend)

Content is file-driven and editable without touching component code:

- `content/live-build.json`
- `content/posts.json`
- `content/projects.json`

UI reads these files through:

- `src/lib/content.ts`

## Content validation

```bash
npm run content:check
```

This validates shape + required fields + unique slugs.

## View tracker (free)

Blog views can be tracked with free Upstash Redis.

1. Create a free Redis database on Upstash.
2. Copy REST URL + REST token.
3. Set env vars (Vercel or Cloudflare Workers):
   - `UPSTASH_REDIS_REST_URL`
   - `UPSTASH_REDIS_REST_TOKEN`

If env vars are missing, the site falls back to static view counts from content files.

## CI workflows

- `.github/workflows/ci.yml`
  - runs `content:check`, `lint`, and `build` on PRs and pushes to `main`
- `.github/workflows/content-validation.yml`
  - runs content checks for content-related changes

## Deploy (Vercel + custom domain)

1. Import this GitHub repo in Vercel.
2. Set framework to Next.js (auto-detected).
3. Add your domain in Vercel Project Settings -> Domains.
4. Update DNS at your domain provider using the records shown by Vercel.
5. Wait for SSL to provision automatically.

## Deploy (Cloudflare Workers + custom domain)

This repo is configured for Cloudflare with:

- `open-next.config.ts`
- `wrangler.jsonc` (`main` + `assets.directory` set to `.open-next/assets`)

Build/deploy commands:

```bash
npm run cf:build
npm run cf:deploy
```

Local preview:

```bash
npm run cf:preview
```

Why your error happened:

- `wrangler deploy` was run directly.
- For Next.js, deploy through OpenNext CLI so it builds + wires assets correctly.
- Use `npm run cf:deploy` instead of calling `wrangler deploy` manually.

Custom domain on Cloudflare:

1. Deploy once using `npm run cf:deploy`.
2. In Cloudflare Dashboard -> Workers & Pages -> your worker -> Triggers -> Custom domains.
3. Add your domain (for example `whyujjwal.com` and/or `www.whyujjwal.com`).
4. Keep DNS proxied in Cloudflare and SSL mode as `Full (strict)`.
