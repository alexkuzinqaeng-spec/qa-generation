// Движок викторины: чистые функции без зависимостей от React и Next.js.
import type { AnswerRecord, QuizQuestion } from '@/contracts/types';

/** Отбор вопросов по теме и сложности (если заданы) */
export function selectQuestions(
  questions: QuizQuestion[],
  options: { topic?: string; difficulty?: string; limit?: number } = {},
): QuizQuestion[] {
  let pool = questions;
  if (options.topic) {
    pool = pool.filter((q) => q.topic === options.topic);
  }
  if (options.difficulty) {
    pool = pool.filter((q) => q.difficulty === options.difficulty);
  }
  pool = shuffle(pool);
  return options.limit ? pool.slice(0, options.limit) : pool;
}

/** Перемешивание Фишера–Йетса */
export function shuffle<T>(items: T[]): T[] {
  const arr = [...items];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

/**
 * Перемешивание вариантов ответа: новый порядок и карта
 * «новый индекс → старый индекс», чтобы не потерять correctIndex.
 */
export function shuffleOptions(question: QuizQuestion): {
  options: string[];
  indexMap: number[];
} {
  const indexMap = shuffle(question.options.map((_, i) => i));
  return {
    options: indexMap.map((oldIndex) => question.options[oldIndex]),
    indexMap,
  };
}

/** Проверка ответа: выбранный индекс сравнивается с correctIndex */
export function isAnswerCorrect(
  question: QuizQuestion,
  chosenIndex: number,
  indexMap?: number[],
): boolean {
  const originalIndex = indexMap ? indexMap[chosenIndex] : chosenIndex;
  return originalIndex === question.correctIndex;
}

/** Собрать запись ответа для прогресса */
export function buildAnswerRecord(
  question: QuizQuestion,
  chosenIndex: number,
  isCorrect: boolean,
): AnswerRecord {
  return {
    questionId: question.id,
    chosenIndex,
    isCorrect,
    answeredAt: new Date().toISOString(),
  };
}

/** Итоги сессии викторины */
export interface QuizResult {
  total: number;
  correct: number;
  percent: number;
  wrongIds: string[];
}

export function calculateResult(
  answers: AnswerRecord[],
): QuizResult {
  const total = answers.length;
  const correct = answers.filter((a) => a.isCorrect).length;
  return {
    total,
    correct,
    percent: total === 0 ? 0 : Math.round((correct / total) * 100),
    wrongIds: answers.filter((a) => !a.isCorrect).map((a) => a.questionId),
  };
}

/** Темы, присутствующие в наборе вопросов (для фильтров в UI) */
export function availableTopics(questions: QuizQuestion[]): string[] {
  return [...new Set(questions.map((q) => q.topic))];
}
