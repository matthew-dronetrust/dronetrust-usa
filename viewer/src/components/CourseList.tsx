import { Link } from "react-router-dom";
import { getAllCourses } from "../lib/content";

export default function CourseList() {
  const courses = getAllCourses();

  return (
    <div className="page">
      <div className="page-intro">
        <h1>Courses</h1>
        <p>
          Practical, no-fluff courses for drone operators — from launching a
          business to marketing it well.
        </p>
      </div>
      <div className="card-grid">
        {courses.map((c) => (
          <Link key={c.id} to={`/course/${c.id}`} className="card course-card">
            <h2>{c.title}</h2>
            <p>{c.description}</p>
            <div className="meta">
              <span>{c.modules.length} modules</span>
              {c.estimatedDuration ? <span>{c.estimatedDuration}</span> : null}
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
