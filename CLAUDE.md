# CLAUDE.md — whyujjwal.com Portfolio

## Project Overview

Personal portfolio and blog for Ujjwal Raj (whyujjwal.com). AI Engineer focused on production RAG systems, autonomous agents, and LLM infrastructure. Dark-themed, animation-rich site with MDX blog, project showcase, and 3D hero scene.

## Tech Stack

- **Framework:** Next.js 16.1.6 (App Router, React Server Components)
- **React:** 19.2.3, TypeScript 5
- **Animation:** GSAP 3 (ScrollTrigger), Lenis (smooth scroll), Framer Motion (springs), Three.js (3D)
- **Content:** MDX via `next-mdx-remote/rsc`, Shiki syntax highlighting (theme: `github-dark-default`)
- **Styling:** Custom CSS with design tokens (no Tailwind utility classes in practice)
- **Deployment:** Cloudflare Workers via `@opennextjs/cloudflare` (OpenNext)
- **Analytics:** Upstash Redis REST API (optional view counter)

## Commands

```bash
npm run dev          # Local dev server (port 3000)
npm run build        # Production build (static generation, all 17 pages)
npm run lint         # ESLint
npm run content:check # Validate JSON content files
npm run cf:build     # Build for Cloudflare Workers
npm run cf:deploy    # Build + deploy to Cloudflare
```

## Project Structure

```
content/
  posts/              # .mdx blog posts with YAML frontmatter
  projects.json       # Project showcase data (3 projects)
  live-build.json     # Current "building in public" project status
  posts.json          # Legacy — not used by MDX system

src/
  app/
    page.tsx          # Home — all-in-one landing (hero, building, writing, proof, about, contact)
    layout.tsx        # Root layout (SmoothScrollProvider, SiteNav, CommandMenu, SiteFooter)
    about/page.tsx    # About page
    writing/
      page.tsx        # Blog index with tag filter (BlogTagFilter client component)
      [slug]/page.tsx # Individual post (MDX rendered, TOC sidebar, prev/next, related)
    proof/
      page.tsx        # Project showcase archive
      [slug]/page.tsx # Project story page (problem/approach/broke/worked/next)
    api/views/route.ts # GET/POST view counter (Upstash Redis)
    globals.css       # CSS entry — imports all style files

  components/
    animation/        # GSAP-powered animations (all "use client")
      text-reveal.tsx       # Variants: fade, words, lines, chars
      scroll-reveal.tsx     # Directions: up, left, right, scale
      parallax-layer.tsx    # Speed-based parallax on scroll
      magnetic-element.tsx  # Framer Motion spring on hover
      custom-cursor.tsx     # Canvas cursor with trail + expand on interactive
      scroll-progress.tsx   # Fixed top progress bar
    hero/
      constellation-sphere.tsx  # Three.js icosahedron with mouse interaction
      hero-scene.tsx            # R3F Canvas wrapper
    mdx/              # Custom MDX components for blog posts
      index.ts        # Component map passed to compileMDX
      callout.tsx     # Info/warning/danger/success with colored border
      code-block.tsx  # Wraps shiki <pre> with copy button + language badge
      comparison.tsx  # Side-by-side good/bad/neutral comparison
      file-tree.tsx   # Directory tree display (content prop)
      link-card.tsx   # Card link for related reading
      mdx-image.tsx   # Next.js Image with caption
      stat-highlight.tsx # Large stat display (value + label + detail)
      steps.tsx       # Numbered steps with accent badges
      tabs.tsx        # Tab switcher (client component)
      terminal.tsx    # Terminal output with command highlighting (content prop)
      table-of-contents.tsx # Client component, IntersectionObserver for h2/h3
    providers/
      smooth-scroll-provider.tsx # Lenis + GSAP ScrollTrigger integration
    command-menu.tsx  # Cmd+K palette (cmdk library)
    site-nav.tsx      # Fixed header with scroll hide/show
    blog-tag-filter.tsx # Client component — tag pills + card grid

  lib/
    mdx.ts            # Core MDX infrastructure (getAllPostMeta, getCompiledPost, getRelatedPosts)
    content.ts        # JSON data loaders (projects, liveBuild, shippedRail)
    fonts.ts          # Inter + JetBrains Mono (Google Fonts)
    view-store.ts     # Upstash Redis client (getViews, incrementViews)

  styles/
    tokens.css        # Design tokens (colors, radii, easing, durations)
    reset.css         # CSS reset
    typography.css    # Font hierarchy
    layout.css        # Grid/spacing utilities
    animations.css    # Keyframe animations
    components/       # Component-scoped CSS (nav.css, hero.css, blog.css, etc.)
```

## Key Conventions

### MDX Blog Posts

- Location: `content/posts/<slug>.mdx`
- Frontmatter: `title`, `date` (ISO), `excerpt`, `tags`, `featured`, `coverImage`, `draft`
- Compiled at build time via `generateStaticParams()` — no runtime `node:fs`
- **Terminal and FileTree components use `content` prop** (not children) because MDX expression children `{``...``}` don't render in RSC mode

```mdx
<Terminal title="example" content={`$ echo hello
hello`} />

<FileTree content={`src/
├── index.ts
└── utils.ts`} />
```

- **ComparisonSide tags must NOT be indented** — MDX strict parser treats indented JSX as list items
- Markdown content inside JSX components (like lists in ComparisonSide) works only when tags are flush-left

### Design Tokens

All colors use CSS custom properties defined in `src/styles/tokens.css`:
- `--bg: #000000` (background)
- `--surface: #06070a` (cards)
- `--text: #f0f2f5` (primary text)
- `--text-muted: #9a9fa8`
- `--accent: #a8b4c8` (muted blue-starlight)
- `--highlight: #e8c47c` (warm amber for active/live)
- `--border: #161a21`

### Client vs Server Components

- Pages and layout are Server Components (can use `node:fs`, async)
- Animation components, interactive UI, and Three.js are `"use client"`
- MDX `Tabs` is client (useState for active tab)
- MDX `TableOfContents` is client (IntersectionObserver)
- All other MDX components are server-compatible

### Content Data Flow

- Blog posts: `.mdx` files → `src/lib/mdx.ts` → page components
- Projects: `content/projects.json` → `src/lib/content.ts` → page components
- Live build: `content/live-build.json` → `src/lib/content.ts` → home page
- Views: Upstash Redis → `src/lib/view-store.ts` → `src/app/api/views/route.ts` → `ViewCount` component

### Deployment

- Primary: Cloudflare Workers via OpenNext
- Worker entry: `.open-next/worker.js`
- Static assets: `.open-next/assets/`
- Env vars needed: `UPSTASH_REDIS_REST_URL`, `UPSTASH_REDIS_REST_TOKEN` (optional)
- Domain: whyujjwal.com

## Gotchas

1. **MDX children don't work for Terminal/FileTree** — always use `content={``...``}` prop
2. **MDX strict indentation** — JSX tags inside markdown context must not be indented (especially ComparisonSide)
3. **Tabs component filters whitespace nodes** — MDX injects text nodes between Tab elements; filtered with `Children.toArray().filter(isValidElement)`
4. **`node:fs` is build-time only** — all filesystem calls happen in `generateStaticParams` or page-level server functions; no runtime fs access (Cloudflare Workers has no fs)
5. **ViewCount fallback is string** — pass `fallback="0"` not `fallback={0}`
6. **Three.js is lazy loaded** — `dynamic(() => import('./hero-scene'), { ssr: false })` to avoid SSR issues
7. **Lenis smooth scroll** — wraps entire app; GSAP ScrollTrigger is configured to use Lenis's scroll position
8. **All animations respect `prefers-reduced-motion`** — accessibility requirement throughout
