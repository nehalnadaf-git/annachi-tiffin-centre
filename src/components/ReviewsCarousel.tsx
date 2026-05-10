"use client";
import { useState, useRef, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Star, ChevronLeft, ChevronRight } from "lucide-react";
import { REVIEWS } from "@/lib/data";
import { BRAND } from "@/lib/data";

/* ──────────────────────────────────────────────────────────
   Helpers
────────────────────────────────────────────────────────── */
function getVisibleCount(width: number): number {
  if (width >= 1024) return 3;
  if (width >= 640) return 2;
  return 1;
}

const GAP = 20; // px between cards

/* ──────────────────────────────────────────────────────────
   Main component
────────────────────────────────────────────────────────── */
export default function ReviewsCarousel() {
  const [current, setCurrent] = useState(0);
  const [visibleCount, setVisibleCount] = useState(1);
  const [translateX, setTranslateX] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);

  // Keep visibleCount in sync with window width
  const syncVisible = useCallback(() => {
    const v = getVisibleCount(window.innerWidth);
    setVisibleCount(v);
  }, []);

  useEffect(() => {
    syncVisible();
    window.addEventListener("resize", syncVisible);
    return () => window.removeEventListener("resize", syncVisible);
  }, [syncVisible]);

  const max = Math.max(0, REVIEWS.length - visibleCount);

  // Clamp current when visibleCount changes (e.g. resize)
  useEffect(() => {
    setCurrent((c) => Math.min(c, max));
  }, [max]);

  // Recompute pixel translation whenever current or visibleCount changes
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;
    const cardWidth = (container.offsetWidth - (visibleCount - 1) * GAP) / visibleCount;
    setTranslateX(-current * (cardWidth + GAP));
  }, [current, visibleCount]);

  const prev = () => setCurrent((c) => Math.max(0, c - 1));
  const next = () => setCurrent((c) => Math.min(max, c + 1));

  const handleReviewClick = () => {
    // Send to Google Maps review or WhatsApp (fallback to WhatsApp)
    const msg = encodeURIComponent(
      `Hi! I'd like to leave a review for Annachi Tiffin Centre 🌟`
    );
    window.open(`https://wa.me/${BRAND.whatsapp}?text=${msg}`, "_blank", "noopener");
  };

  return (
    <section
      id="reviews"
      style={{
        padding: "clamp(64px, 8vw, 96px) 0",
        overflow: "hidden",
        position: "relative",
        background: "hsl(var(--background))",
      }}
    >
      {/* Decorative blobs */}
      <div aria-hidden style={{
        position: "absolute", top: "-20%", left: "-10%",
        width: "40%", height: "60%",
        background: "hsl(var(--primary)/0.06)",
        filter: "blur(120px)", pointerEvents: "none",
      }} />
      <div aria-hidden style={{
        position: "absolute", bottom: "-20%", right: "-10%",
        width: "40%", height: "60%",
        background: "hsl(var(--secondary)/0.04)",
        filter: "blur(120px)", pointerEvents: "none",
      }} />

      <div className="container" style={{ maxWidth: "1200px" }}>
        {/* Header row */}
        <div style={{
          display: "flex", flexWrap: "wrap",
          alignItems: "flex-end", justifyContent: "space-between",
          gap: "16px", marginBottom: "40px",
        }}>
          <div>
            <div className="section-label" style={{ marginBottom: "16px" }}>
              <span style={{
                width: "6px", height: "6px", borderRadius: "50%",
                background: "hsl(var(--primary-light))",
                animation: "pulse-dot 2s infinite",
              }} />
              Guest Reviews
            </div>
            <h2 className="font-display" style={{
              fontWeight: 400,
              fontSize: "clamp(28px, 4vw, 40px)",
              background: "linear-gradient(to right, #A5D6A7, #2E7D32)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
              marginTop: "8px",
            }}>
              What Hubli Is Saying
            </h2>
          </div>

          <div style={{ display: "flex", gap: "8px", alignItems: "center" }}>
            {/* Prev */}
            <NavButton
              id="rev-prev"
              onClick={prev}
              disabled={current === 0}
              icon={<ChevronLeft size={18} />}
            />
            {/* Next */}
            <NavButton
              id="rev-next"
              onClick={next}
              disabled={current >= max}
              icon={<ChevronRight size={18} />}
            />

            <button
              id="write-review-btn"
              onClick={handleReviewClick}
              style={{
                padding: "10px 20px", borderRadius: "9999px",
                border: "1px solid hsl(var(--primary)/0.3)",
                background: "hsl(var(--primary)/0.06)",
                color: "hsl(var(--primary-light))",
                fontFamily: "var(--font-inter)",
                fontSize: "13px", fontWeight: 500, cursor: "pointer",
                transition: "background 200ms",
              }}
              onMouseEnter={(e) => (e.currentTarget.style.background = "hsl(var(--primary)/0.12)")}
              onMouseLeave={(e) => (e.currentTarget.style.background = "hsl(var(--primary)/0.06)")}
            >
              Write a Review
            </button>
          </div>
        </div>

        {/* Carousel viewport */}
        <div
          style={{
            overflow: "hidden",
            maskImage: "linear-gradient(to right, transparent, black 4%, black 96%, transparent)",
            WebkitMaskImage: "linear-gradient(to right, transparent, black 4%, black 96%, transparent)",
          }}
        >
          {/* Measure container */}
          <div ref={containerRef} style={{ width: "100%" }}>
            <motion.div
              animate={{ x: translateX }}
              transition={{ type: "spring", damping: 32, stiffness: 300 }}
              style={{
                display: "flex",
                gap: `${GAP}px`,
                paddingBottom: "8px",
                willChange: "transform",
              }}
            >
              {REVIEWS.map((review, i) => (
                <ReviewCard
                  key={i}
                  review={review}
                  visibleCount={visibleCount}
                />
              ))}
            </motion.div>
          </div>
        </div>

        {/* Dot indicators */}
        {max > 0 && (
          <div style={{
            display: "flex",
            justifyContent: "center",
            gap: "8px",
            marginTop: "28px",
          }}>
            {Array.from({ length: max + 1 }).map((_, i) => (
              <button
                key={i}
                onClick={() => setCurrent(i)}
                aria-label={`Go to slide ${i + 1}`}
                style={{
                  width: i === current ? "22px" : "8px",
                  height: "8px",
                  borderRadius: "9999px",
                  border: "none",
                  background: i === current
                    ? "hsl(var(--primary))"
                    : "hsl(var(--foreground)/0.15)",
                  cursor: "pointer",
                  padding: 0,
                  transition: "width 280ms ease, background 220ms ease",
                }}
              />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}

/* ──────────────────────────────────────────────────────────
   Nav button
────────────────────────────────────────────────────────── */
function NavButton({
  id, onClick, disabled, icon,
}: {
  id: string;
  onClick: () => void;
  disabled: boolean;
  icon: React.ReactNode;
}) {
  return (
    <button
      id={id}
      onClick={onClick}
      disabled={disabled}
      style={{
        width: "40px", height: "40px", borderRadius: "50%",
        border: "1px solid hsl(var(--border))",
        background: "hsl(var(--foreground)/0.04)",
        color: disabled ? "hsl(var(--foreground)/0.20)" : "hsl(var(--foreground)/0.7)",
        display: "flex", alignItems: "center", justifyContent: "center",
        cursor: disabled ? "default" : "pointer",
        transition: "all 200ms",
        opacity: disabled ? 0.4 : 1,
      }}
      onMouseEnter={(e) => {
        if (disabled) return;
        const el = e.currentTarget as HTMLElement;
        el.style.background = "hsl(var(--primary)/0.12)";
        el.style.borderColor = "hsl(var(--primary)/0.35)";
        el.style.color = "hsl(var(--primary-light))";
      }}
      onMouseLeave={(e) => {
        const el = e.currentTarget as HTMLElement;
        el.style.background = "hsl(var(--foreground)/0.04)";
        el.style.borderColor = "hsl(var(--border))";
        el.style.color = "hsl(var(--foreground)/0.7)";
      }}
    >
      {icon}
    </button>
  );
}

/* ──────────────────────────────────────────────────────────
   Review card
────────────────────────────────────────────────────────── */
function ReviewCard({
  review,
  visibleCount,
}: {
  review: typeof REVIEWS[0];
  visibleCount: number;
}) {
  return (
    <div
      style={{
        // Each card takes exactly 1/visibleCount of the container, minus proportional gaps
        flex: `0 0 calc((100% - ${(visibleCount - 1) * GAP}px) / ${visibleCount})`,
        minHeight: "240px",
        borderRadius: "16px",
        border: "1px solid hsl(var(--border))",
        background: "hsl(var(--card))",
        backdropFilter: "blur(16px)",
        WebkitBackdropFilter: "blur(16px)",
        padding: "24px",
        display: "flex",
        flexDirection: "column",
        gap: "12px",
        boxSizing: "border-box",
      }}
    >
      {/* Stars */}
      <div style={{ display: "flex", gap: "3px" }}>
        {[1, 2, 3, 4, 5].map((s) => (
          <Star
            key={s}
            size={14}
            style={{
              color: s <= review.rating ? "#F9A825" : "hsl(var(--muted-foreground))",
              fill: s <= review.rating ? "#F9A825" : "none",
            }}
          />
        ))}
      </div>

      {/* Review text */}
      <p style={{
        fontFamily: "var(--font-inter)",
        fontSize: "14px",
        color: "hsl(var(--muted-foreground))",
        lineHeight: 1.75,
        fontStyle: "italic",
        flex: 1,
        fontWeight: 400,
      }}>
        &ldquo;{review.text}&rdquo;
      </p>

      {/* Footer: name + date */}
      <div style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        paddingTop: "8px",
        borderTop: "1px solid hsl(var(--border))",
      }}>
        <span style={{
          fontFamily: "var(--font-inter)",
          fontWeight: 500,
          color: "hsl(var(--foreground))",
          fontSize: "14px",
        }}>
          {review.name}
        </span>
        <span style={{
          fontFamily: "var(--font-inter)",
          fontSize: "11px",
          color: "hsl(var(--muted-foreground)/0.60)",
          letterSpacing: "0.04em",
        }}>
          {review.date}
        </span>
      </div>
    </div>
  );
}
