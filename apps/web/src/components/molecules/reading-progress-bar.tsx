"use client";

import { useEffect, useState } from "react";

export function ReadingProgressBar(): React.JSX.Element {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    function handleScroll(): void {
      const scrollTop = window.scrollY;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      if (docHeight <= 0) {
        setProgress(0);
        return;
      }
      setProgress(Math.min(100, Math.max(0, (scrollTop / docHeight) * 100)));
    }

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div className="fixed top-0 left-0 right-0 z-50 h-[3px]" aria-hidden>
      <div
        className="h-full bg-gradient-to-r from-sky-500 to-sky-400 transition-[width] duration-150 ease-out"
        style={{ width: `${progress}%` }}
      />
    </div>
  );
}
