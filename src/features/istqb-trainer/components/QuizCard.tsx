'use client';

// Клиентский компонент викторины: вопрос, варианты, разбор после ответа.
import { useMemo, useState } from 'react';
import type { ModuleId, QuizQuestion } from '@/contracts/types';
import {
  buildAnswerRecord,
  calculateResult,
  isAnswerCorrect,
  shuffleOptions,
  type QuizResult,
} from '@/lib/quiz-engine';
import { recordAnswer } from '@/lib/progress-storage';

const LETTERS = ['A', 'B', 'C', 'D', 'E', 'F'];

interface QuizCardProps {
  moduleId: ModuleId;
  questions: QuizQuestion[];
}

export function QuizCard({ moduleId, questions }: QuizCardProps) {
  const [current, setCurrent] = useState(0);
  const [chosen, setChosen] = useState<number | null>(null);
  const [answers, setAnswers] = useState<Answer[]>([]);

  const shuffled = useMemo(
    () => questions.map((q) => ({ question: q, ...shuffleOptions(q) })),
    [questions],
  );

  function handleAnswer(index: number) {
    if (chosen !== null) return;
    const item = shuffled[current];
    const correct = isAnswerCorrect(item.question, index, item.indexMap);
    setChosen(index);
    const record = buildAnswerRecord(item.question, index, correct);
    setAnswers((prev) => [...prev, record]);
    recordAnswer(moduleId, item.question.id, record);
  }

  function handleNext() {
    setChosen(null);
    setCurrent((prev) => prev + 1);
  }

  if (current >= shuffled.length) {
    return (
      <ResultScreen
        result={calculateResult(answers)}
        onRestart={() => {
          setCurrent(0);
          setAnswers([]);
          setChosen(null);
        }}
      />
    );
  }

  const { question, options, indexMap } = shuffled[current];

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <header className="space-y-2">
        <div className="flex items-center justify-between text-sm text-neutral-400">
          <span>{question.topic}</span>
          <span>{current + 1} / {shuffled.length}</span>
        </div>
        <h2 className="text-xl font-semibold text-neutral-100">{question.text}</h2>
      </header>

      <ul className="space-y-3">
        {options.map((option, i) => {
          const isChosen = chosen === i;
          const isCorrectOption = chosen !== null && isAnswerCorrect(question, i, indexMap);
          const stateClass = chosen === null
            ? 'border-neutral-700 hover:border-teal-400 hover:bg-neutral-800/60'
            : isCorrectOption
              ? 'border-teal-400 bg-teal-400/10'
              : isChosen
                ? 'border-red-400 bg-red-400/10'
                : 'border-neutral-800 opacity-60';
          return (
            <li key={i}>
              <button
                type="button"
                onClick={() => handleAnswer(i)}
                disabled={chosen !== null}
                className={`flex w-full items-start gap-3 rounded-xl border p-4 text-left transition-colors ${stateClass}`}
              >
                <span className="font-mono text-sm text-teal-400">{LETTERS[i]}</span>
                <span className="text-neutral-100">{option}</span>
              </button>
            </li>
          );
        })}
      </ul>

      {chosen !== null && (
        <div className="space-y-4">
          <div className="rounded-xl border border-neutral-700 bg-neutral-800/40 p-4">
            <p className="mb-1 font-medium text-teal-400">
              {isAnswerCorrect(question, chosen, indexMap) ? 'Верно!' : 'Неверно'}
            </p>
            <p className="text-sm text-neutral-300">{question.explanation}</p>
            {question.source && (
              <p className="mt-2 text-xs text-neutral-500">{question.source}</p>
            )}
          </div>
          <button
            type="button"
            onClick={handleNext}
            className="w-full rounded-xl bg-teal-400 py-3 font-medium text-neutral-950 transition-colors hover:bg-teal-300"
          >
            {current + 1 === shuffled.length ? 'Показать результат' : 'Дальше'}
          </button>
        </div>
      )}
    </div>
  );
}

function ResultScreen({ result, onRestart }: { result: QuizResult; onRestart: () => void }) {
  return (
    <div className="mx-auto max-w-md space-y-6 text-center">
      <h2 className="text-3xl font-bold text-teal-400">{result.percent}%</h2>
      <p className="text-neutral-300">Правильных ответов: {result.correct} из {result.total}</p>
      <button
        type="button"
        onClick={onRestart}
        className="rounded-xl bg-teal-400 px-6 py-3 font-medium text-neutral-950 transition-colors hover:bg-teal-300"
      >
        Пройти ещё раз
      </button>
    </div>
  );
}

interface Answer {
  questionId: string;
  chosenIndex: number;
  isCorrect: boolean;
  answeredAt: string;
}
