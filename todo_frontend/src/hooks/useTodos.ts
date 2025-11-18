"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useLocalStorage } from "./useLocalStorage";
import type { Todo } from "@/types/todo";

type Filter = "all" | "active" | "completed";

const TITLE_MAX = 200;
const NOTE_MAX = 2000;

function sanitizeText(input: string, maxLen: number) {
  // Remove control characters except \n and \t
  const cleaned = input.replace(/[^\P{C}\n\t]/gu, "");
  return cleaned.trim().slice(0, maxLen);
}

/**
 * PUBLIC_INTERFACE
 * useTodos manages a todo list with localStorage persistence and derived UI state.
 *
 * Exposes CRUD operations, filter/search, counts, and a soft error flag when storage resets.
 */
export function useTodos() {
  const [todos, setTodos] = useLocalStorage<Todo[]>("todos:v1", []);
  const [filter, setFilter] = useLocalStorage<Filter>("todos:filter", "all");
  const [search, setSearch] = useState<string>("");
  const [storageReset, setStorageReset] = useState<boolean>(false);

  // Detect corrupted storage and reset defensively
  const parsedOnce = useRef(false);
  useEffect(() => {
    if (parsedOnce.current) return;
    parsedOnce.current = true;
    try {
      // re-read to test parse
      if (typeof window !== "undefined") {
        const raw = window.localStorage.getItem("todos:v1");
        if (raw) JSON.parse(raw);
      }
    } catch {
      setTodos([]);
      setStorageReset(true);
    }
  }, [setTodos]);

  const addTodo = (title: string, note?: string) => {
    const sTitle = sanitizeText(title, TITLE_MAX);
    const sNote = note ? sanitizeText(note, NOTE_MAX) : undefined;
    if (!sTitle) return;
    const now = new Date().toISOString();
    const newTodo: Todo = {
      id: crypto.randomUUID(),
      title: sTitle,
      note: sNote,
      completed: false,
      createdAt: now,
      updatedAt: now,
    };
    setTodos((prev) => [newTodo, ...prev]);
  };

  const updateTodo = (id: string, patch: Partial<Pick<Todo, "title" | "note">>) => {
    setTodos((prev) =>
      prev.map((t) => {
        if (t.id !== id) return t;
        const next: Todo = {
          ...t,
          title: patch.title !== undefined ? sanitizeText(patch.title, TITLE_MAX) : t.title,
          note:
            patch.note !== undefined
              ? sanitizeText(patch.note ?? "", NOTE_MAX) || undefined
              : t.note,
          updatedAt: new Date().toISOString(),
        };
        return next;
      })
    );
  };

  const toggleTodo = (id: string) => {
    setTodos((prev) =>
      prev.map((t) =>
        t.id === id ? { ...t, completed: !t.completed, updatedAt: new Date().toISOString() } : t
      )
    );
  };

  const deleteTodo = (id: string) => {
    setTodos((prev) => prev.filter((t) => t.id !== id));
  };

  const clearCompleted = () => {
    setTodos((prev) => prev.filter((t) => !t.completed));
  };

  const bulkToggle = (completeAll: boolean) => {
    setTodos((prev) => prev.map((t) => ({ ...t, completed: completeAll, updatedAt: new Date().toISOString() })));
  };

  const moveUp = (id: string) => {
    setTodos((prev) => {
      const idx = prev.findIndex((t) => t.id === id);
      if (idx <= 0) return prev;
      const next = [...prev];
      const [item] = next.splice(idx, 1);
      next.splice(idx - 1, 0, item);
      return next;
    });
  };

  const moveDown = (id: string) => {
    setTodos((prev) => {
      const idx = prev.findIndex((t) => t.id === id);
      if (idx === -1 || idx >= prev.length - 1) return prev;
      const next = [...prev];
      const [item] = next.splice(idx, 1);
      next.splice(idx + 1, 0, item);
      return next;
    });
  };

  const remainingCount = useMemo(() => todos.filter((t) => !t.completed).length, [todos]);

  const filteredTodos = useMemo(() => {
    let list = todos;
    if (filter === "active") list = list.filter((t) => !t.completed);
    if (filter === "completed") list = list.filter((t) => t.completed);
    if (search.trim()) {
      const q = search.trim().toLowerCase();
      list = list.filter(
        (t) =>
          t.title.toLowerCase().includes(q) ||
          (t.note ? t.note.toLowerCase().includes(q) : false)
      );
    }
    return list;
  }, [todos, filter, search]);

  return {
    todos,
    filteredTodos,
    remainingCount,
    filter,
    search,
    storageReset,

    addTodo,
    updateTodo,
    toggleTodo,
    deleteTodo,
    clearCompleted,
    bulkToggle,
    moveUp,
    moveDown,

    setFilter,
    setSearch,
  };
}
