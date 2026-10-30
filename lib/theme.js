export const PRIORITY_ORDER = ['low', 'medium', 'high'];

export const PRIORITY_LABEL = {
  low: 'Low',
  medium: 'Medium',
  high: 'High',
};

export const PRIORITY_COLOR = {
  low: 'rgb(var(--priority-low))',
  medium: 'rgb(var(--priority-medium))',
  high: 'rgb(var(--priority-high))',
};

export const PRIORITY_RANK = {
  high: 0,
  medium: 1,
  low: 2,
};

// Resolved through the theme tokens so category dots follow light/dark palettes.
export const CATEGORY_COLORS = {
  violet: 'rgb(var(--cat-violet))',
  cyan: 'rgb(var(--cat-cyan))',
  mint: 'rgb(var(--cat-mint))',
  rose: 'rgb(var(--cat-rose))',
  blue: 'rgb(var(--cat-blue))',
  amber: 'rgb(var(--cat-amber))',
};

export const CATEGORY_ICONS = [
  'sparkles',
  'briefcase',
  'book',
  'heart',
  'home',
  'bolt',
  'moon',
  'target',
];

export const SORT_OPTIONS = [
  { value: 'smart', label: 'Smart order' },
  { value: 'due', label: 'Due date' },
  { value: 'priority', label: 'Priority' },
  { value: 'newest', label: 'Newest' },
];

export const VIEW_META = {
  overview: {
    label: 'Overview',
    title: 'Your day',
    emptyTitle: 'A clear slate',
    emptyBody: 'No open tasks. Add one small thing, or enjoy the quiet.',
  },
  tasks: {
    label: 'My Tasks',
    title: 'All tasks',
    emptyTitle: 'Nothing here yet',
    emptyBody: 'Everything you add lands here, with the details that matter.',
  },
  today: {
    label: 'Today',
    title: 'Today',
    emptyTitle: 'Today is yours',
    emptyBody: 'Nothing is due today. Plan something light, or keep the space.',
  },
  upcoming: {
    label: 'Upcoming',
    title: 'Upcoming',
    emptyTitle: 'The horizon is clear',
    emptyBody: 'No deadlines ahead. Add a due date when something needs one.',
  },
  completed: {
    label: 'Completed',
    title: 'Completed',
    emptyTitle: 'No wins logged yet',
    emptyBody: 'Finished tasks collect here so you can see the week add up.',
  },
};

export const TASK_TITLE_MAX = 120;
export const TASK_NOTES_MAX = 600;
export const CATEGORY_NAME_MAX = 22;
