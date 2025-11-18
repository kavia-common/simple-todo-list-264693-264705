"use client";

import React, { Suspense, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import TodoForm from "@/components/TodoForm";
import Toolbar from "@/components/Toolbar";
import TodoList from "@/components/TodoList";
import { useTodos } from "@/hooks/useTodos";

function HomeInner() {
  const {
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
  } = useTodos();

  const params = useSearchParams();
  const router = useRouter();

  // Initialize filter from URL (client-only)
  useEffect(() => {
    const f = params.get("filter");
    if (f === "active" || f === "completed" || f === "all") {
      setFilter(f);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // run once after mount

  // Optionally sync filter to query string without full reload
  useEffect(() => {
    const current = params.get("filter");
    if (current !== filter) {
      const usp = new URLSearchParams(params.toString());
      if (filter === "all") {
        usp.delete("filter");
      } else {
        usp.set("filter", filter);
      }
      router.replace(`/?${usp.toString()}`, { scroll: false });
    }
  }, [filter, params, router]);

  return (
    <div className="flex flex-col gap-4">
      {storageReset && (
        <div
          role="status"
          aria-live="polite"
          className="rounded-md border border-amber-200 bg-amber-50 px-3 py-2 text-sm text-amber-900"
        >
          Local data was reset due to a storage error. You can continue using the app normally.
        </div>
      )}

      <TodoForm onAdd={addTodo} />

      <Toolbar
        filter={filter as "all" | "active" | "completed"}
        onFilterChange={setFilter}
        search={search}
        onSearchChange={setSearch}
        remainingCount={remainingCount}
        onClearCompleted={clearCompleted}
        onBulkToggle={bulkToggle}
      />

      <TodoList
        todos={filteredTodos}
        onToggle={toggleTodo}
        onUpdate={updateTodo}
        onDelete={deleteTodo}
        onMoveUp={moveUp}
        onMoveDown={moveDown}
      />
    </div>
  );
}

export default function Home() {
  return (
    <Suspense fallback={<div className="text-sm text-gray-600">Loading…</div>}>
      <HomeInner />
    </Suspense>
  );
}
