import { Link, useParams } from "react-router-dom";
import {
  getCourse,
  getLessonMarkdown,
  getModule,
  getQuiz,
} from "../lib/content";
import Markdown from "./Markdown";
import QuizView from "./Quiz";

export default function LessonView() {
  const { courseId, moduleId, lessonId } = useParams<{
    courseId: string;
    moduleId: string;
    lessonId: string;
  }>();

  if (!courseId || !moduleId || !lessonId) {
    return <div className="page">Lesson not found.</div>;
  }

  const course = getCourse(courseId);
  const module = getModule(moduleId);
  if (!course || !module) {
    return <div className="page">Lesson not found.</div>;
  }

  const lessonIdx = module.lessons.findIndex((l) => l.id === lessonId);
  if (lessonIdx < 0) {
    return <div className="page">Lesson not found.</div>;
  }
  const lesson = module.lessons[lessonIdx];

  const prev = module.lessons[lessonIdx - 1];
  const next = module.lessons[lessonIdx + 1];

  return (
    <div className="page lesson-page">
      <div className="lesson-breadcrumbs">
        <Link to="/">All courses</Link>
        <span> / </span>
        <Link to={`/course/${course.id}`}>{course.title}</Link>
        <span> / </span>
        <span>{module.title}</span>
      </div>

      <div className="lesson-layout">
        <aside className="lesson-sidebar">
          <h3>{module.title}</h3>
          <ol className="sidebar-lesson-list">
            {module.lessons.map((l) => (
              <li key={l.id}>
                <Link
                  to={`/course/${course.id}/module/${module.id}/lesson/${l.id}`}
                  className={`sidebar-lesson ${
                    l.id === lessonId ? "active" : ""
                  } ${l.type}`}
                >
                  <span>{l.title}</span>
                  <span className="lesson-type-badge small">
                    {l.type === "quiz" ? "Quiz" : "Lesson"}
                  </span>
                </Link>
              </li>
            ))}
          </ol>
        </aside>

        <article className="lesson-content">
          {lesson.type === "content" ? (
            <ContentLesson moduleId={module.id} fileName={lesson.markdownPath ?? ""} />
          ) : (
            <QuizLesson moduleId={module.id} />
          )}

          <nav className="lesson-nav">
            {prev ? (
              <Link
                to={`/course/${course.id}/module/${module.id}/lesson/${prev.id}`}
                className="nav-link"
              >
                ← {prev.title}
              </Link>
            ) : (
              <span />
            )}
            {next ? (
              <Link
                to={`/course/${course.id}/module/${module.id}/lesson/${next.id}`}
                className="nav-link nav-next"
              >
                {next.title} →
              </Link>
            ) : (
              <Link to={`/course/${course.id}`} className="nav-link nav-next">
                Back to course →
              </Link>
            )}
          </nav>
        </article>
      </div>
    </div>
  );
}

function ContentLesson({
  moduleId,
  fileName,
}: {
  moduleId: string;
  fileName: string;
}) {
  const md = getLessonMarkdown(moduleId, fileName);
  if (!md) return <div>Lesson content not found.</div>;
  return <Markdown source={md} />;
}

function QuizLesson({ moduleId }: { moduleId: string }) {
  const quiz = getQuiz(moduleId);
  if (!quiz) return <div>Quiz not found.</div>;
  return <QuizView quiz={quiz} />;
}
