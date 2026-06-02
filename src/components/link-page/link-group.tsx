"use client";

import { AnimatePresence } from "framer-motion";

import { LinkCard } from "@/components/link-page/link-card";
import type { BioLink, LinkCategory } from "@/config/profile";

type LinkGroupProps = {
  links: BioLink[];
  activeCategory: "all" | LinkCategory;
};

export function LinkGroup({ links, activeCategory }: LinkGroupProps) {
  const filteredLinks =
    activeCategory === "all"
      ? links
      : links.filter((link) => link.category === activeCategory);

  return (
    <section aria-label="主要連結" className="space-y-3">
      <AnimatePresence mode="popLayout">
        {filteredLinks.map((link, index) => (
          <LinkCard key={link.title} link={link} index={index} />
        ))}
      </AnimatePresence>
    </section>
  );
}
