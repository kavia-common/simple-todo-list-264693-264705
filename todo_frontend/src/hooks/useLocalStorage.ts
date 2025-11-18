"use client";

import { useCallback, useEffect, useRef, useState } from "react";

/**
 * PUBLIC_INTERFACE
 * useLocalStorage is a generic React hook to persist and hydrate state in localStorage safely.
 *
 * - Guards SSR by returning initial value on server (no window access).
 * - Parses/serializes JSON with try/catch.
 * - Listens to 'storage' events to sync state across tabs.
 *
 * @param key storage key
 * @param initial initial value or lazy initializer
 */
export function useLocalStorage<T>(key: string, initial: T | (() => T)) {
  const isClient = typeof window !== "undefined";
  const initRef = useRef(false);

  const getInitial = useCallback((): T => {
    try {
      if (!isClient) {
        return typeof initial === "function" ? (initial as () => T)() : initial;
      }
      const raw = window.localStorage.getItem(key);
      if (raw == null) {
        const value = typeof initial === "function" ? (initial as () => T)() : initial;
        window.localStorage.setItem(key, JSON.stringify(value));
        return value;
      }
      return JSON.parse(raw) as T;
    } catch {
      // If parsing fails, reset to initial to avoid breaking UI
      try {
        const value = typeof initial === "function" ? (initial as () => T)() : initial;
        if (isClient) window.localStorage.setItem(key, JSON.stringify(value));
        return value;
      } catch {
        // fallback in case initial itself is not serializable
        return typeof initial === "function" ? (initial as () => T)() : initial;
      }
    }
  }, [isClient, key, initial]);

  const [value, setValue] = useState<T>(getInitial);

  // Sync to storage when value changes
  useEffect(() => {
    if (!isClient) return;
    if (!initRef.current) {
      initRef.current = true;
      return;
    }
    try {
      window.localStorage.setItem(key, JSON.stringify(value));
    } catch {
      // Swallow errors (quota etc.)
    }
  }, [isClient, key, value]);

  // Cross-tab sync
  useEffect(() => {
    if (!isClient) return;
    const onStorage = (e: StorageEvent) => {
      if (e.key === key && e.newValue) {
        try {
          setValue(JSON.parse(e.newValue));
        } catch {
          // ignore invalid
        }
      }
    };
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, [isClient, key]);

  return [value, setValue] as const;
}
