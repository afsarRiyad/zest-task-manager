# Zest

A premium task manager with a warm light canvas, a full dark theme, orange as the single primary accent, and Nova — an original anime-inspired focus companion who reacts to what you do.

## Stack

- Next.js 14 (App Router), JavaScript only
- Redux Toolkit and React Redux
- Framer Motion
- Tailwind CSS
- date-fns
- Inter and Plus Jakarta Sans via `next/font/google`
- localStorage persistence

## Run it

```bash
npm install
npm run dev
```

Open http://localhost:3000. For a production check:

```bash
npm run build
npm start
```

## What is in the box

- Landing, sign-up, sign-in, forgot-password, and an authenticated dashboard, plus a custom 404.
- Create, edit, complete, reopen, and delete tasks. Deletes can be undone from the toast.
- Categories with a name, icon, and color. Starter categories ship by default; new ones are created inline from an expandable selector.
- Priorities (low, medium, high), sorted high first, with completed tasks kept at the bottom.
- Due date and time, with local display and UTC storage.
- Email reminder settings: toggle, address, and offset (at due time, 30 minutes, 1 hour, or 1 day before). Reminders require a due date.
- Filter by category, sort by due date or priority, and search by task title.
- Swipe right to complete, swipe left to delete.
- Nova, an SVG companion with moods driven by Redux and the current task state.
- Light and dark themes, chosen in settings or the header toggle, with light as the default.
- Responsive from 360px upward: a three-column desktop dashboard, a tablet layout, and a mobile layout with a bottom navigation bar.

## Folders

```
app/                    routes, layout, globals, auth pages, 404
components/             app shell, auth layout, dashboard panels, toasts, icons
features/tasks/         slice, selectors, list, sheet
features/categories/    slice, selector, inline create panel
features/mascot/        Nova illustration and reaction moods
lib/                    store, actions, storage, auth, dates, design tokens
```

## Data

Tasks and categories live in Redux. Every write goes through a slice action, so the reducers can later be replaced with `createAsyncThunk` requests without touching the UI. The browser store saves `tasks` and `categories` under `zest:state:v1` and rehydrates on load. Per-account data is kept under `zest:data:v1:<userId>`.

```js
task = {
  id, title, notes, categoryId,
  priority,                 // low | medium | high
  dueAt,                    // ISO string, UTC, or null
  createdAt, updatedAt,     // ISO strings
  completed,
  reminder: { enabled, email, offsetMinutes, sentAt }
}

category = { id, name, icon, color }
```

Accounts are stored in the browser under `zest:accounts:v1` with a salted PBKDF2 hash of the password; the session lives in `zest:session:v1`. Nova keeps its reaction in `mascot.mood` and answers task actions through `extraReducers`. Resting states (sleeping, worried, all done) are derived from the task list.

## Choices and simplifications

- **Category stickers use icons instead of emoji.** A small, consistent icon set keeps the chips readable and avoids mixing emoji with line icons. The color still carries the personality.
- **Email delivery is not wired.** The form stores the full reminder configuration, including `sentAt: null`, but there is no mail provider yet. The helper copy says it is saved, not that mail has been sent.
- **No server yet.** Accounts and persistence are local to the browser. An API adapter can replace the storage helpers without touching the UI.
- **Editing uses the task title.** Tapping the title opens the same sheet with values filled in.
- **Search matches titles only.**
- **Nova's resting mood is derived, not stored.** Redux holds momentary reactions and the resting mood is computed from tasks and the time of day, which keeps overdue and all-done states accurate without timers fighting each other.
- **localStorage writes are debounced** and wrapped in error handling so a blocked or full store does not break the UI.
- **Reminders are configuration only.** A future job can read `reminder.enabled`, `reminder.sentAt`, and the offset to send mail and then stamp `sentAt`.
- **Streaks, subtasks, repeat tasks, reordering, and PWA install** are intentionally not built.

## Notes

- Dates are entered and shown in the local timezone and stored as UTC ISO strings.
- Swipe affordances are backed by real buttons (checkbox and title) for keyboard and screen-reader use.
- `prefers-reduced-motion` removes large movement while keeping state changes instant and clear.