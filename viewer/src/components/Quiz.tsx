import { useMemo, useState } from "react";
import type { Quiz, QuizQuestion } from "../types";

interface Props {
  quiz: Quiz;
}

type Answers = Record<string, Set<string>>;

function scoreQuestion(question: QuizQuestion, picked: Set<string>): boolean {
  const correctIds = new Set(
    question.answers.filter((a) => a.correct).map((a) => a.id),
  );
  if (picked.size !== correctIds.size) return false;
  for (const id of picked) if (!correctIds.has(id)) return false;
  return true;
}

export default function QuizView({ quiz }: Props) {
  const [answers, setAnswers] = useState<Answers>({});
  const [submitted, setSubmitted] = useState(false);

  const sortedQuestions = useMemo(
    () => [...quiz.questions].sort((a, b) => a.questionNumber - b.questionNumber),
    [quiz.questions],
  );

  function toggle(questionId: string, answerId: string, isMultiple: boolean) {
    setAnswers((prev) => {
      const next = { ...prev };
      const current = new Set(next[questionId] ?? []);
      if (isMultiple) {
        if (current.has(answerId)) current.delete(answerId);
        else current.add(answerId);
      } else {
        current.clear();
        current.add(answerId);
      }
      next[questionId] = current;
      return next;
    });
  }

  const correctCount = sortedQuestions.filter((q) =>
    scoreQuestion(q, answers[q.id] ?? new Set()),
  ).length;
  const total = sortedQuestions.length;
  const percent = Math.round((correctCount / total) * 100);
  const passed = percent >= quiz.passingScore;

  return (
    <div className="quiz">
      <h2>{quiz.title}</h2>
      <p className="quiz-meta">
        Passing score: {quiz.passingScore}% — {total} questions
      </p>

      {sortedQuestions.map((question, idx) => {
        const picked = answers[question.id] ?? new Set<string>();
        const isMultiple = question.type === "MULTIPLE_RESPONSE";
        const isCorrect = submitted && scoreQuestion(question, picked);

        return (
          <div
            key={question.id}
            className={`quiz-question ${
              submitted ? (isCorrect ? "correct" : "incorrect") : ""
            }`}
          >
            <div className="quiz-question-header">
              <span className="quiz-question-number">Q{idx + 1}</span>
              <p className="quiz-question-text">{question.question}</p>
              {isMultiple ? (
                <span className="quiz-multi-badge">Select all that apply</span>
              ) : null}
            </div>
            <ul className="quiz-answers">
              {question.answers.map((answer) => {
                const isPicked = picked.has(answer.id);
                let stateClass = "";
                if (submitted) {
                  if (answer.correct) stateClass = "answer-correct";
                  else if (isPicked) stateClass = "answer-wrong";
                }
                return (
                  <li key={answer.id} className={stateClass}>
                    <label>
                      <input
                        type={isMultiple ? "checkbox" : "radio"}
                        name={question.id}
                        checked={isPicked}
                        disabled={submitted}
                        onChange={() => toggle(question.id, answer.id, isMultiple)}
                      />
                      <span>{answer.text}</span>
                    </label>
                  </li>
                );
              })}
            </ul>
            {submitted && question.feedback ? (
              <div className="quiz-feedback">{question.feedback}</div>
            ) : null}
          </div>
        );
      })}

      {submitted ? (
        <div className={`quiz-result ${passed ? "passed" : "failed"}`}>
          <strong>
            {correctCount} / {total} correct ({percent}%)
          </strong>{" "}
          — {passed ? "Passed" : "Below passing score"}
          <button
            className="btn-secondary"
            onClick={() => {
              setSubmitted(false);
              setAnswers({});
            }}
          >
            Retake quiz
          </button>
        </div>
      ) : (
        <button
          className="btn-primary"
          onClick={() => setSubmitted(true)}
          disabled={
            sortedQuestions.some((q) => (answers[q.id]?.size ?? 0) === 0)
          }
        >
          Submit answers
        </button>
      )}
    </div>
  );
}
