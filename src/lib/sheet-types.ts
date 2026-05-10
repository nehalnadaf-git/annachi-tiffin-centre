// ============================================================
//  ANNACHI TIFFIN CENTRE — Google Sheets Dynamic Data Types
// ============================================================

/** A product override row from the Google Sheet */
export interface SheetProduct {
  id: string;         // Must match MENU_ITEMS id in data.ts
  price: number;      // Live price in rupees
  active: boolean;    // FALSE = hide product from menu
}

/** Store settings from the Google Sheet */
export interface SheetSettings {
  openHour: number;           // e.g. 8  (for 8:00 AM)
  closeHour: number;          // e.g. 21 (for 9:00 PM)
  closedDays: number[];       // e.g. [0] = Sunday. 0=Sun,1=Mon,...,6=Sat
  manualStatus: "auto" | "open" | "closed"; // override switch
  manualClosedReason: string; // message shown when manually closed
}

/** Combined payload returned by /api/menu */
export interface SheetData {
  products: SheetProduct[];
  settings: SheetSettings;
}

/** What getStoreStatus returns */
export interface StoreStatus {
  open: boolean;
  reason: string;
  nextOpen: string;
}

/** Fallback used when the sheet is unavailable */
export const DEFAULT_SETTINGS: SheetSettings = {
  openHour: 8,
  closeHour: 21,
  closedDays: [0],
  manualStatus: "auto",
  manualClosedReason: "",
};

/** Computes store status from settings + IST time */
export function computeStoreStatus(settings: SheetSettings): StoreStatus {
  // Manual override takes absolute priority
  if (settings.manualStatus === "open") {
    return { open: true, reason: "", nextOpen: "" };
  }
  if (settings.manualStatus === "closed") {
    return {
      open: false,
      reason: settings.manualClosedReason || "We're temporarily closed. We'll be back soon!",
      nextOpen: "When we reopen manually",
    };
  }

  // Auto: time-based logic in IST (UTC+5:30)
  const now = new Date(
    new Date().toLocaleString("en-US", { timeZone: "Asia/Kolkata" })
  );
  const day = now.getDay();
  const timeMinutes = now.getHours() * 60 + now.getMinutes();
  const openMinutes = settings.openHour * 60;
  const closeMinutes = settings.closeHour * 60;

  const dayNames = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

  // Check if today is a closed day
  if (settings.closedDays.includes(day)) {
    // Find next open day
    let nextDayIdx = (day + 1) % 7;
    let daysAhead = 1;
    while (settings.closedDays.includes(nextDayIdx) && daysAhead < 7) {
      nextDayIdx = (nextDayIdx + 1) % 7;
      daysAhead++;
    }
    const nextDayName = daysAhead === 1 ? "Tomorrow" : dayNames[nextDayIdx];
    return {
      open: false,
      reason: `We're closed today (${dayNames[day]}) — it's our rest day.`,
      nextOpen: `${nextDayName} at ${formatHour(settings.openHour)}`,
    };
  }

  if (timeMinutes < openMinutes) {
    return {
      open: false,
      reason: "Not open yet — we're still prepping the kitchen.",
      nextOpen: `Today at ${formatHour(settings.openHour)}`,
    };
  }

  if (timeMinutes >= closeMinutes) {
    // Find next open day
    let nextDayIdx = (day + 1) % 7;
    let daysAhead = 1;
    while (settings.closedDays.includes(nextDayIdx) && daysAhead < 7) {
      nextDayIdx = (nextDayIdx + 1) % 7;
      daysAhead++;
    }
    const nextDayName = daysAhead === 1 ? "Tomorrow" : dayNames[nextDayIdx];
    return {
      open: false,
      reason: "We've closed for the day. See you tomorrow!",
      nextOpen: `${nextDayName} at ${formatHour(settings.openHour)}`,
    };
  }

  return { open: true, reason: "", nextOpen: "" };
}

function formatHour(hour: number): string {
  const period = hour >= 12 ? "PM" : "AM";
  const h = hour > 12 ? hour - 12 : hour === 0 ? 12 : hour;
  return `${h}:00 ${period}`;
}
