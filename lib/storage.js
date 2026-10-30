const STORAGE_KEY = 'zest:state:v1';

export function loadState() {
  if (typeof window === 'undefined') return null;

  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;

    const parsed = JSON.parse(raw);
    if (!parsed || !Array.isArray(parsed.tasks) || !Array.isArray(parsed.categories)) {
      return null;
    }

    return { tasks: parsed.tasks, categories: parsed.categories };
  } catch {
    return null;
  }
}

export function saveState(state) {
  if (typeof window === 'undefined') return;

  try {
    window.localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({ version: 1, tasks: state.tasks, categories: state.categories })
    );
  } catch {
    // storage can be full or blocked, the app still works in memory
  }
}
