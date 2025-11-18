"use client";

import React, { useEffect, useRef, useState } from "react";
import type { Todo } from "@/types/todo";

type Props = {
  todo: Todo;
  onToggle: (id: string) => void;
  onUpdate: (id: string, patch: { title?: string; note?: string }) => void;
  onDelete: (id: string) => void;
  onMoveUp: (id: string) => void;
  onMoveDown: (id: string) => void;
  index: number;
  total: number;
};

/**
 * PUBLIC_INTERFACE
 * TodoItem renders an accessible list item with toggle, edit, note visibility, delete and reordering.
 */
export default function TodoItem({
  todo,
  onToggle,
  onUpdate,
  onDelete,
  onMoveUp,
  onMoveDown,
  index,
  total,
}: Props) {
  const [editing, setEditing] = useState(false);
  const [draftTitle, setDraftTitle] = useState(todo.title);
  const [showNote, setShowNote] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (editing) inputRef.current?.focus();
  }, [editing]);

  useEffect(() => {
    setDraftTitle(todo.title);
  }, [todo.title]);

  const save = () => {
    const trimmed = draftTitle.trim();
    if (!trimmed) {
      setEditing(false);
      setDraftTitle(todo.title);
      return;
    }
    onUpdate(todo.id, { title: trimmed });
    setEditing(false);
  };

  const cancel = () => {
    setEditing(false);
    setDraftTitle(todo.title);
  };

  const onKeyDownTitle = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      save();
    } else if (e.key === "Escape") {
      e.preventDefault();
      cancel();
    }
  };

  return (
    <li
      role="listitem"
      className="flex flex-col gap-2 rounded-lg border border-gray-200 bg-white px-3 py-3"
    >
      <div className="flex items-start gap-3">
        <input
          id={`toggle-${todo.id}`}
          type="checkbox"
          checked={todo.completed}
          onChange={() => onToggle(todo.id)}
          aria-label={todo.completed ? "Mark as active" : "Mark as completed"}
          className="mt-1 size-4 accent-blue-600"
        />
        <div className="flex-1">
          {!editing ? (
            <div className="flex items-start justify-between gap-2">
              <button
                type="button"
                className={`text-left flex-1 ${todo.completed ? "line-through text-gray-400" : "text-gray-900"}`}
                onDoubleClick={() => setEditing(true)}
                aria-label={`Todo: ${todo.title}`}
                title="Double click to edit"
              >
                {todo.title}
              </button>
              <div className="flex items-center gap-1">
                <button
                  type="button"
                  className="btn-ghost"
                  onClick={() => setShowNote((v) => !v)}
                  aria-expanded={showNote}
                  aria-controls={`note-${todo.id}`}
                >
                  {showNote ? "Hide note" : "Show note"}
                </button>
                <button
                  type="button"
                  className="btn-ghost"
                  onClick={() => setEditing(true)}
                  aria-label="Edit todo"
                >
                  Edit
                </button>
                <button
                  type="button"
                  className="btn-ghost"
                  onClick={() => onMoveUp(todo.id)}
                  aria-label="Move up"
                  disabled={index === 0}
                  title="Move up"
                >
                  ↑
                </button>
                <button
                  type="button"
                  className="btn-ghost"
                  onClick={() => onMoveDown(todo.id)}
                  aria-label="Move down"
                  disabled={index === total - 1}
                  title="Move down"
                >
                  ↓
                </button>
                <button
                  type="button"
                  className="btn-ghost text-red-600 hover:text-red-700"
                  onClick={() => {
                    if (confirm("Delete this todo?")) onDelete(todo.id);
                  }}
                  aria-label="Delete todo"
                >
                  Delete
                </button>
              </div>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <label htmlFor={`edit-${todo.id}`} className="sr-only">
                Edit title
              </label>
              <input
                id={`edit-${todo.id}`}
                ref={inputRef}
                className="input flex-1"
                value={draftTitle}
                onChange={(e) => setDraftTitle(e.target.value)}
                onKeyDown={onKeyDownTitle}
              />
              <button type="button" className="btn btn-primary" onClick={save}>
                Save
              </button>
              <button type="button" className="btn-ghost" onClick={cancel}>
                Cancel
              </button>
            </div>
          )}
          {todo.note && showNote && (
            <p id={`note-${todo.id}`} className="mt-1 text-sm text-gray-600">
              {todo.note}
            </p>
          )}
        </div>
      </div>
    </li>
  );
}
