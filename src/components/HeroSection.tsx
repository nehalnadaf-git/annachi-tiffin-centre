"use client";
import { motion } from "framer-motion";
import Image from "next/image";
import { ArrowUpRight, Info } from "lucide-react";

export default function HeroSection() {
  const scrollToMenu = () => document.getElementById("menu")?.scrollIntoView({ behavior: "smooth" });
  const scrollToAbout = () => document.getElementById("about")?.scrollIntoView({ behavior: "smooth" });

  return (
    <section
      id="home"
      style={{
        position: "relative",
        minHeight: "90vh",
        maxHeight: "900px",
        display: "flex",
        alignItems: "center",
        background: "hsl(var(--background))",
        overflow: "hidden",
      }}
    >
      {/* Ambient blobs */}
      <div aria-hidden style={{
        position: "absolute", top: "10%", left: "0",
        width: "55%", height: "55%",
        background: "radial-gradient(ellipse, hsl(var(--primary)/0.07), transparent 70%)",
        filter: "blur(80px)", pointerEvents: "none",
      }} />
      <div aria-hidden style={{
        position: "absolute", bottom: "0", right: "0",
        width: "45%", height: "50%",
        background: "radial-gradient(ellipse, hsl(var(--secondary)/0.06), transparent 70%)",
        filter: "blur(100px)", pointerEvents: "none",
      }} />

      {/* Desktop: 2-col flex */}
      <div style={{
        width: "100%",
        maxWidth: "1440px",
        margin: "0 auto",
        paddingTop: "clamp(100px, 14vw, 150px)",
        paddingBottom: "clamp(40px, 5vw, 60px)",
        paddingLeft: "clamp(20px, 5vw, 80px)",
        paddingRight: "clamp(20px, 5vw, 80px)",
        display: "flex",
        alignItems: "center",
        gap: "clamp(24px, 4vw, 60px)",
        position: "relative",
        zIndex: 1,
      }}>

        {/* LEFT COLUMN */}
        <motion.div
          initial={{ x: -40, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
          style={{ flex: "0 0 52%", maxWidth: "52%" }}
        >
          {/* Hero Badge */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1, duration: 0.6 }}
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "8px",
              padding: "8px 18px",
              borderRadius: "9999px",
              background: "linear-gradient(135deg, rgba(27,94,32,0.90), rgba(46,125,50,0.85))",
              border: "1px solid rgba(165,214,167,0.45)",
              boxShadow: "0 2px 16px rgba(46,125,50,0.35), inset 0 1px 0 rgba(165,214,167,0.15)",
              marginBottom: "28px",
            }}
          >
            <span style={{
              width: "7px", height: "7px", borderRadius: "50%",
              background: "#A5D6A7",
              boxShadow: "0 0 10px rgba(165,214,167,1)",
              animation: "pulse-dot 2s ease-in-out infinite",
              flexShrink: 0,
            }} />
            <span style={{
              fontFamily: "var(--font-inter)",
              fontWeight: 500,
              fontSize: "clamp(9px, 1.1vw, 11px)",
              letterSpacing: "0.14em",
              textTransform: "uppercase",
              color: "#C8E6C9",
            }}>
              HUBLI&apos;S FINEST TAMILIAN TIFFIN
            </span>
          </motion.div>

          {/* H1 Headline — Outfit display font */}
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15, duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
            style={{
              fontFamily: "var(--font-display)",
              fontWeight: 500,
              fontSize: "clamp(40px, 5.8vw, 88px)",
              lineHeight: 0.95,
              letterSpacing: "-0.04em",
              marginBottom: "24px",
              color: "#000",
            }}
          >
            <span style={{ display: "block" }}>Taste the</span>
            <span style={{
              display: "block",
              background: "linear-gradient(135deg, #F9A825 0%, #2E7D32 60%, #1B5E20 100%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
              paddingBottom: "0.1em", // Slight padding to prevent descender clipping of the gradient
              marginBottom: "-0.1em",
            }}>tradition</span>
            <span style={{ display: "block" }}>of Tamil Nadu</span>
          </motion.h1>

          {/* Description */}
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.25, duration: 0.8 }}
            style={{
              fontFamily: "var(--font-inter)",
              fontSize: "clamp(13px, 1.5vw, 18px)",
              maxWidth: "460px",
              color: "#222",
              lineHeight: 1.75,
              marginBottom: "28px",
              fontWeight: 400,
            }}
          >
            Freshly made, authentic South Indian breakfast — crispy Dosa, soft
            Idli, golden Vada &amp; comforting Pongal. Crafted with love every
            morning in Shanti Nagar, Hubli.
          </motion.p>

          {/* Meta row */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.7 }}
            style={{ display: "flex", flexWrap: "wrap", gap: "clamp(14px, 2vw, 28px)", marginBottom: "36px" }}
          >
            {[
              { icon: "🕗", text: "Mon–Sat: 8 AM – 9 PM" },
              { icon: "📍", text: "Shanti Nagar, Hubli" },
              { icon: "🌿", text: "Pure Veg · Authentic Tamil" },
            ].map((item) => (
              <div key={item.text} style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                <span style={{ fontSize: "clamp(12px, 1.4vw, 16px)" }}>{item.icon}</span>
                <span style={{
                  fontFamily: "var(--font-inter)",
                  fontSize: "clamp(11px, 1.2vw, 14px)",
                  fontWeight: 500,
                  color: "hsl(var(--foreground)/0.60)",
                }}>{item.text}</span>
              </div>
            ))}
          </motion.div>

          {/* CTA Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.35, duration: 0.7 }}
            style={{ display: "flex", flexWrap: "wrap", gap: "12px" }}
          >
            {/* Primary */}
            <button
              id="hero-explore-btn"
              onClick={scrollToMenu}
              className="shimmer"
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "14px",
                padding: "clamp(12px, 1.5vw, 18px) clamp(20px, 3vw, 36px)",
                borderRadius: "60px",
                border: "none",
                background: "linear-gradient(135deg, #2E7D32, #1B5E20)",
                color: "#fff",
                fontFamily: "var(--font-inter)",
                fontSize: "clamp(13px, 1.4vw, 15px)",
                fontWeight: 400,
                cursor: "pointer",
                boxShadow: "0 14px 40px rgba(46,125,50,0.4)",
                transition: "box-shadow 300ms, transform 200ms",
              }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLElement).style.transform = "translateY(-2px)";
                (e.currentTarget as HTMLElement).style.boxShadow = "0 20px 50px rgba(46,125,50,0.5)";
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLElement).style.transform = "translateY(0)";
                (e.currentTarget as HTMLElement).style.boxShadow = "0 14px 40px rgba(46,125,50,0.4)";
              }}
            >
              Explore Full Menu
              <span style={{
                width: "32px", height: "32px", borderRadius: "50%",
                background: "rgba(255,255,255,0.92)",
                display: "flex", alignItems: "center", justifyContent: "center",
              }}>
                <ArrowUpRight size={16} style={{ color: "#2E7D32" }} />
              </span>
            </button>

            {/* Secondary */}
            <button
              id="hero-about-btn"
              onClick={scrollToAbout}
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "8px",
                padding: "clamp(11px, 1.4vw, 17px) clamp(18px, 2.5vw, 32px)",
                borderRadius: "60px",
                border: "2px solid hsl(var(--foreground)/0.10)",
                background: "hsl(var(--foreground)/0.03)",
                backdropFilter: "blur(12px)",
                color: "hsl(var(--foreground)/0.80)",
                fontFamily: "var(--font-inter)",
                fontSize: "clamp(13px, 1.4vw, 15px)",
                fontWeight: 400,
                cursor: "pointer",
                transition: "all 200ms",
              }}
              onMouseEnter={(e) => {
                const el = e.currentTarget as HTMLElement;
                el.style.background = "hsl(var(--foreground)/0.08)";
                el.style.borderColor = "hsl(var(--foreground)/0.20)";
                el.style.transform = "translateY(-2px)";
              }}
              onMouseLeave={(e) => {
                const el = e.currentTarget as HTMLElement;
                el.style.background = "hsl(var(--foreground)/0.03)";
                el.style.borderColor = "hsl(var(--foreground)/0.10)";
                el.style.transform = "translateY(0)";
              }}
            >
              <Info size={16} />
              About Us
            </button>
          </motion.div>
        </motion.div>

        {/* RIGHT COLUMN — Food Image */}
        <motion.div
          initial={{ opacity: 0, scale: 0.82, rotate: -10 }}
          animate={{ opacity: 1, scale: 1, rotate: 0 }}
          transition={{ duration: 1.3, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
          style={{
            flex: "1",
            position: "relative",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          {/* Radial halo glow behind the image */}
          <div aria-hidden style={{
            position: "absolute",
            inset: "-10%",
            background: "radial-gradient(ellipse at center, rgba(46,125,50,0.14) 0%, rgba(249,168,37,0.06) 45%, transparent 70%)",
            filter: "blur(40px)",
            pointerEvents: "none",
            zIndex: 0,
          }} />

          <Image
            src="/hero-image/dosa.webp"
            alt="Crispy Dosa — Star dish at Annachi Tiffin Centre"
            width={700}
            height={700}
            priority
            style={{
              objectFit: "contain",
              width: "100%",
              maxWidth: "700px",
              height: "auto",
              position: "relative",
              zIndex: 1,
              filter: "drop-shadow(0 48px 96px rgba(0,0,0,0.38)) drop-shadow(0 12px 32px rgba(46,125,50,0.18))",
              animation: "hero-float 7s ease-in-out infinite",
            }}
          />
        </motion.div>
      </div>

      {/* Mobile: reorder image for small screens */}
      <style>{`
        @media (max-width: 767px) {
          #home > div { flex-direction: column !important; padding-top: 100px !important; }
          #home > div > div:first-child { flex: none !important; max-width: 100% !important; }
          #home > div > div:last-child { position: absolute !important; top: 150px !important; right: -8px !important; width: 248px !important; }
          #home > div > div:last-child > div { max-width: 248px !important; }
          #home > div > div:last-child img { animation: none !important; }
          #home > div > div:first-child h1 { font-size: 40px !important; max-width: 55% !important; }
          #home > div > div:first-child p:first-of-type { font-size: 13px !important; }
        }
      `}</style>
    </section>
  );
}
