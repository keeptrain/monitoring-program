"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useCallback, useMemo } from "react";

type SearchParamsObject = Record<string, string | number | boolean | undefined>;

/**
 * Utility hook for managing URL search parameters efficiently.
 * Provides getters and setters for query params with automatic URL updates.
 */
export function useURLSearchParams<T extends SearchParamsObject = SearchParamsObject>() {
  const router = useRouter();
  const searchParams = useSearchParams();

  // Create a stable object from search params for easy access
  const params = useMemo(() => {
    const obj: Record<string, string> = {};
    searchParams.forEach((value, key) => {
      obj[key] = value;
    });
    return obj as T;
  }, [searchParams]);

  /**
   * Get a single parameter value
   */
  const getParam = useCallback(
    (key: keyof T, defaultValue?: string | number | boolean): string | number | boolean | undefined => {
      const value = searchParams.get(String(key));
      return value ?? defaultValue;
    },
    [searchParams],
  );

  /**
   * Set single or multiple parameters and update URL
   */
  const setParams = useCallback(
    (updates: Partial<T>, resetPage = true) => {
      const newParams = new URLSearchParams(searchParams);

      // Update parameters
      Object.entries(updates).forEach(([key, value]) => {
        if (value === undefined || value === null || value === "") {
          newParams.delete(key);
        } else {
          newParams.set(key, String(value));
        }
      });

      // Reset to page 1 when filter changes (optional)
      if (resetPage && "page" in updates === false) {
        newParams.set("page", "1");
      }

      // Build new URL
      const newUrl = newParams.toString() ? `?${newParams.toString()}` : "";
      router.push(newUrl || "?");
    },
    [searchParams, router],
  );

  /**
   * Clear all parameters or specific ones
   */
  const clearParams = useCallback(
    (keys?: (keyof T)[]) => {
      const newParams = new URLSearchParams(searchParams);

      if (keys) {
        keys.forEach((key) => newParams.delete(String(key)));
      } else {
        // Clear all
        newParams.forEach((_, key) => newParams.delete(key));
      }

      const newUrl = newParams.toString() ? `?${newParams.toString()}` : "";
      router.push(newUrl || "?");
    },
    [searchParams, router],
  );

  return {
    params,
    getParam,
    setParams,
    clearParams,
  };
}
