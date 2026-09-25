"use client";

import { useEffect } from "react";

/**
 * One automatic reload after a cold-start load failure.
 * Avoids infinite loops via sessionStorage.
 */
const AutoRetryOnce = ({ storageKey }) => {
  useEffect(() => {
    if (typeof window === "undefined") return;

    const key = `nn-retry:${storageKey}`;
    if (sessionStorage.getItem(key)) return;

    sessionStorage.setItem(key, "1");
    const timer = setTimeout(() => {
      window.location.reload();
    }, 1200);

    return () => clearTimeout(timer);
  }, [storageKey]);

  return null;
};

export default AutoRetryOnce;
