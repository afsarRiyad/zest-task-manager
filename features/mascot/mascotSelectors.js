import { getCounts, getNextUp, getTodayProgress } from '@/features/tasks/taskSelectors';
import { TRANSIENT_MOODS } from '@/features/mascot/mascotSlice';

function shortTitle(title, max = 44) {
  const clean = String(title || '').trim();
  return clean.length > max ? `${clean.slice(0, max - 1)}…` : clean;
}

export function getCompanionView(tasks, mascot, now = new Date()) {
  const counts = getCounts(tasks, now);
  const progress = getTodayProgress(tasks, now);
  const next = getNextUp(tasks, now);
  const hour = now.getHours();
  const late = hour >= 23 || hour < 5;

  let restingMood = 'focus';
  let restingMessage = "First up: what's one thing worth starting?";

  if (counts.total === 0) {
    restingMood = 'idle';
    restingMessage = 'A fresh page. Add one small thing and we can start there.';
  } else if (counts.open === 0) {
    restingMood = 'happy';
    restingMessage = "Everything's clear. That's the whole list — go enjoy it.";
  } else if (counts.overdue > 0) {
    restingMood = 'concerned';
    restingMessage =
      counts.overdue === 1
        ? "One thing slipped. Let's put it back on the map."
        : `${counts.overdue} things slipped. One at a time — we'll reset them.`;
  } else if (late) {
    restingMood = 'sleepy';
    restingMessage = "It's late. The list will still be here tomorrow.";
  } else if (next) {
    restingMood = 'focus';
    restingMessage = `Next up: ${shortTitle(next.title)}.`;
  }

  const transient = TRANSIENT_MOODS.includes(mascot.mood);

  return {
    mood: transient ? mascot.mood : restingMood,
    message: transient && mascot.message ? mascot.message : restingMessage,
    restingMessage,
    reaction: mascot.reaction,
    counts,
    progress,
    next,
    allDone: counts.total > 0 && counts.open === 0,
    hasOverdue: counts.overdue > 0,
  };
}

export function getGreetingLine(name, now = new Date()) {
  const hour = now.getHours();
  const first = String(name || '').trim().split(' ')[0] || 'friend';
  if (hour < 5) return `Still up, ${first}?`;
  if (hour < 12) return `Good morning, ${first}.`;
  if (hour < 18) return `Good afternoon, ${first}.`;
  return `Good evening, ${first}.`;
}
