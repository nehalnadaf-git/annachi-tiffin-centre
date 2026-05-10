"use client";
import { useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { QRCodeSVG } from "qrcode.react";
import { X, Plus, Minus, ArrowRight, ChevronLeft, Trash2, Share2, QrCode, RefreshCw } from "lucide-react";
import { useSheetData } from "@/contexts/SheetDataContext";
import { BRAND } from "@/lib/data";

/* ─────────────────────────────────────────────────────────────
   TYPES
───────────────────────────────────────────────────────────── */
type View = "builder" | "summary" | "qr";
interface BillEntry { id: string; name: string; price: number; qty: number; }

/* ─────────────────────────────────────────────────────────────
   UPI LINK BUILDER
───────────────────────────────────────────────────────────── */
function buildUpiLink(amount: number): string {
  const note = encodeURIComponent("Annachi Tiffin Centre Bill");
  const name = encodeURIComponent("Annachi Tiffin Centre");
  return `upi://pay?pa=${BRAND.paytmUpiId}&pn=${name}&am=${amount}&cu=INR&tn=${note}`;
}

/* ─────────────────────────────────────────────────────────────
   MAIN COMPONENT
───────────────────────────────────────────────────────────── */
export default function OwnerBillingPanel({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  const { allMenuItems } = useSheetData();
  const [view, setView] = useState<View>("builder");
  const [quantities, setQuantities] = useState<Record<string, number>>({});

  /* Derived values */
  const billEntries: BillEntry[] = allMenuItems
    .filter((item) => (quantities[item.id] ?? 0) > 0)
    .map((item) => ({
      id: item.id,
      name: item.name,
      price: item.price,
      qty: quantities[item.id],
    }));
  const total = billEntries.reduce((sum, e) => sum + e.price * e.qty, 0);
  const upiLink = buildUpiLink(total);

  const setQty = useCallback((id: string, delta: number) => {
    setQuantities((prev) => {
      const next = Math.max(0, (prev[id] ?? 0) + delta);
      return { ...prev, [id]: next };
    });
  }, []);

  const clearAll = () => {
    setQuantities({});
    setView("builder");
  };

  const handleClose = () => {
    onClose();
    // Reset after exit animation
    setTimeout(() => { setQuantities({}); setView("builder"); }, 350);
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({ title: "Pay Annachi Tiffin Centre", url: upiLink });
      } catch { /* cancelled */ }
    } else {
      window.open(upiLink, "_blank", "noopener");
    }
  };

  return (
    <AnimatePresence>
      {open && (
        <>
          {/* Backdrop */}
          <motion.div
            key="owner-backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={handleClose}
            style={{
              position: "fixed", inset: 0,
              background: "rgba(0,0,0,0.75)",
              backdropFilter: "blur(8px)",
              WebkitBackdropFilter: "blur(8px)",
              zIndex: 200,
            }}
          />

          {/* Panel */}
          <motion.div
            key="owner-panel"
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%" }}
            transition={{ type: "spring", damping: 32, stiffness: 340 }}
            style={{
              position: "fixed",
              left: 0, right: 0, bottom: 0,
              height: "92dvh",
              zIndex: 210,
              background: "linear-gradient(180deg, #0a1f0b 0%, #060d06 100%)",
              borderTop: "1px solid rgba(165,214,167,0.18)",
              borderRadius: "24px 24px 0 0",
              boxShadow: "0 -24px 80px rgba(0,0,0,0.60)",
              display: "flex",
              flexDirection: "column",
              overflow: "hidden",
            }}
          >
            <AnimatePresence mode="wait">
              {view === "builder" && (
                <BuilderView
                  key="builder"
                  allMenuItems={allMenuItems}
                  quantities={quantities}
                  total={total}
                  hasBill={billEntries.length > 0}
                  setQty={setQty}
                  clearAll={clearAll}
                  onClose={handleClose}
                  onProceed={() => setView("summary")}
                />
              )}
              {view === "summary" && (
                <SummaryView
                  key="summary"
                  entries={billEntries}
                  total={total}
                  onBack={() => setView("builder")}
                  onClose={handleClose}
                  onShare={handleShare}
                  onQR={() => setView("qr")}
                />
              )}
              {view === "qr" && (
                <QRView
                  key="qr"
                  entries={billEntries}
                  total={total}
                  upiLink={upiLink}
                  onBack={() => setView("summary")}
                  onClose={handleClose}
                  onNewBill={clearAll}
                />
              )}
            </AnimatePresence>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

/* ─────────────────────────────────────────────────────────────
   VIEW 1 — BILL BUILDER
───────────────────────────────────────────────────────────── */
function BuilderView({
  allMenuItems, quantities, total, hasBill, setQty, clearAll, onClose, onProceed,
}: {
  allMenuItems: ReturnType<typeof useSheetData>["allMenuItems"];
  quantities: Record<string, number>;
  total: number;
  hasBill: boolean;
  setQty: (id: string, d: number) => void;
  clearAll: () => void;
  onClose: () => void;
  onProceed: () => void;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, x: 30 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -30 }}
      transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
      style={{ display: "flex", flexDirection: "column", height: "100%" }}
    >
      {/* Header */}
      <div style={{
        padding: "20px 20px 16px",
        borderBottom: "1px solid rgba(165,214,167,0.10)",
        display: "flex", alignItems: "center", justifyContent: "space-between",
        flexShrink: 0,
      }}>
        <div>
          <p style={{
            fontFamily: "var(--font-inter)", fontSize: "10px",
            letterSpacing: "0.18em", textTransform: "uppercase",
            color: "rgba(165,214,167,0.50)", marginBottom: "2px",
          }}>Owner Panel</p>
          <h2 style={{
            fontFamily: "var(--font-inter)", fontSize: "18px",
            fontWeight: 400, color: "#fff", letterSpacing: "-0.01em", margin: 0,
          }}>Build Bill</h2>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          {hasBill && (
            <button onClick={clearAll} style={ghostBtn} title="Clear all">
              <Trash2 size={14} color="rgba(239,68,68,0.70)" />
            </button>
          )}
          <button onClick={onClose} style={closeBtn}>
            <X size={16} />
          </button>
        </div>
      </div>

      {/* Item List */}
      <div style={{ flex: 1, overflowY: "auto", padding: "12px 16px" }} className="scrollbar-hide">
        {allMenuItems.map((item) => {
          const qty = quantities[item.id] ?? 0;
          const selected = qty > 0;
          return (
            <div
              key={item.id}
              style={{
                display: "flex", alignItems: "center",
                justifyContent: "space-between",
                padding: "13px 14px",
                marginBottom: "8px",
                borderRadius: "16px",
                background: selected
                  ? "rgba(46,125,50,0.14)"
                  : "rgba(255,255,255,0.04)",
                border: selected
                  ? "1px solid rgba(165,214,167,0.22)"
                  : "1px solid rgba(255,255,255,0.07)",
                transition: "background 180ms, border-color 180ms",
              }}
            >
              <div>
                <p style={{
                  fontFamily: "var(--font-inter)", fontSize: "14px",
                  fontWeight: 400, color: "#fff", margin: 0,
                }}>{item.name}</p>
                <p style={{
                  fontFamily: "var(--font-inter)", fontSize: "12px",
                  color: selected ? "#A5D6A7" : "rgba(255,255,255,0.40)",
                  marginTop: "2px",
                }}>Rs. {item.price}</p>
              </div>

              {/* Qty Controls */}
              <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                {qty > 0 && (
                  <>
                    <button
                      onClick={() => setQty(item.id, -1)}
                      style={qtyBtn}
                      aria-label="Decrease"
                    >
                      <Minus size={12} />
                    </button>
                    <span style={{
                      fontFamily: "var(--font-inter)", fontSize: "15px",
                      fontWeight: 400, color: "#fff",
                      minWidth: "20px", textAlign: "center",
                    }}>{qty}</span>
                  </>
                )}
                <button
                  onClick={() => setQty(item.id, 1)}
                  style={{
                    ...qtyBtn,
                    background: selected ? "rgba(46,125,50,0.35)" : "rgba(255,255,255,0.08)",
                    border: selected ? "1px solid rgba(165,214,167,0.30)" : "1px solid rgba(255,255,255,0.12)",
                  }}
                  aria-label="Increase"
                >
                  <Plus size={12} />
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Footer */}
      <div style={{
        padding: "16px 20px 28px",
        borderTop: "1px solid rgba(165,214,167,0.10)",
        flexShrink: 0,
      }}>
        {hasBill ? (
          <>
            <div style={{
              display: "flex", justifyContent: "space-between",
              alignItems: "baseline", marginBottom: "14px",
            }}>
              <span style={{ fontFamily: "var(--font-inter)", fontSize: "13px", color: "rgba(255,255,255,0.50)" }}>
                Total
              </span>
              <span style={{
                fontFamily: "var(--font-inter)", fontSize: "26px",
                fontWeight: 400, color: "#fff", letterSpacing: "-0.03em",
              }}>
                Rs. {total}
              </span>
            </div>
            <button
              onClick={onProceed}
              style={primaryBtn}
              onMouseEnter={(e) => (e.currentTarget.style.opacity = "0.88")}
              onMouseLeave={(e) => (e.currentTarget.style.opacity = "1")}
            >
              View Bill <ArrowRight size={15} />
            </button>
          </>
        ) : (
          <p style={{
            fontFamily: "var(--font-inter)", fontSize: "13px",
            color: "rgba(255,255,255,0.30)", textAlign: "center",
          }}>
            Tap + on items to build the bill
          </p>
        )}
      </div>
    </motion.div>
  );
}

/* ─────────────────────────────────────────────────────────────
   VIEW 2 — BILL SUMMARY
───────────────────────────────────────────────────────────── */
function SummaryView({
  entries, total, onBack, onClose, onShare, onQR,
}: {
  entries: BillEntry[];
  total: number;
  onBack: () => void;
  onClose: () => void;
  onShare: () => void;
  onQR: () => void;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, x: 30 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -30 }}
      transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
      style={{ display: "flex", flexDirection: "column", height: "100%" }}
    >
      {/* Header */}
      <div style={{
        padding: "20px 20px 16px",
        borderBottom: "1px solid rgba(165,214,167,0.10)",
        display: "flex", alignItems: "center", justifyContent: "space-between",
        flexShrink: 0,
      }}>
        <button onClick={onBack} style={backBtn}>
          <ChevronLeft size={16} /> Back
        </button>
        <button onClick={onClose} style={closeBtn}><X size={16} /></button>
      </div>

      {/* Bill Receipt */}
      <div style={{ flex: 1, overflowY: "auto", padding: "24px 20px" }} className="scrollbar-hide">
        <p style={{
          fontFamily: "var(--font-inter)", fontSize: "10px",
          letterSpacing: "0.18em", textTransform: "uppercase",
          color: "rgba(165,214,167,0.50)", marginBottom: "6px",
        }}>Bill Summary</p>
        <h2 style={{
          fontFamily: "var(--font-inter)", fontSize: "18px",
          fontWeight: 400, color: "#fff", letterSpacing: "-0.01em",
          margin: "0 0 24px",
        }}>Annachi Tiffin Centre</h2>

        {/* Divider */}
        <div style={{ height: "1px", background: "rgba(165,214,167,0.12)", marginBottom: "16px" }} />

        {/* Items */}
        {entries.map((e) => (
          <div key={e.id} style={{
            display: "flex", justifyContent: "space-between",
            alignItems: "baseline", marginBottom: "12px",
          }}>
            <div>
              <span style={{
                fontFamily: "var(--font-inter)", fontSize: "14px",
                color: "#fff", fontWeight: 400,
              }}>{e.name}</span>
              <span style={{
                fontFamily: "var(--font-inter)", fontSize: "12px",
                color: "rgba(255,255,255,0.40)", marginLeft: "8px",
              }}>× {e.qty}</span>
            </div>
            <span style={{
              fontFamily: "var(--font-inter)", fontSize: "14px",
              color: "#A5D6A7", fontWeight: 400,
            }}>Rs. {e.price * e.qty}</span>
          </div>
        ))}

        {/* Divider */}
        <div style={{ height: "1px", background: "rgba(165,214,167,0.12)", margin: "16px 0" }} />

        {/* Total */}
        <div style={{
          display: "flex", justifyContent: "space-between",
          alignItems: "baseline",
        }}>
          <span style={{ fontFamily: "var(--font-inter)", fontSize: "13px", color: "rgba(255,255,255,0.50)" }}>
            Grand Total
          </span>
          <span style={{
            fontFamily: "var(--font-inter)", fontSize: "32px",
            fontWeight: 400, color: "#fff", letterSpacing: "-0.03em",
          }}>
            Rs. {total}
          </span>
        </div>
      </div>

      {/* Action buttons */}
      <div style={{ padding: "16px 20px 28px", flexShrink: 0, display: "flex", flexDirection: "column", gap: "10px" }}>
        <button
          onClick={onQR}
          style={primaryBtn}
          onMouseEnter={(e) => (e.currentTarget.style.opacity = "0.88")}
          onMouseLeave={(e) => (e.currentTarget.style.opacity = "1")}
        >
          <QrCode size={16} /> Generate QR Code
        </button>
        <button
          onClick={onShare}
          style={secondaryBtn}
          onMouseEnter={(e) => (e.currentTarget.style.background = "rgba(165,214,167,0.10)")}
          onMouseLeave={(e) => (e.currentTarget.style.background = "rgba(255,255,255,0.05)")}
        >
          <Share2 size={16} /> Share UPI Link
        </button>
      </div>
    </motion.div>
  );
}

/* ─────────────────────────────────────────────────────────────
   VIEW 3 — QR CODE
───────────────────────────────────────────────────────────── */
function QRView({
  entries, total, upiLink, onBack, onClose, onNewBill,
}: {
  entries: BillEntry[];
  total: number;
  upiLink: string;
  onBack: () => void;
  onClose: () => void;
  onNewBill: () => void;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, x: 30 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -30 }}
      transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
      style={{ display: "flex", flexDirection: "column", height: "100%" }}
    >
      {/* Header */}
      <div style={{
        padding: "20px 20px 16px",
        borderBottom: "1px solid rgba(165,214,167,0.10)",
        display: "flex", alignItems: "center", justifyContent: "space-between",
        flexShrink: 0,
      }}>
        <button onClick={onBack} style={backBtn}>
          <ChevronLeft size={16} /> Back
        </button>
        <button onClick={onClose} style={closeBtn}><X size={16} /></button>
      </div>

      {/* QR + Bill Side-by-side or stacked */}
      <div style={{ flex: 1, overflowY: "auto", padding: "24px 20px" }} className="scrollbar-hide">
        {/* Amount */}
        <div style={{ textAlign: "center", marginBottom: "24px" }}>
          <p style={{
            fontFamily: "var(--font-inter)", fontSize: "11px",
            letterSpacing: "0.16em", textTransform: "uppercase",
            color: "rgba(165,214,167,0.55)", marginBottom: "6px",
          }}>Amount to Collect</p>
          <p style={{
            fontFamily: "var(--font-inter)", fontSize: "40px",
            fontWeight: 400, color: "#fff", letterSpacing: "-0.03em",
            lineHeight: 1,
          }}>Rs. {total}</p>
        </div>

        {/* QR Code */}
        <div style={{
          display: "flex", justifyContent: "center",
          marginBottom: "24px",
        }}>
          <div style={{
            background: "#fff",
            borderRadius: "20px",
            padding: "18px",
            boxShadow: "0 8px 40px rgba(0,0,0,0.50)",
          }}>
            <QRCodeSVG
              value={upiLink}
              size={200}
              level="M"
              includeMargin={false}
            />
          </div>
        </div>

        <p style={{
          fontFamily: "var(--font-inter)", fontSize: "12px",
          color: "rgba(255,255,255,0.35)", textAlign: "center",
          letterSpacing: "0.02em", marginBottom: "28px",
        }}>
          Scan with any UPI app to pay
        </p>

        {/* Bill breakdown */}
        <div style={{
          background: "rgba(255,255,255,0.04)",
          border: "1px solid rgba(165,214,167,0.10)",
          borderRadius: "16px",
          padding: "16px",
        }}>
          <p style={{
            fontFamily: "var(--font-inter)", fontSize: "10px",
            letterSpacing: "0.14em", textTransform: "uppercase",
            color: "rgba(165,214,167,0.50)", marginBottom: "12px",
          }}>Order Breakdown</p>
          {entries.map((e) => (
            <div key={e.id} style={{
              display: "flex", justifyContent: "space-between",
              alignItems: "baseline", marginBottom: "8px",
            }}>
              <span style={{
                fontFamily: "var(--font-inter)", fontSize: "13px",
                color: "rgba(255,255,255,0.70)",
              }}>{e.name} × {e.qty}</span>
              <span style={{
                fontFamily: "var(--font-inter)", fontSize: "13px",
                color: "#A5D6A7",
              }}>Rs. {e.price * e.qty}</span>
            </div>
          ))}
          <div style={{ height: "1px", background: "rgba(165,214,167,0.12)", margin: "10px 0 10px" }} />
          <div style={{ display: "flex", justifyContent: "space-between" }}>
            <span style={{ fontFamily: "var(--font-inter)", fontSize: "13px", color: "rgba(255,255,255,0.50)" }}>Total</span>
            <span style={{ fontFamily: "var(--font-inter)", fontSize: "14px", fontWeight: 400, color: "#fff" }}>
              Rs. {total}
            </span>
          </div>
        </div>
      </div>

      {/* New Bill Button */}
      <div style={{ padding: "16px 20px 28px", flexShrink: 0 }}>
        <button
          onClick={onNewBill}
          style={secondaryBtn}
          onMouseEnter={(e) => (e.currentTarget.style.background = "rgba(165,214,167,0.10)")}
          onMouseLeave={(e) => (e.currentTarget.style.background = "rgba(255,255,255,0.05)")}
        >
          <RefreshCw size={15} /> New Bill
        </button>
      </div>
    </motion.div>
  );
}

/* ─────────────────────────────────────────────────────────────
   SHARED STYLES
───────────────────────────────────────────────────────────── */
const primaryBtn: React.CSSProperties = {
  width: "100%",
  display: "flex", alignItems: "center", justifyContent: "center", gap: "8px",
  background: "linear-gradient(135deg, #2E7D32, #1B5E20)",
  border: "none", borderRadius: "14px",
  padding: "15px 20px",
  color: "#fff",
  fontFamily: "var(--font-inter)", fontSize: "14px", fontWeight: 400,
  cursor: "pointer",
  boxShadow: "0 6px 28px rgba(46,125,50,0.40)",
  letterSpacing: "0.01em",
  transition: "opacity 200ms",
};

const secondaryBtn: React.CSSProperties = {
  width: "100%",
  display: "flex", alignItems: "center", justifyContent: "center", gap: "8px",
  background: "rgba(255,255,255,0.05)",
  border: "1px solid rgba(165,214,167,0.20)",
  borderRadius: "14px",
  padding: "14px 20px",
  color: "#A5D6A7",
  fontFamily: "var(--font-inter)", fontSize: "14px", fontWeight: 400,
  cursor: "pointer",
  letterSpacing: "0.01em",
  transition: "background 200ms",
};

const qtyBtn: React.CSSProperties = {
  width: "30px", height: "30px",
  display: "flex", alignItems: "center", justifyContent: "center",
  background: "rgba(255,255,255,0.08)",
  border: "1px solid rgba(255,255,255,0.12)",
  borderRadius: "8px",
  color: "#fff",
  cursor: "pointer",
  flexShrink: 0,
  transition: "background 150ms",
};

const closeBtn: React.CSSProperties = {
  width: "32px", height: "32px",
  display: "flex", alignItems: "center", justifyContent: "center",
  background: "rgba(255,255,255,0.06)",
  border: "1px solid rgba(255,255,255,0.08)",
  borderRadius: "50%",
  color: "rgba(255,255,255,0.50)",
  cursor: "pointer",
  flexShrink: 0,
};

const ghostBtn: React.CSSProperties = {
  width: "32px", height: "32px",
  display: "flex", alignItems: "center", justifyContent: "center",
  background: "rgba(239,68,68,0.08)",
  border: "1px solid rgba(239,68,68,0.15)",
  borderRadius: "50%",
  cursor: "pointer",
  flexShrink: 0,
};

const backBtn: React.CSSProperties = {
  display: "flex", alignItems: "center", gap: "4px",
  background: "none", border: "none",
  color: "rgba(165,214,167,0.70)",
  fontFamily: "var(--font-inter)", fontSize: "13px", fontWeight: 400,
  cursor: "pointer",
  padding: "4px 0",
  letterSpacing: "0.01em",
};
