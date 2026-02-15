import { readFile } from "node:fs/promises";
import path from "node:path";

const contentDir = path.join(process.cwd(), "content");
const errors = [];

function isObject(value) {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function assert(condition, message) {
  if (!condition) {
    errors.push(message);
  }
}

async function readJson(fileName) {
  const filePath = path.join(contentDir, fileName);
  const raw = await readFile(filePath, "utf8");
  return JSON.parse(raw);
}

function expectString(value, pathLabel) {
  assert(typeof value === "string" && value.trim().length > 0, `${pathLabel} must be a non-empty string`);
}

function expectNumber(value, pathLabel) {
  assert(typeof value === "number" && Number.isFinite(value), `${pathLabel} must be a valid number`);
}

function validateLiveBuild(liveBuild) {
  assert(isObject(liveBuild), "live-build.json must contain an object");
  if (!isObject(liveBuild)) {
    return;
  }

  expectString(liveBuild.name, "liveBuild.name");
  expectString(liveBuild.summary, "liveBuild.summary");
  expectString(liveBuild.status, "liveBuild.status");
  expectString(liveBuild.weekNumber, "liveBuild.weekNumber");
  expectString(liveBuild.week, "liveBuild.week");
  expectNumber(liveBuild.progress, "liveBuild.progress");
  expectNumber(liveBuild.commits, "liveBuild.commits");
  expectNumber(liveBuild.stars, "liveBuild.stars");
  expectString(liveBuild.githubUrl, "liveBuild.githubUrl");
  expectString(liveBuild.logUrl, "liveBuild.logUrl");
}

function validatePosts(posts) {
  assert(Array.isArray(posts), "posts.json must contain an array");
  if (!Array.isArray(posts)) {
    return;
  }

  const slugSet = new Set();

  posts.forEach((post, index) => {
    const label = `posts[${index}]`;
    assert(isObject(post), `${label} must be an object`);
    if (!isObject(post)) {
      return;
    }

    expectString(post.slug, `${label}.slug`);
    if (typeof post.slug === "string") {
      assert(!slugSet.has(post.slug), `Duplicate post slug: ${post.slug}`);
      slugSet.add(post.slug);
    }

    expectString(post.title, `${label}.title`);
    expectString(post.date, `${label}.date`);
    expectNumber(post.minutes, `${label}.minutes`);
    expectString(post.views, `${label}.views`);
    expectNumber(post.reactions, `${label}.reactions`);
    expectString(post.excerpt, `${label}.excerpt`);

    assert(Array.isArray(post.tags), `${label}.tags must be an array`);
    if (Array.isArray(post.tags)) {
      post.tags.forEach((tag, tagIndex) => {
        expectString(tag, `${label}.tags[${tagIndex}]`);
      });
    }

    assert(Array.isArray(post.sections) && post.sections.length > 0, `${label}.sections must be a non-empty array`);
    if (Array.isArray(post.sections)) {
      post.sections.forEach((section, sectionIndex) => {
        const sectionLabel = `${label}.sections[${sectionIndex}]`;
        assert(isObject(section), `${sectionLabel} must be an object`);
        if (!isObject(section)) {
          return;
        }
        expectString(section.heading, `${sectionLabel}.heading`);
        expectString(section.body, `${sectionLabel}.body`);
        if (section.code !== undefined) {
          expectString(section.code, `${sectionLabel}.code`);
        }
      });
    }
  });
}

function validateProjects(projects) {
  assert(Array.isArray(projects), "projects.json must contain an array");
  if (!Array.isArray(projects)) {
    return;
  }

  const slugSet = new Set();

  projects.forEach((project, index) => {
    const label = `projects[${index}]`;
    assert(isObject(project), `${label} must be an object`);
    if (!isObject(project)) {
      return;
    }

    expectString(project.slug, `${label}.slug`);
    if (typeof project.slug === "string") {
      assert(!slugSet.has(project.slug), `Duplicate project slug: ${project.slug}`);
      slugSet.add(project.slug);
    }

    expectString(project.name, `${label}.name`);
    expectString(project.summary, `${label}.summary`);
    expectString(project.explainLikeFriend, `${label}.explainLikeFriend`);
    expectNumber(project.stars, `${label}.stars`);
    expectString(project.metricLabel, `${label}.metricLabel`);
    expectString(project.metricValue, `${label}.metricValue`);
    expectString(project.sourceUrl, `${label}.sourceUrl`);
    expectString(project.demoUrl, `${label}.demoUrl`);

    assert(Array.isArray(project.tags), `${label}.tags must be an array`);
    if (Array.isArray(project.tags)) {
      project.tags.forEach((tag, tagIndex) => {
        expectString(tag, `${label}.tags[${tagIndex}]`);
      });
    }

    assert(isObject(project.story), `${label}.story must be an object`);
    if (isObject(project.story)) {
      expectString(project.story.problem, `${label}.story.problem`);
      expectString(project.story.approach, `${label}.story.approach`);
      expectString(project.story.broke, `${label}.story.broke`);
      expectString(project.story.worked, `${label}.story.worked`);
      expectString(project.story.next, `${label}.story.next`);
    }
  });
}

async function main() {
  try {
    const [liveBuild, posts, projects] = await Promise.all([
      readJson("live-build.json"),
      readJson("posts.json"),
      readJson("projects.json"),
    ]);

    validateLiveBuild(liveBuild);
    validatePosts(posts);
    validateProjects(projects);

    if (errors.length > 0) {
      console.error("Content validation failed:\n");
      for (const error of errors) {
        console.error(`- ${error}`);
      }
      process.exit(1);
    }

    console.log("Content validation passed.");
  } catch (error) {
    console.error("Failed to validate content.");
    console.error(error instanceof Error ? error.message : error);
    process.exit(1);
  }
}

main();
