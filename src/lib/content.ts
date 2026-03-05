import liveBuildData from "../../content/live-build.json";
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
export const projects = projectsData as Project[];

export const shippedRail = projects.map((project) => ({
  slug: project.slug,
  name: project.name,
  tags: project.tags,
}));

export function getProject(slug: string): Project | undefined {
  return projects.find((project) => project.slug === slug);
}
