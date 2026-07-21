import { redirect } from "next/navigation";

import { isAdminAuthenticated } from "@/lib/admin-auth";

export const dynamic = "force-dynamic";

type LoginPageProps = {
  searchParams?: Promise<{ error?: string }>;
};

export default async function AdminLoginPage({ searchParams }: LoginPageProps) {
  if (await isAdminAuthenticated()) redirect("/admin/analytics");
  const params = searchParams ? await searchParams : {};

  return (
    <main className="flex min-h-screen items-center justify-center bg-[#f5f2eb] px-5 py-12 text-[#241812]">
      <section className="w-full max-w-md border border-[#d7c2aa] bg-[#fffaf3] p-7 shadow-xl shadow-[#6b3f24]/10">
        <p className="text-sm font-semibold text-[#1d6d58]">Dino080077-Do理in財</p>
        <h1 className="mt-3 font-['DM_Serif_Display'] text-3xl text-[#04342c]">後臺登入</h1>
        <p className="mt-3 text-sm leading-7 text-[#72543f]">
          請輸入管理密碼。登入狀態只會保存在這台裝置的安全 Cookie，八小時後自動失效。
        </p>

        {params.error ? (
          <p className="mt-5 border border-[#d7a48b] bg-[#fff0e7] px-4 py-3 text-sm text-[#8c3f24]">
            密碼不正確，請重新輸入。
          </p>
        ) : null}

        <form action="/api/admin/login" method="post" className="mt-6">
          <label className="block">
            <span className="text-sm font-semibold">管理密碼</span>
            <input
              type="password"
              name="password"
              required
              autoComplete="current-password"
              className="mt-2 h-12 w-full border border-[#d7c2aa] bg-white px-3 outline-none focus:border-[#1d6d58] focus:ring-2 focus:ring-[#9fe1cb]"
            />
          </label>
          <button
            type="submit"
            className="mt-5 h-12 w-full bg-[#04342c] px-5 font-semibold text-[#e1f5ee] transition hover:bg-[#085041]"
          >
            登入後臺
          </button>
        </form>
      </section>
    </main>
  );
}
