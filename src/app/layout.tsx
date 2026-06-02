import type { Metadata, Viewport } from "next";

import "./globals.css";

export const metadata: Metadata = {
  title: "亨尼財商輕聊｜小資現金流地圖",
  description:
    "幫助小資族檢查財務體質、ETF 配置、退休缺口與現金流風險，建立看得懂、做得到的理財計畫。",
  openGraph: {
    title: "亨尼財商輕聊｜小資現金流地圖",
    description:
      "幫助小資族檢查財務體質、ETF 配置、退休缺口與現金流風險，建立看得懂、做得到的理財計畫。",
    type: "website",
    locale: "zh_TW"
  }
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#1e715d"
};

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-TW">
      <body>{children}</body>
    </html>
  );
}
