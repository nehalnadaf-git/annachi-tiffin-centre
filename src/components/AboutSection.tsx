"use client";
import { motion } from "framer-motion";
import { MapPin, Clock, ChevronDown, ChevronUp } from "lucide-react";
import { useState } from "react";
import { BRAND, FAQS } from "@/lib/data";

export default function AboutSection() {
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  return (
    <section id="about" style={{ padding: "clamp(56px, 8vw, 96px) 0", overflow: "hidden", position: "relative" }}>
      {/* Background glow */}
      <div aria-hidden style={{
        position: "absolute", left: 0, top: "50%", transform: "translateY(-50%)",
        width: "400px", height: "400px",
        background: "hsl(var(--primary)/0.05)", filter: "blur(120px)",
        pointerEvents: "none",
      }} />

      <div className="container" style={{ maxWidth: "1280px", position: "relative", zIndex: 1 }}>
        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
          gap: "clamp(40px, 6vw, 64px)",
          alignItems: "start",
        }}>

          {/* LEFT — Story */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          >
            <div className="section-label" style={{ marginBottom: "20px" }}>Our Story</div>
            <h2 className="font-display" style={{
              fontWeight: 400,
              fontSize: "clamp(32px, 4.5vw, 56px)",
              lineHeight: 1.05,
              marginBottom: "24px",
            }}>
              Annachi&apos;s<br />
              <span className="text-gradient">Tiffin Centre</span>
            </h2>

            <p style={{
              fontFamily: "var(--font-inter)",
              fontSize: "clamp(14px, 1.6vw, 16px)",
              color: "#424242",
              lineHeight: 1.8,
              marginBottom: "20px",
              fontWeight: 400,
            }}>
              Our journey began with a simple mission: to bring the true, soulful taste of Tamil Nadu to the streets of Hubli. At Annachi Tiffin Centre, we believe that breakfast isn&apos;t just a meal—it&apos;s a tradition that sets the tone for your entire day. That&apos;s why we never compromise on our ingredients or our methods.
            </p>
            <p style={{
              fontFamily: "var(--font-inter)",
              fontSize: "clamp(14px, 1.6vw, 16px)",
              color: "#424242",
              lineHeight: 1.8,
              marginBottom: "32px",
              fontWeight: 400,
            }}>
              Every morning in Shanti Nagar, our kitchen comes alive with the sound of sizzling dosas and the aroma of freshly ground sambar spices. We stay true to our roots, using age-old recipes and cooking everything from scratch. No reheating, no shortcuts—just the honest, authentic flavors that have made us Hubli&apos;s favorite tiffin spot.
            </p>

            {/* 3-pillar grid */}
            <div style={{
              borderTop: "1px solid rgba(0,0,0,0.06)",
              paddingTop: "24px", marginTop: "32px",
              display: "grid",
              gridTemplateColumns: "repeat(3, 1fr)",
              gap: "12px",
            }}>
              {[
                { label: "Freshly Cooked", sub: "Made to order only" },
                { label: "Authenticity", sub: "True Tamil flavors" },
                { label: "Hygienic Prep", sub: "Quality ingredients" },
              ].map((p) => (
                <div key={p.label}>
                  <p style={{
                    fontFamily: "var(--font-inter)",
                    fontSize: "9px", fontWeight: 600,
                    textTransform: "uppercase", letterSpacing: "0.12em",
                    color: "#2E7D32", marginBottom: "4px",
                  }}>{p.label}</p>
                  <p style={{
                    fontFamily: "var(--font-inter)",
                    fontSize: "12px", fontWeight: 500,
                    color: "#424242",
                    lineHeight: 1.4,
                  }}>{p.sub}</p>
                </div>
              ))}
            </div>

            {/* Hours table */}
            <div style={{
              marginTop: "32px",
              padding: "16px 20px",
              borderRadius: "16px",
              background: "#ffffff",
              border: "1px solid rgba(0,0,0,0.04)",
              boxShadow: "0 8px 24px rgba(0,0,0,0.04), 0 2px 8px rgba(0,0,0,0.02)",
            }}>
              <p style={{
                fontFamily: "var(--font-inter)",
                fontSize: "10px", fontWeight: 600,
                letterSpacing: "0.14em", textTransform: "uppercase",
                color: "#757575", marginBottom: "12px",
              }}>Hours of Operation</p>
              <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                {[
                  { day: "Monday – Saturday", time: "8:00 AM – 9:00 PM", open: true },
                  { day: "Sunday", time: "Closed (Holiday)", open: false },
                ].map((h) => (
                  <div key={h.day} style={{ 
                    display: "flex", justifyContent: "space-between", alignItems: "center",
                    borderBottom: h.open ? "1px solid rgba(0,0,0,0.05)" : "none",
                    paddingBottom: h.open ? "10px" : "0"
                  }}>
                    <span style={{ fontFamily: "var(--font-inter)", fontSize: "13px", fontWeight: 500, color: "#424242" }}>{h.day}</span>
                    <span style={{
                      fontFamily: "var(--font-inter)", fontSize: "12px", fontWeight: 600,
                      color: h.open ? "#2E7D32" : "#D32F2F",
                    }}>{h.time}</span>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>

          {/* RIGHT — Info card + FAQ */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
            style={{ display: "flex", flexDirection: "column", gap: "24px" }}
          >
            {/* Info card */}
            <div style={{ 
              padding: "clamp(20px, 4vw, 28px)", 
              borderRadius: "20px",
              background: "#ffffff",
              border: "1px solid rgba(0,0,0,0.03)",
              boxShadow: "0 12px 36px rgba(0,0,0,0.06), 0 2px 12px rgba(0,0,0,0.03)",
            }}>
              <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
                {[
                  {
                    icon: <MapPin size={16} strokeWidth={2} color="#ffffff" />,
                    label: "Address",
                    value: "Shanti Nagar, Hubli, Karnataka",
                    bg: "linear-gradient(135deg, #E65100, #F57C00)",
                    shadow: "rgba(230,81,0,0.4)"
                  },
                  {
                    icon: <Clock size={16} strokeWidth={2} color="#ffffff" />,
                    label: "Hours",
                    value: "Mon – Sat: 8:00 AM – 9:00 PM · Sunday: Closed",
                    bg: "linear-gradient(135deg, #283593, #3F51B5)",
                    shadow: "rgba(63,81,181,0.4)"
                  },
                ].map((row, i) => (
                  <motion.div
                    key={row.label}
                    initial={{ opacity: 0, y: 12 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.1 }}
                    style={{ display: "flex", gap: "16px", alignItems: "flex-start" }}
                  >
                    <div style={{
                      width: "40px", height: "40px", borderRadius: "12px",
                      background: row.bg,
                      display: "flex", alignItems: "center", justifyContent: "center",
                      flexShrink: 0,
                      boxShadow: `0 8px 16px ${row.shadow}, inset 0 2px 4px rgba(255,255,255,0.3)`,
                    }}>
                      <span style={{ filter: "drop-shadow(0 2px 4px rgba(0,0,0,0.2))" }}>
                        {row.icon}
                      </span>
                    </div>
                    <div style={{ paddingTop: "2px" }}>
                      <p style={{ fontFamily: "var(--font-inter)", fontSize: "10px", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.16em", color: "#757575", marginBottom: "4px" }}>{row.label}</p>
                      <p style={{ fontFamily: "var(--font-inter)", fontSize: "13px", fontWeight: 600, color: "#212121", lineHeight: 1.5, letterSpacing: "-0.01em" }}>{row.value}</p>
                    </div>
                  </motion.div>
                ))}
              </div>

              {/* Payment methods */}
              <div style={{ marginTop: "24px", paddingTop: "20px", borderTop: "1px solid rgba(0,0,0,0.06)" }}>
                <p style={{ fontFamily: "var(--font-inter)", fontSize: "10px", fontWeight: 600, letterSpacing: "0.14em", textTransform: "uppercase", color: "#757575", marginBottom: "12px" }}>Payment Accepted</p>
                <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
                  {["📱 UPI", "💵 Cash"].map((pm) => (
                    <span key={pm} style={{
                      padding: "6px 12px", borderRadius: "9999px",
                      background: "linear-gradient(135deg, rgba(27,94,32,0.90), rgba(46,125,50,0.85))",
                      border: "1px solid rgba(165,214,167,0.45)",
                      color: "#C8E6C9",
                      fontFamily: "var(--font-inter)", fontSize: "11px", fontWeight: 500,
                      boxShadow: "0 4px 12px rgba(46,125,50,0.20), inset 0 1px 0 rgba(165,214,167,0.15)",
                    }}>{pm}</span>
                  ))}
                  <span style={{
                    padding: "6px 12px", borderRadius: "9999px",
                    background: "#f5f5f5",
                    border: "1px solid #e0e0e0",
                    color: "#9e9e9e",
                    fontFamily: "var(--font-inter)", fontSize: "11px", fontWeight: 500,
                    textDecoration: "line-through",
                  }}>💳 Card</span>
                </div>
              </div>
            </div>

            {/* FAQ */}
            <div>
              <p style={{ fontFamily: "var(--font-inter)", fontSize: "10px", fontWeight: 400, letterSpacing: "0.14em", textTransform: "uppercase", color: "hsl(var(--muted-foreground))", marginBottom: "16px" }}>Frequently Asked Questions</p>
              <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                {FAQS.map((faq, i) => (
                  <div
                    key={i}
                    style={{
                      borderRadius: "14px",
                      border: "1px solid hsl(var(--border))",
                      background: openFaq === i ? "hsl(var(--card))" : "transparent",
                      overflow: "hidden",
                      transition: "background 200ms",
                    }}
                  >
                    <button
                      onClick={() => setOpenFaq(openFaq === i ? null : i)}
                      style={{
                        width: "100%", display: "flex",
                        alignItems: "center", justifyContent: "space-between",
                        padding: "14px 16px",
                        background: "none", border: "none", cursor: "pointer",
                        textAlign: "left",
                      }}
                    >
                      <span style={{ fontFamily: "var(--font-inter)", fontSize: "13px", fontWeight: 400, color: "hsl(var(--foreground)/0.85)" }}>{faq.q}</span>
                      {openFaq === i ? <ChevronUp size={16} style={{ color: "hsl(var(--primary-light))", flexShrink: 0 }} /> : <ChevronDown size={16} style={{ color: "hsl(var(--muted-foreground))", flexShrink: 0 }} />}
                    </button>
                    {openFaq === i && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.25 }}
                        style={{ padding: "0 16px 14px" }}
                      >
                        <p style={{ fontFamily: "var(--font-inter)", fontSize: "13px", color: "hsl(var(--muted-foreground))", lineHeight: 1.7 }}>{faq.a}</p>
                      </motion.div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
