// Контракты данных проекта. Все модули контента и прогресса описаны здесь.

export type ModuleId = 'istqb' | 'sql' | 'api' | 'ai-for-qa' | 'automation';

/** Описание учебного модуля (content/<id>/module.json) */
export interface CourseModule {
  id: ModuleId;
  title: string;
  description: string;
  /** Название иконки из lucide-react */
  icon: string;
  /** Акцентный цвет модуля в формате #RRGGBB */
  accentColor: string;
  lessonCount: number;
}

/** Вопрос викторины (content/<id>/questions.json) */
export interface QuizQuestion {
  id: string;
  moduleId: ModuleId;
  topic: string;
  difficulty: 'easy' | 'medium' | 'hard';
  text: string;
  options: string[];
  /** Индекс правильного варианта в исходном массиве options */
  correctIndex: number;
  explanation: string;
  /** Ссылка на первоисточник (раздел Syllabus, документация и т. п.) */
  source?: string;
}

/** Одна запись ответа пользователя на вопрос */
export interface AnswerRecord {
  questionId: string;
  chosenIndex: number;
  isCorrect: boolean;
  answeredAt: string;
}

/** Прогресс по одному модулю */
export interface ModuleProgress {
  completedLessonIds: string[];
  answeredQuestions: Record<string, AnswerRecord>;
  /** Результаты пробных экзаменов: процент, дата, длительность */
  examResults: Array<{
    percent: number;
    correctCount: number;
    totalCount: number;
    durationSeconds: number;
    passedAt: string;
  }>;
  updatedAt: string;
}

/** Общий прогресс пользователя (localStorage) */
export interface UserProgress {
  /** Версия схемы для миграций */
  version: 1;
  lastVisitedAt: string;
  /** Серия активных дней */
  streakDays: number;
  modules: Record<ModuleId, ModuleProgress>;
}
  