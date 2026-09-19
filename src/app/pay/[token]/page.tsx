import type { Metadata } from "next";
import Link from "next/link";
import { headers } from "next/headers";
import { BRAND } from "@/lib/data";
import {
  buildUpiLink,
  decodePayToken,
  formatOrderWhen,
  itemSummary,
} from "@/lib/pay";
import PayQrCard from "@/components/PayQrCard";

type PageProps = { params: Promise<{ token: string }> };

async function siteOrigin(): Promise<string> {
  if (process.env.NEXT_PUBLIC_SITE_URL) {
    return process.env.NEXT_PUBLIC_SITE_URL.replace(/\/$/, "");
  }
  const h = await headers();
  const host = h.get("x-forwarded-host") || h.get("host") || "localhost:3000";
  const proto = h.get("x-forwarded-proto") || (host.includes("localhost") ? "http" : "https");
  return `${proto}://${host}`;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { token } = await params;
  const order = decodePayToken(token);
  const origin = await siteOrigin();

  if (!order) {
    return {
      title: `Payment | ${BRAND.name}`,
      description: `UPI payment for ${BRAND.name}.`,
      metadataBase: new URL(origin),
    };
  }

  const summary = itemSummary(order);
  const title = `Pay ₹${order.amount} – ${BRAND.name}`;
  const description = `${order.customerName}'s order: ${summary}. Scan the QR to pay via UPI.`;

  return {
    title,
    description,
    metadataBase: new URL(origin),
    openGraph: {
      title,
      description,
      url: `${origin}/pay/${token}`,
      siteName: BRAND.name,
      locale: "en_IN",
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
    },
  };
}

export default async function PayPage({ params }: PageProps) {
  const { token } = await params;
  const order = decodePayToken(token);

  if (!order) {
    return (
      <main style={pageShell}>
        <div style={{ maxWidth: 420, margin: "0 auto", textAlign: "center" }}>
          <h1 style={{ color: "#fff", fontSize: 22, fontWeight: 500, marginBottom: 10 }}>
            This payment link is invalid
          </h1>
          <p style={{ color: "rgba(255,255,255,0.55)", fontSize: 14, marginBottom: 24 }}>
            Ask the customer to place the order again from the website.
          </p>
          <Link href="/" style={homeLink}>
            Back to menu
          </Link>
        </div>
      </main>
    );
  }

  const upiLink = buildUpiLink(order.amount);
  const { date, time } = formatOrderWhen(order.createdAt);

  return (
    <main style={pageShell}>
      <div style={{ maxWidth: 440, margin: "0 auto", width: "100%" }}>
        <p style={eyebrow}>{BRAND.name}</p>
        <h1 style={{ color: "#fff", fontSize: 26, fontWeight: 500, letterSpacing: "-0.03em", marginBottom: 6 }}>
          Pay ₹{order.amount}
        </h1>
        <p style={{ color: "rgba(165,214,167,0.85)", fontSize: 14, marginBottom: 22 }}>
          Order for {order.customerName} · {date} {time}
        </p>

        <PayQrCard upiLink={upiLink} amount={order.amount} />

        <div style={ticket}>
          <p style={ticketLabel}>Items</p>
          {order.items.map((it) => (
            <div key={`${it.name}-${it.qty}-${it.price}`} style={ticketRow}>
              <span>
                {it.name} × {it.qty}
              </span>
              <span>₹{it.qty * it.price}</span>
            </div>
          ))}
          <div style={{ ...ticketRow, marginTop: 10, paddingTop: 10, borderTop: "1px solid rgba(165,214,167,0.16)", fontWeight: 600, color: "#fff" }}>
            <span>Total</span>
            <span>₹{order.amount}</span>
          </div>
        </div>

        <p style={{ color: "rgba(255,255,255,0.38)", fontSize: 12, textAlign: "center", marginTop: 22, lineHeight: 1.6 }}>
          After paying, send a screenshot on WhatsApp so we can confirm the order.
        </p>
        <div style={{ textAlign: "center", marginTop: 16 }}>
          <Link href="/" style={homeLink}>
            Back to menu
          </Link>
        </div>
      </div>
    </main>
  );
}

const pageShell: React.CSSProperties = {
  minHeight: "100dvh",
  background: "linear-gradient(180deg, #0d2210 0%, #060d07 100%)",
  padding: "36px 20px 48px",
  fontFamily: "var(--font-inter)",
};

const eyebrow: React.CSSProperties = {
  fontSize: 11,
  letterSpacing: "0.16em",
  textTransform: "uppercase",
  color: "rgba(165,214,167,0.6)",
  marginBottom: 10,
};

const ticket: React.CSSProperties = {
  marginTop: 22,
  background: "rgba(255,255,255,0.06)",
  border: "1px solid rgba(165,214,167,0.14)",
  borderRadius: 18,
  padding: "16px 18px",
};

const ticketLabel: React.CSSProperties = {
  fontSize: 11,
  letterSpacing: "0.12em",
  textTransform: "uppercase",
  color: "rgba(165,214,167,0.65)",
  marginBottom: 10,
};

const ticketRow: React.CSSProperties = {
  display: "flex",
  justifyContent: "space-between",
  gap: 12,
  fontSize: 14,
  color: "rgba(255,255,255,0.82)",
  marginBottom: 8,
};

const homeLink: React.CSSProperties = {
  color: "#A5D6A7",
  fontSize: 13,
  textDecoration: "none",
};
