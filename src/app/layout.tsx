import type { Metadata, Viewport } from "next";
import type { ReactNode } from "react";

import "./globals.css";

export const metadata: Metadata = {
  title: "Dino080077-Do理in財 | 財務顧問導流頁",
  description:
    "幫小資族把看不懂的投資理財，變成聽得懂、做得到的現金流計畫。",
  openGraph: {
    title: "Dino080077-Do理in財",
    description:
      "拆解 ETF、存股、退休現金流與投資焦慮，讓理財回到生活選擇。",
    type: "website",
    locale: "zh_TW"
  }
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#6b3f24"
};

export default function RootLayout({
  children
}: Readonly<{
  children: ReactNode;
}>) {
  return (
    <html lang="zh-TW">
      <body
        style={{
          fontFamily:
            "'Noto Sans TC', 'DM Sans', system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif"
        }}
      >
        {children}
      </body>
    </html>
  );
}
