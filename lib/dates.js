import {
  differenceInCalendarDays,
  format,
  isSameDay,
  isToday,
  isTomorrow,
  isValid,
  parseISO,
  startOfDay,
  subDays,
} from 'date-fns';

export function parseDate(value) {
  if (!value) return null;
  const date = value instanceof Date ? value : new Date(value);
  return isValid(date) ? date : null;
}

export function isOverdue(task, now = new Date()) {
  if (!task || task.completed || !task.dueAt) return false;
  const due = parseDate(task.dueAt);
  return Boolean(due && due.getTime() < now.getTime());
}

export function dueLabel(value, now = new Date(), { done = false } = {}) {
  const date = parseDate(value);
  if (!date) return '';

  if (!done && date.getTime() < now.getTime()) {
    const days = differenceInCalendarDays(now, date);
    if (days <= 0) return `Overdue · ${format(date, 'h:mm a')}`;
    if (days === 1) return '1 day overdue';
    if (days < 7) return `${days} days overdue`;
    return `Overdue since ${format(date, 'MMM d')}`;
  }

  if (isToday(date)) return `Today · ${format(date, 'h:mm a')}`;
  if (isTomorrow(date)) return `Tomorrow · ${format(date, 'h:mm a')}`;
  return `${format(date, 'EEE, MMM d')} · ${format(date, 'h:mm a')}`;
}

export function shortDue(value, now = new Date(), { done = false } = {}) {
  const date = parseDate(value);
  if (!date) return '';

  if (!done && date.getTime() < now.getTime()) return 'Overdue';
  if (isToday(date)) return format(date, 'h:mm a');
  if (isTomorrow(date)) return 'Tomorrow';
  return format(date, 'MMM d');
}

export function createdLabel(value, now = new Date()) {
  const date = parseDate(value);
  if (!date) return '';
  if (isSameDay(date, now)) return 'Added today';
  return `Added ${format(date, 'MMM d')}`;
}

export function dateInputValue(value) {
  const date = parseDate(value);
  return date ? format(date, 'yyyy-MM-dd') : '';
}

export function timeInputValue(value) {
  const date = parseDate(value);
  return date ? format(date, 'HH:mm') : '';
}

export function toIsoFromInputs(dateStr, timeStr) {
  if (!dateStr) return null;

  const [year, month, day] = dateStr.split('-').map(Number);
  const [hours, minutes] = (timeStr || '17:00').split(':').map(Number);
  const local = new Date(year, month - 1, day, hours, minutes, 0, 0);

  if (!isValid(local)) return null;
  return local.toISOString();
}

// A default time that is still in the future, so quick-picking "Today" never
// creates a task that is already overdue.
export function nextTimeSlot(now = new Date()) {
  const slot = new Date(now.getTime() + 30 * 60000);
  slot.setSeconds(0, 0);

  if (slot.getMinutes() > 30) {
    slot.setHours(slot.getHours() + 1, 0, 0, 0);
  } else {
    slot.setMinutes(30, 0, 0);
  }

  if (!isToday(slot)) return '23:45';
  return format(slot, 'HH:mm');
}

export function defaultDueTime(dateStr, now = new Date()) {
  if (dateStr === format(now, 'yyyy-MM-dd')) return nextTimeSlot(now);
  return '17:00';
}

export function todayLabel(now = new Date()) {
  return format(now, 'EEEE, MMMM d');
}

export function shortToday(now = new Date()) {
  return format(now, 'EEE, MMM d');
}

export function greetingFor(now = new Date()) {
  const hour = now.getHours();
  if (hour < 5) return 'Still up';
  if (hour < 12) return 'Good morning';
  if (hour < 18) return 'Good afternoon';
  return 'Good evening';
}

export function weekDays(now = new Date()) {
  return Array.from({ length: 7 }, (_, index) => {
    const day = subDays(now, 6 - index);
    return {
      date: day,
      key: format(day, 'yyyy-MM-dd'),
      short: format(day, 'EEEEE'),
      label: format(day, 'EEE'),
      isToday: isSameDay(day, now),
    };
  });
}

export function dayStart(value = new Date()) {
  return startOfDay(value);
}

export function isValidEmail(value) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(value).trim());
}

export function dueDateIsValid(dateStr, timeStr) {
  return Boolean(toIsoFromInputs(dateStr, timeStr));
}
