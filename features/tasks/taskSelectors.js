import { endOfDay, isSameDay, parseISO, startOfDay } from 'date-fns';
import { weekDays } from '@/lib/dates';
import { compareTasksBySmartOrder } from '@/lib/taskModel';
import { PRIORITY_RANK } from '@/lib/theme';

function dateOf(value) {
  if (!value) return null;
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? null : date;
}

function isOpenOverdue(task, now) {
  if (task.completed || !task.dueAt) return false;
  const due = dateOf(task.dueAt);
  return Boolean(due && due.getTime() < now.getTime());
}

export function getCounts(tasks, now = new Date()) {
  const open = tasks.filter((task) => !task.completed).length;
  const done = tasks.length - open;
  const overdue = tasks.filter((task) => isOpenOverdue(task, now)).length;
  const dueToday = tasks.filter(
    (task) => task.dueAt && isSameDay(parseISO(task.dueAt), now)
  ).length;
  const doneToday = tasks.filter(
    (task) => task.completedAt && isSameDay(parseISO(task.completedAt), now)
  ).length;

  return {
    total: tasks.length,
    open,
    done,
    overdue,
    dueToday,
    doneToday,
  };
}

export function getTodayPlan(tasks, now = new Date()) {
  const dueToday = tasks.filter(
    (task) => task.dueAt && isSameDay(parseISO(task.dueAt), now)
  );
  const completedToday = tasks.filter(
    (task) => task.completedAt && isSameDay(parseISO(task.completedAt), now)
  );

  const seen = new Set();
  return [...completedToday, ...dueToday].filter((task) => {
    if (seen.has(task.id)) return false;
    seen.add(task.id);
    return true;
  });
}

export function getTodayProgress(tasks, now = new Date()) {
  const plan = getTodayPlan(tasks, now);
  const done = plan.filter((task) => task.completed).length;
  const total = plan.length;

  return {
    plan,
    total,
    done,
    remaining: total - done,
    percent: total ? Math.round((done / total) * 100) : 0,
  };
}

export function getWeekActivity(tasks, now = new Date()) {
  const days = weekDays(now).map((day) => {
    const count = tasks.filter((task) => {
      if (!task.completedAt) return false;
      const completed = dateOf(task.completedAt);
      return completed ? isSameDay(completed, day.date) : false;
    }).length;

    return { ...day, count };
  });

  return {
    days,
    total: days.reduce((sum, day) => sum + day.count, 0),
    max: Math.max(1, ...days.map((day) => day.count)),
  };
}

export function getUpcomingTasks(tasks, now = new Date(), limit = 3) {
  return tasks
    .filter((task) => {
      if (task.completed || !task.dueAt) return false;
      const due = dateOf(task.dueAt);
      return Boolean(due && due.getTime() > now.getTime());
    })
    .sort((left, right) => new Date(left.dueAt) - new Date(right.dueAt))
    .slice(0, limit);
}

export function getNextUp(tasks, now = new Date()) {
  return tasks
    .filter((task) => !task.completed)
    .slice()
    .sort((left, right) => compareTasksBySmartOrder(left, right))[0] || null;
}

export function sortTasks(tasks, sort = 'smart', now = new Date()) {
  const list = tasks.slice();

  if (sort === 'due') {
    return list.sort((left, right) => {
      if (left.completed !== right.completed) return left.completed ? 1 : -1;
      const leftDue = dateOf(left.dueAt);
      const rightDue = dateOf(right.dueAt);
      if (leftDue && rightDue && leftDue.getTime() !== rightDue.getTime()) {
        return leftDue - rightDue;
      }
      if (leftDue && !rightDue) return -1;
      if (!leftDue && rightDue) return 1;
      return PRIORITY_RANK[left.priority] - PRIORITY_RANK[right.priority];
    });
  }

  if (sort === 'priority') {
    return list.sort((left, right) => {
      if (left.completed !== right.completed) return left.completed ? 1 : -1;
      const rank = PRIORITY_RANK[left.priority] - PRIORITY_RANK[right.priority];
      if (rank !== 0) return rank;
      const leftDue = dateOf(left.dueAt);
      const rightDue = dateOf(right.dueAt);
      if (leftDue && rightDue) return leftDue - rightDue;
      if (leftDue) return -1;
      if (rightDue) return 1;
      return new Date(right.createdAt) - new Date(left.createdAt);
    });
  }

  if (sort === 'newest') {
    return list.sort((left, right) => {
      if (left.completed !== right.completed) return left.completed ? 1 : -1;
      return new Date(right.createdAt) - new Date(left.createdAt);
    });
  }

  return list.sort((left, right) => compareTasksBySmartOrder(left, right));
}

export function getVisibleTasks(
  tasks,
  { view = 'overview', categoryId = 'all', status = 'all', query = '', sort = 'smart', now = new Date() } = {}
) {
  const needle = String(query || '').trim().toLowerCase();

  let list = tasks.filter((task) => {
    if (categoryId !== 'all' && task.categoryId !== categoryId) return false;
    if (!needle) return true;
    return `${task.title} ${task.notes}`.toLowerCase().includes(needle);
  });

  if (view === 'overview') {
    list = list.filter((task) => !task.completed);
  } else if (view === 'today') {
    list = list.filter((task) => {
      const due = dateOf(task.dueAt);
      if (!due) return false;
      return isSameDay(due, now) || (!task.completed && due.getTime() < startOfDay(now).getTime());
    });
  } else if (view === 'upcoming') {
    list = list.filter((task) => {
      const due = dateOf(task.dueAt);
      return Boolean(!task.completed && due && due.getTime() > endOfDay(now).getTime());
    });
  } else if (view === 'completed') {
    list = list.filter((task) => task.completed);
  } else if (status === 'open') {
    list = list.filter((task) => !task.completed);
  } else if (status === 'done') {
    list = list.filter((task) => task.completed);
  }

  if (view === 'completed' && sort === 'smart') {
    return list.sort((left, right) => {
      const leftDone = dateOf(left.completedAt)?.getTime() || 0;
      const rightDone = dateOf(right.completedAt)?.getTime() || 0;
      return rightDone - leftDone;
    });
  }

  return sortTasks(list, sort, now);
}

export function getSidebarCounts(tasks, now = new Date()) {
  const counts = getCounts(tasks, now);
  const todayOpen = tasks.filter((task) => {
    if (task.completed || !task.dueAt) return false;
    const due = dateOf(task.dueAt);
    return Boolean(due && (isSameDay(due, now) || due.getTime() < startOfDay(now).getTime()));
  }).length;
  const upcoming = tasks.filter((task) => {
    if (task.completed || !task.dueAt) return false;
    const due = dateOf(task.dueAt);
    return Boolean(due && due.getTime() > endOfDay(now).getTime());
  }).length;

  return {
    ...counts,
    today: todayOpen,
    upcoming,
    completed: counts.done,
  };
}

export function getCategoryCounts(tasks, categories) {
  const map = new Map();
  for (const category of categories) {
    map.set(category.id, {
      open: tasks.filter((task) => task.categoryId === category.id && !task.completed).length,
      total: tasks.filter((task) => task.categoryId === category.id).length,
    });
  }
  return map;
}

export function getInsight(tasks, now = new Date()) {
  const counts = getCounts(tasks, now);
  const week = getWeekActivity(tasks, now);

  if (counts.overdue === 1) {
    return 'One task slipped. Reschedule it or shrink it until it feels possible.';
  }

  if (counts.overdue > 1) {
    return `${counts.overdue} tasks slipped. Pick one to reset first — the rest can wait.`;
  }

  if (week.total > 0) {
    const best = week.days.slice().sort((left, right) => right.count - left.count)[0];
    if (best && best.count > 0) {
      return `${week.total} finished this week. ${best.isToday ? 'Today' : best.label} did the heavy lifting.`;
    }
  }

  if (counts.open > 0) {
    return `${counts.open} open. Start with the smallest one and let momentum do the rest.`;
  }

  return 'Your week has room. Add one thing you actually want to finish.';
}

export function getTodayCompleted(tasks, now = new Date()) {
  return tasks
    .filter((task) => task.completedAt && isSameDay(parseISO(task.completedAt), now))
    .sort((left, right) => new Date(right.completedAt) - new Date(left.completedAt));
}
