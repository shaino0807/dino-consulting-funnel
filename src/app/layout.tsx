import type { Metadata, Viewport } from "next";
import type { ReactNode } from "react";

import "./globals.css";
import "./dino.css";
import "./dino-motion.css";

export const metadata: Metadata = {
  title: "Do理in財 | Dino 財務整理・理財教育・陪跑",
  description:
    "先整理，再投資。Dino 陪你釐清現金流、投資配置與財務目標。首次 30 分鐘免費健診，不代操、不報明牌。",
  openGraph: {
    title: "Do理in財 | 先整理，再投資",
    description:
      "拆解 ETF、存股、退休現金流與投資焦慮，讓理財回到生活選擇。",
    type: "website",
    locale: "zh_TW"
  }
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#04342c"
};

export default function RootLayout({
  children
}: Readonly<{
  children: ReactNode;
}>) {
  return (
    <html lang="zh-TW" data-scroll-behavior="smooth">
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
