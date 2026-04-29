import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { startTransition, useCallback, useMemo } from "react";

type SearchParamsObject = Record<string, string | number | boolean | undefined>;

/**
 * Utility hook for managing URL search parameters efficiently.
 * Provides getters and setters for query params with automatic URL updates.
 * Optimized with useTransition for fluid UI and usePathname for robust navigation.
 */
export function useURLSearchParams<
  T extends SearchParamsObject = SearchParamsObject,
>() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  // Create a stable object from search params for easy access (Derived State)
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
    (
      key: keyof T,
      defaultValue?: string | number | boolean,
    ): string | number | boolean | undefined => {
      const value = searchParams.get(String(key));
      return value ?? defaultValue;
    },
    [searchParams],
  );

  /**
   * Set single or multiple parameters and update URL with transition
   */
  const setParams = useCallback(
    (
      updates: Partial<T>,
      options?: { resetPage?: boolean; replace?: boolean },
    ) => {
      const { resetPage = true, replace = true } = options || {};
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
      if (resetPage && !("page" in updates)) {
        newParams.set("page", "1");
      }

      const queryString = newParams.toString();
      const url = queryString ? `${pathname}?${queryString}` : pathname;

      // Wrap in transition to prevent UI blocking during navigation (Rule 2.5)
      startTransition(() => {
        if (replace) {
          router.replace(url, { scroll: false });
        } else {
          router.push(url, { scroll: false });
        }
      });
    },
    [searchParams, router, pathname],
  );

  /**
   * Clear all parameters or specific ones
   */
  const clearParams = useCallback(
    (keys?: (keyof T)[], options?: { replace?: boolean }) => {
      const { replace = true } = options || {};
      const newParams = new URLSearchParams(searchParams);

      if (keys) {
        keys.forEach((key) => newParams.delete(String(key)));
      } else {
        // Clear all (except logic specific ones if needed)
        newParams.forEach((_, key) => newParams.delete(key));
      }

      const queryString = newParams.toString();
      const url = queryString ? `${pathname}?${queryString}` : pathname;

      startTransition(() => {
        if (replace) {
          router.replace(url, { scroll: false });
        } else {
          router.push(url, { scroll: false });
        }
      });
    },
    [searchParams, router, pathname],
  );

  return {
    params,
    getParam,
    setParams,
    clearParams,
  };
}
