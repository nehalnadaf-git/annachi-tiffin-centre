import { BRAND } from "@/lib/data";

export type PayItem = {
  name: string;
  qty: number;
  price: number;
};

export type PayOrder = {
  customerName: string;
  amount: number;
  items: PayItem[];
  createdAt: number;
};

type CompactPayload = {
  n: string;
  a: number;
  i: [string, number, number][];
  t: number;
};

export function buildUpiLink(amount: number, note = "Annachi Tiffin Centre Order"): string {
  const tn = encodeURIComponent(note);
  const name = encodeURIComponent(BRAND.name);
  return `upi://pay?pa=${BRAND.paytmUpiId}&pn=${name}&am=${amount}&cu=INR&tn=${tn}`;
}

function toBase64Url(bytes: Uint8Array): string {
  let binary = "";
  for (let i = 0; i < bytes.length; i++) binary += String.fromCharCode(bytes[i]!);
  return btoa(binary).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/g, "");
}

function fromBase64Url(token: string): Uint8Array {
  const padded = token.replace(/-/g, "+").replace(/_/g, "/");
  const pad = padded.length % 4 === 0 ? "" : "=".repeat(4 - (padded.length % 4));
  const binary = atob(padded + pad);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) bytes[i] = binary.charCodeAt(i);
  return bytes;
}

export function encodePayToken(order: PayOrder): string {
  const payload: CompactPayload = {
    n: order.customerName.trim().slice(0, 80),
    a: Math.round(order.amount),
    i: order.items.slice(0, 40).map((it) => [
      it.name.slice(0, 60),
      Math.max(1, Math.round(it.qty)),
      Math.max(0, Math.round(it.price)),
    ]),
    t: order.createdAt,
  };
  return toBase64Url(new TextEncoder().encode(JSON.stringify(payload)));
}

export function decodePayToken(token: string): PayOrder | null {
  try {
    const json = new TextDecoder().decode(fromBase64Url(token));
    const raw = JSON.parse(json) as CompactPayload;
    if (!raw || typeof raw.n !== "string" || typeof raw.a !== "number" || !Array.isArray(raw.i)) {
      return null;
    }
    if (!Number.isFinite(raw.a) || raw.a <= 0) return null;
    const items = raw.i
      .filter((row) => Array.isArray(row) && typeof row[0] === "string")
      .map((row) => ({
        name: row[0],
        qty: Number(row[1]) || 1,
        price: Number(row[2]) || 0,
      }));
    if (items.length === 0) return null;
    return {
      customerName: raw.n.trim() || "Guest",
      amount: Math.round(raw.a),
      items,
      createdAt: typeof raw.t === "number" ? raw.t : Date.now(),
    };
  } catch {
    return null;
  }
}

export function buildPayPath(order: PayOrder): string {
  return `/pay/${encodePayToken(order)}`;
}

export function buildPayUrl(origin: string, order: PayOrder): string {
  return `${origin.replace(/\/$/, "")}${buildPayPath(order)}`;
}

export function itemSummary(order: PayOrder, max = 90): string {
  const text = order.items.map((it) => `${it.qty}× ${it.name}`).join(", ");
  if (text.length <= max) return text;
  return `${text.slice(0, max - 1)}…`;
}

export function formatOrderWhen(createdAt: number): { date: string; time: string } {
  const now = new Date(createdAt);
  return {
    date: `${now.getDate()}/${now.getMonth() + 1}/${now.getFullYear()}`,
    time: now.toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" }),
  };
}

export function buildCheckoutWhatsAppMessage(order: PayOrder, payUrl: string): string {
  const { date, time } = formatOrderWhen(order.createdAt);
  const itemLines = order.items
    .map((it) => `  - ${it.name.padEnd(20)} x${it.qty}  Rs. ${(it.qty * it.price).toFixed(0)}`)
    .join("\n");

  return (
    `ORDER REQUEST —\n` +
    `${BRAND.name}\n` +
    `--------------------------------------\n` +
    `Customer  : ${order.customerName}\n` +
    `Date      : ${date}\n` +
    `Time      : ${time}\n` +
    `--------------------------------------\n` +
    `ITEMS ORDERED\n` +
    `${itemLines}\n` +
    `--------------------------------------\n` +
    `TOTAL AMOUNT : Rs. ${order.amount}\n` +
    `--------------------------------------\n` +
    `Pay here (QR + UPI):\n${payUrl}\n` +
    `--------------------------------------\n` +
    `Kindly confirm this order once payment is done.\n` +
    `Thank you for ordering from ${BRAND.name}.`
  );
}
