"use client";

import Image from "next/image";
import { MapPin } from "lucide-react";
import { m } from "framer-motion";

import { Avatar } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { profile, quickStats } from "@/config/profile";

export function ProfileHeader() {
  return (
    <header className="relative overflow-hidden">
      <div className="absolute inset-x-0 top-0 h-56">
        <Image
          src={profile.heroImageUrl}
          alt=""
          fill
          priority
          sizes="100vw"
          className="object-cover"
        />
        <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(18,23,32,0.25),hsl(var(--background))_88%)]" />
      </div>

      <div className="relative mx-auto flex w-full max-w-xl flex-col items-center px-4 pb-5 pt-28 text-center sm:pt-32">
        <m.div
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55, ease: "easeOut" }}
          className="flex flex-col items-center"
        >
          <div className="relative">
            <span className="absolute inset-0 rounded-full border-2 border-primary/60 animate-pulse-ring" />
            <Avatar src={profile.avatarUrl} alt={profile.name} />
          </div>

          <div className="mt-4 space-y-2">
            <div>
              <p className="text-sm font-semibold text-primary">{profile.handle}</p>
              <h1 className="mt-1 text-3xl font-bold tracking-normal text-foreground">
                {profile.name}
              </h1>
            </div>
            <p className="text-balance text-sm font-medium text-muted-foreground">
              {profile.role}
            </p>
            <p className="mx-auto max-w-md text-pretty text-sm leading-6 text-muted-foreground">
              {profile.intro}
            </p>
          </div>

          <div className="mt-4 flex flex-wrap justify-center gap-2">
            <Badge className="gap-1 bg-card text-foreground">
              <MapPin className="h-3 w-3" />
              {profile.location}
            </Badge>
            {profile.trustSignals.map((signal) => (
              <Badge key={signal} className="bg-card text-foreground">
                {signal}
              </Badge>
            ))}
          </div>

          <Button asChild className="mt-5 w-full max-w-sm" size="lg">
            <a href={profile.primaryCta.href} target="_blank" rel="noreferrer">
              {profile.primaryCta.label}
            </a>
          </Button>
        </m.div>

        <m.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.12, duration: 0.5, ease: "easeOut" }}
          className="mt-5 grid w-full grid-cols-3 gap-2"
        >
          {quickStats.map((stat) => {
            const Icon = stat.icon;
            return (
              <div
                key={stat.label}
                className="rounded-lg border border-border bg-card/80 px-2 py-3 shadow-sm backdrop-blur"
              >
                <Icon className="mx-auto h-4 w-4 text-primary" />
                <p className="mt-1 text-base font-bold">{stat.value}</p>
                <p className="text-[11px] font-medium text-muted-foreground">
                  {stat.label}
                </p>
              </div>
            );
          })}
        </m.div>
      </div>
    </header>
  );
}
