import { Link, useParams } from "react-router-dom";
import { getCourse, getCourseWelcome, getModule } from "../lib/content";
import Markdown from "./Markdown";

export default function CourseView() {
  const { courseId } = useParams<{ courseId: string }>();
  if (!courseId) return <div>Course not found.</div>;

  const course = getCourse(courseId);
  if (!course) return <div className="page">Course not found.</div>;

  const welcome = getCourseWelcome(courseId);

  return (
    <div className="page">
      <div className="page-intro">
        <Link to="/" className="back-link">
          ← All courses
        </Link>
        <h1>{course.title}</h1>
        <p className="lead">{course.description}</p>
        {course.estimatedDuration ? (
          <div className="meta">
            <span>{course.estimatedDuration}</span>
            <span>{course.modules.length} modules</span>
          </div>
        ) : null}
      </div>

      {welcome ? (
        <section className="welcome-section">
          <Markdown source={welcome} />
        </section>
      ) : null}

      <section>
        <h2 className="section-title">Modules</h2>
        <div className="module-list">
          {course.modules.map((moduleId, idx) => {
            const mod = getModule(moduleId);
            if (!mod) {
              return (
                <div key={moduleId} className="card module-card disabled">
                  <h3>Module not found: {moduleId}</h3>
                </div>
              );
            }
            return (
              <div key={mod.id} className="card module-card">
                <div className="module-card-header">
                  <span className="module-number">Module {idx + 1}</span>
                  <h3>{mod.title}</h3>
                  <p>{mod.description}</p>
                </div>
                <ol className="lesson-list">
                  {mod.lessons.map((lesson) => (
                    <li key={lesson.id}>
                      <Link
                        to={`/course/${course.id}/module/${mod.id}/lesson/${lesson.id}`}
                        className={`lesson-link ${lesson.type}`}
                      >
                        <span className="lesson-title">{lesson.title}</span>
                        <span className="lesson-type-badge">
                          {lesson.type === "quiz" ? "Quiz" : "Lesson"}
                        </span>
                      </Link>
                    </li>
                  ))}
                </ol>
              </div>
            );
          })}
        </div>
      </section>
    </div>
  );
}
