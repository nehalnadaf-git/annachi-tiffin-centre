import { NextResponse } from "next/server";
import { SheetData, SheetProduct, SheetSettings, DEFAULT_SETTINGS } from "@/lib/sheet-types";

/* ── Simple but robust CSV parser (handles quoted fields with commas) ── */
function parseCSV(text: string): string[][] {
  const rows: string[][] = [];
  const lines = text.replace(/\r\n/g, "\n").replace(/\r/g, "\n").split("\n");

  for (const line of lines) {
    if (!line.trim()) continue;
    const cols: string[] = [];
    let inQuotes = false;
    let current = "";

    for (let i = 0; i < line.length; i++) {
      const ch = line[i];
      if (ch === '"') {
        if (inQuotes && line[i + 1] === '"') {
          current += '"';
          i++;
        } else {
          inQuotes = !inQuotes;
        }
      } else if (ch === "," && !inQuotes) {
        cols.push(current.trim());
        current = "";
      } else {
        current += ch;
      }
    }
    cols.push(current.trim());
    rows.push(cols);
  }

  return rows;
}

/* ── Fetch a public CSV URL (60s revalidation) ── */
async function fetchCSV(url: string): Promise<string[][]> {
  const res = await fetch(url, {
    next: { revalidate: 60 },
    headers: { Accept: "text/csv, text/plain" },
  });
  if (!res.ok) throw new Error(`HTTP ${res.status} fetching sheet`);
  return parseCSV(await res.text());
}

/* ── Parse the "products" tab ── */
function parseProducts(rows: string[][]): SheetProduct[] {
  if (rows.length < 2) return [];
  // Expected columns: id, price, active
  return rows
    .slice(1) // skip header row
    .filter((r) => r.length >= 3 && r[0])
    .map((r) => ({
      id: r[0].toLowerCase().trim(),
      price: parseFloat(r[1]) || 0,
      active: r[2].toUpperCase() !== "FALSE",
    }));
}

/* ── Parse the "settings" tab ── */
function parseSettings(rows: string[][]): SheetSettings {
  const map: Record<string, string> = {};
  rows.slice(1).forEach((r) => {
    if (r[0]) map[r[0].trim()] = (r[1] || "").trim();
  });

  const closedDaysRaw = map.closedDays || "0";
  const closedDays = closedDaysRaw
    .split(",")
    .map((d) => parseInt(d.trim()))
    .filter((n) => !isNaN(n));

  const manualRaw = (map.manualStatus || "auto").toLowerCase();
  const manualStatus =
    manualRaw === "open" ? "open" : manualRaw === "closed" ? "closed" : "auto";

  return {
    openHour: parseInt(map.openHour || "8") || 8,
    closeHour: parseInt(map.closeHour || "21") || 21,
    closedDays: closedDays.length ? closedDays : [0],
    manualStatus,
    manualClosedReason: map.manualClosedReason || "",
  };
}

/* ── GET /api/menu ── */
export async function GET() {
  const productsUrl = process.env.SHEET_PRODUCTS_URL;
  const settingsUrl = process.env.SHEET_SETTINGS_URL;

  // If env vars are not configured, return graceful fallback
  if (!productsUrl || !settingsUrl) {
    const fallback: SheetData = {
      products: [],
      settings: DEFAULT_SETTINGS,
    };
    return NextResponse.json(fallback, {
      headers: { "Cache-Control": "public, s-maxage=60, stale-while-revalidate=30" },
    });
  }

  try {
    const [productRows, settingsRows] = await Promise.all([
      fetchCSV(productsUrl),
      fetchCSV(settingsUrl),
    ]);

    const data: SheetData = {
      products: parseProducts(productRows),
      settings: parseSettings(settingsRows),
    };

    return NextResponse.json(data, {
      headers: { "Cache-Control": "public, s-maxage=60, stale-while-revalidate=30" },
    });
  } catch (err) {
    console.error("[/api/menu] Failed to fetch sheet:", err);
    // Return graceful fallback — site continues working
    const fallback: SheetData = {
      products: [],
      settings: DEFAULT_SETTINGS,
    };
    return NextResponse.json(fallback, { status: 200 });
  }
}
