"use client";

import React, { useEffect, useMemo, useState } from "react";

type Filter = "all" | "active" | "completed";

type Props = {
  filter: Filter;
  onFilterChange: (f: Filter) => void;
  search: string;
  onSearchChange: (q: string) => void;
  remainingCount: number;
  onClearCompleted: () => void;
  onBulkToggle: (completeAll: boolean) => void;
};

/**
 * PUBLIC_INTERFACE
 * Toolbar offers filter tabs, remaining count, search, clear completed, and bulk toggle
 */
export default function Toolbar({
  filter,
  onFilterChange,
  search,
  onSearchChange,
  remainingCount,
  onClearCompleted,
  onBulkToggle,
}: Props) {
  const [completeAll, setCompleteAll] = useState(false);

  const filters: { key: Filter; label: string }[] = useMemo(
    () => [
      { key: "all", label: "All" },
      { key: "active", label: "Active" },
      { key: "completed", label: "Completed" },
    ],
    []
  );

  useEffect(() => {
    // Keep bulk toggle button label intuitive based on current state
    setCompleteAll(false);
  }, [filter, search]);

  return (
    <section className="card p-4 sm:p-5 mb-6" aria-label="Todo filters and actions">
      <div className="flex flex-col gap-4">
        <div className="flex items-center justify-between gap-2">
          <div className="inline-flex rounded-lg border border-gray-200 p-1 bg-white" role="tablist" aria-label="Filter todos">
            {filters.map((f) => {
              const active = filter === f.key;
              return (
                <button
                  key={f.key}
                  role="tab"
                  aria-selected={active}
                  className={`px-3 py-1.5 text-sm rounded-md transition-colors ${active ? "bg-blue-50 text-blue-700" : "text-gray-600 hover:text-gray-900"}`}
                  onClick={() => onFilterChange(f.key)}
                >
                  {f.label}
                </button>
              );
            })}
          </div>
          <div className="text-sm text-gray-600" aria-live="polite" aria-atomic>
            {remainingCount} item{remainingCount === 1 ? "" : "s"} left
          </div>
        </div>
        <div className="flex items-center gap-2">
          <label htmlFor="todo-search" className="sr-only">
            Search todos
          </label>
          <input
            id="todo-search"
            className="input"
            placeholder="Search by title or note..."
            value={search}
            onChange={(e) => onSearchChange(e.target.value)}
          />
          <button
            type="button"
            className="btn btn-danger"
            onClick={onClearCompleted}
            aria-label="Clear completed todos"
            title="Clear completed"
          >
            Clear Completed
          </button>
          <button
            type="button"
            className="btn btn-primary"
            onClick={() => {
              onBulkToggle(!completeAll);
              setCompleteAll(!completeAll);
            }}
            aria-label={completeAll ? "Mark all as active" : "Mark all as completed"}
            title={completeAll ? "Mark all as active" : "Mark all as completed"}
          >
            {completeAll ? "Uncomplete All" : "Complete All"}
          </button>
        </div>
      </div>
    </section>
  );
}
