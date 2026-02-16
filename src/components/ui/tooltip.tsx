"use client";

import * as React from "react";
import { createPortal } from "react-dom";
import { cn } from "@/lib/utils";

interface TooltipContextValue {
  open: boolean;
  setOpen: (open: boolean) => void;
  triggerRef: React.RefObject<HTMLElement | null>;
}

const TooltipContext = React.createContext<TooltipContextValue>({
  open: false,
  setOpen: () => {},
  triggerRef: { current: null },
});

function useTooltip() {
  return React.useContext(TooltipContext);
}

interface TooltipProps {
  children: React.ReactNode;
  delayDuration?: number;
}

function Tooltip({ children, delayDuration = 300 }: TooltipProps) {
  const [open, setOpen] = React.useState(false);
  const triggerRef = React.useRef<HTMLElement | null>(null);
  const timeoutRef = React.useRef<ReturnType<typeof setTimeout>>(undefined);

  const handleSetOpen = React.useCallback(
    (value: boolean) => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
      if (value) {
        timeoutRef.current = setTimeout(() => setOpen(true), delayDuration);
      } else {
        setOpen(false);
      }
    },
    [delayDuration]
  );

  React.useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  return (
    <TooltipContext.Provider value={{ open, setOpen: handleSetOpen, triggerRef }}>
      {children}
    </TooltipContext.Provider>
  );
}
Tooltip.displayName = "Tooltip";

interface TooltipTriggerProps extends React.HTMLAttributes<HTMLDivElement> {
  asChild?: boolean;
}

const TooltipTrigger = React.forwardRef<HTMLDivElement, TooltipTriggerProps>(
  ({ children, asChild, ...props }, ref) => {
    const { setOpen, triggerRef } = useTooltip();

    const combinedRef = React.useCallback(
      (node: HTMLDivElement | null) => {
        (triggerRef as React.MutableRefObject<HTMLElement | null>).current = node;
        if (typeof ref === "function") {
          ref(node);
        } else if (ref) {
          (ref as React.MutableRefObject<HTMLDivElement | null>).current = node;
        }
      },
      [ref, triggerRef]
    );

    return (
      <div
        ref={combinedRef}
        onMouseEnter={() => setOpen(true)}
        onMouseLeave={() => setOpen(false)}
        onFocus={() => setOpen(true)}
        onBlur={() => setOpen(false)}
        {...props}
      >
        {children}
      </div>
    );
  }
);
TooltipTrigger.displayName = "TooltipTrigger";

interface TooltipContentProps extends React.HTMLAttributes<HTMLDivElement> {
  side?: "top" | "bottom" | "left" | "right";
  sideOffset?: number;
}

const TooltipContent = React.forwardRef<HTMLDivElement, TooltipContentProps>(
  ({ className, children, side = "top", sideOffset = 4, ...props }, ref) => {
    const { open, triggerRef } = useTooltip();
    const [mounted, setMounted] = React.useState(false);
    const [position, setPosition] = React.useState({ top: 0, left: 0 });
    const contentRef = React.useRef<HTMLDivElement | null>(null);

    React.useEffect(() => {
      setMounted(true);
    }, []);

    React.useEffect(() => {
      if (!open || !triggerRef.current) return;

      const updatePosition = () => {
        const trigger = triggerRef.current;
        const content = contentRef.current;
        if (!trigger || !content) return;

        const triggerRect = trigger.getBoundingClientRect();
        const contentRect = content.getBoundingClientRect();

        let top = 0;
        let left = 0;

        switch (side) {
          case "top":
            top = triggerRect.top - contentRect.height - sideOffset;
            left = triggerRect.left + (triggerRect.width - contentRect.width) / 2;
            break;
          case "bottom":
            top = triggerRect.bottom + sideOffset;
            left = triggerRect.left + (triggerRect.width - contentRect.width) / 2;
            break;
          case "left":
            top = triggerRect.top + (triggerRect.height - contentRect.height) / 2;
            left = triggerRect.left - contentRect.width - sideOffset;
            break;
          case "right":
            top = triggerRect.top + (triggerRect.height - contentRect.height) / 2;
            left = triggerRect.right + sideOffset;
            break;
        }

        setPosition({ top, left });
      };

      // Use requestAnimationFrame to get accurate dimensions after render
      requestAnimationFrame(updatePosition);
    }, [open, side, sideOffset, triggerRef]);

    const combinedRef = React.useCallback(
      (node: HTMLDivElement | null) => {
        contentRef.current = node;
        if (typeof ref === "function") {
          ref(node);
        } else if (ref) {
          (ref as React.MutableRefObject<HTMLDivElement | null>).current = node;
        }
      },
      [ref]
    );

    if (!mounted || !open) return null;

    return createPortal(
      <div
        ref={combinedRef}
        role="tooltip"
        style={{ position: "fixed", top: position.top, left: position.left }}
        className={cn(
          "z-50 overflow-hidden rounded-md bg-primary px-3 py-1.5 text-xs text-primary-foreground animate-in fade-in-0",
          className
        )}
        {...props}
      >
        {children}
      </div>,
      document.body
    );
  }
);
TooltipContent.displayName = "TooltipContent";

export { Tooltip, TooltipTrigger, TooltipContent };
