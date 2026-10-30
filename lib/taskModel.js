import { makeId } from '@/lib/id';
import { CATEGORY_COLORS, CATEGORY_ICONS, PRIORITY_ORDER, PRIORITY_RANK } from '@/lib/theme';

export function createTask(input = {}) {
  const now = new Date().toISOString();
  const priority = PRIORITY_ORDER.includes(input.priority) ? input.priority : 'medium';
  const dueAt =
    input.dueAt && !Number.isNaN(new Date(input.dueAt).getTime()) ? input.dueAt : null;

  return {
    id: makeId('task'),
    title: String(input.title || '').trim(),
    notes: String(input.notes || '').trim(),
    categoryId: input.categoryId || null,
    priority,
    dueAt,
    completed: false,
    completedAt: null,
    createdAt: now,
    updatedAt: now,
  };
}

export function createCategory(input = {}) {
  return {
    id: makeId('cat'),
    name: String(input.name || '').trim(),
    icon: CATEGORY_ICONS.includes(input.icon) ? input.icon : 'sparkles',
    color: CATEGORY_COLORS[input.color] ? input.color : 'violet',
  };
}

export function patchTask(task, changes, now = new Date()) {
  return {
    ...task,
    ...changes,
    updatedAt: now.toISOString(),
  };
}

export function toggleTask(task, completed, now = new Date()) {
  return {
    ...task,
    completed: Boolean(completed),
    completedAt: completed ? now.toISOString() : null,
    updatedAt: now.toISOString(),
  };
}

export function compareTasksBySmartOrder(left, right) {
  if (left.completed !== right.completed) return left.completed ? 1 : -1;

  const leftDue = left.dueAt ? new Date(left.dueAt).getTime() : null;
  const rightDue = right.dueAt ? new Date(right.dueAt).getTime() : null;
  const now = Date.now();
  const leftOverdue = leftDue !== null && leftDue < now;
  const rightOverdue = rightDue !== null && rightDue < now;

  if (leftOverdue !== rightOverdue) return leftOverdue ? -1 : 1;

  if (leftDue !== null && rightDue !== null && leftDue !== rightDue) {
    return leftDue - rightDue;
  }
  if (leftDue !== null && rightDue === null) return -1;
  if (leftDue === null && rightDue !== null) return 1;

  const priority = PRIORITY_RANK[left.priority] - PRIORITY_RANK[right.priority];
  if (priority !== 0) return priority;

  return new Date(right.createdAt) - new Date(left.createdAt);
}
