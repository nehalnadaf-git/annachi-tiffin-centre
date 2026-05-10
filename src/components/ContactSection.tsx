"use client";
import { motion } from "framer-motion";
import { BRAND } from "@/lib/data";

export default function ContactSection() {
  return (
    <section id="contact" style={{ padding: "clamp(64px, 8vw, 96px) 0", overflow: "hidden", position: "relative" }}>
      {/* Subtle background glow */}
      <div aria-hidden style={{
        position: "absolute", bottom: 0, left: "50%", transform: "translateX(-50%)",
        width: "500px", height: "300px",
        background: "hsl(var(--primary)/0.05)",
        filter: "blur(140px)", pointerEvents: "none",
      }} />

      <div className="container" style={{ position: "relative", zIndex: 1 }}>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          style={{ textAlign: "center" }}
        >
          {/* Label */}
          <div className="section-label" style={{ marginBottom: "16px" }}>
            <span style={{ width: "6px", height: "6px", borderRadius: "50%", background: "hsl(var(--primary-light))", animation: "pulse-dot 2s infinite" }} />
            Contact
          </div>

          {/* Heading */}
          <h2 className="font-display" style={{
            fontWeight: 400,
            fontSize: "clamp(28px, 5vw, 56px)",
            marginBottom: "12px",
            lineHeight: 1.05,
          }}>
            Come Visit <span className="text-gradient">Us</span>
          </h2>

          {/* One-line info */}
          <p style={{
            fontFamily: "var(--font-inter)",
            fontSize: "clamp(13px, 1.6vw, 15px)",
            color: "#555555",
            lineHeight: 1.7,
            marginBottom: "32px",
            fontWeight: 400,
          }}>
            📍 Shanti Nagar, Hubli &nbsp;·&nbsp; 🌿 Pure Veg Tamil Breakfast
          </p>

          {/* Action buttons */}
          <div style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            gap: "12px",
            flexWrap: "wrap",
            marginBottom: "12px",
          }}>
            {/* Call button — solid dark */}
            <motion.a
              href={`tel:${BRAND.phone}`}
              whileHover={{ scale: 1.04, boxShadow: "0 6px 20px rgba(0,0,0,0.18)" }}
              whileTap={{ scale: 0.96 }}
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "8px",
                padding: "11px 22px",
                borderRadius: "9999px",
                background: "#1a1a1a",
                border: "1px solid rgba(0,0,0,0.12)",
                color: "#ffffff",
                fontFamily: "var(--font-inter)",
                fontSize: "13px",
                fontWeight: 500,
                textDecoration: "none",
                letterSpacing: "0.01em",
                boxShadow: "0 2px 12px rgba(0,0,0,0.12)",
                whiteSpace: "nowrap",
              }}
            >
              📞 Call Us
            </motion.a>

            {/* WhatsApp button — forest green */}
            <motion.a
              href={`https://wa.me/${BRAND.whatsapp}`}
              target="_blank"
              rel="noopener noreferrer"
              whileHover={{ scale: 1.04, boxShadow: "0 8px 24px rgba(46,125,50,0.45)" }}
              whileTap={{ scale: 0.96 }}
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "8px",
                padding: "11px 22px",
                borderRadius: "9999px",
                background: "linear-gradient(135deg, #1B5E20, #2E7D32)",
                border: "1px solid rgba(165,214,167,0.35)",
                color: "#E8F5E9",
                fontFamily: "var(--font-inter)",
                fontSize: "13px",
                fontWeight: 500,
                textDecoration: "none",
                letterSpacing: "0.01em",
                boxShadow: "0 4px 16px rgba(46,125,50,0.35)",
                whiteSpace: "nowrap",
              }}
            >
              💬 WhatsApp
            </motion.a>
          </div>

          {/* Direction button — below */}
          <div style={{ display: "flex", justifyContent: "center" }}>
            <motion.a
              href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent("Annachi Tiffin Centre Shanti Nagar Hubli")}`}
              target="_blank"
              rel="noopener noreferrer"
              whileHover={{ scale: 1.04, boxShadow: "0 6px 20px rgba(0,0,0,0.12)" }}
              whileTap={{ scale: 0.96 }}
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "8px",
                padding: "11px 24px",
                borderRadius: "9999px",
                background: "#ffffff",
                border: "1px solid rgba(0,0,0,0.15)",
                color: "#1a1a1a",
                fontFamily: "var(--font-inter)",
                fontSize: "13px",
                fontWeight: 500,
                textDecoration: "none",
                letterSpacing: "0.01em",
                boxShadow: "0 2px 8px rgba(0,0,0,0.06)",
                whiteSpace: "nowrap",
              }}
            >
              📍 Get Directions
            </motion.a>
          </div>

        </motion.div>
      </div>
    </section>
  );
}
