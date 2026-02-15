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
3. Set env vars in Vercel:
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
