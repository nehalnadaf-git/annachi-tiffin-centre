"use client";
import { MapPin, Clock } from "lucide-react";

const year = new Date().getFullYear();

const QUICK_LINKS = [
  { label: "Home", href: "#home" },
  { label: "Menu", href: "#menu" },
  { label: "About", href: "#about" },
  { label: "Contact", href: "#contact" },
];

export default function Footer() {
  const scrollTo = (href: string) => {
    document.getElementById(href.replace("#", ""))?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <footer style={{ position: "relative", background: "hsl(var(--background))", paddingTop: "80px", paddingBottom: "48px", overflow: "hidden" }}>
      {/* Top gradient line */}
      <div style={{ height: "1px", background: "linear-gradient(90deg, transparent, hsl(var(--primary)/0.15), transparent)", marginBottom: "64px" }} />

      <div className="container" style={{ maxWidth: "1280px" }}>
        <div className="footer-grid">
          {/* Column 1: Quick Links */}
          <div className="footer-links">
            <nav style={{ display: "flex", flexDirection: "column", gap: "16px", textAlign: "left" }}>
              {QUICK_LINKS.map((link) => (
                <button
                  key={link.href}
                  onClick={() => scrollTo(link.href)}
                  style={{
                    background: "none",
                    border: "none",
                    cursor: "pointer",
                    fontFamily: "var(--font-inter)",
                    fontSize: "15px",
                    fontWeight: 400,
                    color: "rgba(0,0,0,0.65)",
                    transition: "all 200ms",
                    padding: "4px 0",
                    textAlign: "left",
                  }}
                  onMouseEnter={(e) => {
                    const el = e.currentTarget as HTMLElement;
                    el.style.color = "hsl(var(--primary))";
                    el.style.transform = "translateX(4px)";
                  }}
                  onMouseLeave={(e) => {
                    const el = e.currentTarget as HTMLElement;
                    el.style.color = "rgba(0,0,0,0.65)";
                    el.style.transform = "translateX(0)";
                  }}
                >
                  {link.label}
                </button>
              ))}
            </nav>
          </div>

          {/* Column 2: Brand Image (Tooth replacement) */}
          <div className="footer-image">
            <div className="footer-image-inner" style={{ position: "relative", width: "100%" }}>
              <img
                src="/hero-image/dosa.webp"
                alt="Annachi Dish"
                style={{
                  width: "100%",
                  height: "auto",
                  filter: "drop-shadow(0 20px 40px rgba(0,0,0,0.15))",
                }}
              />
              <div style={{
                position: "absolute",
                inset: "20%",
                background: "radial-gradient(circle, rgba(46,125,50,0.1) 0%, transparent 70%)",
                filter: "blur(20px)",
                zIndex: -1,
              }} />
            </div>
          </div>

          {/* Column 3: Contact Info */}
          <div className="footer-contact">
            <div style={{ display: "flex", flexDirection: "column", gap: "12px", textAlign: "left" }}>
              <div>
                <p style={{ fontFamily: "var(--font-inter)", fontSize: "14px", color: "hsl(var(--primary))", fontWeight: 500, marginBottom: "4px" }}>
                  Shanti Nagar, Hubli
                </p>
                <p style={{ fontFamily: "var(--font-inter)", fontSize: "13px", color: "rgba(0,0,0,0.5)", lineHeight: 1.5 }}>
                  Near Shanti Nagar Cross,<br />Hubli — 580023, Karnataka
                </p>
              </div>
              <div>
                <p style={{ fontFamily: "var(--font-inter)", fontSize: "14px", color: "hsl(var(--primary))", fontWeight: 500, marginBottom: "4px" }}>
                  annachi.tiffin@gmail.com
                </p>
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                <p style={{ fontFamily: "var(--font-inter)", fontSize: "14px", color: "hsl(var(--primary))", fontWeight: 500 }}>
                  +91 72045 23312
                </p>
              </div>

            </div>
          </div>
        </div>

        <style>{`
          .footer-grid {
            display: grid;
            grid-template-columns: 0.7fr 1.3fr;
            gap: 24px 16px;
            margin-bottom: 40px;
            align-items: center;
          }
          .footer-links {
            grid-column: 1;
            grid-row: 1;
            display: flex;
            justify-content: flex-start;
          }
          .footer-image {
            grid-column: 2;
            grid-row: 1;
            display: flex;
            justify-content: flex-start;
          }
          .footer-image-inner {
            max-width: 850px !important;
            margin-left: 0px !important;
            margin-right: 0 !important;
          }
          .footer-contact {
            grid-column: 1 / -1;
            grid-row: 2;
            display: flex;
            justify-content: flex-start;
          }

          @media (min-width: 768px) {
            .footer-grid {
              grid-template-columns: 1fr 1fr 1fr;
              align-items: start;
            }
            .footer-links { grid-column: 1; grid-row: 1; }
            .footer-contact { grid-column: 2; grid-row: 1; }
            .footer-image { grid-column: 3; grid-row: 1; }
            .footer-image-inner {
              max-width: 320px !important;
              margin-right: 0 !important;
              margin-left: auto !important;
            }
          }
        `}</style>


        {/* Huge Brand Footer Statement */}
        <div style={{
          textAlign: "center",
          overflow: "hidden",
          marginBottom: "32px",
        }}>
          <h2 style={{
            fontFamily: "var(--font-inter)",
            fontSize: "clamp(80px, 25vw, 340px)",
            fontWeight: 500,
            lineHeight: 0.8,
            letterSpacing: "-0.05em",
            color: "#000",
            margin: "0 0 -12px 0",
            pointerEvents: "none",
            userSelect: "none",
          }}
          >
            Annachi
          </h2>
          <p style={{
            fontFamily: "var(--font-inter)",
            fontSize: "clamp(12px, 1.2vw, 16px)",
            fontWeight: 500,
            letterSpacing: "0.4em",
            textTransform: "uppercase",
            color: "hsl(var(--primary))",
            opacity: 0.8,
            marginTop: "16px",
          }}>
            Tiffin Centre
          </p>
        </div>

        {/* Bottom bar */}
        <div style={{ display: "flex", flexWrap: "wrap", alignItems: "center", justifyContent: "center", gap: "12px", borderTop: "1px solid rgba(0,0,0,0.05)", paddingTop: "32px" }}>
          <p style={{ fontFamily: "var(--font-inter)", fontSize: "12px", color: "rgba(0,0,0,0.4)", textAlign: "center" }}>
            © {year} Annachi Tiffin Centre. All Rights Reserved.
          </p>
          <span style={{ color: "rgba(0,0,0,0.1)", fontSize: "12px" }}>·</span>
          <p style={{ fontFamily: "var(--font-inter)", fontSize: "12px", color: "rgba(0,0,0,0.4)" }}>
            🌿 Pure Veg · Shanti Nagar, Hubli
          </p>
        </div>
      </div>
    </footer>
  );
}
