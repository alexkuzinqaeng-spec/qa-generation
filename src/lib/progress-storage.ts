// Прогресс пользователя — только localStorage, без сервера.
import type { AnswerRecord, ModuleId, UserProgress } from '@/contracts/types';

const STORAGE_KEY = 'qa-generation:progress:v1';
const MODULE_IDS: ModuleId[] = ['istqb', 'sql', 'api', 'ai-for-qa', 'automation'];

function createDefault(): UserProgress {
  return {
    version: 1,
    lastVisitedAt: new Date().toISOString(),
    streakDays: 0,
    modules: Object.fromEntries(
      MODULE_IDS.map((id) => [
        id,
        { completedLessonIds: [], answeredQuestions: {}, examResults: [], updatedAt: new Date().toISOString() },
      ]),
    ),
  } as UserProgress;
}

export function loadProgress(): UserProgress {
  if (typeof window === 'undefined') return createDefault();
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return createDefault();
    const parsed = JSON.parse(raw) as UserProgress;
    if (parsed.version !== 1) return createDefault();
    // Дозаполняем отсутствующие модули, если схема менялась в рамках v1
    for (const id of MODULE_IDS) {
      if (!parsed.modules[id]) {
        parsed.modules[id] = {
          completedLessonIds: [],
          answeredQuestions: {},
          examResults: [],
          updatedAt: new Date().toISOString(),
        };
      }
    }
    return parsed;
  } catch {
    return createDefault();
  }
}

export function saveProgress(progress: UserProgress): void {
  if (typeof window === 'undefined') return;
  progress.lastVisitedAt = new Date().toISOString();
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(progress));
}

/** Записать ответ на вопрос и обновить серию активных дней */
export function recordAnswer(
  moduleId: ModuleId,
  questionId: string,
  record: Omit<AnswerRecord, 'questionId'>,
): void {
  const progress = loadProgress();
  const moduleProgress = progress.modules[moduleId];
  moduleProgress.answeredQuestions[questionId] = { questionId, ...record };
  moduleProgress.updatedAt = new Date().toISOString();
  updateStreak(progress);
  saveProgress(progress);
}

/** Серия активных дней: +1 при визите вчера, сброс при пропуске, минимум 1 сегодня */
function updateStreak(progress: UserProgress): void {
  const today = new Date();
  const last = new Date(progress.lastVisitedAt);
  const daysBetween = Math.floor((today.getTime() - last.getTime()) / 86_400_000);
  if (daysBetween === 1) {
    progress.streakDays += 1;
  } else if (daysBetween > 1) {
    progress.streakDays = 1;
  } else if (progress.streakDays === 0) {
    progress.streakDays = 1;
  }
}
