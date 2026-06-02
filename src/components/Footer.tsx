import { profile } from "@/data/profile";

export function Footer() {
  return (
    <footer className="px-5 pb-10 pt-8">
      <div className="mx-auto max-w-3xl border-t border-slate-200/80 pt-8 text-center">
        <p className="font-bold text-slate-950">{profile.brandName}</p>
        <p className="mt-2 text-sm text-slate-600">{profile.tagline}</p>
        <div className="mt-5 flex flex-wrap justify-center gap-x-4 gap-y-2 text-sm text-slate-500">
          <a href="https://example.com" className="hover:text-emerald-700">
            隱私權政策
          </a>
          <a href="https://example.com" className="hover:text-emerald-700">
            免責聲明
          </a>
        </div>
        <p className="mt-5 text-xs leading-6 text-slate-500">
          {profile.disclaimer}
        </p>
        <p className="mt-4 text-xs text-slate-400">
          Copyright © {new Date().getFullYear()} {profile.brandName}. All rights
          reserved.
        </p>
      </div>
    </footer>
  );
}
