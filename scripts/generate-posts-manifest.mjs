#!/usr/bin/env node
/**
 * Generates src/lib/posts-manifest.json from content/posts/*.mdx
 * Must run before next build so the manifest is available at build + runtime.
 * Cloudflare Workers has no node:fs — this embeds all metadata as a static import.
 */

import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const POSTS_DIR = path.join(__dirname, "..", "content", "posts");
const OUT_FILE = path.join(__dirname, "..", "src", "lib", "posts-manifest.json");

function parseFrontmatter(raw) {
  const match = raw.match(/^---\r?\n([\s\S]*?)\r?\n---/);
  if (!match) return {};
  const fm = {};
  for (const line of match[1].split("\n")) {
    const colon = line.indexOf(":");
    if (colon === -1) continue;
    const key = line.slice(0, colon).trim();
    let value = line.slice(colon + 1).trim();
    // strip surrounding quotes
    if ((value.startsWith('"') && value.endsWith('"')) || (value.startsWith("'") && value.endsWith("'"))) {
      value = value.slice(1, -1);
    }
    // arrays: ["a", "b"]
    if (value.startsWith("[")) {
      try {
        fm[key] = JSON.parse(value);
      } catch {
        fm[key] = [];
      }
      continue;
    }
    if (value === "true") { fm[key] = true; continue; }
    if (value === "false") { fm[key] = false; continue; }
    if (value === "null") { fm[key] = null; continue; }
    fm[key] = value;
  }
  return fm;
}

function countWords(text) {
  return text.split(/\s+/).filter(Boolean).length;
}

const slugs = fs
  .readdirSync(POSTS_DIR)
  .filter((f) => f.endsWith(".mdx"))
  .map((f) => f.replace(/\.mdx$/, ""));

const posts = slugs
  .map((slug) => {
    const raw = fs.readFileSync(path.join(POSTS_DIR, `${slug}.mdx`), "utf-8");
    const fm = parseFrontmatter(raw);
    if (fm.draft) return null;
    // strip frontmatter for word count
    const body = raw.replace(/^---[\s\S]*?---/, "");
    const readingTime = Math.max(1, Math.ceil(countWords(body) / 200));
    return {
      slug,
      title: fm.title ?? slug,
      date: fm.date ?? "",
      excerpt: fm.excerpt ?? "",
      tags: Array.isArray(fm.tags) ? fm.tags : [],
      featured: Boolean(fm.featured),
      coverImage: fm.coverImage ?? null,
      draft: false,
      readingTime,
    };
  })
  .filter(Boolean)
  .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

fs.writeFileSync(OUT_FILE, JSON.stringify(posts, null, 2) + "\n");
console.log(`✓ posts-manifest.json — ${posts.length} posts written to src/lib/`);
