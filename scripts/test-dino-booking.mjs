// Node 22.18+ / 24+ supports the native TypeScript import used here.
// Pure tests: no server, credentials, network or lead records.
import assert from "node:assert/strict";
import { test } from "node:test";
import { getBookingDates, getBookingWindows, isValidBooking, taipeiDateKey } from "../src/lib/booking.ts";

const now = new Date("2026-09-23T16:30:00Z");
test("date boundary uses Taiwan time", () => {
  assert.equal(taipeiDateKey(now), "2026-09-24");
});
test("eight future days include Saturday but never Sunday", () => {
  const dates = getBookingDates(now);
  assert.equal(dates.length, 8);
  assert.equal(dates[0].value, "2026-09-25");
  assert.ok(dates.some(day => day.value === "2026-09-26"));
  assert.ok(dates.every(day => new Date(`${day.value}T00:00:00Z`).getUTCDay() !== 0));
});
test("weekday evening and Saturday daytime windows are separate", () => {
  assert.deepEqual(getBookingWindows("2026-09-25"), ["20:00–22:00"]);
  assert.equal(getBookingWindows("2026-09-26").length, 5);
  assert.deepEqual(getBookingWindows("2026-09-27"), []);
});
test("invalid calendar dates do not roll into another month", () => {
  for (const date of ["", "garbage", "2026-02-30", "2026-13-01", "2026-9-25"]) {
    assert.deepEqual(getBookingWindows(date), []);
  }
});
test("reject mismatched windows, past dates and distant dates", () => {
  assert.ok(isValidBooking("2026-09-26", "10:00–12:00", now));
  assert.ok(!isValidBooking("2026-09-26", "20:00–22:00", now));
  assert.ok(!isValidBooking("2026-09-27", "10:00–12:00", now));
  assert.ok(!isValidBooking("2025-09-26", "20:00–22:00", now));
  assert.ok(!isValidBooking("2027-09-24", "20:00–22:00", now));
});
test("Sunday requests can choose the following Monday", () => {
  assert.equal(getBookingDates(new Date("2026-09-27T04:00:00Z"))[0].value, "2026-09-28");
});
