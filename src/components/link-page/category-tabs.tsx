"use client";

import { m } from "framer-motion";

import { categories, type LinkCategory } from "@/config/profile";
import { cn } from "@/lib/utils";

type CategoryTabsProps = {
  activeCategory: "all" | LinkCategory;
  onChange: (category: "all" | LinkCategory) => void;
};

export function CategoryTabs({ activeCategory, onChange }: CategoryTabsProps) {
  return (
    <div className="sticky top-2 z-20 -mx-4 px-4 py-2">
      <div className="flex gap-2 overflow-x-auto rounded-lg border border-border bg-card/88 p-1 shadow-sm backdrop-blur tap-highlight-transparent">
        {categories.map((category) => {
          const isActive = activeCategory === category.id;
          return (
            <button
              key={category.id}
              type="button"
              onClick={() => onChange(category.id)}
              className={cn(
                "relative min-w-fit rounded-md px-3 py-2 text-sm font-semibold text-muted-foreground transition-colors",
                isActive && "text-primary"
              )}
            >
              {isActive ? (
                <m.span
                  layoutId="active-category"
                  className="absolute inset-0 rounded-md bg-secondary"
                  transition={{ type: "spring", stiffness: 420, damping: 34 }}
                />
              ) : null}
              <span className="relative">{category.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
