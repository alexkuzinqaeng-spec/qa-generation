// Загрузчик контента из /content. Работает на сервере (Server Components),
// читает JSON через fs — контент остаётся данными, не кодом.
import fs from 'fs';
import path from 'path';
import type { CourseModule, QuizQuestion } from '@/contracts/types';

const CONTENT_DIR = path.join(process.cwd(), 'content');

/** Загрузить модуль: /content/<moduleId>/module.json */
export function loadModule(moduleId: string): CourseModule | null {
  const file = path.join(CONTENT_DIR, moduleId, 'module.json');
  if (!fs.existsSync(file)) return null;
  return JSON.parse(fs.readFileSync(file, 'utf-8')) as CourseModule;
}

/** Загрузить вопросы: /content/<moduleId>/questions.json */
export function loadQuestions(moduleId: string): QuizQuestion[] {
  const file = path.join(CONTENT_DIR, moduleId, 'questions.json');
  if (!fs.existsSync(file)) return [];
  return JSON.parse(fs.readFileSync(file, 'utf-8')) as QuizQuestion[];
}

/** Список всех модулей из /content */
export function loadAllModules(): CourseModule[] {
  const ids = ['istqb', 'sql', 'api', 'ai-for-qa', 'automation'];
  return ids
    .map(loadModule)
    .filter((m): m is CourseModule => m !== null);
}
