export type LessonType = "content" | "quiz";

export interface Lesson {
  id: string;
  title: string;
  type: LessonType;
  markdownPath?: string;
  quizPath?: string;
}

export interface Module {
  id: string;
  title: string;
  description: string;
  tags?: string[];
  lessons: Lesson[];
}

export interface Course {
  id: string;
  title: string;
  description: string;
  estimatedDuration?: string;
  welcomePath: string;
  modules: string[];
}

export interface QuizAnswer {
  id: string;
  text: string;
  textHtml?: string;
  correct: boolean;
}

export interface QuizQuestion {
  id: string;
  questionNumber: number;
  type: "MULTIPLE_CHOICE" | "MULTIPLE_RESPONSE";
  question: string;
  questionHtml?: string;
  answers: QuizAnswer[];
  feedback?: string;
  feedbackHtml?: string;
}

export interface Quiz {
  title: string;
  type: "quiz";
  passingScore: number;
  questions: QuizQuestion[];
}
