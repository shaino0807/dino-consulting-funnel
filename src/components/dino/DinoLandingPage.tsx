"use client";
import Image from "next/image";
import { useEffect, useState } from "react";
import { AnimatePresence, MotionConfig } from "framer-motion";
import { ArrowRight, ArrowUpRight, Check, Compass } from "lucide-react";
import { dinoProfile, heroStats } from "@/data/dino-site";
import { methodSteps, paidPlans } from "@/data/dino-content";
import { trackAnalytics } from "@/lib/dino-analytics";
import { DinoNavigation } from "./DinoNavigation";
import { ConsultationProgress, NumberRow, Reveal, SectionHeading } from "./DesignPrimitives";
import { FAQSection } from "./FAQSection";
import { LeadForm } from "./LeadForm";
import { VideoResources } from "./VideoResources";
import { MotionExperience, ReadingProgress, HeroParticles, HeroVisual, ExpertiseMarquee, PresenceAside } from "./MotionExperience";

const startingTopics = [
  { topic: "ETF / 投資配置", title: "買了不少 ETF，卻不確定配置邏輯", label: "投資結構" },
  { topic: "現金流", title: "收入不低，卻總是存不下錢", label: "每月收支" },
  { topic: "退休規劃", title: "想準備退休，不知道從哪裡開始", label: "未來目標" }
];

export function DinoLandingPage() {
  const [topic, setTopic] = useState("");
  const [heroVisible, setHeroVisible] = useState(true);
  const [formVisible, setFormVisible] = useState(false);
  const [sent, setSent] = useState(false);
  useEffect(() => {
    trackAnalytics({ type: "page_view", label: "home-v3" });
    const hero = document.getElementById("hero-primary-cta");
    const form = document.getElementById("lead-form");
    const heroObserver = new IntersectionObserver(([entry]) => setHeroVisible(entry.isIntersecting));
    const formObserver = new IntersectionObserver(([entry]) => setFormVisible(entry.isIntersecting));
    if (hero) heroObserver.observe(hero);
    if (form) formObserver.observe(form);
    return () => { heroObserver.disconnect(); formObserver.disconnect(); };
  }, []);
  function selectTopic(value: string, scroll = false) {
    setTopic(value);
    trackAnalytics({ type: "topic_selected", label: value, href: "#consultation-value" });
    if (scroll) document.getElementById("consultation-value")?.scrollIntoView({ block: "start" });
  }
  function cta(label: string, hero = false) {
    trackAnalytics({ type: hero ? "hero_cta_click" : "consultation_cta_click", label, href: hero ? "#start-here" : "#lead-form" });
  }
  return <MotionConfig reducedMotion="user"><MotionExperience><div className="dino-site"><ReadingProgress /><DinoNavigation /><main id="main-content">
    <section id="top" className="hero-section"><HeroParticles /><div className="dino-container hero-grid">
      <div className="hero-copy"><p className="eyebrow">FINANCIAL CONSULTATION · 財務整理</p><h1><span className="hero-line"><span>買了 ETF，</span></span><span className="hero-line"><span>卻說不清楚自己</span></span><span className="hero-line"><span>在投資什麼？</span></span></h1><p className="hero-description">與其急著找下一檔 ETF，不如先把現在的資產、現金流與投資邏輯整理清楚。</p><div className="hero-actions"><a id="hero-primary-cta" className="dino-button" href="#start-here" onClick={() => cta("hero-primary", true)}>申請免費健診<ArrowRight aria-hidden="true" /></a><a className="text-link" href="#services">先看看怎麼進行<ArrowUpRight aria-hidden="true" /></a></div><p className="small-copy hero-note">首次 30 分鐘免費 · 不報明牌，不帶操作</p></div>
      <HeroVisual><Reveal className="diagnosis-preview"><div className="preview-top"><span>FINANCIAL FIELD NOTES</span><span>01 / CLARITY</span></div><div className="preview-heading"><Compass aria-hidden="true" /><h2>先看懂全貌，<br />再決定下一步。</h2></div><p className="preview-disclaimer">財務整理示意 · 非真實客戶資料或評分</p><dl className="diagnosis-list"><div><dt><span>01</span>現金流</dt><dd>錢從哪裡來，往哪裡去</dd></div><div><dt><span>02</span>投資配置</dt><dd>持有哪些產品，為什麼持有</dd></div><div><dt><span>03</span>生活目標</dt><dd>為想要的生活，留下選擇</dd></div></dl><div className="preview-note"><span className="eyebrow">THE QUESTION TO START WITH</span><p>「我知道自己買了什麼，<br />但還不確定為什麼這樣配置。」</p></div><div className="preview-bottom"><span>先整理，再投資</span><span>DINO / Do理in財</span></div></Reveal></HeroVisual>
    </div></section>
    <section className="trust-strip" aria-label="服務經驗"><div className="dino-container stats-grid">{heroStats.map(stat => <div key={stat.label}><strong>{stat.value}</strong><span>{stat.label}</span></div>)}<div><strong>30<span className="metric-unit"> MIN</span></strong><span>首次免費健診</span></div></div><ExpertiseMarquee><p>財務健診 <span>／</span> 現金流 <span>／</span> 資產配置 <span>／</span> 風險評估 <span>／</span> 退休規劃 <span>／</span> 理財行為</p></ExpertiseMarquee></section>
    <section id="start-here" className="dino-section outcomes-section"><div className="dino-container">
      <div className="topic-intro"><p className="eyebrow">START WITH YOUR QUESTION</p><h2>你現在，最想整理哪一題？</h2></div><div className="topic-options" role="group" aria-label="選擇最想整理的問題">{startingTopics.map((item, index) => <button type="button" key={item.topic} aria-pressed={topic === item.topic} onClick={() => selectTopic(item.topic, true)}><span className="eyebrow">0{index + 1} · {item.label}</span><span>{item.title}</span><ArrowRight aria-hidden="true" /></button>)}</div>
      <div id="consultation-value" className="outcome-layout"><SectionHeading eyebrow="WHAT YOU’LL LEAVE WITH" title="這次通話，你會帶走三項成果"><p>不是更多理財名詞，而是更清楚的問題輪廓。先釐清，再決定是否需要深入整理。</p><ConsultationProgress topic={topic} step={2} /><p className="selected-topic" role="status">目前選擇：{topic || "尚未選擇主題"}</p><a className="text-link" href="#lead-form" onClick={() => cta("outcomes")}>申請免費健診<ArrowRight aria-hidden="true" /></a></SectionHeading><Reveal><NumberRow number="01" title="看懂財務全貌">把收入、支出、資產、負債與投資，放回同一張地圖。</NumberRow><NumberRow number="02" title="找到優先處理的問題">不一次解決所有事，先找到 1–2 個重要的財務卡點。</NumberRow><NumberRow number="03" title="知道下一步該往哪走">帶走可以執行的方向，而不是只得到更多理財知識。</NumberRow></Reveal></div>
    </div></section>
    <section id="philosophy" className="dino-section dark-section"><div className="dino-container two-column"><SectionHeading eyebrow="FRAMEWORK OVER ANSWERS" title="為什麼我不急著給你標準答案"><blockquote>我比較想給你釣竿，<br />而不是每天告訴你<br />今天該釣哪一條魚。</blockquote></SectionHeading><Reveal><NumberRow number="01" title="同一支 ETF，不同的意義">你的現金流、人生階段與目標，才是配置的起點。</NumberRow><NumberRow number="02" title="報酬率不是唯一問題">你能不能承受波動，和這筆錢什麼時候要用，同樣重要。</NumberRow><NumberRow number="03" title="把判斷力留在自己手上">即使沒有人告訴你答案，也能慢慢做出有邏輯的財務決定。</NumberRow></Reveal></div></section>
    <section id="method" className="dino-section"><div className="dino-container two-column method-layout"><div className="sticky-heading"><SectionHeading eyebrow="HOW I WORK · 財務整理方法" title="先整理，再投資"><p>投資只是財務的一部分。先知道自己站在哪裡，才知道下一步應該往哪裡走。</p></SectionHeading><span className="method-note">A FRAMEWORK, NOT A SHORTCUT.</span></div><div>{methodSteps.map(([title, description], index) => <Reveal key={title} delay={index * 0.06}><NumberRow number={`0${index + 1}`} title={title}>{description}</NumberRow></Reveal>)}</div></div></section>
    <section id="services" className="dino-section process-section"><div className="dino-container"><SectionHeading eyebrow="CONSULTATION PROCESS" title="30 分鐘，我們會怎麼進行？"><p>你不必先整理出完美報表。帶著現在的問題，就可以開始。</p></SectionHeading><div className="process-grid">{[["BEFORE", "先從你的問題開始", "留下最困擾你的財務問題，選擇希望時段，等待 Dino 回覆確認。"], ["DURING", "一起把問題拆開", "從現金流、投資與生活目標，找出真正影響你的問題。"], ["AFTER", "留下下一步", "釐清主要卡點、哪些事不必急，以及下一步最值得處理什麼。"]].map(([label, title, body], index) => <Reveal key={label} delay={index * 0.09}><span className="process-number">0{index + 1}</span><p className="eyebrow">{label}</p><h3>{title}</h3><p>{body}</p></Reveal>)}</div><p className="small-copy">首次健診不承諾一次解決所有財務問題，也不保證投資報酬。後續付費服務由你自行決定。</p></div></section>
    <section id="pricing" className="dino-section"><div className="dino-container"><div className="section-topline"><SectionHeading eyebrow="GO DEEPER · 課程與付費諮詢" title="需要更深入時，再往下一步"><p>免費健診先釐清方向；課程與深度諮詢，則是另外選擇的付費服務。</p></SectionHeading><span className="pricing-currency">所有價格均以新台幣計價</span></div><div className="pricing-grid">{paidPlans.map((plan, index) => {
      const href = `https://line.me/R/oaMessage/@558mfjcy/?${encodeURIComponent(`你好 Dino，我想了解「${plan.title}」（NT$${plan.price.toLocaleString("en-US")}${plan.id === "coaching" ? "／次" : ""}）的服務內容與安排。`)}`;
      return <article className={`pricing-card ${plan.id === "coaching" ? "coaching-card" : ""}`} key={plan.id}><p className="eyebrow">0{index + 1} / {plan.id === "coaching" ? "PERSONAL CONSULTATION" : "LEARNING PROGRAM"}</p><h3>{plan.title}</h3><p className="plan-english">{plan.english}</p><p className="plan-price">NT$ {plan.price.toLocaleString("en-US")}<small>{plan.id === "coaching" ? "／次" : ""}</small></p><p className="plan-duration">{plan.duration}</p><ul>{plan.features.map(feature => <li key={feature}><Check aria-hidden="true" />{feature}</li>)}</ul><a className="dino-button outline" href={href} target="_blank" rel="noreferrer" onClick={() => trackAnalytics({ type: "consultation_cta_click", label: `paid-${plan.id}`, href })}>洽詢{plan.id === "coaching" ? "付費諮詢" : "課程"}<ArrowUpRight aria-hidden="true" /></a><p className="small-copy">透過 LINE 確認內容與安排，非線上付款。</p></article>;
    })}</div></div></section>
    <section id="about" className="dino-section about-section"><div className="dino-container about-layout"><div className="about-portrait"><Image src={dinoProfile.avatarUrl} alt="Dino 本人照片" width={560} height={660} sizes="(max-width: 767px) 90vw, 40vw" /><p>DINO / ENGINEER & FINANCIAL EDUCATOR</p></div><div><SectionHeading eyebrow="ABOUT DINO · 關於我" title="白天是工程師，其他時間研究錢與人的決定。" /><div className="about-copy"><p>嗨，我是 Dino。工作以外喜歡研究金融、投資、社會心理與人的決策行為。</p><p>在股市裡打滾超過 12 年，也跟很多人一樣，還在努力往提早退休的方向前進。我沒有要把自己包裝成站在終點的成功大師。</p><p>累積服務超過 100 位對象、諮詢超過 500 次。我最喜歡的，是把看起來很亂的理財疑難雜症，一層一層拆開。</p><p>如果一定要形容，大概就是一個喜歡研究金融與社會心理、想提早退休的無聊男子。</p></div><blockquote className="about-quote">有一天不需要我，<br />也知道怎麼判斷，才是最好的結果。</blockquote></div></div></section>
    <section id="feedback" className="dino-section"><div className="dino-container"><SectionHeading eyebrow="WHO THIS IS FOR" title="先說清楚，這個服務不一定適合所有人" /><div className="suitability-grid"><div><p className="eyebrow">THIS MAY BE FOR YOU</p><h3>想把問題整理清楚的你</h3><ul>{["已經投資，卻沒有完整的配置架構", "收入不低，但很難累積資產", "想釐清現金流與投資的關係", "想開始準備退休或其他生活目標", "想逐步建立自己的判斷能力"].map(item => <li key={item}><Check aria-hidden="true" />{item}</li>)}</ul></div><div><p className="eyebrow">THIS MAY NOT BE FOR YOU</p><h3>如果你正在找這些服務</h3><ul>{["直接告訴你哪一檔股票會漲", "短線買賣點與進出場指令", "由別人代替你操作投資", "快速致富或保證報酬"].map(item => <li key={item}><span aria-hidden="true">—</span>{item}</li>)}</ul><p className="small-copy">這些不是本服務提供的範圍。</p></div></div></div></section>
    <section id="resources" className="dino-section resources-section"><div className="dino-container"><div className="section-topline"><SectionHeading eyebrow="DINO NOTES · 精選觀點" title="先免費認識我的方法"><p>三段短內容，從投資產品走回自己的財務判斷。內容為教育說明，不構成買賣建議。</p></SectionHeading><a className="text-link" href="/resources" onClick={() => trackAnalytics({ type: "resource_expanded", label: "all-content", href: "/resources" })}>看全部內容<ArrowUpRight aria-hidden="true" /></a></div><VideoResources /></div></section>
    <FAQSection />
    <section id="cta" className="dino-section dark-section final-cta"><div className="dino-container"><p className="eyebrow">START HERE</p><h2>你不需要先懂很多，<br />帶著現在的問題就可以開始。</h2><p>先知道自己現在在哪裡，再決定下一步要往哪裡。</p><a className="dino-button light" href="#lead-form" onClick={() => cta("final-cta")}>申請免費健診<ArrowRight aria-hidden="true" /></a><p className="small-copy">首次 30 分鐘免費 · 不帶操作，不帶明牌</p></div></section>
    <LeadForm topic={topic} onTopicChange={value => selectTopic(value)} onSent={() => setSent(true)} />
    <section id="data-notice" className="data-notice"><div className="dino-container"><details><summary>資料與服務說明</summary><div><p>本站提供財務整理、金融知識與理財教育，不提供代操、明牌、投資群組、帶進帶出或收益保證。個股與總經內容為教育用途，不構成買賣建議。</p><p>申請資料包含稱呼、聯絡方式、需求、偏好聯絡方式、時段偏好與同意時間，用於回覆及服務聯繫，由 Dino 透過受保護的管理後台處理。資料不公開、不轉售。</p><p>網站會使用瀏覽器本機儲存保存隨機工作階段識別碼，並記錄頁面路徑、操作事件、來源參數、瀏覽器資訊與來源頁，用於了解網站使用情形。本站不要求銀行密碼、金融憑證或身分證件。</p><p>如需查詢、更正或請求刪除提交資料，請聯絡 <a href={`mailto:${dinoProfile.email}`}>{dinoProfile.email}</a>。具體處理方式由 Dino 回覆確認；本站不宣稱自動刪除或固定保存期限。</p><p>免費健診與付費服務分開。本站沒有線上付款；付費課程的開課安排、提供方式及取消／退款條件，需在付款前向 Dino 確認。</p></div></details></div></section>
  </main><footer className="dino-footer"><div className="dino-container"><div className="footer-top"><a className="brand" href="#top"><span className="brand-mark">Do</span>Do理in財</a><p>先整理，再投資。<br />把判斷力，留在自己手上。</p><nav aria-label="社群與聯絡">{[["Instagram", dinoProfile.instagramUrl], ["LINE", dinoProfile.lineUrl], ["YouTube", dinoProfile.youtubeUrl], ["Email", `mailto:${dinoProfile.email}`]].map(([label, href]) => <a key={label} href={href} target={href.startsWith("http") ? "_blank" : undefined} rel="noreferrer" onClick={() => trackAnalytics({ type: "link_click", label: `footer-${label}`, href })}>{label} ↗</a>)}</nav></div><div className="footer-bottom"><span>© {new Date().getFullYear()} Do理in財 / Dino Consulting</span><a href="#data-notice">資料與服務說明</a><span>理財教育 · 不代操 · 不保證報酬</span></div></div></footer>
    <AnimatePresence>{!heroVisible && !formVisible && !sent && <PresenceAside key="mobile-cta" className="mobile-sticky-cta" label="免費健診快捷申請"><p aria-live="polite">{topic ? `目前選擇：${topic}` : "首次 30 分鐘免費"}</p><a className="dino-button" href="#lead-form" onClick={() => cta("mobile-sticky-cta")}>申請免費健診<ArrowRight aria-hidden="true" /></a></PresenceAside>}</AnimatePresence>
    <AnimatePresence>{topic && !heroVisible && !formVisible && !sent && <PresenceAside key="topic-confirmation" className="desktop-topic-confirmation" label="目前健診主題">目前選擇：{topic}</PresenceAside>}</AnimatePresence>
  </div></MotionExperience></MotionConfig>;
}
