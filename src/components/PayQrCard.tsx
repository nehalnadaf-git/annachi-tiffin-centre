"use client";

import { QRCodeSVG } from "qrcode.react";
import { BRAND } from "@/lib/data";

export default function PayQrCard({
  upiLink,
  amount,
}: {
  upiLink: string;
  amount: number;
}) {
  return (
    <div
      style={{
        background: "#fff",
        borderRadius: 24,
        padding: "28px 24px 22px",
        textAlign: "center",
        boxShadow: "0 18px 50px rgba(0,0,0,0.28)",
      }}
    >
      <p
        style={{
          fontFamily: "var(--font-inter)",
          fontSize: 11,
          letterSpacing: "0.14em",
          textTransform: "uppercase",
          color: "#2E7D32",
          marginBottom: 16,
          fontWeight: 600,
        }}
      >
        Scan to pay ₹{amount}
      </p>
      <div style={{ display: "flex", justifyContent: "center" }}>
        <QRCodeSVG value={upiLink} size={220} level="M" includeMargin={false} />
      </div>
      <p
        style={{
          fontFamily: "var(--font-inter)",
          fontSize: 12,
          color: "#5a5a5a",
          marginTop: 16,
          lineHeight: 1.5,
        }}
      >
        Google Pay · PhonePe · Paytm · any UPI app
      </p>
      <a
        href={upiLink}
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          marginTop: 18,
          background: "linear-gradient(135deg, #2E7D32, #1B5E20)",
          color: "#fff",
          textDecoration: "none",
          borderRadius: 14,
          padding: "14px 18px",
          fontFamily: "var(--font-inter)",
          fontSize: 14,
          fontWeight: 500,
          boxShadow: "0 6px 28px rgba(46,125,50,0.40)",
        }}
      >
        Open UPI app · ₹{amount}
      </a>
      <p
        style={{
          fontFamily: "var(--font-inter)",
          fontSize: 11,
          color: "#888",
          marginTop: 12,
        }}
      >
        Pay to {BRAND.paytmUpiId}
      </p>
    </div>
  );
}
