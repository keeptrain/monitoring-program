"use client";

import { RefObject, useEffect, useRef, useState } from "react";

type UseInViewOnceOptions = IntersectionObserverInit;

export function useInViewOnce<T extends HTMLElement>(
  options?: UseInViewOnceOptions,
): {
  ref: RefObject<T | null>;
  isInView: boolean;
} {
  const ref = useRef<T | null>(null);
  const [isInView, setIsInView] = useState(false);

  useEffect(() => {
    const target = ref.current;
    if (!target || isInView) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsInView(true);
          observer.disconnect();
        }
      },
      {
        root: options?.root ?? null,
        rootMargin: options?.rootMargin ?? "0px",
        threshold: options?.threshold ?? 0,
      },
    );

    observer.observe(target);
    return () => observer.disconnect();
  }, [isInView, options?.root, options?.rootMargin, options?.threshold]);

  return { ref, isInView };
}
