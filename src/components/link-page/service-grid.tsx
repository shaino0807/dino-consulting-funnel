"use client";

import { ArrowRight } from "lucide-react";
import { m } from "framer-motion";

import { services } from "@/config/profile";

export function ServiceGrid() {
  return (
    <section className="space-y-3" aria-labelledby="services-title">
      <div className="flex items-end justify-between gap-3">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.18em] text-primary">
            Services
          </p>
          <h2 id="services-title" className="mt-1 text-lg font-bold">
            合作可以從這裡開始
          </h2>
        </div>
      </div>

      <div className="grid gap-3 sm:grid-cols-3">
        {services.map((service, index) => {
          const Icon = service.icon;
          return (
            <m.a
              key={service.title}
              href={service.href}
              target="_blank"
              rel="noreferrer"
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ delay: index * 0.06, duration: 0.35 }}
              whileHover={{ y: -3 }}
              className="group rounded-lg border border-border bg-card p-4 shadow-sm transition-shadow hover:shadow-lift"
            >
              <div className="flex h-10 w-10 items-center justify-center rounded-md bg-accent text-accent-foreground">
                <Icon className="h-5 w-5" />
              </div>
              <h3 className="mt-3 text-sm font-bold">{service.title}</h3>
              <p className="mt-1 text-sm leading-5 text-muted-foreground">
                {service.description}
              </p>
              <span className="mt-3 inline-flex items-center text-sm font-bold text-primary">
                了解更多
                <ArrowRight className="ml-1 h-4 w-4 transition-transform group-hover:translate-x-1" />
              </span>
            </m.a>
          );
        })}
      </div>
    </section>
  );
}
