'use client';

import { AnimatePresence } from 'framer-motion';
import TaskRow from '@/components/dashboard/TaskRow';

export default function TaskList({ tasks, categories, now, onToggle, onEdit, onDelete }) {
  const categoryMap = new Map(categories.map((category) => [category.id, category]));

  return (
    <ul className="space-y-1.5" aria-label="Tasks">
      <AnimatePresence initial={false}>
        {tasks.map((task) => (
          <TaskRow
            key={task.id}
            task={task}
            category={categoryMap.get(task.categoryId)}
            now={now}
            onToggle={onToggle}
            onEdit={onEdit}
            onDelete={onDelete}
          />
        ))}
      </AnimatePresence>
    </ul>
  );
}
