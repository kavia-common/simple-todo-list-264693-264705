"use client";

import React from "react";
import type { Todo } from "@/types/todo";
import TodoItem from "./TodoItem";

type Props = {
  todos: Todo[];
  onToggle: (id: string) => void;
  onUpdate: (id: string, patch: { title?: string; note?: string }) => void;
  onDelete: (id: string) => void;
  onMoveUp: (id: string) => void;
  onMoveDown: (id: string) => void;
};

/**
 * PUBLIC_INTERFACE
 * TodoList renders a list of todos and an empty state when none are present.
 */
export default function TodoList({
  todos,
  onToggle,
  onUpdate,
  onDelete,
  onMoveUp,
  onMoveDown,
}: Props) {
  if (todos.length === 0) {
    return (
      <div className="card p-6 text-center text-gray-600">
        <p>No todos yet. Add your first task above.</p>
      </div>
    );
  }

  return (
    <section aria-label="Todo list" className="card p-2 sm:p-3">
      <ul role="list" className="flex flex-col divide-y divide-gray-100">
        {todos.map((t, idx) => (
          <TodoItem
            key={t.id}
            todo={t}
            onToggle={onToggle}
            onUpdate={onUpdate}
            onDelete={onDelete}
            onMoveUp={onMoveUp}
            onMoveDown={onMoveDown}
            index={idx}
            total={todos.length}
          />
        ))}
      </ul>
    </section>
  );
}
