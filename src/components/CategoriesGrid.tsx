"use client";
import { motion } from "framer-motion";
import Image from "next/image";
import { MENU_CATEGORIES } from "@/lib/data";

export default function CategoriesGrid() {
  const scrollToMenu = (catId: string) => {
    const targetId = catId === "all" ? "menu" : `cat-${catId}`;
    document.getElementById(targetId)?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section style={{ padding: "56px 0 80px", overflow: "hidden", position: "relative" }}>
      {/* Ambient glow */}
      <div aria-hidden style={{
        position: "absolute", left: "50%", top: "50%",
        transform: "translate(-50%,-50%)",
        width: "700px", height: "400px",
        background: "hsl(var(--primary)/0.04)",
        filter: "blur(180px)",
        pointerEvents: "none",
      }} />

      <div className="container" style={{ position: "relative", zIndex: 1 }}>
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          style={{ textAlign: "center", marginBottom: "48px" }}
        >
          <div className="section-label" style={{ marginBottom: "16px" }}>
            <span style={{
              width: "6px", height: "6px", borderRadius: "50%",
              background: "hsl(var(--primary-light))",
              animation: "pulse-dot 2s ease-in-out infinite",
            }} />
            Full Menu
          </div>
          <h2 className="font-display" style={{
            fontWeight: 400,
            fontSize: "clamp(32px, 5vw, 56px)",
            marginBottom: "12px",
          }}>
            Browse by <span className="text-gradient">Category</span>
          </h2>
          <p style={{
            fontFamily: "var(--font-inter)",
            fontSize: "clamp(13px, 1.5vw, 16px)",
            color: "hsl(var(--muted-foreground))",
            maxWidth: "480px",
            margin: "0 auto",
          }}>
            Pick your craving — we&apos;ve got Hubli&apos;s finest Tamil tiffin covered.
          </p>
        </motion.div>

        {/* Grid */}
        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(140px, 1fr))",
          gap: "16px",
          maxWidth: "700px",
          margin: "0 auto",
        }}>
          {[
            { id: "all", name: "All Items", image: "/product-images/dosa.webp", count: 7 },
            { id: "breakfast", name: "Breakfast", image: "/product-images/idli.webp", count: 5 },
            { id: "drinks", name: "Drinks", image: "/product-images/chai.webp", count: 2 },
          ].map((cat, i) => (
            <motion.button
              key={cat.id}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.08, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
              onClick={() => scrollToMenu(cat.id)}
              className="glass card-hover"
              style={{
                borderRadius: "18px",
                padding: "20px",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: "12px",
                cursor: "pointer",
                border: "1px solid hsl(var(--border))",
                background: "rgba(0, 0, 0, 0.04)",
              }}
            >
              <div style={{ width: "80px", height: "80px", position: "relative" }}>
                <Image
                  src={cat.image}
                  alt={cat.name}
                  fill
                  style={{ objectFit: "contain", filter: "drop-shadow(0 8px 16px rgba(0,0,0,0.25))" }}
                />
              </div>
              <span style={{
                fontFamily: "var(--font-inter)",
                fontSize: "13px",
                fontWeight: 400,
                color: "hsl(var(--foreground)/0.9)",
              }}>{cat.name}</span>
              <span style={{
                fontFamily: "var(--font-inter)",
                fontSize: "10px",
                fontWeight: 400,
                borderRadius: "9999px",
                background: "linear-gradient(135deg, #1B5E20, #2E7D32)",
                border: "none",
                color: "#E8F5E9",
                padding: "4px 12px",
                boxShadow: "0 2px 8px rgba(46, 125, 50, 0.25)",
                letterSpacing: "0.06em",
              }}>{cat.count} items</span>
            </motion.button>
          ))}
        </div>
      </div>
    </section>
  );
}
