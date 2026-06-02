export type Service = {
  title: string;
  description: string;
  icon: string;
};

export const services: Service[] = [
  {
    title: "小資現金流健檢",
    description:
      "輸入收入、支出、存款與 ETF 持股，快速看出你的財務體質、風險與退休缺口。",
    icon: "WalletCards"
  },
  {
    title: "ETF 配置分析",
    description:
      "分析 ETF 重疊度、高股息依賴、配息壓力與資產配置風險。",
    icon: "PieChart"
  },
  {
    title: "一對一理財陪跑",
    description:
      "協助你建立適合自己的現金流地圖、退休計畫與長期投資節奏。",
    icon: "Route"
  }
];
