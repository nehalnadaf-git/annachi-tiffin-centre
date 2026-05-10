"use client";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useSheetData } from "@/contexts/SheetDataContext";
import ProductCard from "@/components/ProductCard";

type ViewMode = "available" | "full";

export default function MenuSection() {
  const { liveMenuItems, allMenuItems } = useSheetData();
  const [viewMode, setViewMode] = useState<ViewMode>("available");

  // How many items are currently unavailable
  const unavailableCount = allMenuItems.filter((i) => i.unavailable).length;

  // The items to render based on the current view
  const displayItems = viewMode === "available" ? liveMenuItems : allMenuItems;

  return (
    <section
      id="menu"
      className="menu-section-bg"
      style={{ padding: "80px 0", position: "relative", overflow: "hidden" }}
    >
      <div className="container" style={{ position: "relative", zIndex: 1 }}>
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          style={{ textAlign: "center", marginBottom: "48px" }}
        >
          <div style={{
            display: "inline-flex", alignItems: "center", gap: "8px",
            padding: "7px 16px", borderRadius: "9999px",
            background: "linear-gradient(135deg, rgba(27,94,32,0.90), rgba(46,125,50,0.85))",
            border: "1px solid rgba(165,214,167,0.45)",
            boxShadow: "0 2px 16px rgba(46,125,50,0.35), inset 0 1px 0 rgba(165,214,167,0.15)",
            color: "#C8E6C9",
            fontFamily: "var(--font-inter)",
            fontSize: "11px", fontWeight: 500,
            letterSpacing: "0.14em", textTransform: "uppercase",
            marginBottom: "20px",
          }}>
            <span style={{
              width: "6px", height: "6px", borderRadius: "50%",
              background: "#A5D6A7",
              boxShadow: "0 0 8px rgba(165,214,167,0.9)",
              animation: "pulse-dot 2s ease-in-out infinite",
            }} />
            Fresh &amp; Authentic
          </div>

          <h2 className="font-display" style={{
            fontWeight: 400,
            fontSize: "clamp(36px, 5.5vw, 72px)",
            color: "#fff",
            lineHeight: 1.0,
            marginBottom: "16px",
          }}>
            Our Full{" "}
            <span className="text-gradient-gold">Menu</span>
          </h2>

          <p style={{
            fontFamily: "var(--font-inter)",
            fontSize: "14px",
            fontWeight: 400,
            color: "rgba(255,255,255,0.60)",
            marginTop: "12px",
            maxWidth: "460px",
            margin: "12px auto 0",
            lineHeight: 1.75,
          }}>
            Everything made fresh every morning <br />
            no pre-cooked, no shortcuts.
          </p>

          {/* ── Available / Full Menu Toggle ── */}
          <div style={{
            display: "inline-flex",
            alignItems: "center",
            marginTop: "28px",
            background: "rgba(255,255,255,0.06)",
            border: "1px solid rgba(255,255,255,0.10)",
            borderRadius: "9999px",
            padding: "4px",
            gap: "2px",
            position: "relative",
          }}>
            {(["available", "full"] as ViewMode[]).map((mode) => {
              const isActive = viewMode === mode;
              const label = mode === "available" ? "Available" : "Full Menu";
              const badge = mode === "full" && unavailableCount > 0 ? unavailableCount : null;
              return (
                <button
                  key={mode}
                  onClick={() => setViewMode(mode)}
                  style={{
                    position: "relative",
                    display: "flex",
                    alignItems: "center",
                    gap: "6px",
                    padding: "8px 20px",
                    borderRadius: "9999px",
                    border: "none",
                    background: isActive
                      ? "linear-gradient(135deg, #2E7D32, #1B5E20)"
                      : "transparent",
                    color: isActive ? "#fff" : "rgba(255,255,255,0.45)",
                    fontFamily: "var(--font-inter)",
                    fontSize: "13px",
                    fontWeight: isActive ? 500 : 400,
                    cursor: "pointer",
                    transition: "all 220ms ease",
                    letterSpacing: "0.01em",
                    boxShadow: isActive
                      ? "0 4px 16px rgba(46,125,50,0.40)"
                      : "none",
                  }}
                >
                  {label}
                  {badge !== null && (
                    <span style={{
                      display: "inline-flex",
                      alignItems: "center",
                      justifyContent: "center",
                      minWidth: "18px",
                      height: "18px",
                      padding: "0 5px",
                      borderRadius: "9999px",
                      background: isActive
                        ? "rgba(255,255,255,0.20)"
                        : "rgba(239,68,68,0.18)",
                      color: isActive ? "#fff" : "rgba(239,68,68,0.80)",
                      fontSize: "10px",
                      fontWeight: 500,
                      lineHeight: 1,
                    }}>
                      {badge}
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </motion.div>

        {/* Render by Category */}
        {["breakfast", "drinks"].map((catId) => {
          const catItems = displayItems.filter((item) => item.categoryId === catId);
          const catName = catId === "breakfast" ? "Breakfast" : (
            <>Drinks &<br />Refreshments</>
          );
          if (catItems.length === 0) return null;

          return (
            <div key={catId} style={{ marginBottom: "clamp(80px, 12vw, 120px)" }}>
              {/* Category header */}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
                id={`cat-${catId}`}
                style={{ scrollMarginTop: "140px", marginBottom: "clamp(16px, 3vw, 24px)" }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
                  <h3 style={{
                    fontFamily: "var(--font-display)",
                    fontWeight: 400,
                    fontSize: "clamp(24px, 3.5vw, 36px)",
                    color: "#fff",
                    letterSpacing: "-0.02em",
                    lineHeight: 1.1,
                  }}>
                    {catName}
                  </h3>
                  <div style={{ flex: 1, height: "1px", background: "rgba(255,255,255,0.15)" }} />
                  <div style={{ display: "flex", alignItems: "center", gap: "8px", flexShrink: 0 }}>
                    {/* Available count + green dot */}
                    <span style={{ display: "flex", alignItems: "center", gap: "4px", fontFamily: "var(--font-inter)", fontSize: "13px", fontWeight: 400, color: "rgba(255,255,255,0.75)" }}>
                      {catItems.filter((i) => !i.unavailable).length}
                      <span style={{ width: "9px", height: "9px", borderRadius: "50%", background: "#4CAF50", boxShadow: "0 0 6px rgba(76,175,80,0.80)", display: "inline-block" }} />
                    </span>
                    {/* Unavailable count + red dot (full menu mode only) */}
                    {viewMode === "full" && catItems.some((i) => i.unavailable) && (
                      <span style={{ display: "flex", alignItems: "center", gap: "4px", fontFamily: "var(--font-inter)", fontSize: "13px", fontWeight: 400, color: "rgba(255,255,255,0.75)" }}>
                        {catItems.filter((i) => i.unavailable).length}
                        <span style={{ width: "9px", height: "9px", borderRadius: "50%", background: "#EF5350", boxShadow: "0 0 6px rgba(239,83,80,0.75)", display: "inline-block" }} />
                      </span>
                    )}
                  </div>
                </div>
              </motion.div>

              {/* Products grid */}
              <AnimatePresence mode="popLayout">
                <div
                  className="product-grid"
                  style={{
                    display: "grid",
                    gridTemplateColumns: "repeat(2, 1fr)",
                    gap: "clamp(12px, 2vw, 16px)",
                    rowGap: "clamp(80px, 12vw, 120px)",
                    paddingTop: "clamp(45px, 6vw, 55px)",
                    overflow: "visible",
                  }}
                >
                  {catItems.map((item, i) => (
                    <ProductCard
                      key={item.id}
                      item={item}
                      index={i}
                      unavailable={item.unavailable}
                    />
                  ))}
                </div>
              </AnimatePresence>
            </div>
          );
        })}

        {/* Grid responsive overrides */}
        <style>{`
          /* Mobile: original card layout */
          .product-card-wrapper { padding-top: 90px; }
          .product-card-img { width: 180px; height: 180px; }
          .product-card-body { padding: 65px 16px 18px; }

          @media (min-width: 640px) and (max-width: 1023px) {
            #menu .product-grid { grid-template-columns: repeat(3, 1fr) !important; }
            .product-card-wrapper { padding-top: 90px; }
            .product-card-img { width: 180px; height: 180px; }
            .product-card-body { padding: 65px 14px 16px; }
          }
          @media (min-width: 1024px) {
            #menu .product-grid { grid-template-columns: repeat(4, 1fr) !important; }
            .product-card-wrapper { padding-top: 80px; }
            .product-card-img { width: 140px; height: 140px; }
            .product-card-body { padding: 50px 14px 16px; }
          }
        `}</style>

      </div>
    </section>
  );
}
