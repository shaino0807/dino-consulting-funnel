"use client";

import { motion } from "framer-motion";

import { getIcon } from "@/components/IconResolver";
import { Card, CardContent } from "@/components/ui/card";
import { services } from "@/data/services";

export function ServiceCards() {
  return (
    <section className="px-5 py-14">
      <div className="mx-auto max-w-5xl">
        <div className="mb-7 text-center">
          <p className="text-sm font-semibold tracking-[0.14em] text-emerald-700">
            ｜服務項目｜
          </p>
        </div>
        <motion.div
          className="grid gap-4 md:grid-cols-3"
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.25 }}
          variants={{
            hidden: {},
            show: { transition: { staggerChildren: 0.12 } }
          }}
        >
          {services.map((service) => {
            const Icon = getIcon(service.icon);
            return (
              <motion.button
                key={service.title}
                type="button"
                className="group text-left tap-highlight-transparent"
                variants={{
                  hidden: { opacity: 0, y: 18 },
                  show: { opacity: 1, y: 0 }
                }}
                whileHover={{ y: -5 }}
                whileTap={{ scale: 0.98 }}
              >
                <Card className="h-full rounded-2xl border-white/50 bg-white/80 shadow-sm backdrop-blur transition-shadow group-hover:shadow-xl">
                  <CardContent className="p-6">
                    <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-100 text-emerald-700">
                      <Icon className="h-6 w-6" />
                    </div>
                    <h3 className="text-lg font-bold text-slate-950">
                      {service.title}
                    </h3>
                    <p className="mt-3 text-sm leading-7 text-slate-600">
                      {service.description}
                    </p>
                  </CardContent>
                </Card>
              </motion.button>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
}
