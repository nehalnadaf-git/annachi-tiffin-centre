"use client";
import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, ShoppingBag, Phone } from "lucide-react";
import { useCart } from "@/contexts/CartContext";
import { BRAND } from "@/lib/data";

/* ─── Secret trigger helper ─── */
function dispatchOwnerBilling() {
  window.dispatchEvent(new CustomEvent("annachi:billing:open"));
}

const NAV_LINKS = [
  { label: "Home", href: "#home" },
  { label: "Menu", href: "#menu" },
  { label: "About", href: "#about" },
  { label: "Contact", href: "#contact" },
];

export default function Navbar() {
  const { totalItems, setCartOpen } = useCart();

  const [scrolled, setScrolled] = useState(false);
  const [visible, setVisible] = useState(true);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [activeSection, setActiveSection] = useState("home");
  const lastScrollY = useRef(0);

  /* --- Hide / show on scroll --- */
  useEffect(() => {
    const onScroll = () => {
      const y = window.scrollY;
      if (y < 10) {
        setVisible(true);
        setScrolled(false);
        lastScrollY.current = y;
        return;
      }
      const delta = y - lastScrollY.current;
      setScrolled(true);
      if (Math.abs(delta) > 5) {
        setVisible(delta < 0); // hide on scroll down, show on scroll up
      }
      lastScrollY.current = y;
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  /* --- Active section via IntersectionObserver --- */
  useEffect(() => {
    const sections = ["home", "menu", "about", "contact"];
    const observers: IntersectionObserver[] = [];
    sections.forEach((id) => {
      const el = document.getElementById(id);
      if (!el) return;
      const obs = new IntersectionObserver(
        ([entry]) => { if (entry.isIntersecting) setActiveSection(id); },
        { rootMargin: "-30% 0px -60% 0px" }
      );
      obs.observe(el);
      observers.push(obs);
    });
    return () => observers.forEach((o) => o.disconnect());
  }, []);

  const scrollTo = (href: string) => {
    const id = href.replace("#", "");
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
    setDrawerOpen(false);
  };

  return (
    <>
      {/* Grain overlay */}
      <div className="grain" aria-hidden />

      {/* ─────────────────── NAVBAR WRAPPER (centering) ─────────────────── */}
      <div style={{
        position: "fixed",
        top: "12px",
        left: 0,
        right: 0,
        zIndex: 50,
        display: "flex",
        justifyContent: "center",
        pointerEvents: "none",
      }}>
      <motion.nav
        id="main-navbar"
        initial={{ y: -80, opacity: 0 }}
        animate={{ y: visible ? 0 : -96, opacity: visible ? 1 : 0 }}
        transition={{ type: "spring", damping: 28, stiffness: 320 }}
        style={{
          width: "94vw",
          maxWidth: "1100px",
          borderRadius: "9999px",
          pointerEvents: "all",
          position: "relative",
        }}
      >
        {/* Glassmorphism background layer */}
        <div style={{
          position: "absolute",
          inset: 0,
          borderRadius: "9999px",
          backdropFilter: "blur(28px)",
          WebkitBackdropFilter: "blur(28px)",
          backgroundColor: scrolled
            ? "rgba(8, 18, 9, 0.82)"
            : "rgba(8, 18, 9, 0.55)",
          border: `1px solid ${scrolled
            ? "rgba(165, 214, 167, 0.20)"
            : "rgba(165, 214, 167, 0.10)"}`,
          boxShadow: scrolled
            ? "0 8px 40px rgba(0,0,0,0.35), inset 0 1px 0 rgba(165,214,167,0.08)"
            : "0 2px 16px rgba(0,0,0,0.12), inset 0 1px 0 rgba(255,255,255,0.04)",
          transition: "background-color 400ms ease, border-color 400ms ease, box-shadow 400ms ease",
        }} />

        {/* ── UNIFIED WRAPPER ── */}
        <div style={{
          position: "relative",
          zIndex: 1,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          height: scrolled ? "64px" : "72px",
          padding: "0 clamp(18px, 4vw, 36px)",
          transition: "height 400ms ease",
        }}>
          {/* Left Side: Mobile Menu OR Desktop Links */}
          <div style={{ flex: 1, display: "flex", alignItems: "center" }}>
            {/* Mobile Menu Button */}
            <button
              className="logo-mobile"
              aria-label="Open menu"
              onClick={() => setDrawerOpen(true)}
              style={{
                display: "flex",
                flexDirection: "column",
                gap: "6px",
                background: "none",
                border: "none",
                cursor: "pointer",
                padding: "10px 4px",
              }}
            >
              {[20, 12, 16].map((w, i) => (
                <span key={i} style={{ width: `${w}px`, height: "1.8px", background: "rgba(165,214,167,0.85)", borderRadius: "2px", display: "block" }} />
              ))}
            </button>

            {/* Desktop Links (Visible on >= 768px) */}
            <div className="logo-desktop" style={{ display: "flex", alignItems: "center", gap: "4px" }}>
              {NAV_LINKS.map((link) => (
                <NavLink
                  key={link.href}
                  label={link.label}
                  active={activeSection === link.href.replace("#", "")}
                  onClick={() => scrollTo(link.href)}
                />
              ))}
            </div>
          </div>

          {/* Brand — Absolute Center */}
          <button
            onClick={() => scrollTo("#home")}
            style={{
              position: "absolute",
              left: "50%",
              top: "50%",
              transform: "translate(-50%, -50%)",
              background: "none",
              border: "none",
              cursor: "pointer",
              padding: 0,
              whiteSpace: "nowrap",
              zIndex: 10,
            }}
          >
            <div className="logo-desktop">
              <BrandLogo size="lg" />
            </div>
            <div className="logo-mobile">
              <BrandLogo size="sm" />
            </div>
          </button>

          {/* Right Side: Cart */}
          <div style={{ flex: 1, display: "flex", justifyContent: "flex-end" }}>
            <CartButton totalItems={totalItems} onClick={() => setCartOpen(true)} />
          </div>
        </div>
      </motion.nav>
      </div> {/* end centering wrapper */}

      {/* Responsive style injection */}
      <style>{`
        @media (max-width: 767px) {
          .logo-desktop { display: none !important; }
        }
        @media (min-width: 768px) {
          .logo-mobile { display: none !important; }
        }
      `}</style>

      {/* ─────────────────── MOBILE DRAWER ─────────────────── */}
      <AnimatePresence>
        {drawerOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              key="drawer-backdrop"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              onClick={() => setDrawerOpen(false)}
              style={{
                position: "fixed",
                inset: 0,
                background: "rgba(0,0,0,0.55)",
                backdropFilter: "blur(6px)",
                WebkitBackdropFilter: "blur(6px)",
                zIndex: 60,
              }}
            />

            {/* Drawer panel */}
            <motion.div
              key="drawer"
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "spring", damping: 32, stiffness: 360 }}
              style={{
                position: "fixed",
                left: 0,
                top: 0,
                bottom: 0,
                width: "78vw",
                maxWidth: "300px",
                zIndex: 70,
                background: "linear-gradient(160deg, rgba(14, 34, 15, 0.98) 0%, rgba(6, 14, 6, 0.99) 100%)",
                borderRight: "1px solid rgba(165, 214, 167, 0.12)",
                boxShadow: "-24px 0 80px rgba(0,0,0,0.5)",
                display: "flex",
                flexDirection: "column",
                padding: "28px 22px",
                backdropFilter: "blur(20px)",
                WebkitBackdropFilter: "blur(20px)",
              }}
            >
              {/* Drawer header */}
              <div style={{
                display: "flex",
                alignItems: "flex-start",
                justifyContent: "space-between",
                marginBottom: "36px",
              }}>
                <div />
                <button
                  onClick={() => setDrawerOpen(false)}
                  style={{
                    background: "rgba(255,255,255,0.06)",
                    border: "1px solid rgba(255,255,255,0.08)",
                    borderRadius: "50%",
                    width: "32px",
                    height: "32px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    cursor: "pointer",
                    color: "rgba(255,255,255,0.5)",
                    flexShrink: 0,
                  }}
                >
                  <X size={16} />
                </button>
              </div>

              {/* Nav links */}
              <nav style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
                {NAV_LINKS.map((link, i) => {
                  const isActive = activeSection === link.href.replace("#", "");
                  return (
                    <motion.button
                      key={link.href}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.04 + i * 0.06, type: "spring", stiffness: 300 }}
                      onClick={() => scrollTo(link.href)}
                      style={{
                        textAlign: "left",
                        padding: "12px 16px",
                        borderRadius: "14px",
                        border: isActive
                          ? "1px solid rgba(165,214,167,0.18)"
                          : "1px solid transparent",
                        background: isActive
                          ? "rgba(46,125,50,0.12)"
                          : "transparent",
                        color: isActive ? "#A5D6A7" : "rgba(255,255,255,0.55)",
                        fontFamily: "var(--font-inter)",
                        fontSize: "15px",
                        fontWeight: 400,
                        cursor: "pointer",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                        transition: "all 150ms",
                      }}
                    >
                      {link.label}
                      {isActive && (
                        <span style={{
                          width: "7px",
                          height: "7px",
                          borderRadius: "50%",
                          background: "#A5D6A7",
                          boxShadow: "0 0 8px rgba(165,214,167,0.7)",
                        }} />
                      )}
                    </motion.button>
                  );
                })}
              </nav>

              {/* Divider */}
              <div style={{
                margin: "20px 0",
                height: "1px",
                background: "linear-gradient(90deg, transparent, rgba(165,214,167,0.15), transparent)",
              }} />



              {/* Branded Footer — secret 3s long-press opens owner billing */}
              <AnnachiSecretTrigger />

              {/* CTA */}
              <button
                onClick={() => scrollTo("#menu")}
                className="shimmer"
                style={{
                  marginTop: "16px",
                  width: "100%",
                  padding: "14px",
                  borderRadius: "14px",
                  border: "none",
                  background: "linear-gradient(135deg, #2E7D32, #1B5E20)",
                  color: "#fff",
                  fontFamily: "var(--font-inter)",
                  fontSize: "14px",
                  fontWeight: 400,
                  cursor: "pointer",
                  boxShadow: "0 6px 24px rgba(46,125,50,0.40)",
                  letterSpacing: "0.02em",
                }}
              >
                Explore Menu
              </button>

              {/* Call Now Button */}
              <motion.a
                href={`tel:${BRAND.phone}`}
                whileTap={{ scale: 0.96 }}
                style={{
                  marginTop: "12px",
                  width: "100%",
                  padding: "14px",
                  borderRadius: "14px",
                  border: "1px solid rgba(165,214,167,0.3)",
                  background: "rgba(255,255,255,0.04)",
                  color: "#A5D6A7",
                  fontFamily: "var(--font-inter)",
                  fontSize: "14px",
                  fontWeight: 400,
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: "8px",
                  textDecoration: "none",
                  letterSpacing: "0.02em",
                }}
              >
                <Phone size={16} />
                Call Now
              </motion.a>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}

/* ─── Brand Logo ─── */
function BrandLogo({ size }: { size: "sm" | "lg" }) {
  const isLarge = size === "lg";

  return (
    <div style={{
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      gap: isLarge ? "2px" : "1px",
      userSelect: "none",
      lineHeight: 1,
    }}>
      <span style={{
        fontFamily: "var(--font-display)",
        fontWeight: 400,
        fontSize: isLarge ? "20px" : "16px",
        letterSpacing: "0.02em",
        textTransform: "none",
        color: "#A5D6A7",
      }}>
        Annachi
      </span>
      <span style={{
        fontFamily: "var(--font-inter)",
        fontWeight: 400,
        fontSize: isLarge ? "9px" : "8px",
        letterSpacing: "0.32em",
        textTransform: "uppercase",
        color: "rgba(255,255,255,0.45)",
      }}>
        TIFFIN CENTRE
      </span>
    </div>
  );
}

/* ─── Nav Link with animated underlay pill ─── */
function NavLink({
  label,
  active,
  onClick,
}: {
  label: string;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      style={{
        position: "relative",
        padding: "8px 18px",
        borderRadius: "9999px",
        border: "none",
        background: "transparent",
        color: active ? "#A5D6A7" : "rgba(255,255,255,0.45)",
        fontFamily: "var(--font-inter)",
        fontSize: "13px",
        fontWeight: active ? 600 : 400,
        cursor: "pointer",
        transition: "color 200ms",
        whiteSpace: "nowrap",
      }}
      onMouseEnter={(e) => {
        if (!active)
          (e.currentTarget as HTMLElement).style.color = "rgba(255,255,255,0.80)";
      }}
      onMouseLeave={(e) => {
        if (!active)
          (e.currentTarget as HTMLElement).style.color = "rgba(255,255,255,0.45)";
      }}
    >
      {active && (
        <motion.span
          layoutId="nav-pill"
          style={{
            position: "absolute",
            inset: 0,
            borderRadius: "9999px",
            background: "rgba(46,125,50,0.18)",
            border: "1px solid rgba(165,214,167,0.15)",
          }}
          transition={{ type: "spring", bounce: 0.2, duration: 0.4 }}
        />
      )}
      <span style={{ position: "relative", zIndex: 1 }}>{label}</span>
    </button>
  );
}

/* ─── Cart Button ─── */
function CartButton({ totalItems, onClick }: { totalItems: number; onClick: () => void }) {
  return (
    <button
      id="open-cart-btn"
      aria-label={`Open cart${totalItems > 0 ? `, ${totalItems} items` : ""}`}
      onClick={onClick}
      style={{
        position: "relative",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        width: "38px",
        height: "38px",
        borderRadius: "50%",
        background: totalItems > 0
          ? "rgba(46,125,50,0.22)"
          : "rgba(255,255,255,0.07)",
        border: totalItems > 0
          ? "1px solid rgba(165,214,167,0.28)"
          : "1px solid rgba(255,255,255,0.10)",
        cursor: "pointer",
        transition: "background 200ms, border-color 200ms",
        flexShrink: 0,
      }}
    >
      <ShoppingBag
        size={16}
        color={totalItems > 0 ? "#A5D6A7" : "rgba(255,255,255,0.55)"}
      />
      <AnimatePresence>
        {totalItems > 0 && (
          <motion.span
            key="badge"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            exit={{ scale: 0 }}
            style={{
              position: "absolute",
              top: "-4px",
              right: "-4px",
              minWidth: "18px",
              height: "18px",
              borderRadius: "9999px",
              background: "#2E7D32",
              color: "#fff",
              fontFamily: "var(--font-inter)",
              fontSize: "10px",
              fontWeight: 400,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              padding: "0 4px",
              boxShadow: "0 2px 8px rgba(46,125,50,0.50)",
            }}
          >
            {totalItems > 9 ? "9+" : totalItems}
          </motion.span>
        )}
      </AnimatePresence>
    </button>
  );
}

/* ─── Secret Annachi Long-Press Trigger ─── */
function AnnachiSecretTrigger() {
  const pressTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const startPress = () => {
    pressTimer.current = setTimeout(() => {
      dispatchOwnerBilling();
    }, 3000);
  };

  const cancelPress = () => {
    if (pressTimer.current) clearTimeout(pressTimer.current);
  };

  return (
    <div
      style={{
        marginTop: "auto",
        paddingTop: "32px",
        paddingBottom: "8px",
        textAlign: "center",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: "6px",
        userSelect: "none",
        WebkitUserSelect: "none",
        // @ts-expect-error — non-standard but required for iOS Safari
        WebkitTouchCallout: "none",
        touchAction: "none",
        position: "relative",
      }}
      onPointerDown={startPress}
      onPointerUp={cancelPress}
      onPointerLeave={cancelPress}
      onPointerCancel={cancelPress}
      onContextMenu={(e) => e.preventDefault()}
    >
      {/* Secret long-press trigger */}

      <h2
        className="font-display"
        style={{
          fontWeight: 600,
          fontSize: "42px",
          color: "#fff",
          letterSpacing: "-0.02em",
          textTransform: "none",
          lineHeight: 1,
          margin: 0,
          cursor: "default",
          userSelect: "none",
          WebkitUserSelect: "none",
          // @ts-expect-error — non-standard but required for iOS Safari
          WebkitTouchCallout: "none",
          pointerEvents: "none",
        }}
      >
        Annachi
      </h2>
      <span
        style={{
          fontFamily: "var(--font-inter)",
          fontWeight: 500,
          fontSize: "11px",
          letterSpacing: "0.45em",
          textTransform: "uppercase",
          color: "#A5D6A7",
          marginTop: "2px",
          userSelect: "none",
          WebkitUserSelect: "none",
          // @ts-expect-error — non-standard but required for iOS Safari
          WebkitTouchCallout: "none",
          pointerEvents: "none",
        }}
      >
        TIFFIN CENTRE
      </span>
    </div>
  );
}
