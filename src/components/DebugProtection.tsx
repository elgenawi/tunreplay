"use client";

import { useEffect } from "react";

const DEBUG = false ; // true = active, false = inactive

export default function DebugProtection() {
  useEffect(() => {
    if (!DEBUG) return;

    // Disable right-click
    const handleContextMenu = (e: MouseEvent) => e.preventDefault();
    document.addEventListener("contextmenu", handleContextMenu);

    // Block DevTools shortcuts
    const handleKeyDown = (e: KeyboardEvent) => {
      if (
        e.ctrlKey &&
        (e.key === "u" || e.key === "s" || e.key === "i" || e.key === "j" || e.key === "c")
      ) {
        e.preventDefault();
      }
      if (
        e.key === "F12" || 
        (e.ctrlKey && e.shiftKey && (e.key === "I" || e.key === "C" || e.key === "J"))
      ) {
        e.preventDefault();
      }
    };
    document.addEventListener("keydown", handleKeyDown);

    // Detect DevTools Open
    const detectDevTools = setInterval(() => {
      if (!DEBUG) return;
      
      const before = performance.now();
      debugger; // Forces a pause when DevTools is open
      const after = performance.now();
      if (after - before > 100) {
        window.location.href = "/blocked"; // Redirect if DevTools is detected
      }
    }, 2000);

    return () => {
      clearInterval(detectDevTools);
      document.removeEventListener("contextmenu", handleContextMenu);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  return null;
}
