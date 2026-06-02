"use client";

import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import { ArrowRight, ShieldAlert } from "lucide-react";

import { SectionHeader } from "@/components/SectionHeader";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

type RiskProfile = "conservative" | "balanced" | "growth";

type Result = {
  score: number;
  savingsRate: number;
  emergencyMonths: number;
  biggestRisk: string;
  suggestion: string;
};

const riskSuggestions: Record<RiskProfile, string> = {
  conservative: "重點放在緊急預備金、低波動配置與穩定現金流。",
  balanced: "重點放在 ETF 長期配置、股債平衡與定期檢視。",
  growth: "重點放在成長型資產、波動承受度與再平衡紀律。"
};

function clampScore(score: number) {
  return Math.min(100, Math.max(0, Math.round(score)));
}

export function CashflowPreviewTool() {
  const [monthlyIncome, setMonthlyIncome] = useState("50000");
  const [monthlyExpense, setMonthlyExpense] = useState("32000");
  const [currentSavings, setCurrentSavings] = useState("180000");
  const [riskProfile, setRiskProfile] = useState<RiskProfile>("balanced");
  const [hasResult, setHasResult] = useState(false);

  const result = useMemo<Result>(() => {
    const income = Number(monthlyIncome) || 0;
    const expense = Number(monthlyExpense) || 0;
    const savings = Number(currentSavings) || 0;
    const monthlySurplus = income - expense;
    const savingsRate = income > 0 ? monthlySurplus / income : 0;
    const emergencyMonths = expense > 0 ? savings / expense : 0;

    let score = 50;
    if (savingsRate > 0.3) score += 20;
    else if (savingsRate > 0.15) score += 10;
    else if (savingsRate <= 0) score -= 20;

    if (emergencyMonths >= 12) score += 20;
    else if (emergencyMonths >= 6) score += 10;
    else if (emergencyMonths < 3) score -= 15;

    const biggestRisk =
      monthlySurplus <= 0
        ? "每月現金流為負，投資前需要先止血。"
        : emergencyMonths < 6
          ? "緊急預備金不足，遇到收入中斷時會壓縮投資計畫。"
          : "主要風險在於配置是否能長期維持，而不是短期報酬。";

    return {
      score: clampScore(score),
      savingsRate,
      emergencyMonths,
      biggestRisk,
      suggestion: riskSuggestions[riskProfile]
    };
  }, [currentSavings, monthlyExpense, monthlyIncome, riskProfile]);

  return (
    <section className="px-5 py-14">
      <div className="mx-auto max-w-5xl">
        <SectionHeader
          eyebrow="免費工具預覽"
          title="小資現金流地圖"
          description="輸入幾個數字，先快速抓出你的財務體質與下一步優先順序。"
        />
        <div className="grid gap-5 lg:grid-cols-[0.95fr_1.05fr]">
          <Card className="rounded-2xl border-white/50 bg-white/80 shadow-sm backdrop-blur">
            <CardContent className="space-y-5 p-5 sm:p-6">
              <Field
                label="月收入"
                value={monthlyIncome}
                onChange={setMonthlyIncome}
              />
              <Field
                label="月支出"
                value={monthlyExpense}
                onChange={setMonthlyExpense}
              />
              <Field
                label="目前存款"
                value={currentSavings}
                onChange={setCurrentSavings}
              />
              <label className="block">
                <span className="text-sm font-semibold text-slate-700">
                  投資風格
                </span>
                <select
                  value={riskProfile}
                  onChange={(event) =>
                    setRiskProfile(event.target.value as RiskProfile)
                  }
                  className="mt-2 h-12 w-full rounded-xl border border-slate-200 bg-white px-4 text-slate-900 outline-none ring-emerald-600 transition focus:ring-2"
                >
                  <option value="conservative">保守</option>
                  <option value="balanced">穩健</option>
                  <option value="growth">積極</option>
                </select>
              </label>
              <Button
                type="button"
                className="h-13 w-full rounded-full bg-emerald-700 text-base hover:bg-emerald-800"
                onClick={() => setHasResult(true)}
              >
                產生財務體質預覽
              </Button>
            </CardContent>
          </Card>

          <div className="min-h-96">
            {hasResult ? (
              <motion.div
                initial={{ opacity: 0, x: 24 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.45, ease: "easeOut" }}
              >
                <Card className="rounded-2xl border-emerald-100 bg-white/90 shadow-xl shadow-emerald-900/5 backdrop-blur">
                  <CardContent className="p-6 sm:p-8">
                    <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
                      <div>
                        <p className="text-sm font-semibold text-emerald-700">
                          財務體質分數
                        </p>
                        <p className="mt-2 text-6xl font-bold text-slate-950">
                          {result.score}
                        </p>
                      </div>
                      <div className="rounded-2xl bg-emerald-50 px-5 py-4 text-sm text-slate-700">
                        <p>儲蓄率：{Math.round(result.savingsRate * 100)}%</p>
                        <p className="mt-1">
                          預備金：{result.emergencyMonths.toFixed(1)} 個月
                        </p>
                      </div>
                    </div>
                    <div className="mt-7 rounded-2xl border border-amber-100 bg-amber-50 p-4">
                      <div className="flex gap-3">
                        <ShieldAlert className="mt-1 h-5 w-5 shrink-0 text-amber-700" />
                        <div>
                          <p className="font-bold text-slate-900">最大風險</p>
                          <p className="mt-1 text-sm leading-6 text-slate-700">
                            {result.biggestRisk}
                          </p>
                        </div>
                      </div>
                    </div>
                    <div className="mt-5 rounded-2xl bg-slate-50 p-4">
                      <p className="font-bold text-slate-900">初步建議</p>
                      <p className="mt-1 text-sm leading-6 text-slate-700">
                        {result.suggestion}
                      </p>
                    </div>
                    <Button
                      asChild
                      className="mt-6 h-13 w-full rounded-full bg-slate-950 text-base text-white hover:bg-slate-800"
                    >
                      <a href="https://example.com">
                        取得完整 ETF 財務健檢報告
                        <ArrowRight className="ml-2 h-5 w-5" />
                      </a>
                    </Button>
                  </CardContent>
                </Card>
              </motion.div>
            ) : (
              <Card className="flex min-h-96 items-center rounded-2xl border-dashed border-emerald-200 bg-white/55 shadow-sm backdrop-blur">
                <CardContent className="p-8 text-center">
                  <p className="text-lg font-bold text-slate-900">
                    輸入資料後會顯示你的現金流預覽
                  </p>
                  <p className="mt-3 text-sm leading-6 text-slate-600">
                    結果會包含分數、儲蓄率、緊急預備金月數與初步配置方向。
                  </p>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}

function Field({
  label,
  value,
  onChange
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
}) {
  return (
    <label className="block">
      <span className="text-sm font-semibold text-slate-700">{label}</span>
      <input
        type="number"
        min="0"
        inputMode="numeric"
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="mt-2 h-12 w-full rounded-xl border border-slate-200 bg-white px-4 text-slate-900 outline-none ring-emerald-600 transition focus:ring-2"
      />
    </label>
  );
}
