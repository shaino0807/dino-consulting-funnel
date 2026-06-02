"use client";

import { ArrowUpRight } from "lucide-react";
import { m } from "framer-motion";

import { Badge } from "@/components/ui/badge";
import type { BioLink } from "@/config/profile";
import { cn } from "@/lib/utils";

type LinkCardProps = {
  link: BioLink;
  index: number;
};

export function LinkCard({ link, index }: LinkCardProps) {
  const Icon = link.icon;

  return (
    <m.a
      href={link.href}
      target="_blank"
      rel="noreferrer"
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -8 }}
      transition={{ delay: index * 0.035, duration: 0.32, ease: "easeOut" }}
      whileHover={{ y: -3 }}
      whileTap={{ scale: 0.985 }}
      className={cn(
        "group grid grid-cols-[auto_1fr_auto] gap-3 rounded-lg border border-border bg-card p-4 text-left shadow-sm transition-shadow hover:shadow-lift",
        link.highlighted && "border-primary/35 bg-[linear-gradient(135deg,hsl(var(--card)),hsl(var(--secondary)))]"
      )}
    >
      <span
        className={cn(
          "flex h-11 w-11 items-center justify-center rounded-md bg-muted text-primary",
          link.highlighted && "bg-primary text-primary-foreground"
        )}
      >
        <Icon className="h-5 w-5" />
      </span>
      <span className="min-w-0">
        <span className="flex flex-wrap items-center gap-2">
          <span className="text-base font-bold tracking-normal text-foreground">
            {link.title}
          </span>
          {link.badge ? <Badge>{link.badge}</Badge> : null}
        </span>
        <span className="mt-1 block text-sm leading-5 text-muted-foreground">
          {link.description}
        </span>
        <span className="mt-2 inline-flex items-center text-sm font-bold text-primary">
          {link.cta}
        </span>
      </span>
      <span className="mt-1 flex h-8 w-8 items-center justify-center rounded-md text-muted-foreground transition-colors group-hover:bg-muted group-hover:text-primary">
        <ArrowUpRight className="h-4 w-4" />
      </span>
    </m.a>
  );
}
