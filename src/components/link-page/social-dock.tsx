"use client";

import { socialLinks } from "@/config/profile";

export function SocialDock() {
  return (
    <nav
      aria-label="社群連結"
      className="flex items-center justify-center gap-2 pb-8 pt-2"
    >
      {socialLinks.map((social) => {
        const Icon = social.icon;
        return (
          <a
            key={social.label}
            href={social.href}
            target="_blank"
            rel="noreferrer"
            aria-label={social.label}
            title={social.label}
            className="flex h-11 w-11 items-center justify-center rounded-md border border-border bg-card text-muted-foreground shadow-sm transition-all hover:-translate-y-0.5 hover:text-primary hover:shadow-lift"
          >
            <Icon className="h-5 w-5" />
          </a>
        );
      })}
    </nav>
  );
}
