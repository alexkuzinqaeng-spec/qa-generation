import { QuizCard } from '@/features/istqb-trainer/components/QuizCard';
import { loadModule, loadQuestions } from '@/lib/content-loader';

export const metadata = { title: 'ISTQB-тренер — QA-Generation' };

export default function IstqbPage() {
  const moduleData = loadModule('istqb');
  const questions = loadQuestions('istqb');

  if (!moduleData || questions.length === 0) {
    return (
      <main className="mx-auto max-w-2xl p-8">
        <p className="text-neutral-400">Контент модуля пока не загружен.</p>
      </main>
    );
  }

  return (
    <main className="mx-auto max-w-2xl p-8">
      <h1 className="mb-2 text-2xl font-bold text-neutral-100">{moduleData.title}</h1>
      <p className="mb-8 text-neutral-400">{moduleData.description}</p>
      <QuizCard moduleId="istqb" questions={questions} />
    </main>
  );
}
