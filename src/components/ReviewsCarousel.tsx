"use client";
import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Star, ChevronLeft, ChevronRight } from "lucide-react";
import { REVIEWS, BRAND } from "@/lib/data";

const AVATAR_COLORS = ["#2E7D32", "#1565C0", "#6A1B9A", "#C62828", "#E65100", "#00695C"];

function getInitials(name: string) {
  return name.split(" ").map((n) => n[0]).join("").slice(0, 2).toUpperCase();
}

export default function ReviewsCarousel() {
  const [current, setCurrent] = useState(0);
  const [direction, setDirection] = useState(1);
  const touchStartX = useRef(0);

  const prev = () => { setDirection(-1); setCurrent((c) => (c - 1 + REVIEWS.length) % REVIEWS.length); };
  const next = () => { setDirection(1);  setCurrent((c) => (c + 1) % REVIEWS.length); };
  const goTo = (i: number) => { setDirection(i > current ? 1 : -1); setCurrent(i); };

  const handleTouchStart = (e: React.TouchEvent) => { touchStartX.current = e.touches[0].clientX; };
  const handleTouchEnd   = (e: React.TouchEvent) => {
    const dx = e.changedTouches[0].clientX - touchStartX.current;
    if (Math.abs(dx) > 48) dx < 0 ? next() : prev();
  };

  const handleWriteReview = () => {
    const msg = encodeURIComponent("Hi! I'd like to leave a review for Annachi Tiffin Centre 🌟");
    window.open(`https://wa.me/${BRAND.whatsapp}?text=${msg}`, "_blank", "noopener");
  };

  return (
    <section
      id="reviews"
      style={{ padding: "clamp(64px, 8vw, 96px) 0", overflow: "hidden", position: "relative", background: "hsl(var(--background))" }}
    >
      {/* Ambient blobs */}
      <div aria-hidden style={{ position: "absolute", top: "-20%", left: "-10%", width: "40%", height: "60%", background: "hsl(var(--primary)/0.06)", filter: "blur(120px)", pointerEvents: "none" }} />
      <div aria-hidden style={{ position: "absolute", bottom: "-20%", right: "-10%", width: "40%", height: "60%", background: "hsl(var(--secondary)/0.04)", filter: "blur(120px)", pointerEvents: "none" }} />

      <div className="container" style={{ maxWidth: "660px" }}>
        {/* Header */}
        <div style={{ textAlign: "center", marginBottom: "36px" }}>
          <div className="section-label" style={{ marginBottom: "14px", justifyContent: "center" }}>
            <span style={{ width: "6px", height: "6px", borderRadius: "50%", background: "hsl(var(--primary-light))", animation: "pulse-dot 2s infinite" }} />
            Guest Reviews
          </div>
          <h2 className="font-display" style={{
            fontWeight: 400, fontSize: "clamp(26px, 4vw, 38px)",
            background: "linear-gradient(to right, #A5D6A7, #2E7D32)",
            WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text",
            paddingBottom: "0.15em",
            marginBottom: "-0.15em",
          }}>
            What Hubli Is Saying
          </h2>
        </div>

        {/* Swipe area */}
        <div
          style={{ position: "relative", userSelect: "none" }}
          onTouchStart={handleTouchStart}
          onTouchEnd={handleTouchEnd}
        >
          <AnimatePresence mode="wait" custom={direction}>
            <motion.div
              key={current}
              custom={direction}
              initial={{ opacity: 0, x: direction * 56 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: direction * -56 }}
              transition={{ duration: 0.32, ease: [0.22, 1, 0.36, 1] }}
            >
              <ReviewCard
                review={REVIEWS[current]}
                avatarColor={AVATAR_COLORS[current % AVATAR_COLORS.length]}
              />
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Controls row */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "14px", marginTop: "24px" }}>
          <NavBtn id="rev-prev" onClick={prev}><ChevronLeft size={16} /></NavBtn>

          <div style={{ display: "flex", gap: "6px", alignItems: "center" }}>
            {REVIEWS.map((_, i) => (
              <button
                key={i}
                onClick={() => goTo(i)}
                aria-label={`Slide ${i + 1}`}
                style={{
                  width: i === current ? "20px" : "6px",
                  height: "6px", borderRadius: "9999px", border: "none", padding: 0,
                  background: i === current ? "hsl(var(--primary))" : "hsl(var(--foreground)/0.15)",
                  cursor: "pointer",
                  transition: "width 280ms ease, background 220ms ease",
                }}
              />
            ))}
          </div>

          <NavBtn id="rev-next" onClick={next}><ChevronRight size={16} /></NavBtn>
        </div>

        {/* Write review */}
        <div style={{ textAlign: "center", marginTop: "20px" }}>
          <button
            id="write-review-btn"
            onClick={handleWriteReview}
            style={{
              padding: "9px 22px", borderRadius: "9999px",
              border: "1px solid hsl(var(--primary)/0.30)",
              background: "hsl(var(--primary)/0.06)",
              color: "hsl(var(--primary-light))",
              fontFamily: "var(--font-inter)", fontSize: "13px", fontWeight: 500,
              cursor: "pointer", transition: "background 200ms",
            }}
            onMouseEnter={(e) => (e.currentTarget.style.background = "hsl(var(--primary)/0.14)")}
            onMouseLeave={(e) => (e.currentTarget.style.background = "hsl(var(--primary)/0.06)")}
          >
            Write a Review
          </button>
        </div>
      </div>
    </section>
  );
}

/* ── Nav button ── */
function NavBtn({ id, onClick, children }: { id: string; onClick: () => void; children: React.ReactNode }) {
  return (
    <button
      id={id}
      onClick={onClick}
      style={{
        width: "36px", height: "36px", borderRadius: "50%",
        border: "1px solid hsl(var(--border))",
        background: "hsl(var(--foreground)/0.04)",
        color: "hsl(var(--foreground)/0.65)",
        display: "flex", alignItems: "center", justifyContent: "center",
        cursor: "pointer", flexShrink: 0, transition: "all 200ms",
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.background = "hsl(var(--primary)/0.10)";
        e.currentTarget.style.borderColor = "hsl(var(--primary)/0.35)";
        e.currentTarget.style.color = "hsl(var(--primary-light))";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.background = "hsl(var(--foreground)/0.04)";
        e.currentTarget.style.borderColor = "hsl(var(--border))";
        e.currentTarget.style.color = "hsl(var(--foreground)/0.65)";
      }}
    >
      {children}
    </button>
  );
}

/* ── Review card ── */
function ReviewCard({ review, avatarColor }: { review: typeof REVIEWS[0]; avatarColor: string }) {
  const initials = getInitials(review.name);
  return (
    <div style={{
      borderRadius: "20px",
      border: "1px solid hsl(var(--border))",
      background: "hsl(var(--card))",
      backdropFilter: "blur(16px)",
      WebkitBackdropFilter: "blur(16px)",
      padding: "clamp(16px, 4vw, 26px)",
      boxShadow: "0 6px 32px rgba(0,0,0,0.07)",
    }}>
      {/* Top row: avatar + name + stars + date */}
      <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "14px" }}>
        <div style={{
          width: "42px", height: "42px", borderRadius: "50%",
          background: avatarColor, flexShrink: 0,
          display: "flex", alignItems: "center", justifyContent: "center",
          fontFamily: "var(--font-inter)", fontWeight: 600, fontSize: "14px", color: "#fff",
        }}>
          {initials}
        </div>
        <div style={{ flex: 1 }}>
          <p style={{ fontFamily: "var(--font-inter)", fontSize: "14px", fontWeight: 500, color: "hsl(var(--foreground))", marginBottom: "3px" }}>
            {review.name}
          </p>
          <div style={{ display: "flex", gap: "2px" }}>
            {[1, 2, 3, 4, 5].map((s) => (
              <Star key={s} size={11} style={{ color: s <= review.rating ? "#F9A825" : "hsl(var(--muted-foreground))", fill: s <= review.rating ? "#F9A825" : "none" }} />
            ))}
          </div>
        </div>
        <span style={{ fontFamily: "var(--font-inter)", fontSize: "11px", color: "hsl(var(--muted-foreground)/0.55)", letterSpacing: "0.04em", flexShrink: 0 }}>
          {review.date}
        </span>
      </div>

      {/* Review text */}
      <p style={{
        fontFamily: "var(--font-inter)", fontSize: "clamp(13px, 1.4vw, 15px)",
        color: "hsl(var(--muted-foreground))", lineHeight: 1.75,
        fontStyle: "italic", fontWeight: 400,
      }}>
        &ldquo;{review.text}&rdquo;
      </p>
    </div>
  );
}
