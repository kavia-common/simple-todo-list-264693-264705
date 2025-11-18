"use client";

import React, { useEffect, useRef, useState } from "react";

type Props = {
  onAdd: (title: string, note?: string) => void;
};

/**
 * PUBLIC_INTERFACE
 * TodoForm provides controls to add a new todo with an optional note.
 * - Enter submits when focus is on title field
 * - Button submits
 * - After add, clears inputs and focuses back to title
 */
export default function TodoForm({ onAdd }: Props) {
  const [title, setTitle] = useState("");
  const [note, setNote] = useState("");
  const [expanded, setExpanded] = useState(false);
  const [announce, setAnnounce] = useState("");
  const titleRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (announce) {
      const t = setTimeout(() => setAnnounce(""), 1500);
      return () => clearTimeout(t);
    }
  }, [announce]);

  const submit = () => {
    const trimmed = title.trim();
    if (!trimmed) return;
    onAdd(trimmed, note.trim() ? note : undefined);
    setTitle("");
    setNote("");
    setExpanded(false);
    setAnnounce("Todo added");
    titleRef.current?.focus();
  };

  const onKeyDownTitle = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      submit();
    }
  };

  return (
    <section aria-label="Add new todo" className="card p-4 sm:p-6 mb-6">
      <div className="flex flex-col gap-3">
        <div className="flex items-center gap-2">
          <label htmlFor="todo-title" className="sr-only">
            Todo title
          </label>
          <input
            id="todo-title"
            ref={titleRef}
            className="input flex-1"
            placeholder="What needs to be done?"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            onKeyDown={onKeyDownTitle}
            aria-label="Todo title"
          />
          <button
            type="button"
            className="btn btn-primary"
            onClick={submit}
            disabled={!title.trim()}
            aria-disabled={!title.trim()}
            aria-label="Add todo"
          >
            Add
          </button>
        </div>
        <div>
          <button
            type="button"
            className="btn-ghost"
            onClick={() => setExpanded((v) => !v)}
            aria-expanded={expanded}
            aria-controls="todo-note"
          >
            {expanded ? "Hide note" : "Add note"}
          </button>
        </div>
        {expanded && (
          <div>
            <label htmlFor="todo-note" className="sr-only">
              Todo note
            </label>
            <textarea
              id="todo-note"
              className="textarea"
              placeholder="Additional details (optional)"
              rows={3}
              value={note}
              onChange={(e) => setNote(e.target.value)}
              aria-label="Todo note"
            />
          </div>
        )}
        <p className="sr-only" role="status" aria-live="polite">
          {announce}
        </p>
      </div>
    </section>
  );
}
