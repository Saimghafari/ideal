"use client";

import { useEffect, useRef } from "react";

/** Poll only while this page is mounted and the browser tab is visible. */
export default function useVisiblePoll(callback, delay, immediate = true) {
  const saved = useRef(callback);
  saved.current = callback;

  useEffect(() => {
    if (!delay) return undefined;

    let timer = null;

    const tick = () => {
      if (document.visibilityState !== "visible") return;
      saved.current();
    };

    const stop = () => {
      if (timer) window.clearInterval(timer);
      timer = null;
    };

    const start = (runNow) => {
      if (timer || document.visibilityState !== "visible") return;
      if (runNow) tick();
      timer = window.setInterval(tick, delay);
    };

    const onVisibility = () => {
      if (document.visibilityState === "visible") start(true);
      else stop();
    };

    start(immediate);
    document.addEventListener("visibilitychange", onVisibility);
    return () => {
      stop();
      document.removeEventListener("visibilitychange", onVisibility);
    };
  }, [delay, immediate]);
}
