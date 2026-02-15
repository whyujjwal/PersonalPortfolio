import liveBuildData from "../../content/live-build.json";
import postsData from "../../content/posts.json";
import projectsData from "../../content/projects.json";

export type LiveBuild = {
  name: string;
  summary: string;
  status: string;
  weekNumber: string;
  week: string;
  progress: number;
  commits: number;
  stars: number;
  githubUrl: string;
  logUrl: string;
};

export type Post = {
  slug: string;
  title: string;
  date: string;
  minutes: number;
  views: string;
  reactions: number;
  excerpt: string;
  tags: string[];
  sections: Array<{
    heading: string;
    body: string;
    code?: string;
  }>;
};

export type Project = {
  slug: string;
  name: string;
  summary: string;
  explainLikeFriend: string;
  tags: string[];
  stars: number;
  metricLabel: string;
  metricValue: string;
  sourceUrl: string;
  demoUrl: string;
  story: {
    problem: string;
    approach: string;
    broke: string;
    worked: string;
    next: string;
  };
};

export const liveBuild = liveBuildData as LiveBuild;
export const posts = postsData as Post[];
export const projects = projectsData as Project[];

export const shippedRail = projects.map((project) => ({
  slug: project.slug,
  name: project.name,
  tags: project.tags,
}));

export function getPost(slug: string): Post | undefined {
  return posts.find((post) => post.slug === slug);
}

export function getProject(slug: string): Project | undefined {
  return projects.find((project) => project.slug === slug);
}
