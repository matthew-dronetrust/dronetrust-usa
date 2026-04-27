import { Link, Route, Routes } from "react-router-dom";
import CourseList from "./components/CourseList";
import CourseView from "./components/CourseView";
import LessonView from "./components/LessonView";

export default function App() {
  return (
    <div className="app">
      <header className="app-header">
        <Link to="/" className="brand">
          <span className="brand-mark">▲</span>
          <span>DroneTrust Courses</span>
        </Link>
      </header>
      <main className="app-main">
        <Routes>
          <Route path="/" element={<CourseList />} />
          <Route path="/course/:courseId" element={<CourseView />} />
          <Route
            path="/course/:courseId/module/:moduleId/lesson/:lessonId"
            element={<LessonView />}
          />
        </Routes>
      </main>
      <footer className="app-footer">
        <span>Course content from learn.dronetrust.com</span>
      </footer>
    </div>
  );
}
