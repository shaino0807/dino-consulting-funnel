"use client";
import { type FormEvent, useEffect, useRef, useState } from "react";
import { ArrowRight, Check, CalendarDays } from "lucide-react";
import { dinoProfile } from "@/data/dino-site";
import { topicOptions } from "@/data/dino-content";
import { analyticsBody, trackAnalytics } from "@/lib/dino-analytics";
import { getBookingDates, getBookingWindows, isValidBooking } from "@/lib/booking";
import { ConsultationProgress, SectionHeading } from "./DesignPrimitives";
import { AnimatedSwap } from "./MotionExperience";

type Errors = Partial<Record<"name" | "contact" | "topic" | "consent", string>>;
export function LeadForm({ topic, onTopicChange, onSent }: { topic: string; onTopicChange: (topic: string) => void; onSent: () => void }) {
  const [state, setState] = useState<"idle" | "sending" | "sent" | "error">("idle");
  const [errors, setErrors] = useState<Errors>({});
  const [leadId, setLeadId] = useState<string>();
  const startedAt = useRef(0);
  const tracked = useRef(false);
  const resultHeading = useRef<HTMLHeadingElement>(null);
  useEffect(() => { startedAt.current = Date.now(); }, []);
  function clear(field: keyof Errors) { setErrors(current => ({ ...current, [field]: undefined })); }
  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (state === "sending") return;
    const form = event.currentTarget;
    const data = new FormData(form);
    const name = String(data.get("name") || "").trim();
    const contact = String(data.get("contact") || "").trim();
    const consent = data.get("consent") === "on";
    const next: Errors = {};
    if (!name) next.name = "請留下方便稱呼你的名字。";
    if (!contact) next.contact = "請填寫 Email 或 LINE ID。";
    else if (contact.includes("@") && !contact.startsWith("@") && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(contact)) next.contact = "請確認 Email 格式，或填寫 LINE ID。";
    if (!topicOptions.includes(topic)) next.topic = "請選擇最想整理的問題。";
    if (!consent) next.consent = "請閱讀說明並勾選同意。";
    setErrors(next);
    if (Object.keys(next).length) {
      trackAnalytics({ type: "form_validation_error", label: Object.keys(next).join(",") });
      (form.elements.namedItem(Object.keys(next)[0]) as HTMLElement | null)?.focus();
      return;
    }
    setState("sending");
    // Store preference in the existing message field so the admin/export needs no migration.
    const preference = String(data.get("preferredContact") || "不指定");
    const message = `[偏好聯絡方式：${preference}]\n${String(data.get("message") || "").trim()}`;
    try {
      const response = await fetch("/api/analytics", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify(analyticsBody({ type: "lead_submit_success", label: "lead-form-v3", lead: { name, contact, topic, message, consent, website: String(data.get("website") || ""), startedAt: startedAt.current } })) });
      if (!response.ok) throw new Error("Submit failed");
      const result = await response.json() as { leadId?: string };
      if (!result.leadId) throw new Error("Missing lead receipt");
      setLeadId(result.leadId); setState("sent"); onSent();
    } catch { setState("error"); trackAnalytics({ type: "lead_submit_failed", label: "lead-form-v3" }); }
  }
  return <section id="lead-form" className="dino-section contact-section" aria-label="免費健診申請"><div className="dino-container contact-layout"><div>
    <SectionHeading eyebrow="CONTACT · 免費健診申請" title="讓我們開始聊聊"><p>不知道從哪裡整理，也沒有關係。先告訴我，目前最困擾你的財務問題。</p></SectionHeading>
    <p className="contact-promise">首次 30 分鐘免費<br />3 個工作天內回覆</p>
    <dl className="contact-details"><div><dt>LINE</dt><dd><a href={dinoProfile.lineUrl} target="_blank" rel="noreferrer">@558mfjcy ↗</a></dd></div><div><dt>EMAIL</dt><dd><a href={`mailto:${dinoProfile.email}`}>{dinoProfile.email}</a></dd></div><div><dt>TAIWAN TIME</dt><dd>週一～週五 20:00–22:00<br />週六 10:00–20:00<br /><small>週日可送出申請，不進行諮詢。</small></dd></div></dl>
    <p className="small-copy">付費方案需另外確認，送出免費健診申請不會產生費用。請勿提供帳號密碼或金融憑證。</p>
  </div><div>
    <AnimatedSwap stateKey={state === "sent" ? "success" : "form"} onEntered={() => { if (state === "sent") { resultHeading.current?.focus({ preventScroll: true }); resultHeading.current?.scrollIntoView({ block: "start" }); } }}>{state === "sent" ? <div className="form-success"><Check aria-hidden="true" /><h3 ref={resultHeading} tabIndex={-1}>申請已收到</h3><p>接著選擇希望日期與時段。Dino 會在 3 個工作天內，依你留下的聯絡方式回覆。</p><BookingCalendar leadId={leadId!} topic={topic} /></div> : <form onSubmit={submit} noValidate className="lead-form" aria-labelledby="lead-form-title" onFocusCapture={() => { if (!tracked.current) { tracked.current = true; trackAnalytics({ type: "form_started", label: topic || "尚未選擇主題" }); } }}>
      <h3 id="lead-form-title">先從你的問題開始</h3><ConsultationProgress topic={topic} step={3} />
      <label className="honeypot" aria-hidden="true">網站<input name="website" tabIndex={-1} autoComplete="off" /></label>
      <div className="field-grid"><Field name="name" label="稱呼" placeholder="你的名字" error={errors.name} onChange={() => clear("name")} /><Field name="contact" label="Email 或 LINE ID" placeholder="email@example.com 或 LINE ID" error={errors.contact} onChange={() => clear("contact")} /></div>
      <label className="form-field" htmlFor="lead-topic"><span>最想整理的問題 *</span><select id="lead-topic" name="topic" value={topic} required aria-invalid={!!errors.topic} aria-describedby={errors.topic ? "topic-error" : undefined} onChange={event => { onTopicChange(event.target.value); clear("topic"); }}><option value="" disabled>請選擇最想整理的問題</option>{topicOptions.map(value => <option key={value}>{value}</option>)}</select>{errors.topic && <span className="field-error" id="topic-error" role="alert">{errors.topic}</span>}</label>
      <label className="form-field" htmlFor="preferred-contact"><span>偏好的聯絡方式</span><select id="preferred-contact" name="preferredContact" defaultValue="不指定"><option>不指定</option><option>LINE</option><option>Email</option></select></label>
      <label className="form-field" htmlFor="lead-message"><span>目前狀況／想告訴我的事情</span><textarea id="lead-message" name="message" rows={4} maxLength={700} placeholder="簡單描述即可，不需要提供帳戶或金融憑證。" /></label>
      <div className="consent-row"><input id="lead-consent" type="checkbox" name="consent" required aria-invalid={!!errors.consent} aria-describedby="consent-note consent-error" onChange={() => clear("consent")} /><label htmlFor="lead-consent">我已閱讀資料與服務說明，同意 Dino 使用上述資料聯絡本次需求。</label></div><p className="small-copy" id="consent-note">資料用於需求回覆與服務聯繫，不公開、不轉售。<a href="#data-notice">閱讀完整說明</a></p><p className="field-error" id="consent-error" role={errors.consent ? "alert" : undefined}>{errors.consent}</p>
      {state === "error" && <p role="alert" className="field-error">目前無法送出，填寫內容已保留。請稍後重試，或透過 <a href={dinoProfile.lineUrl}>LINE 聯絡 Dino</a>。</p>}
      <button className="dino-button submit-button" type="submit" disabled={state === "sending"}>{state === "sending" ? "正在送出…" : "送出免費健診申請"}<ArrowRight aria-hidden="true" /></button><p className="small-copy">送出後選擇希望時段；Dino 回覆確認後才完成預約。</p>
    </form>}</AnimatedSwap>
  </div></div></section>;
}
function Field({ name, label, placeholder, error, onChange }: { name: "name" | "contact"; label: string; placeholder: string; error?: string; onChange: () => void }) {
  return <label className="form-field" htmlFor={name}><span>{label} *</span><input id={name} name={name} required maxLength={name === "name" ? 80 : 120} placeholder={placeholder} autoComplete={name === "name" ? "name" : "off"} aria-invalid={!!error} aria-describedby={error ? `${name}-error` : undefined} onChange={onChange} />{error && <span id={`${name}-error`} className="field-error" role="alert">{error}</span>}</label>;
}
function BookingCalendar({ leadId, topic }: { leadId: string; topic: string }) {
  const [date, setDate] = useState("");
  const [window, setWindow] = useState("");
  const [state, setState] = useState<"idle" | "sending" | "sent" | "error">("idle");
  const dates = getBookingDates();
  const windows = getBookingWindows(date);
  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (state === "sending") return;
    if (!isValidBooking(date, window)) { setState("error"); (event.currentTarget.elements.namedItem(!date ? "date" : "window") as HTMLElement)?.focus(); return; }
    setState("sending");
    try {
      const response = await fetch("/api/analytics", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify(analyticsBody({ type: "booking_requested", label: `${date}|${window}|${topic}`, leadId })) });
      if (!response.ok) throw new Error("Booking failed");
      setState("sent");
    } catch { setState("error"); }
  }
  return <AnimatedSwap stateKey={state === "sent" ? "receipt" : "booking"}>{state === "sent" ? <div role="status" className="booking-receipt"><h4>時段偏好已送出</h4><p>{date} · {window}（台灣時間）</p><p>這不是即時預約確認。Dino 將於 3 個工作天內回覆最終安排。</p></div> : <form className="booking-form" onSubmit={submit} noValidate><h4><CalendarDays aria-hidden="true" />選擇希望時段</h4><p className="small-copy">皆為台灣時間。此處是時段偏好，不是即時空檔保證。</p><label className="form-field" htmlFor="booking-date"><span>希望日期</span><select id="booking-date" name="date" value={date} onChange={event => { setDate(event.target.value); setWindow(""); setState("idle"); }}><option value="">請選日期</option>{dates.map(option => <option key={option.value} value={option.value}>{option.label}</option>)}</select></label><label className="form-field" htmlFor="booking-window"><span>希望時段</span><select id="booking-window" name="window" value={window} disabled={!date} onChange={event => { setWindow(event.target.value); setState("idle"); }}><option value="">請選時段</option>{windows.map(value => <option key={value}>{value}</option>)}</select></label>{state === "error" && <p role="alert" className="field-error">請確認日期與時段；若無法送出，請透過 LINE 聯絡 Dino。</p>}<button className="dino-button" disabled={state === "sending"}>{state === "sending" ? "正在送出…" : "送出時段偏好"}</button></form>}</AnimatedSwap>;
}
