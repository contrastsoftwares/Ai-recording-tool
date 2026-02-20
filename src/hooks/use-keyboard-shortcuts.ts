"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export function useKeyboardShortcuts() {
  const router = useRouter();

  useEffect(() => {
    function handleKeyDown(event: KeyboardEvent) {
      const isModifier = event.metaKey || event.ctrlKey;
      if (!isModifier) return;

      // Ignore if user is typing in an input, textarea, or contenteditable
      const target = event.target as HTMLElement;
      if (
        target.tagName === "INPUT" ||
        target.tagName === "TEXTAREA" ||
        target.isContentEditable
      ) {
        return;
      }

      switch (event.key.toLowerCase()) {
        case "k": {
          // Cmd/Ctrl + K: Focus search
          event.preventDefault();
          window.dispatchEvent(new CustomEvent("focus-search"));
          break;
        }
        case "n": {
          // Cmd/Ctrl + N: Navigate to new note
          event.preventDefault();
          router.push("/notes/new");
          break;
        }
        case "r": {
          // Cmd/Ctrl + R: Navigate to recorder
          // Only intercept if Shift is not held (Shift+Cmd+R is hard reload)
          if (!event.shiftKey) {
            event.preventDefault();
            router.push("/recorder");
          }
          break;
        }
      }
    }

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [router]);
}
