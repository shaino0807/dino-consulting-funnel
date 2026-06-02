"use client";

import { useMemo, useState } from "react";

import { CategoryTabs } from "@/components/link-page/category-tabs";
import { FeaturedOffer } from "@/components/link-page/featured-offer";
import { LinkGroup } from "@/components/link-page/link-group";
import { ProfileHeader } from "@/components/link-page/profile-header";
import { ServiceGrid } from "@/components/link-page/service-grid";
import { ShareButton } from "@/components/link-page/share-button";
import { SocialDock } from "@/components/link-page/social-dock";
import { ThemeToggle } from "@/components/link-page/theme-toggle";
import { bioLinks, type LinkCategory } from "@/config/profile";

export function LinkPageClient() {
  const [activeCategory, setActiveCategory] = useState<"all" | LinkCategory>(
    "all"
  );

  const sortedLinks = useMemo(
    () =>
      [...bioLinks].sort((a, b) => {
        if (a.highlighted && !b.highlighted) return -1;
        if (!a.highlighted && b.highlighted) return 1;
        return 0;
      }),
    []
  );

  return (
    <main className="min-h-screen bg-[radial-gradient(circle_at_top_left,hsl(var(--secondary)),transparent_32rem),linear-gradient(180deg,hsl(var(--background)),hsl(var(--muted)))]">
      <div className="fixed right-3 top-3 z-30 flex gap-2">
        <ShareButton />
        <ThemeToggle />
      </div>

      <ProfileHeader />

      <div className="mx-auto flex w-full max-w-xl flex-col gap-5 px-4">
        <FeaturedOffer />
        <CategoryTabs
          activeCategory={activeCategory}
          onChange={setActiveCategory}
        />
        <LinkGroup links={sortedLinks} activeCategory={activeCategory} />
        <ServiceGrid />
        <SocialDock />
      </div>
    </main>
  );
}
