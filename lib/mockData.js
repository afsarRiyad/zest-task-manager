import { makeId } from '@/lib/id';

// Temporary mock data so the dashboard has something to show.
// Remove this file, the seed in Dashboard.jsx and app/api/me once the real backend is wired up.

export const MOCK_USER = {
  id: 'mock-user-1',
  name: 'Alex Morgan',
  email: 'alex@zest.app',
};

function at(base, dayOffset, hour = 9, minute = 0) {
  const date = new Date(base);
  date.setDate(date.getDate() + dayOffset);
  date.setHours(hour, minute, 0, 0);
  return date.toISOString();
}

export function createMockTasks(categories = [], base = new Date()) {
  const pick = (name, fallback) =>
    categories.find((category) => category.name.toLowerCase() === name)?.id || fallback || null;

  const personal = pick('personal', 'personal');
  const work = pick('work', 'work');
  const study = pick('study', 'study');
  const health = pick('health', 'health');

  const completedToday = at(base, 0, 8, 10);
  const completedYesterday = at(base, -1, 19, 30);
  const createdEarlier = at(base, -3, 10, 0);

  return [
    {
      id: makeId('task'),
      title: 'Finish the quarterly report',
      notes: 'Pull the last two weeks of numbers and send the summary to the team.',
      categoryId: work,
      priority: 'high',
      dueAt: at(base, 0, 17, 0),
      completed: false,
      completedAt: null,
      createdAt: createdEarlier,
      updatedAt: createdEarlier,
    },
    {
      id: makeId('task'),
      title: "Reply to Maya's email",
      notes: 'She needs the revised timeline before lunch.',
      categoryId: work,
      priority: 'medium',
      dueAt: at(base, 0, 11, 0),
      completed: false,
      completedAt: null,
      createdAt: at(base, -1, 9, 0),
      updatedAt: at(base, -1, 9, 0),
    },
    {
      id: makeId('task'),
      title: 'Morning run — 5k',
      notes: '',
      categoryId: health,
      priority: 'low',
      dueAt: at(base, 0, 7, 0),
      completed: true,
      completedAt: completedToday,
      createdAt: at(base, -2, 20, 0),
      updatedAt: completedToday,
    },
    {
      id: makeId('task'),
      title: 'Read 20 pages',
      notes: 'Atomic Habits, chapter 6.',
      categoryId: study,
      priority: 'low',
      dueAt: at(base, 0, 21, 30),
      completed: false,
      completedAt: null,
      createdAt: at(base, -2, 21, 0),
      updatedAt: at(base, -2, 21, 0),
    },
    {
      id: makeId('task'),
      title: 'Book dentist appointment',
      notes: 'The six-month check-up is overdue.',
      categoryId: health,
      priority: 'medium',
      dueAt: at(base, -1, 16, 0),
      completed: false,
      completedAt: null,
      createdAt: at(base, -5, 12, 0),
      updatedAt: at(base, -5, 12, 0),
    },
    {
      id: makeId('task'),
      title: 'Draft the portfolio case study',
      notes: 'Outline first, screenshots later.',
      categoryId: personal,
      priority: 'high',
      dueAt: at(base, 1, 18, 0),
      completed: false,
      completedAt: null,
      createdAt: at(base, -1, 15, 0),
      updatedAt: at(base, -1, 15, 0),
    },
    {
      id: makeId('task'),
      title: 'Weekly grocery run',
      notes: 'Oats, coffee, fruit, eggs.',
      categoryId: personal,
      priority: 'low',
      dueAt: at(base, 2, 10, 0),
      completed: false,
      completedAt: null,
      createdAt: at(base, -1, 18, 0),
      updatedAt: at(base, -1, 18, 0),
    },
    {
      id: makeId('task'),
      title: 'Review open pull requests',
      notes: 'Two are waiting on feedback.',
      categoryId: work,
      priority: 'medium',
      dueAt: at(base, 1, 15, 0),
      completed: false,
      completedAt: null,
      createdAt: at(base, -1, 11, 0),
      updatedAt: at(base, -1, 11, 0),
    },
    {
      id: makeId('task'),
      title: 'Study Spanish — 15 minutes',
      notes: 'Focus on past tense verbs.',
      categoryId: study,
      priority: 'low',
      dueAt: at(base, -1, 20, 0),
      completed: true,
      completedAt: completedYesterday,
      createdAt: at(base, -3, 20, 0),
      updatedAt: completedYesterday,
    },
    {
      id: makeId('task'),
      title: 'Plan the weekend trip',
      notes: 'Check train times and pick a place to stay.',
      categoryId: personal,
      priority: 'medium',
      dueAt: at(base, 5, 12, 0),
      completed: false,
      completedAt: null,
      createdAt: at(base, -4, 14, 0),
      updatedAt: at(base, -4, 14, 0),
    },
  ];
}
