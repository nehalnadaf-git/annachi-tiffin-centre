import { ImageResponse } from "next/og";
import QRCode from "qrcode";
import { BRAND } from "@/lib/data";
import { buildUpiLink, decodePayToken, itemSummary } from "@/lib/pay";

export const runtime = "nodejs";
export const alt = "Annachi Tiffin Centre UPI payment QR";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

type ImageProps = { params: Promise<{ token: string }> };

export default async function OpenGraphImage({ params }: ImageProps) {
  const { token } = await params;
  const order = decodePayToken(token);

  if (!order) {
    return new ImageResponse(
      (
        <div
          style={{
            width: "100%",
            height: "100%",
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            padding: 80,
            background: "linear-gradient(135deg, #0d2210 0%, #1B5E20 100%)",
            color: "white",
            fontFamily: "sans-serif",
          }}
        >
          <div style={{ display: "flex", fontSize: 28, letterSpacing: "0.2em", textTransform: "uppercase", color: "#A5D6A7" }}>
            {BRAND.name}
          </div>
          <div style={{ display: "flex", fontSize: 64, marginTop: 18, fontWeight: 600 }}>
            Payment link expired
          </div>
        </div>
      ),
      size,
    );
  }

  const upiLink = buildUpiLink(order.amount);
  const qrDataUrl = await QRCode.toDataURL(upiLink, {
    width: 520,
    margin: 1,
    errorCorrectionLevel: "M",
    color: { dark: "#0d2210", light: "#ffffff" },
  });
  const summary = itemSummary(order, 70);

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          background: "linear-gradient(135deg, #071409 0%, #123318 55%, #1B5E20 100%)",
          color: "white",
          fontFamily: "sans-serif",
          padding: 56,
        }}
      >
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            flex: 1,
            paddingRight: 40,
          }}
        >
          <div style={{ display: "flex", flexDirection: "column" }}>
            <div style={{ display: "flex", fontSize: 22, letterSpacing: "0.22em", textTransform: "uppercase", color: "#A5D6A7" }}>
              {BRAND.name}
            </div>
            <div style={{ display: "flex", fontSize: 72, fontWeight: 700, marginTop: 22, letterSpacing: "-0.04em" }}>
              {`Pay ₹${order.amount}`}
            </div>
            <div style={{ display: "flex", fontSize: 28, marginTop: 12, color: "rgba(255,255,255,0.82)" }}>
              {`Order for ${order.customerName}`}
            </div>
            <div style={{ display: "flex", fontSize: 24, marginTop: 18, color: "rgba(165,214,167,0.9)", lineHeight: 1.4 }}>
              {summary}
            </div>
          </div>
          <div style={{ display: "flex", fontSize: 22, color: "rgba(255,255,255,0.55)" }}>
            Scan the QR with any UPI app
          </div>
        </div>
        <div
          style={{
            width: 430,
            height: 430,
            background: "white",
            borderRadius: 28,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            alignSelf: "center",
          }}
        >
          <img src={qrDataUrl} width={360} height={360} alt="" />
        </div>
      </div>
    ),
    size,
  );
}
