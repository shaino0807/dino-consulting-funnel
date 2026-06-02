"use client";

import { motion } from "framer-motion";

import { getIcon } from "@/components/IconResolver";
import { SectionHeader } from "@/components/SectionHeader";
import { socialLinks } from "@/data/links";

export function SocialLinks() {
  return (
    <section className="px-5 py-14">
      <div className="mx-auto max-w-3xl">
        <SectionHeader title="來這裡找我" />
        <div className="flex flex-wrap justify-center gap-3">
          {socialLinks.map((social) => {
            const Icon = getIcon(social.icon);
            return (
              <motion.a
                key={social.label}
                href={social.url}
                aria-label={social.label}
                title={social.label}
                className="group flex h-14 w-14 items-center justify-center rounded-full border border-white/60 bg-white/80 text-slate-800 shadow-sm backdrop-blur transition hover:bg-emerald-700 hover:text-white"
                whileHover={{ scale: 1.08, y: -2 }}
                whileTap={{ scale: 0.96 }}
              >
                <Icon className="h-6 w-6" />
                <span className="sr-only">{social.label}</span>
              </motion.a>
            );
          })}
        </div>
      </div>
    </section>
  );
}
