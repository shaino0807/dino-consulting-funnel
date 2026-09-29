export const BOOKING_TIMEZONE = "Asia/Taipei";
export function taipeiDateKey(now = new Date()) {
  const parts = new Intl.DateTimeFormat("en-US", { timeZone: BOOKING_TIMEZONE, year: "numeric", month: "2-digit", day: "2-digit" }).formatToParts(now);
  const get = (type: string) => parts.find(part => part.type === type)!.value;
  return `${get("year")}-${get("month")}-${get("day")}`;
}
export function getBookingDates(now = new Date()) {
  const cursor = new Date(`${taipeiDateKey(now)}T00:00:00Z`);
  const dates: { value: string; label: string }[] = [];
  while (dates.length < 8) {
    cursor.setUTCDate(cursor.getUTCDate() + 1);
    if (cursor.getUTCDay() === 0) continue;
    dates.push({ value: cursor.toISOString().slice(0, 10), label: `${cursor.getUTCMonth() + 1}/${cursor.getUTCDate()}（${"日一二三四五六"[cursor.getUTCDay()]}）` });
  }
  return dates;
}
export function getBookingWindows(date: string) {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) return [];
  const parsed = new Date(`${date}T00:00:00Z`);
  if (Number.isNaN(parsed.getTime()) || parsed.toISOString().slice(0, 10) !== date) return [];
  const day = parsed.getUTCDay();
  return day === 0 ? [] : day === 6 ? ["10:00–12:00", "12:00–14:00", "14:00–16:00", "16:00–18:00", "18:00–20:00"] : ["20:00–22:00"];
}
export function isValidBooking(date: string, window: string, now = new Date()) {
  return getBookingDates(now).some(option => option.value === date) && getBookingWindows(date).includes(window);
}
