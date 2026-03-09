"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  FileText,
  Camera,
  Mic,
  Settings,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useTranslation } from "@/lib/i18n";

const navIcons = [
  { key: "home" as const, href: "/dashboard", icon: LayoutDashboard },
  { key: "notes" as const, href: "/notes", icon: FileText },
  { key: "photo" as const, href: "/photo-solver", icon: Camera },
  { key: "audio" as const, href: "/recorder", icon: Mic },
  { key: "settings" as const, href: "/settings", icon: Settings },
];

export function MobileNav() {
  const pathname = usePathname();
  const t = useTranslation();

  return (
    <nav
      className={cn(
        "flex lg:hidden fixed bottom-0 left-0 right-0 z-50",
        "bg-background/95 backdrop-blur-md supports-backdrop-filter:bg-background/80",
        "border-t border-border"
      )}
    >
      <div className="flex w-full items-center justify-around px-1 pb-[env(safe-area-inset-bottom)]">
        {navIcons.map((item) => {
          const hrefPath = item.href.split("?")[0];
          const isActive =
            pathname === hrefPath || pathname.startsWith(hrefPath + "/");
          const Icon = item.icon;
          const label = t.nav[item.key];

          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex flex-col items-center justify-center gap-0.5 py-2 px-3 min-w-0",
                "transition-colors duration-150",
                isActive
                  ? "text-primary"
                  : "text-muted-foreground active:text-foreground"
              )}
            >
              <Icon
                className={cn("h-5 w-5 shrink-0", isActive && "stroke-[2.5]")}
              />
              {isActive && (
                <span className="text-[10px] font-semibold leading-tight truncate max-w-[64px]">
                  {label}
                </span>
              )}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
