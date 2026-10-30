import { makeId } from '@/lib/id';

const DATA_PREFIX = 'zest:data:v1:';
const DATA_VERSION = 1;

export const STARTER_CATEGORIES = [
  { id: 'personal', name: 'Personal', icon: 'sparkles', color: 'amber' },
  { id: 'work', name: 'Work', icon: 'briefcase', color: 'blue' },
  { id: 'study', name: 'Study', icon: 'book', color: 'violet' },
  { id: 'health', name: 'Health', icon: 'heart', color: 'mint' },
];

const PRIORITIES = new Set(['low', 'medium', 'high']);
const COLOR_NAMES = new Set(['violet', 'cyan', 'mint', 'rose', 'blue', 'amber']);
const ICON_NAMES = new Set([
  'sparkles',
  'briefcase',
  'book',
  'heart',
  'home',
  'bolt',
  'moon',
  'target',
]);

export function createStarterCategories() {
  return STARTER_CATEGORIES.map((category) => ({ ...category }));
}

function normaliseCategory(category) {
  if (!category || typeof category !== 'object') return null;
  const name = String(category.name || '').trim().slice(0, 22);
  if (!name) return null;

  return {
    id: String(category.id || makeId('cat')),
    name,
    icon: ICON_NAMES.has(category.icon) ? category.icon : 'sparkles',
    color: COLOR_NAMES.has(category.color) ? category.color : 'violet',
  };
}

function normaliseTask(task) {
  if (!task || typeof task !== 'object') return null;
  const title = String(task.title || '').trim().slice(0, 120);
  if (!title) return null;

  const now = new Date().toISOString();
  const completed = Boolean(task.completed);
  const due = task.dueAt && !Number.isNaN(new Date(task.dueAt).getTime()) ? task.dueAt : null;

  return {
    id: String(task.id || makeId('task')),
    title,
    notes: String(task.notes || '').trim().slice(0, 600),
    categoryId: task.categoryId ? String(task.categoryId) : null,
    priority: PRIORITIES.has(task.priority) ? task.priority : 'medium',
    dueAt: due,
    completed,
    completedAt:
      completed && task.completedAt && !Number.isNaN(new Date(task.completedAt).getTime())
        ? task.completedAt
        : null,
    createdAt:
      task.createdAt && !Number.isNaN(new Date(task.createdAt).getTime()) ? task.createdAt : now,
    updatedAt:
      task.updatedAt && !Number.isNaN(new Date(task.updatedAt).getTime()) ? task.updatedAt : now,
  };
}

function normaliseData(data) {
  if (!data || typeof data !== 'object') return null;

  const categories = Array.isArray(data.categories)
    ? data.categories.map(normaliseCategory).filter(Boolean)
    : createStarterCategories();

  const categoryIds = new Set(categories.map((category) => category.id));
  const tasks = Array.isArray(data.tasks)
    ? data.tasks
        .map(normaliseTask)
        .filter(Boolean)
        .map((task) => ({
          ...task,
          categoryId: task.categoryId && categoryIds.has(task.categoryId) ? task.categoryId : null,
        }))
    : [];

  return { tasks, categories };
}

export function loadUserData(userId) {
  const fallback = { tasks: [], categories: createStarterCategories() };
  if (!userId || typeof window === 'undefined') return fallback;

  try {
    const raw = window.localStorage.getItem(`${DATA_PREFIX}${userId}`);
    if (!raw) return fallback;

    const parsed = JSON.parse(raw);
    return normaliseData(parsed) || fallback;
  } catch {
    return fallback;
  }
}

export function saveUserData(userId, tasks, categories) {
  if (!userId || typeof window === 'undefined') return false;

  try {
    window.localStorage.setItem(
      `${DATA_PREFIX}${userId}`,
      JSON.stringify({
        version: DATA_VERSION,
        updatedAt: new Date().toISOString(),
        tasks,
        categories,
      })
    );
    return true;
  } catch {
    return false;
  }
}

export function clearUserData(userId) {
  if (!userId || typeof window === 'undefined') return;
  window.localStorage.removeItem(`${DATA_PREFIX}${userId}`);
}
