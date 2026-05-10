"use client";
import { motion } from "framer-motion";

import { Flame, Leaf, ShieldCheck } from "lucide-react";

const FEATURES = [
  {
    icon: <Flame strokeWidth={1.5} size={28} color="#A5D6A7" />,
    tag: "Zero Reheating",
    tagStyle: {
      background: "linear-gradient(135deg, rgba(46,125,50,0.85), rgba(27,94,32,0.90))",
      border: "1px solid rgba(165,214,167,0.50)",
      color: "#A5D6A7",
      boxShadow: "0 2px 12px rgba(46,125,50,0.35)",
    },
    title: "Always Fresh",
    desc: "Cooked fresh every single morning — no reheating, no shortcuts. You taste the difference the moment it hits your plate.",
    gradient: "linear-gradient(135deg, rgba(46,125,50,0.15), rgba(46,125,50,0.04))",
    border: "rgba(46,125,50,0.18)",
  },
  {
    icon: <Leaf strokeWidth={1.5} size={28} color="#FDD663" />,
    tag: "True Tamil Flavor",
    tagStyle: {
      background: "linear-gradient(135deg, rgba(180,120,0,0.85), rgba(140,90,0,0.90))",
      border: "1px solid rgba(249,200,80,0.50)",
      color: "#FDD663",
      boxShadow: "0 2px 12px rgba(180,120,0,0.35)",
    },
    title: "Authentic Spice",
    desc: "Real Tamilian street-style flavors, bold and honest. The true taste of Tamil Nadu, served hot — crafted from scratch every day.",
    gradient: "linear-gradient(135deg, rgba(249,168,37,0.12), rgba(249,168,37,0.03))",
    border: "rgba(249,168,37,0.18)",
  },
  {
    icon: <ShieldCheck strokeWidth={1.5} size={28} color="#FFAB91" />,
    tag: "Food Safety First",
    tagStyle: {
      background: "linear-gradient(135deg, rgba(180,55,0,0.85), rgba(140,40,0,0.90))",
      border: "1px solid rgba(255,138,101,0.50)",
      color: "#FFAB91",
      boxShadow: "0 2px 12px rgba(180,55,0,0.35)",
    },
    title: "Hygienic Kitchen",
    desc: "Clean cooking, quality ingredients, handled with care from station to plate. Your health comes first — every single day.",
    gradient: "linear-gradient(135deg, rgba(230,81,0,0.10), rgba(230,81,0,0.02))",
    border: "rgba(230,81,0,0.15)",
  },
];

export default function WhyChooseUs() {
  return (
    <section style={{ padding: "clamp(64px, 8vw, 112px) 0", overflow: "hidden", position: "relative" }}>
      {/* Background glow */}
      <div aria-hidden style={{
        position: "absolute",
        left: "50%", top: "50%",
        transform: "translate(-50%, -50%)",
        width: "800px", height: "400px",
        background: "radial-gradient(ellipse, hsl(var(--primary)/0.08), transparent 70%)",
        filter: "blur(160px)", opacity: 0.4, pointerEvents: "none",
      }} />

      <div className="container" style={{ maxWidth: "1152px", position: "relative", zIndex: 1 }}>
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          style={{ textAlign: "center", marginBottom: "clamp(40px, 6vw, 60px)" }}
        >
          <div className="section-label" style={{ marginBottom: "16px" }}>
            <span style={{
              width: "6px", height: "6px", borderRadius: "50%",
              background: "hsl(var(--primary-light))",
              animation: "pulse-dot 2s ease-in-out infinite",
            }} />
            Our Promise
          </div>
          <h2 className="font-display" style={{
            fontWeight: 400,
            fontSize: "clamp(28px, 4.5vw, 56px)",
            marginBottom: "16px",
          }}>
            Why Choose{" "}
            <span className="text-gradient">Annachi?</span>
          </h2>
          <p style={{
            fontFamily: "var(--font-inter)",
            fontSize: "clamp(13px, 1.5vw, 16px)",
            color: "hsl(var(--muted-foreground))",
            maxWidth: "520px",
            margin: "0 auto",
            lineHeight: 1.85,
          }}>
            Three pillars that make every visit worth coming back for —{" "}
            <span style={{ color: "hsl(var(--primary-light))", fontWeight: 400 }}>every single time.</span>
          </p>
        </motion.div>

        {/* 3 Cards */}
        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
          gap: "20px",
        }}>
          {FEATURES.map((f, i) => (
            <motion.div
              key={f.title}
              initial={{ opacity: 0, y: 32 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{ delay: i * 0.12, duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
              whileHover={{ y: -6 }}
              className="group"
              style={{
                background: "hsl(var(--card))",
                border: "1px solid hsl(var(--border)/0.8)",
                borderRadius: "24px",
                overflow: "hidden",
                position: "relative",
                cursor: "default",
              }}
            >
              {/* Hover gradient overlay */}
              <div style={{
                position: "absolute", inset: 0,
                background: f.gradient,
                opacity: 0,
                transition: "opacity 500ms",
                borderRadius: "24px",
                pointerEvents: "none",
              }}
                onMouseEnter={(e) => ((e.currentTarget as HTMLElement).style.opacity = "1")}
                onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.opacity = "0")}
              />

              <div style={{ padding: "clamp(24px, 4vw, 32px)", display: "flex", flexDirection: "column", gap: "20px" }}>
                {/* Icon badge */}
                <motion.div
                  whileHover={{ scale: 1.15, rotate: 5 }}
                  transition={{ type: "spring", stiffness: 300 }}
                  style={{
                    width: "56px", height: "56px",
                    borderRadius: "16px",
                    background: f.gradient,
                    border: `1px solid ${f.border}`,
                    boxShadow: `0 4px 16px ${f.border}`,
                    display: "flex", alignItems: "center", justifyContent: "center",
                    fontSize: "26px",
                  }}
                >
                  {f.icon}
                </motion.div>

                {/* Tag */}
                <span style={{
                  fontFamily: "var(--font-inter)",
                  fontSize: "10px", fontWeight: 500,
                  letterSpacing: "0.16em", textTransform: "uppercase",
                  padding: "5px 14px", borderRadius: "9999px",
                  width: "fit-content",
                  ...f.tagStyle,
                }}>
                  {f.tag}
                </span>

                {/* Title */}
                <h3 className="font-display" style={{
                  fontSize: "clamp(20px, 2.5vw, 26px)",
                  fontWeight: 400,
                  color: "hsl(var(--foreground))",
                  transition: "color 300ms",
                }}>
                  {f.title}
                </h3>

                {/* Desc */}
                <p style={{
                  fontFamily: "var(--font-inter)",
                  fontSize: "clamp(13px, 1.4vw, 15px)",
                  color: "hsl(var(--muted-foreground))",
                  lineHeight: 1.85,
                  fontWeight: 400,
                }}>
                  {f.desc}
                </p>

                {/* Animated bottom line */}
                <div style={{
                  height: "1px",
                  background: "linear-gradient(90deg, hsl(var(--primary)/0.60), hsl(var(--primary)/0.10))",
                  width: "0",
                  transition: "width 500ms ease-out",
                }}
                  onMouseEnter={(e) => ((e.currentTarget as HTMLElement).style.width = "100%")}
                  onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.width = "0")}
                />
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
