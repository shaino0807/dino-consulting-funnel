"use client";

import { ArrowUpRight } from "lucide-react";
import { m } from "framer-motion";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { featuredOffer } from "@/config/profile";

export function FeaturedOffer() {
  const Icon = featuredOffer.icon;

  return (
    <m.section
      initial={{ opacity: 0, y: 18 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.45, ease: "easeOut" }}
    >
      <Card className="overflow-hidden border-primary/25 bg-primary text-primary-foreground shadow-lift">
        <CardContent className="relative p-5">
          <div className="absolute right-4 top-4 rounded-md bg-white/15 p-2">
            <Icon className="h-5 w-5" />
          </div>
          <p className="text-xs font-bold uppercase tracking-[0.18em] text-primary-foreground/75">
            {featuredOffer.eyebrow}
          </p>
          <h2 className="mt-3 max-w-[15rem] text-xl font-bold tracking-normal">
            {featuredOffer.title}
          </h2>
          <p className="mt-2 max-w-md text-sm leading-6 text-primary-foreground/80">
            {featuredOffer.description}
          </p>
          <Button
            asChild
            className="mt-4 bg-white text-primary hover:bg-white/90"
            variant="secondary"
          >
            <a href={featuredOffer.href} target="_blank" rel="noreferrer">
              {featuredOffer.cta}
              <ArrowUpRight className="ml-2 h-4 w-4" />
            </a>
          </Button>
        </CardContent>
      </Card>
    </m.section>
  );
}
