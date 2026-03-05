import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";
import readingTime from "reading-time";
import { compileMDX } from "next-mdx-remote/rsc";
import rehypeShiki from "@shikijs/rehype";
import rehypeSlug from "rehype-slug";
import remarkGfm from "remark-gfm";
import { mdxComponents } from "@/components/mdx";

export type PostFrontmatter = {
  title: string;
  date: string;
  excerpt: string;
  tags: string[];
  featured: boolean;
  coverImage: string | null;
  draft: boolean;
};

export type PostMeta = PostFrontmatter & {
  slug: string;
  readingTime: number;
};

const POSTS_DIR = path.join(process.cwd(), "content", "posts");

function getPostSlugs(): string[] {
  return fs
    .readdirSync(POSTS_DIR)
    .filter((f) => f.endsWith(".mdx"))
    .map((f) => f.replace(/\.mdx$/, ""));
}

function readPostFile(slug: string): string {
  return fs.readFileSync(path.join(POSTS_DIR, `${slug}.mdx`), "utf-8");
}

export function getAllPostMeta(): PostMeta[] {
  return getPostSlugs()
    .map((slug) => {
      const raw = readPostFile(slug);
      const { data, content } = matter(raw);
      const fm = data as PostFrontmatter;
      if (fm.draft) return null;
      return {
        ...fm,
        slug,
        readingTime: Math.ceil(readingTime(content).minutes),
      };
    })
    .filter((p): p is PostMeta => p !== null)
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
}

export function getPostMeta(slug: string): PostMeta | null {
  try {
    const raw = readPostFile(slug);
    const { data, content } = matter(raw);
    const fm = data as PostFrontmatter;
    if (fm.draft) return null;
    return { ...fm, slug, readingTime: Math.ceil(readingTime(content).minutes) };
  } catch {
    return null;
  }
}

export async function getCompiledPost(slug: string) {
  const raw = readPostFile(slug);
  const { content, frontmatter } = await compileMDX<PostFrontmatter>({
    source: raw,
    components: mdxComponents,
    options: {
      parseFrontmatter: true,
      mdxOptions: {
        remarkPlugins: [remarkGfm],
        rehypePlugins: [
          rehypeSlug,
          [rehypeShiki, { theme: "github-dark-default" }],
        ],
      },
    },
  });

  const bodyText = raw.split("---").slice(2).join("---");
  const meta: PostMeta = {
    ...frontmatter,
    slug,
    readingTime: Math.ceil(readingTime(bodyText).minutes),
  };

  return { content, meta };
}

export function getAllTags(): string[] {
  const tags = new Set<string>();
  getAllPostMeta().forEach((p) => p.tags.forEach((t) => tags.add(t)));
  return Array.from(tags).sort();
}

export function getAdjacentPosts(slug: string): { prev: PostMeta | null; next: PostMeta | null } {
  const posts = getAllPostMeta();
  const i = posts.findIndex((p) => p.slug === slug);
  return {
    prev: i < posts.length - 1 ? posts[i + 1] : null,
    next: i > 0 ? posts[i - 1] : null,
  };
}

export function getRelatedPosts(slug: string, limit = 3): PostMeta[] {
  const posts = getAllPostMeta();
  const current = posts.find((p) => p.slug === slug);
  if (!current) return [];
  return posts
    .filter((p) => p.slug !== slug)
    .map((p) => ({ post: p, score: p.tags.filter((t) => current.tags.includes(t)).length }))
    .sort((a, b) => b.score - a.score)
    .slice(0, limit)
    .map((r) => r.post);
}
