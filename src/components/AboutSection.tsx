import { SectionHeader } from "@/components/SectionHeader";
import { Card, CardContent } from "@/components/ui/card";
import { profile } from "@/data/profile";

export function AboutSection() {
  return (
    <section className="px-5 py-14">
      <div className="mx-auto max-w-5xl">
        <SectionHeader
          title="量身打造你的現金流配置"
          description="不追逐每一個市場熱點，而是建立能陪你走很久的財務節奏。"
        />
        <div className="grid gap-5 md:grid-cols-[1.15fr_0.85fr] md:items-stretch">
          <Card className="rounded-2xl border-white/50 bg-white/80 shadow-sm backdrop-blur">
            <CardContent className="flex h-full items-center p-6 sm:p-8">
              <p className="text-base leading-8 text-slate-700 sm:text-lg">
                {profile.aboutText}
              </p>
            </CardContent>
          </Card>
          <div className="grid gap-3">
            {profile.stats.map((stat) => (
              <Card
                key={stat.label}
                className="rounded-2xl border-white/50 bg-white/80 shadow-sm backdrop-blur"
              >
                <CardContent className="p-5">
                  <p className="text-3xl font-bold text-emerald-700">
                    {stat.value}
                  </p>
                  <p className="mt-1 text-sm font-medium text-slate-600">
                    {stat.label}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
