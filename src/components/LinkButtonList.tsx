"use client";

import { motion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";

import { getIcon } from "@/components/IconResolver";
import { links } from "@/data/links";

export function LinkButtonList() {
  return (
    <section className="px-5 py-14">
      <div className="mx-auto max-w-3xl">
        <div className="mb-7 text-center">
          <h2 className="text-2xl font-bold text-slate-950">先從這裡開始</h2>
          <p className="mt-3 text-base text-slate-600">
            選一個最接近你現在需求的入口，我會帶你把財務問題拆小。
          </p>
        </div>
        <div className="space-y-3">
          {links.map((link, index) => {
            const Icon = getIcon(link.icon);
            return (
              <motion.a
                key={link.title}
                href={link.url}
                className={`group flex min-h-20 w-full items-center gap-4 rounded-2xl border p-4 text-left shadow-sm backdrop-blur transition active:scale-[0.98] ${
                  link.isPrimary
                    ? "border-emerald-200 bg-emerald-700 text-white shadow-emerald-900/10 hover:bg-emerald-800"
                    : "border-white/50 bg-white/80 text-slate-900 hover:bg-white"
                }`}
                initial={{ opacity: 0, y: 12 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.05 }}
                whileHover={{ y: -3 }}
              >
                <span
                  className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl ${
                    link.isPrimary
                      ? "bg-white/16 text-white"
                      : "bg-emerald-100 text-emerald-700"
                  }`}
                >
                  <Icon className="h-6 w-6" />
                </span>
                <span className="min-w-0 flex-1">
                  <span className="block font-bold">{link.title}</span>
                  <span
                    className={`mt-1 block text-sm leading-6 ${
                      link.isPrimary ? "text-emerald-50" : "text-slate-600"
                    }`}
                  >
                    {link.description}
                  </span>
                </span>
                <ArrowUpRight className="h-5 w-5 shrink-0 transition group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
              </motion.a>
            );
          })}
        </div>
      </div>
    </section>
  );
}
