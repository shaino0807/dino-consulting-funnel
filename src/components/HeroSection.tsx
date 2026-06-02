"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { ArrowRight, CalendarCheck } from "lucide-react";

import { Button } from "@/components/ui/button";
import { profile } from "@/data/profile";

export function HeroSection() {
  return (
    <motion.section
      className="mx-auto flex min-h-[88svh] max-w-3xl flex-col items-center justify-center px-5 pb-12 pt-10 text-center sm:pt-16"
      initial={{ opacity: 0, y: 18 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.7, ease: "easeOut" }}
    >
      <div className="relative">
        <div className="absolute inset-0 rounded-full bg-emerald-300/30 blur-2xl" />
        <Image
          src={profile.avatarUrl}
          alt={`${profile.brandName} 大頭貼`}
          width={128}
          height={128}
          priority
          className="relative h-28 w-28 rounded-full border-4 border-white object-cover shadow-xl sm:h-32 sm:w-32"
        />
      </div>
      <p className="mt-6 text-sm font-semibold text-emerald-700">
        小資族 ETF 與現金流規劃
      </p>
      <h1 className="mt-3 text-4xl font-bold text-slate-950 sm:text-6xl">
        {profile.brandName}
      </h1>
      <p className="mt-5 text-xl font-semibold leading-8 text-slate-800 sm:text-2xl">
        {profile.tagline}
      </p>
      <p className="mt-4 max-w-2xl text-base leading-8 text-slate-600 sm:text-lg">
        {profile.description}
      </p>
      <div className="mt-8 grid w-full gap-3 sm:grid-cols-2">
        <motion.div
          animate={{ scale: [1, 1.015, 1] }}
          transition={{ duration: 2.8, repeat: Infinity, ease: "easeInOut" }}
        >
          <Button
            asChild
            size="lg"
            className="h-14 w-full rounded-full bg-emerald-700 text-base hover:bg-emerald-800"
          >
            <a href={profile.primaryCTA.url}>
              {profile.primaryCTA.label}
              <ArrowRight className="ml-2 h-5 w-5" />
            </a>
          </Button>
        </motion.div>
        <Button
          asChild
          size="lg"
          variant="outline"
          className="h-14 w-full rounded-full border-emerald-200 bg-white/70 text-base text-slate-800 hover:bg-white"
        >
          <a href={profile.secondaryCTA.url}>
            <CalendarCheck className="mr-2 h-5 w-5" />
            {profile.secondaryCTA.label}
          </a>
        </Button>
      </div>
    </motion.section>
  );
}
