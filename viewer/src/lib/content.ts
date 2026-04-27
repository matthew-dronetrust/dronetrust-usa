import type { Course, Module, Quiz } from "../types";

const courseFiles = import.meta.glob("../../../courses/*/course.json", {
  eager: true,
  import: "default",
}) as Record<string, Course>;

const welcomeFiles = import.meta.glob("../../../courses/*/welcome.md", {
  eager: true,
  query: "?raw",
  import: "default",
}) as Record<string, string>;

const moduleManifests = import.meta.glob("../../../modules/*/manifest.json", {
  eager: true,
  import: "default",
}) as Record<string, Module>;

const moduleMarkdown = import.meta.glob("../../../modules/*/*.md", {
  eager: true,
  query: "?raw",
  import: "default",
}) as Record<string, string>;

const moduleQuizzes = import.meta.glob("../../../modules/*/quiz.json", {
  eager: true,
  import: "default",
}) as Record<string, Quiz>;

function courseIdFromPath(p: string): string {
  const m = p.match(/courses\/([^/]+)\//);
  return m ? m[1] : "";
}

function moduleIdFromPath(p: string): string {
  const m = p.match(/modules\/([^/]+)\//);
  return m ? m[1] : "";
}

function fileNameFromPath(p: string): string {
  const parts = p.split("/");
  return parts[parts.length - 1];
}

export function getAllCourses(): Course[] {
  return Object.values(courseFiles).sort((a, b) =>
    a.title.localeCompare(b.title),
  );
}

export function getCourse(id: string): Course | undefined {
  for (const [path, course] of Object.entries(courseFiles)) {
    if (courseIdFromPath(path) === id) return course;
  }
  return undefined;
}

export function getCourseWelcome(courseId: string): string {
  for (const [path, content] of Object.entries(welcomeFiles)) {
    if (courseIdFromPath(path) === courseId) return content;
  }
  return "";
}

export function getModule(id: string): Module | undefined {
  for (const [path, mod] of Object.entries(moduleManifests)) {
    if (moduleIdFromPath(path) === id) return mod;
  }
  return undefined;
}

export function getLessonMarkdown(
  moduleId: string,
  fileName: string,
): string | undefined {
  for (const [path, content] of Object.entries(moduleMarkdown)) {
    if (moduleIdFromPath(path) === moduleId && fileNameFromPath(path) === fileName) {
      return content;
    }
  }
  return undefined;
}

export function getQuiz(moduleId: string): Quiz | undefined {
  for (const [path, quiz] of Object.entries(moduleQuizzes)) {
    if (moduleIdFromPath(path) === moduleId) return quiz;
  }
  return undefined;
}
