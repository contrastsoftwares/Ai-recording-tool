import { cn } from "@/lib/utils";

interface GhostLogoProps {
  className?: string;
  size?: number;
  /** Title for accessibility; omit for decorative use. */
  title?: string;
}

/**
 * Study Ghost mascot — a friendly 2D ghost facing slightly left with a wide
 * smile and sharp little teeth. Body uses `currentColor` (set it gold via
 * `text-primary`), with black facial features and white highlights.
 */
export function GhostLogo({ className, size = 32, title }: GhostLogoProps) {
  return (
    <svg
      viewBox="0 0 64 64"
      width={size}
      height={size}
      className={cn("text-primary", className)}
      role={title ? "img" : "presentation"}
      aria-label={title}
      aria-hidden={title ? undefined : true}
      fill="none"
    >
      {/* Body */}
      <path
        d="M12 50 L12 26 C12 13.8 21 6 32 6 C43 6 52 13.8 52 26 L52 50
           C52 53 49.5 54.6 47.4 52.8 C45.8 51.5 43.6 51.6 42.2 53.2
           C40.7 55 37.9 55 36.5 53.2 C35.1 51.5 32.7 51.5 31.3 53.2
           C29.9 55 27.1 55 25.7 53.2 C24.3 51.5 21.9 51.5 20.5 53.2
           C19.1 55 16.3 55 14.9 53.2 C13.7 51.8 12 51.9 12 50 Z"
        fill="currentColor"
      />
      {/* Little cowlick tuft (top-right) for a left-facing feel */}
      <path
        d="M46 9 C49 5 53 5 54 8 C51 8 49 10 48 12 Z"
        fill="currentColor"
      />
      {/* Eyes */}
      <circle cx="25.5" cy="27" r="3" fill="#0b0b0b" />
      <circle cx="38.5" cy="26" r="3" fill="#0b0b0b" />
      {/* Eye highlights */}
      <circle cx="26.7" cy="25.9" r="0.9" fill="#ffffff" />
      <circle cx="39.7" cy="24.9" r="0.9" fill="#ffffff" />
      {/* Smiling mouth */}
      <path
        d="M22 36 Q32 33.5 42 36 Q40 46 32 46 Q24 46 22 36 Z"
        fill="#0b0b0b"
      />
      {/* Sharp teeth */}
      <path d="M25 36 L28.2 36 L26.6 40.5 Z" fill="#ffffff" />
      <path d="M30.4 36 L33.6 36 L32 41.5 Z" fill="#ffffff" />
      <path d="M35.8 36 L39 36 L37.4 40.5 Z" fill="#ffffff" />
    </svg>
  );
}

/**
 * Compact ghost mark inside a rounded badge — for small placements like the
 * sidebar brand tile or an avatar. Renders the ghost on a dark rounded square.
 */
export function GhostMark({ className, size = 36 }: { className?: string; size?: number }) {
  return (
    <span
      className={cn(
        "inline-flex items-center justify-center rounded-xl bg-foreground/5 ring-1 ring-primary/25",
        className
      )}
      style={{ width: size, height: size }}
    >
      <GhostLogo size={Math.round(size * 0.72)} />
    </span>
  );
}
