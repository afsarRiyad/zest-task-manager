'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useRouter } from 'next/navigation';
import { endOfDay, isSameDay, parseISO } from 'date-fns';
import { motion } from 'framer-motion';

import Logo from '@/components/Logo';
import Icon from '@/components/Icon';
import Sidebar from '@/components/dashboard/Sidebar';
import MobileTopbar from '@/components/dashboard/MobileTopbar';
import MobileNav from '@/components/dashboard/MobileNav';
import ContextPanel from '@/components/dashboard/ContextPanel';
import CategorySelect from '@/components/dashboard/CategorySelect';
import SortMenu from '@/components/dashboard/SortMenu';
import SearchField from '@/components/dashboard/SearchField';
import TaskList from '@/components/dashboard/TaskList';
import TaskSheet from '@/components/dashboard/TaskSheet';
import NewCategorySheet from '@/components/dashboard/NewCategorySheet';
import SettingsSheet from '@/components/dashboard/SettingsSheet';
import EmptyState from '@/components/dashboard/EmptyState';
import StarterPlan from '@/components/dashboard/StarterPlan';
import QuickAdd from '@/components/dashboard/QuickAdd';
import WeekStrip from '@/components/dashboard/WeekStrip';
import Sheet from '@/components/ui/Sheet';
import AnimeCompanion from '@/features/mascot/AnimeCompanion';
import { useToast } from '@/components/Toast';

import { getCurrentSession, logout } from '@/lib/auth';
import { loadUserData, saveUserData } from '@/lib/userData';
import { createCategory, createTask, patchTask, toggleTask } from '@/lib/taskModel';
import { todayLabel } from '@/lib/dates';
import { VIEW_META } from '@/lib/theme';

import {
  taskAdded,
  taskPatched,
  taskRemoved,
  taskRestored,
  tasksCleared,
  tasksLoaded,
  tasksLoading,
} from '@/features/tasks/tasksSlice';
import {
  categoriesCleared,
  categoriesLoaded,
  categoriesLoading,
  categoryAdded,
} from '@/features/categories/categoriesSlice';
import { mascotReact, mascotRest } from '@/features/mascot/mascotSlice';
import { getCompanionView, getGreetingLine } from '@/features/mascot/mascotSelectors';
import {
  getCategoryCounts,
  getCounts,
  getInsight,
  getSidebarCounts,
  getTodayCompleted,
  getTodayProgress,
  getUpcomingTasks,
  getVisibleTasks,
  getWeekActivity,
} from '@/features/tasks/taskSelectors';

const SPRING = { type: 'spring', bounce: 0, duration: 0.36 };

const SECTION_TITLES = {
  overview: 'Your list',
  tasks: 'All tasks',
  today: 'Due today',
  upcoming: 'On the horizon',
  completed: 'Finished',
};

export default function Dashboard() {
  const dispatch = useDispatch();
  const router = useRouter();
  const toast = useToast();

  const tasks = useSelector((state) => state.tasks.items);
  const taskStatus = useSelector((state) => state.tasks.status);
  const categories = useSelector((state) => state.categories.items);
  const categoryStatus = useSelector((state) => state.categories.status);
  const mascot = useSelector((state) => state.mascot);

  const [user, setUser] = useState(null);
  const [booting, setBooting] = useState(true);
  const [greet, setGreet] = useState(true);
  const [now, setNow] = useState(() => new Date());

  const [view, setView] = useState('overview');
  const [categoryId, setCategoryId] = useState('all');
  const [status, setStatus] = useState('all');
  const [sort, setSort] = useState('smart');
  const [query, setQuery] = useState('');
  const [searchOpen, setSearchOpen] = useState(false);

  const [contextOpen, setContextOpen] = useState(true);
  const [insightsOpen, setInsightsOpen] = useState(false);

  const [taskSheet, setTaskSheet] = useState(null);
  const [draftDueAt, setDraftDueAt] = useState(null);
  const [categorySheetOpen, setCategorySheetOpen] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);

  const saveFailureRef = useRef(false);

  useEffect(() => {
    const session = getCurrentSession();
    if (!session) {
      router.replace('/login?next=/dashboard');
      return;
    }

    setUser(session.user);
    const data = loadUserData(session.user.id);
    dispatch(tasksLoading());
    dispatch(categoriesLoading());
    dispatch(tasksLoaded(data.tasks));
    dispatch(categoriesLoaded(data.categories));
    setBooting(false);
  }, [dispatch, router]);

  useEffect(() => {
    if (!user) return undefined;
    const timer = window.setTimeout(() => setGreet(false), 1800);
    return () => window.clearTimeout(timer);
  }, [user]);

  useEffect(() => {
    const timer = window.setInterval(() => setNow(new Date()), 60000);
    return () => window.clearInterval(timer);
  }, []);

  const ready = Boolean(user) && taskStatus === 'ready' && categoryStatus === 'ready';

  useEffect(() => {
    if (!ready) return undefined;

    const timer = window.setTimeout(() => {
      const saved = saveUserData(user.id, tasks, categories);
      if (!saved && !saveFailureRef.current) {
        saveFailureRef.current = true;
        toast('This browser could not save your latest changes. Check storage settings.', {
          tone: 'error',
          duration: 6500,
        });
      }
    }, 220);

    return () => window.clearTimeout(timer);
  }, [ready, user, tasks, categories, toast]);

  useEffect(() => {
    if (mascot.mood === 'idle') return undefined;
    const timer = window.setTimeout(() => dispatch(mascotRest()), 3200);
    return () => window.clearTimeout(timer);
  }, [mascot.mood, mascot.reaction, dispatch]);

  const counts = useMemo(() => getCounts(tasks, now), [tasks, now]);
  const sidebarCounts = useMemo(() => getSidebarCounts(tasks, now), [tasks, now]);
  const todayProgress = useMemo(() => getTodayProgress(tasks, now), [tasks, now]);
  const week = useMemo(() => getWeekActivity(tasks, now), [tasks, now]);
  const upcoming = useMemo(() => getUpcomingTasks(tasks, now, 3), [tasks, now]);
  const insight = useMemo(() => getInsight(tasks, now), [tasks, now]);
  const companion = useMemo(() => getCompanionView(tasks, mascot, now), [tasks, mascot, now]);
  const categoryCounts = useMemo(() => getCategoryCounts(tasks, categories), [tasks, categories]);

  const visibleTasks = useMemo(
    () =>
      getVisibleTasks(tasks, {
        view,
        categoryId,
        status,
        query,
        sort,
        now,
      }),
    [tasks, view, categoryId, status, query, sort, now]
  );

  const completedToday = useMemo(() => {
    const needle = query.trim().toLowerCase();

    return getTodayCompleted(tasks, now)
      .filter((task) => categoryId === 'all' || task.categoryId === categoryId)
      .filter(
        (task) =>
          !needle ||
          task.title.toLowerCase().includes(needle) ||
          (task.notes || '').toLowerCase().includes(needle)
      )
      .slice(0, 3);
  }, [tasks, now, categoryId, query]);

  const activeCategory = categories.find((category) => category.id === categoryId);
  const defaultCategoryId =
    categoryId !== 'all' ? categoryId : categories[0]?.id || null;
  const isOverview = view === 'overview';
  const empty = emptyCopy({ view, query, counts, status, activeCategory });

  function closeSearch() {
    setSearchOpen(false);
    setQuery('');
  }

  function handleNavigate(nextView) {
    setView(nextView);
    setCategoryId('all');
    setStatus('all');
    closeSearch();
    setInsightsOpen(false);
    if (typeof window !== 'undefined') window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  function openNewTask(dueAt = null) {
    setInsightsOpen(false);
    setDraftDueAt(dueAt);
    setTaskSheet({ task: null });
  }

  function closeTaskSheet() {
    setTaskSheet(null);
    setDraftDueAt(null);
  }

  function openEditTask(task) {
    setInsightsOpen(false);
    setTaskSheet({ task });
  }

  function handleSelectCategory(nextCategoryId) {
    setCategoryId(nextCategoryId);
    closeSearch();
  }

  function handleSidebarCategory(nextCategoryId) {
    setCategoryId(nextCategoryId);
    setView('tasks');
    setStatus('all');
    closeSearch();
  }

  function handleSaveTask(payload) {
    const editing = taskSheet?.task;

    if (editing) {
      const updated = patchTask(editing, payload);
      dispatch(
        taskPatched({
          id: editing.id,
          changes: {
            title: updated.title,
            notes: updated.notes,
            categoryId: updated.categoryId,
            priority: updated.priority,
            dueAt: updated.dueAt,
            updatedAt: updated.updatedAt,
          },
        })
      );
      dispatch(mascotReact({ mood: 'happy', message: 'Updated. Still yours.' }));
      toast('Task updated', { tone: 'success' });
      setTaskSheet(null);
      return;
    }

    const task = createTask(payload);
    dispatch(taskAdded(task));
    dispatch(
      mascotReact({
        mood: 'cheer',
        message: "It's on the list. One less thing in your head.",
      })
    );
    toast('Task added', { tone: 'success' });
    setTaskSheet(null);
    closeSearch();

    if (status === 'done') setStatus('open');
    if (view === 'completed') setView('overview');

    if (view === 'today') {
      const due = task.dueAt ? parseISO(task.dueAt) : null;
      if (!due || !isSameDay(due, now)) setView('overview');
    }

    if (view === 'upcoming') {
      const due = task.dueAt ? parseISO(task.dueAt) : null;
      if (!due || due.getTime() <= endOfDay(now).getTime()) setView('tasks');
    }

    if (categoryId !== 'all' && task.categoryId !== categoryId) setCategoryId('all');
  }

  function handleToggle(task, completed) {
    const next = toggleTask(task, completed);

    dispatch(
      taskPatched({
        id: task.id,
        changes: {
          completed: next.completed,
          completedAt: next.completedAt,
          updatedAt: next.updatedAt,
        },
      })
    );

    if (completed) {
      const remaining = tasks.filter(
        (item) => !item.completed && item.id !== task.id
      ).length;

      dispatch(
        mascotReact({
          mood: 'cheer',
          message:
            remaining === 0
              ? 'That was the last one. The whole list is clear.'
              : 'One down. The list just got lighter.',
        })
      );

      if (remaining === 0) {
        toast("Everything's clear", { tone: 'success' });
      }

      if (typeof navigator !== 'undefined' && navigator.vibrate) navigator.vibrate(8);
    } else {
      dispatch(mascotReact({ mood: 'focus', message: 'Back on the list. No stress.' }));
    }
  }

  function handleQuickAdd(title) {
    const task = createTask({
      title,
      categoryId: categoryId !== 'all' ? categoryId : defaultCategoryId,
      priority: 'medium',
      dueAt: null,
    });

    dispatch(taskAdded(task));
    dispatch(
      mascotReact({ mood: 'happy', message: 'Captured. It will keep until you are ready.' })
    );
    toast('Task added', { tone: 'success' });
  }

  function handleStarter(payload) {
    const task = createTask(payload);
    dispatch(taskAdded(task));
    dispatch(
      mascotReact({
        mood: 'cheer',
        message: 'A small start. That is how the list gets lighter.',
      })
    );
    toast('Task added', { tone: 'success' });
  }

  function handleDelete(task) {
    dispatch(taskRemoved(task.id));
    dispatch(mascotReact({ mood: 'focus', message: 'Dropped it. Your list, your rules.' }));

    toast('Task deleted', {
      action: {
        label: 'Undo',
        icon: 'undo',
        onClick: () => {
          dispatch(taskRestored(task));
          dispatch(mascotReact({ mood: 'happy', message: 'Back where it was.' }));
          toast('Task restored', { tone: 'success' });
        },
      },
    });
  }

  function handleCreateCategory(payload) {
    const category = createCategory(payload);
    dispatch(categoryAdded(category));
    setCategorySheetOpen(false);
    setCategoryId(category.id);
    setView('tasks');
    setStatus('all');
    dispatch(
      mascotReact({
        mood: 'happy',
        message: `${category.name} has its own corner now.`,
      })
    );
    toast('Category created', { tone: 'success' });
  }

  function handleSignOut() {
    if (user) saveUserData(user.id, tasks, categories);
    logout();
    dispatch(tasksCleared());
    dispatch(categoriesCleared());
    router.replace('/');
  }

  if (booting || !user) return <BootScreen />;

  return (
    <div className="min-h-dvh">
      <Sidebar
        view={view}
        counts={sidebarCounts}
        categories={categories}
        categoryCounts={categoryCounts}
        categoryId={categoryId}
        onNavigate={handleNavigate}
        onSelectCategory={handleSidebarCategory}
        onNewCategory={() => setCategorySheetOpen(true)}
        onNewTask={openNewTask}
        onSettings={() => setSettingsOpen(true)}
        onSignOut={handleSignOut}
        user={user}
      />

      <div className="lg:pl-[252px]">
        <MobileTopbar
          user={user}
          onOpenInsights={() => setInsightsOpen(true)}
          onSettings={() => setSettingsOpen(true)}
          onSignOut={handleSignOut}
        />

        <div
          className={`mx-auto w-full max-w-[880px] px-4 pb-40 pt-5 sm:px-6 lg:px-8 lg:pb-16 lg:pt-8 ${
            contextOpen ? 'xl:max-w-[1400px]' : 'xl:max-w-[1080px]'
          }`}
          style={{ transition: 'max-width 380ms cubic-bezier(0.22, 1, 0.36, 1)' }}
        >
          <div
            className={`grid items-stretch ${
              contextOpen
                ? 'xl:grid-cols-[minmax(0,1fr)_340px] xl:gap-x-8'
                : 'xl:grid-cols-[minmax(0,1fr)_0px] xl:gap-x-0'
            }`}
            style={{
              transition:
                'grid-template-columns 380ms cubic-bezier(0.22, 1, 0.36, 1), column-gap 380ms cubic-bezier(0.22, 1, 0.36, 1)',
            }}
          >
            <main className="flex min-w-0 flex-col">
              <header className="flex items-start justify-between gap-4">
                <div className="min-w-0">
                  <p className="label-caps">
                    {isOverview ? todayLabel(now) : VIEW_META[view].label}
                  </p>
                  <h1 className="mt-2 font-display text-[27px] font-semibold leading-[1.1] tracking-[-0.045em] text-ink sm:text-[33px]">
                    {isOverview ? getGreetingLine(user.name, now) : VIEW_META[view].label}
                  </h1>
                  <p className="mt-2 max-w-[56ch] text-[12.5px] leading-5 text-ink-2">
                    {isOverview
                      ? buildDaySummary(counts, todayProgress)
                      : buildViewSummary(view, visibleTasks.length, counts, activeCategory)}
                  </p>
                </div>

                <div className="hidden shrink-0 items-center gap-2 md:flex">
                  <button
                    type="button"
                    onClick={openNewTask}
                    className="btn-primary h-10 px-4 text-[12.5px]"
                  >
                    <Icon name="plus" size={15} strokeWidth={2.1} />
                    New task
                  </button>

                  <button
                    type="button"
                    onClick={() => setContextOpen((value) => !value)}
                    aria-label={contextOpen ? 'Hide insights' : 'Show insights'}
                    aria-pressed={contextOpen}
                    className="icon-btn hidden border border-line bg-ink/[0.025] xl:inline-flex"
                  >
                    <Icon name={contextOpen ? 'panelRight' : 'panelLeft'} size={17} />
                  </button>

                  <button
                    type="button"
                    onClick={() => setInsightsOpen(true)}
                    aria-label="Open your rhythm"
                    className="icon-btn border border-line bg-ink/[0.025] xl:hidden"
                  >
                    <Icon name="panelRight" size={17} />
                  </button>
                </div>
              </header>

              {(isOverview || view === 'today') ? (
                <div className="mt-5 flex items-center gap-3">
                  <div
                    className="h-1.5 flex-1 overflow-hidden rounded-full bg-ink/[0.05]"
                    role="progressbar"
                    aria-label="Today's progress"
                    aria-valuemin={0}
                    aria-valuemax={100}
                    aria-valuenow={todayProgress.percent}
                  >
                    <motion.div
                      initial={false}
                      animate={{ width: `${todayProgress.percent}%` }}
                      transition={SPRING}
                      className="h-full rounded-full bg-gradient-to-r from-violet-deep via-violet to-cyan/70"
                    />
                  </div>
                  <p className="shrink-0 text-[10.5px] font-medium tabular-nums text-ink-3">
                    {todayProgress.total
                      ? `${todayProgress.done}/${todayProgress.total} today`
                      : 'No plan yet'}
                  </p>
                </div>
              ) : null}

              {isOverview ? (
                <div className="mt-5 flex items-center gap-3 lg:hidden">
                  <div className="h-12 w-12 shrink-0 overflow-hidden rounded-full border border-line bg-elevated/70">
                    <AnimeCompanion
                      mood={companion.mood}
                      variant="avatar"
                      className="h-12 w-12"
                      interactive={false}
                    />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-ink-3">
                      Nova
                    </p>
                    <p className="truncate text-[12px] text-ink-2">{companion.message}</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => setInsightsOpen(true)}
                    aria-label="Open your rhythm"
                    className="icon-btn shrink-0"
                  >
                    <Icon name="chevronRight" size={15} />
                  </button>
                </div>
              ) : null}

              <div className="mt-6">
                <div className="flex items-center gap-2">
                  <CategorySelect
                    categories={categories}
                    categoryCounts={categoryCounts}
                    activeId={categoryId}
                    totalOpen={counts.open}
                    onChange={handleSelectCategory}
                    onCreate={() => setCategorySheetOpen(true)}
                  />

                  <button
                    type="button"
                    onClick={() => {
                      if (searchOpen) closeSearch();
                      else setSearchOpen(true);
                    }}
                    aria-label={searchOpen ? 'Close search' : 'Search tasks'}
                    aria-pressed={searchOpen}
                    className={`icon-btn border ${
                      searchOpen
                        ? 'border-violet/25 bg-violet/10 text-violet'
                        : 'border-line bg-ink/[0.025]'
                    }`}
                  >
                    <Icon name="search" size={16} />
                  </button>

                  <div className="ml-auto flex items-center gap-2">
                    <SortMenu value={sort} onChange={setSort} />
                  </div>
                </div>

                <SearchField
                  open={searchOpen}
                  value={query}
                  onChange={setQuery}
                  onClose={closeSearch}
                />

                {view !== 'completed' ? (
                  <div className="mt-3">
                    <QuickAdd
                      categoryName={activeCategory?.name}
                      onAdd={handleQuickAdd}
                      onOpenDetails={openNewTask}
                    />
                  </div>
                ) : null}
              </div>

              <div className="mt-7 flex items-center justify-between gap-3">
                <div className="flex min-w-0 items-baseline gap-2">
                  <h2 className="truncate font-display text-[16px] font-semibold tracking-[-0.025em] text-ink">
                    {SECTION_TITLES[view]}
                  </h2>
                  <span className="text-[10.5px] tabular-nums text-ink-3">
                    {visibleTasks.length}
                  </span>
                </div>

                {view === 'tasks' ? (
                  <StatusFilter value={status} onChange={setStatus} />
                ) : (
                  <span className="shrink-0 text-[10.5px] text-ink-3">
                    {sectionCountLabel(view, visibleTasks.length, todayProgress, counts)}
                  </span>
                )}
              </div>

              <div className="mt-3">
                {taskStatus !== 'ready' ? (
                  <TaskSkeleton />
                ) : visibleTasks.length > 0 ? (
                  <TaskList
                    tasks={visibleTasks}
                    categories={categories}
                    now={now}
                    onToggle={handleToggle}
                    onEdit={openEditTask}
                    onDelete={handleDelete}
                  />
                ) : (
                  <EmptyState
                    mood={view === 'completed' ? 'happy' : 'idle'}
                    title={empty.title}
                    body={empty.body}
                    actionLabel={empty.actionLabel}
                    actionIcon={empty.actionIcon}
                    onAction={() => {
                      if (empty.action === 'clear') {
                        closeSearch();
                      } else if (empty.action === 'open') {
                        setStatus('open');
                      } else if (empty.action === 'completed') {
                        setStatus('done');
                      } else if (empty.action === 'overview') {
                        handleNavigate('overview');
                      } else {
                        openNewTask();
                      }
                    }}
                    secondaryLabel={
                      categoryId !== 'all'
                        ? 'Show all categories'
                        : view === 'tasks' && status === 'open' && counts.done > 0
                          ? 'See completed'
                          : null
                    }
                    onSecondary={() => {
                      if (categoryId !== 'all') setCategoryId('all');
                      else setStatus('done');
                    }}
                  />
                )}
              </div>

              {isOverview && completedToday.length > 0 ? (
                <section className="mt-9 border-t border-line pt-5">
                  <div className="flex items-center justify-between gap-3">
                    <div>
                      <p className="label-caps">Done today</p>
                      <h2 className="mt-1 font-display text-[16px] font-semibold tracking-[-0.025em] text-ink">
                        Small wins
                      </h2>
                    </div>
                    <button
                      type="button"
                      onClick={() => handleNavigate('completed')}
                      className="text-[11px] font-medium text-ink-3 transition-colors hover:text-ink"
                    >
                      See all
                    </button>
                  </div>
                  <div className="mt-3">
                    <TaskList
                      tasks={completedToday}
                      categories={categories}
                      now={now}
                      onToggle={handleToggle}
                      onEdit={openEditTask}
                      onDelete={handleDelete}
                    />
                  </div>
                </section>
              ) : null}

              {isOverview && !query && taskStatus === 'ready' ? (
                <WeekStrip
                  now={now}
                  tasks={tasks}
                  onPick={(date) => openNewTask(date)}
                />
              ) : null}

              {isOverview && !query && taskStatus === 'ready' && counts.total < 4 ? (
                <StarterPlan categories={categories} onPick={handleStarter} />
              ) : null}
            </main>

            <aside
              className={`hidden overflow-hidden xl:block ${
                contextOpen ? 'opacity-100' : 'pointer-events-none opacity-0'
              }`}
              style={{ transition: 'opacity 220ms ease' }}
              aria-hidden={!contextOpen}
            >
              <div className="sticky top-6 max-h-[calc(100dvh-3rem)] w-[340px] overflow-y-auto no-scrollbar pb-10">
                {contextOpen ? (
                  <ContextPanel
                    companion={companion}
                    counts={counts}
                    todayProgress={todayProgress}
                    week={week}
                    upcoming={upcoming}
                    categories={categories}
                    insight={insight}
                    greet={greet}
                    onEdit={openEditTask}
                    onNewTask={openNewTask}
                    onSeeAll={() => handleNavigate('upcoming')}
                  />
                ) : null}
              </div>
            </aside>
          </div>
        </div>
      </div>

      <MobileNav view={view} onNavigate={handleNavigate} onNewTask={openNewTask} />

      <Sheet
        open={insightsOpen}
        onClose={() => setInsightsOpen(false)}
        title="Your rhythm"
        eyebrow={todayLabel(now)}
        description="Progress, deadlines and the week, without the noise."
        width="lg"
      >
        <ContextPanel
          companion={companion}
          counts={counts}
          todayProgress={todayProgress}
          week={week}
          upcoming={upcoming}
          categories={categories}
          insight={insight}
          greet={false}
          onEdit={openEditTask}
          onNewTask={openNewTask}
          onSeeAll={() => handleNavigate('upcoming')}
        />
      </Sheet>

      <TaskSheet
        open={Boolean(taskSheet)}
        task={taskSheet?.task || null}
        categories={categories}
        defaultCategoryId={defaultCategoryId}
        initialDueAt={draftDueAt}
        onClose={closeTaskSheet}
        onSave={handleSaveTask}
        onDelete={handleDelete}
      />

      <NewCategorySheet
        open={categorySheetOpen}
        categories={categories}
        onClose={() => setCategorySheetOpen(false)}
        onCreate={handleCreateCategory}
      />

      <SettingsSheet
        open={settingsOpen}
        user={user}
        onClose={() => setSettingsOpen(false)}
        onUserUpdated={(updated) => setUser(updated)}
        onSignOut={handleSignOut}
      />
    </div>
  );
}

function buildDaySummary(counts, todayProgress) {
  if (!counts.total) return 'A clear page. Add one small thing and Nova will help you start.';
  if (!counts.open) return 'Everything is done. The whole list — go enjoy it.';

  const parts = [];
  if (todayProgress.remaining > 0) parts.push(`${todayProgress.remaining} left today`);
  if (counts.overdue > 0) parts.push(`${counts.overdue} overdue`);
  if (!parts.length) parts.push(`${counts.open} open`);
  return parts.join(' · ');
}

function buildViewSummary(view, visibleCount, counts, activeCategory) {
  const noun = visibleCount === 1 ? 'task' : 'tasks';
  const suffix = activeCategory ? ` in ${activeCategory.name}` : '';

  if (view === 'tasks') return `${visibleCount} ${noun}${suffix}`;
  if (view === 'today') {
    return counts.overdue
      ? `${visibleCount} on today's list · ${counts.overdue} overdue`
      : `${visibleCount} on today's list`;
  }
  if (view === 'upcoming') return `${visibleCount} deadline${visibleCount === 1 ? '' : 's'} ahead`;
  return `${visibleCount} finished ${noun}`;
}

function sectionCountLabel(view, visibleCount, todayProgress, counts) {
  if (view === 'overview') return `${counts.open} open`;
  if (view === 'today') return `${todayProgress.remaining} left`;
  if (view === 'completed') return `${counts.done} done`;
  if (view === 'upcoming') return `${visibleCount} ahead`;
  return `${visibleCount} tasks`;
}

function emptyCopy({ view, query, counts, status, activeCategory }) {
  if (query) {
    return {
      title: 'No matches',
      body: `Nothing matches “${query}”. Try a shorter word or clear the search.`,
      actionLabel: 'Clear search',
      actionIcon: 'x',
      action: 'clear',
    };
  }

  if (!counts.total) {
    return {
      title: 'A clear start',
      body: 'Your list is empty. Add one small thing and Nova will help you keep it light.',
      actionLabel: 'Add your first task',
      actionIcon: 'plus',
      action: 'new',
    };
  }

  if (view === 'completed') {
    return {
      title: 'No wins logged yet',
      body: 'Complete a task and it will collect here so the week adds up.',
      actionLabel: 'See open tasks',
      actionIcon: 'arrowRight',
      action: 'overview',
    };
  }

  if (view === 'tasks' && status === 'open' && counts.done > 0) {
    return {
      title: "You're clear",
      body: 'No open tasks. Review what you finished or add something small.',
      actionLabel: 'See completed',
      actionIcon: 'checkCircle',
      action: 'completed',
    };
  }

  if (view === 'today') {
    return {
      title: 'Today is clear',
      body: 'Nothing is due today or overdue. Add something or leave the space open.',
      actionLabel: 'Add a task',
      actionIcon: 'plus',
      action: 'new',
    };
  }

  if (view === 'upcoming') {
    return {
      title: 'The horizon is clear',
      body: 'No deadlines ahead. Add a due date to something when it needs one.',
      actionLabel: 'Add a task',
      actionIcon: 'plus',
      action: 'new',
    };
  }

  if (activeCategory) {
    return {
      title: `Nothing in ${activeCategory.name}`,
      body: 'A quiet category. Add a task here or switch the filter.',
      actionLabel: 'Add a task',
      actionIcon: 'plus',
      action: 'new',
    };
  }

  return {
    title: 'Nothing here yet',
    body: 'Add a task and it will show up here, with the details that matter.',
    actionLabel: 'Add a task',
    actionIcon: 'plus',
    action: 'new',
  };
}

function StatusFilter({ value, onChange }) {
  const options = [
    { value: 'all', label: 'All' },
    { value: 'open', label: 'Open' },
    { value: 'done', label: 'Done' },
  ];

  return (
    <div
      role="group"
      aria-label="Filter by completion"
      className="flex shrink-0 rounded-full border border-line bg-ink/[0.02] p-0.5"
    >
      {options.map((option) => {
        const active = value === option.value;
        return (
          <button
            key={option.value}
            type="button"
            onClick={() => onChange(option.value)}
            aria-pressed={active}
            className={`relative flex h-7 items-center rounded-full px-2.5 text-[10.5px] font-medium transition-colors ${
              active ? 'text-ink' : 'text-ink-3 hover:text-ink-2'
            }`}
          >
            {active ? (
              <motion.span
                layoutId="status-filter-active"
                transition={SPRING}
                className="absolute inset-0 rounded-full bg-ink/[0.07]"
                aria-hidden="true"
              />
            ) : null}
            <span className="relative z-10">{option.label}</span>
          </button>
        );
      })}
    </div>
  );
}

function TaskSkeleton() {
  return (
    <div className="space-y-1.5" aria-hidden="true">
      {[0, 1, 2, 3].map((item) => (
        <div key={item} className="flex items-center gap-3 rounded-2xl border border-line/60 p-3">
          <div className="skeleton h-[21px] w-[21px] rounded-full" />
          <div className="flex-1 space-y-2">
            <div className="skeleton h-3.5" style={{ width: `${58 + item * 7}%` }} />
            <div className="skeleton h-2.5 w-24" />
          </div>
        </div>
      ))}
    </div>
  );
}

function BootScreen() {
  return (
    <div className="min-h-dvh" aria-busy="true">
      <div className="fixed inset-y-0 left-0 hidden w-[252px] border-r border-line bg-surface lg:block">
        <div className="px-5 pt-6">
          <Logo />
        </div>
        <div className="mt-12 space-y-3 px-5">
          <div className="skeleton h-3 w-20" />
          <div className="skeleton h-9 w-full rounded-xl" />
          <div className="skeleton h-9 w-full rounded-xl" />
          <div className="skeleton h-9 w-full rounded-xl" />
          <div className="skeleton h-9 w-full rounded-xl" />
        </div>
      </div>
      <div className="lg:pl-[252px]">
        <div className="mx-auto w-full max-w-[1000px] px-5 py-8 sm:px-8 lg:py-12">
          <div className="skeleton h-3 w-24" />
          <div className="skeleton mt-4 h-9 w-72 max-w-full" />
          <div className="skeleton mt-3 h-3 w-52 max-w-full" />
          <div className="skeleton mt-8 h-10 w-full rounded-full" />
          <div className="mt-8 space-y-2">
            <TaskSkeleton />
          </div>
        </div>
      </div>
      <span className="sr-only">Loading your space…</span>
    </div>
  );
}
