"use client";
import { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { X, Minus, Plus, ShoppingBag, Trash2, ArrowRight, ChevronLeft, Clock, Moon } from "lucide-react";
import { useCart } from "@/contexts/CartContext";
import { useSheetData } from "@/contexts/SheetDataContext";
import { computeStoreStatus } from "@/lib/sheet-types";
import { BRAND } from "@/lib/data";


/* ─────────────────────────────────────────────────────────────
   ORDER MESSAGE BUILDER
   Produces a clean, professional, no-emoji order summary.
───────────────────────────────────────────────────────────── */
function buildOrderMessage(
  customerName: string,
  items: { name: string; qty: number; price: number }[],
  total: number,
  upiLink: string
): string {
  const now = new Date();
  const date = `${now.getDate()}/${now.getMonth() + 1}/${now.getFullYear()}`;
  const time = new Date().toLocaleTimeString("en-IN", {
    hour: "2-digit",
    minute: "2-digit",
  });

  const itemLines = items
    .map(
      (it) =>
        `  - ${it.name.padEnd(20)} x${it.qty}  Rs. ${(it.qty * it.price).toFixed(0)}`
    )
    .join("\n");

  return (
    `ORDER REQUEST —\n` +
    `Annachi Tiffin Centre\n` +
    `--------------------------------------\n` +
    `Customer  : ${customerName}\n` +
    `Date      : ${date}\n` +
    `Time      : ${time}\n` +
    `--------------------------------------\n` +
    `ITEMS ORDERED\n` +
    `${itemLines}\n` +
    `--------------------------------------\n` +
    `TOTAL AMOUNT : Rs. ${total}\n` +
    `--------------------------------------\n` +
    `Upi link: ${upiLink}\n` +
    `--------------------------------------\n` +
    `Kindly confirm this order once payment is done.\n` +
    `Thank you for ordering from Annachi Tiffin Centre.`
  );
}

function buildUpiLink(amount: number, upiId: string): string {
  const note = encodeURIComponent("Annachi Tiffin Centre Order");
  const name = encodeURIComponent("Annachi Tiffin Centre");
  return `upi://pay?pa=${upiId}&pn=${name}&am=${amount}&cu=INR&tn=${note}`;
}

/* ─────────────────────────────────────────────────────────────
   STEP VIEWS
───────────────────────────────────────────────────────────── */

type Step = "cart" | "name";

export default function CartDrawer() {
  const { items, totalItems, totalPrice, removeItem, updateQty, clearCart, cartOpen, setCartOpen } = useCart();
  const { settings } = useSheetData();
  const [step, setStep] = useState<Step>("cart");
  const [customerName, setCustomerName] = useState("");
  const [nameError, setNameError] = useState("");
  const storeStatus = computeStoreStatus(settings);

  const close = () => {
    setCartOpen(false);
    setTimeout(() => {
      setStep("cart");
      setCustomerName("");
      setNameError("");
    }, 350);
  };

  const handleNameSubmit = () => {
    const trimmed = customerName.trim();
    if (!trimmed || trimmed.length < 2) {
      setNameError("Please enter your name (at least 2 characters).");
      return;
    }
    setNameError("");
    handleOrder(trimmed);
  };

  const handleOrder = (name?: string) => {
    const resolvedName = name ?? customerName.trim();
    const upiLink = buildUpiLink(totalPrice, BRAND.paytmUpiId);
    const message = buildOrderMessage(
      resolvedName,
      items.map((ci) => ({ name: ci.item.name, qty: ci.quantity, price: ci.item.price })),
      totalPrice,
      upiLink
    );
    const waNumber = BRAND.whatsapp;
    const waUrl = `https://wa.me/${waNumber}?text=${encodeURIComponent(message)}`;
    window.open(waUrl, "_blank", "noopener");
    clearCart();
    close();
  };

  const handlePayDirect = () => {
    const trimmed = customerName.trim();
    if (!trimmed || trimmed.length < 2) {
      setNameError("Please enter your name (at least 2 characters).");
      return;
    }
    const upiLink = buildUpiLink(totalPrice, BRAND.paytmUpiId);
    window.open(upiLink, "_blank", "noopener");
    clearCart();
    close();
  };

  return (
    <AnimatePresence>
      {cartOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            key="cart-backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.22 }}
            onClick={close}
            style={{
              position: "fixed",
              inset: 0,
              background: "rgba(0,0,0,0.60)",
              backdropFilter: "blur(8px)",
              WebkitBackdropFilter: "blur(8px)",
              zIndex: 80,
            }}
          />

          {/* Drawer */}
          <motion.div
            key="cart-drawer"
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 34, stiffness: 380 }}
            style={{
              position: "fixed",
              right: 0,
              top: 0,
              bottom: 0,
              width: "min(92vw, 420px)",
              zIndex: 90,
              background: "linear-gradient(180deg, #0d2210 0%, #060d07 100%)",
              borderLeft: "1px solid rgba(165,214,167,0.14)",
              boxShadow: "-24px 0 80px rgba(0,0,0,0.55)",
              display: "flex",
              flexDirection: "column",
              overflow: "hidden",
            }}
          >
            <AnimatePresence mode="wait">
              {step === "cart" && (
                <CartStep
                  key="cart"
                  items={items}
                  totalItems={totalItems}
                  totalPrice={totalPrice}
                  removeItem={removeItem}
                  updateQty={updateQty}
                  clearCart={clearCart}
                  onClose={close}
                  onProceed={() => setStep("name")}
                  storeOpen={storeStatus.open}
                  storeClosedReason={storeStatus.reason}
                  nextOpenTime={storeStatus.nextOpen}
                />
              )}
              {step === "name" && (
                <NameStep
                  key="name"
                  customerName={customerName}
                  nameError={nameError}
                  onChange={(v) => { setCustomerName(v); setNameError(""); }}
                  onBack={() => setStep("cart")}
                  onNext={handleNameSubmit}
                  onClose={close}
                  onPayDirect={handlePayDirect}
                />
              )}
            </AnimatePresence>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

/* ─── STEP 1: Cart Contents ─── */
function CartStep({
  items, totalItems, totalPrice, removeItem, updateQty, clearCart, onClose, onProceed,
  storeOpen, storeClosedReason, nextOpenTime,
}: {
  items: ReturnType<typeof useCart>["items"];
  totalItems: number;
  totalPrice: number;
  removeItem: (id: string) => void;
  updateQty: (id: string, qty: number) => void;
  clearCart: () => void;
  onClose: () => void;
  onProceed: () => void;
  storeOpen: boolean;
  storeClosedReason: string;
  nextOpenTime: string;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, x: 40 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -40 }}
      transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
      style={{ display: "flex", flexDirection: "column", height: "100%" }}
    >
      {/* Header */}
      <div style={{
        padding: "24px 20px 18px",
        borderBottom: "1px solid rgba(165,214,167,0.10)",
        display: "flex", alignItems: "center", justifyContent: "space-between",
        flexShrink: 0,
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          <ShoppingBag size={18} color="#A5D6A7" />
          <span style={{
            fontFamily: "var(--font-inter)", fontWeight: 400,
            fontSize: "16px", color: "#fff", letterSpacing: "-0.01em",
          }}>
            Your Cart
          </span>
          {totalItems > 0 && (
            <span style={{
              background: "#2E7D32", color: "#fff",
              borderRadius: "9999px", fontSize: "11px",
              padding: "2px 8px", fontFamily: "var(--font-inter)", fontWeight: 400,
            }}>
              {totalItems}
            </span>
          )}
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
          {items.length > 0 && (
            <button
              onClick={clearCart}
              style={{
                background: "none",
                border: "none",
                color: "rgba(239, 68, 68, 0.7)",
                fontSize: "12px",
                fontFamily: "var(--font-inter)",
                cursor: "pointer",
                padding: "4px 8px",
                borderRadius: "6px",
                transition: "all 200ms",
              }}
              onMouseEnter={(e) => (e.currentTarget.style.color = "rgba(239, 68, 68, 1)")}
              onMouseLeave={(e) => (e.currentTarget.style.color = "rgba(239, 68, 68, 0.7)")}
            >
              Clear
            </button>
          )}
          <button onClick={onClose} style={closeBtn}>
            <X size={16} />
          </button>
        </div>
      </div>

      {/* Items */}
      <div style={{ flex: 1, overflowY: "auto", padding: "12px 20px" }} className="scrollbar-hide">
        {items.length === 0 ? (
          <EmptyCart />
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: "12px", paddingTop: "8px" }}>
            {items.map((ci) => (
              <motion.div
                key={ci.item.id}
                layout
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, x: 60, transition: { duration: 0.2 } }}
                style={{
                  background: "rgba(255,255,255,0.07)",
                  border: "1px solid rgba(255,255,255,0.10)",
                  borderRadius: "16px",
                  padding: "12px",
                  display: "flex", gap: "12px", alignItems: "center",
                }}
              >
                {/* Image */}
                <div style={{
                  width: "52px", height: "52px", flexShrink: 0,
                  borderRadius: "10px", overflow: "hidden",
                  background: "rgba(255,255,255,0.06)",
                  position: "relative",
                }}>
                  {ci.item.image ? (
                    <Image src={ci.item.image} alt={ci.item.name} fill style={{ objectFit: "cover" }} />
                  ) : (
                    <span style={{ fontSize: "24px", display: "flex", alignItems: "center", justifyContent: "center", height: "100%" }}>🍽️</span>
                  )}
                </div>

                {/* Info */}
                <div style={{ flex: 1, minWidth: 0 }}>
                  <p style={{
                    fontFamily: "var(--font-inter)", fontSize: "13px",
                    fontWeight: 400, color: "#fff",
                    whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis",
                  }}>{ci.item.name}</p>
                  <p style={{
                    fontFamily: "var(--font-inter)", fontSize: "12px",
                    color: "#A5D6A7", marginTop: "2px", fontWeight: 400,
                  }}>
                    Rs. {ci.item.price * ci.quantity}
                  </p>
                </div>

                {/* Qty controls */}
                <div style={{ display: "flex", alignItems: "center", gap: "8px", flexShrink: 0 }}>
                  <button
                    onClick={() => updateQty(ci.item.id, ci.quantity - 1)}
                    style={qtyBtn}
                    aria-label="Decrease quantity"
                  >
                    <Minus size={12} />
                  </button>
                  <span style={{
                    fontFamily: "var(--font-inter)", fontSize: "13px",
                    color: "#fff", minWidth: "18px", textAlign: "center",
                  }}>{ci.quantity}</span>
                  <button
                    onClick={() => updateQty(ci.item.id, ci.quantity + 1)}
                    style={qtyBtn}
                    aria-label="Increase quantity"
                  >
                    <Plus size={12} />
                  </button>

                  {/* Delete */}
                  <button
                    onClick={() => removeItem(ci.item.id)}
                    style={{
                      ...qtyBtn,
                      background: "rgba(239,68,68,0.12)",
                      border: "1px solid rgba(239,68,68,0.20)",
                      marginLeft: "4px",
                    }}
                    aria-label="Remove item"
                  >
                    <Trash2 size={12} color="#F87171" />
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>

      {/* Footer */}
      {items.length > 0 && (
        <div style={{
          padding: "16px 20px 24px",
          borderTop: "1px solid rgba(165,214,167,0.10)",
          flexShrink: 0,
        }}>
          {storeOpen ? (
            <>
              {/* Total */}
              <div style={{
                display: "flex", justifyContent: "space-between", alignItems: "baseline",
                marginBottom: "16px",
              }}>
                <span style={{ fontFamily: "var(--font-inter)", fontSize: "13px", color: "rgba(255,255,255,0.55)" }}>
                  Total
                </span>
                <span style={{
                  fontFamily: "var(--font-inter)", fontSize: "22px",
                  fontWeight: 400, color: "#fff", letterSpacing: "-0.03em",
                }}>
                  Rs. {totalPrice}
                </span>
              </div>
              <button
                id="cart-proceed-btn"
                onClick={onProceed}
                style={primaryBtn}
                onMouseEnter={(e) => (e.currentTarget.style.opacity = "0.88")}
                onMouseLeave={(e) => (e.currentTarget.style.opacity = "1")}
              >
                Proceed to Order
                <ArrowRight size={16} />
              </button>
            </>
          ) : (
            <StoreClosedBanner reason={storeClosedReason} nextOpen={nextOpenTime} />
          )}
        </div>
      )}
    </motion.div>
  );
}

/* ─── STEP 2: Name entry ─── */
function NameStep({
  customerName, nameError, onChange, onBack, onNext, onClose, onPayDirect,
}: {
  customerName: string;
  nameError: string;
  onChange: (v: string) => void;
  onBack: () => void;
  onNext: () => void;
  onClose: () => void;
  onPayDirect: () => void;
}) {
  const [pressing, setPressing] = useState(false);
  const [progress, setProgress] = useState(0);
  const pressTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const progressInterval = useRef<ReturnType<typeof setInterval> | null>(null);
  const longPressTriggered = useRef(false);

  const startPress = () => {
    const trimmed = customerName.trim();
    if (!trimmed || trimmed.length < 2) return; // let onClick handle validation error
    longPressTriggered.current = false;
    setPressing(true);
    setProgress(0);
    const startTime = Date.now();
    progressInterval.current = setInterval(() => {
      const elapsed = Date.now() - startTime;
      setProgress(Math.min((elapsed / 3000) * 100, 100));
    }, 16);
    pressTimer.current = setTimeout(() => {
      if (progressInterval.current) clearInterval(progressInterval.current);
      longPressTriggered.current = true;
      setPressing(false);
      setProgress(0);
      onPayDirect();
    }, 3000);
  };

  const cancelPress = () => {
    if (pressTimer.current) clearTimeout(pressTimer.current);
    if (progressInterval.current) clearInterval(progressInterval.current);
    setPressing(false);
    setProgress(0);
  };

  const handleClick = () => {
    if (longPressTriggered.current) {
      longPressTriggered.current = false;
      return;
    }
    onNext();
  };

  /* cleanup on unmount */
  const cancelPressRef = useRef(cancelPress);
  cancelPressRef.current = cancelPress;

  return (
    <motion.div
      initial={{ opacity: 0, x: 40 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -40 }}
      transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
      style={{ display: "flex", flexDirection: "column", height: "100%", padding: "24px 20px" }}
    >
      {/* Header */}
      <div style={{
        display: "flex", alignItems: "center", justifyContent: "space-between",
        marginBottom: "36px",
      }}>
        <button onClick={onBack} style={backBtn}>
          <ChevronLeft size={16} />
          Back
        </button>
        <button onClick={onClose} style={closeBtn}>
          <X size={16} />
        </button>
      </div>

      <div style={{ flex: 1 }}>
        <p style={{
          fontFamily: "var(--font-inter)", fontSize: "11px",
          letterSpacing: "0.14em", textTransform: "uppercase",
          color: "rgba(165,214,167,0.55)", marginBottom: "12px",
        }}>
          Almost there
        </p>
        <h3 style={{
          fontFamily: "var(--font-inter)", fontSize: "26px",
          fontWeight: 400, color: "#fff", letterSpacing: "-0.02em",
          lineHeight: 1.15, marginBottom: "8px",
        }}>
          What should we call you?
        </h3>
        <p style={{
          fontFamily: "var(--font-inter)", fontSize: "13px",
          color: "rgba(255,255,255,0.45)", lineHeight: 1.65, marginBottom: "32px",
        }}>
          Your name will be included in the order message sent to the restaurant.
        </p>

        <label style={{
          display: "block", fontFamily: "var(--font-inter)",
          fontSize: "11px", letterSpacing: "0.10em",
          textTransform: "uppercase", color: "rgba(165,214,167,0.70)",
          marginBottom: "8px",
        }}>
          Full Name
        </label>
        <input
          id="customer-name-input"
          type="text"
          value={customerName}
          onChange={(e) => onChange(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && onNext()}
          placeholder="e.g. Ramesh Kumar"
          autoFocus
          style={{
            width: "100%",
            background: "rgba(255,255,255,0.07)",
            border: nameError
              ? "1px solid rgba(239,68,68,0.60)"
              : "1px solid rgba(165,214,167,0.20)",
            borderRadius: "14px",
            padding: "14px 16px",
            color: "#fff",
            fontFamily: "var(--font-inter)",
            fontSize: "15px",
            fontWeight: 400,
            outline: "none",
            transition: "border-color 200ms",
          }}
        />
        {nameError && (
          <p style={{
            fontFamily: "var(--font-inter)", fontSize: "12px",
            color: "#F87171", marginTop: "8px",
          }}>
            {nameError}
          </p>
        )}
      </div>

      {/* Place Order button with long-press → Paytm UPI */}
      <div style={{ marginTop: "24px" }}>
        <button
          id="name-next-btn"
          onClick={handleClick}
          onPointerDown={startPress}
          onPointerUp={cancelPress}
          onPointerLeave={cancelPress}
          onPointerCancel={cancelPress}
          style={{
            ...primaryBtn,
            position: "relative",
            overflow: "hidden",
            userSelect: "none",
            WebkitUserSelect: "none",
            touchAction: "none",
          }}
        >
          {/* Long-press fill indicator */}
          {pressing && (
            <div
              style={{
                position: "absolute",
                left: 0, top: 0, bottom: 0,
                width: `${progress}%`,
                background: "rgba(255,255,255,0.18)",
                pointerEvents: "none",
                transition: "width 16ms linear",
              }}
            />
          )}
          <span style={{ position: "relative", zIndex: 1, display: "flex", alignItems: "center", gap: "8px" }}>
            {pressing
              ? `Hold… ${Math.max(1, Math.ceil(3 - (progress / 100) * 3))}s`
              : "Place Order"}
            <ArrowRight size={16} />
          </span>
        </button>

        {/* Hint */}
        <p style={{
          fontFamily: "var(--font-inter)",
          fontSize: "11px",
          color: "rgba(165,214,167,0.40)",
          textAlign: "center",
          marginTop: "10px",
          letterSpacing: "0.02em",
        }}>
          Hold 3 sec to pay directly via Paytm
        </p>
      </div>
    </motion.div>
  );
}

/* ─── Empty state ─── */
function EmptyCart() {
  return (
    <div style={{
      display: "flex", flexDirection: "column",
      alignItems: "center", justifyContent: "center",
      height: "260px", gap: "12px",
    }}>
      <ShoppingBag size={36} color="rgba(165,214,167,0.25)" />
      <p style={{
        fontFamily: "var(--font-inter)", fontSize: "14px",
        color: "rgba(255,255,255,0.35)", textAlign: "center",
      }}>
        Your cart is empty.
        <br />
        Add items from the menu.
      </p>
    </div>
  );
}

/* ─── Store Closed Banner ─── */
function StoreClosedBanner({ reason, nextOpen }: { reason: string; nextOpen: string }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
    >
      {/* Closed pill */}
      <div style={{
        display: "flex",
        alignItems: "center",
        gap: "8px",
        padding: "10px 14px",
        borderRadius: "12px",
        background: "rgba(183,28,28,0.14)",
        border: "1px solid rgba(239,83,80,0.25)",
        marginBottom: "14px",
      }}>
        <Moon size={14} color="#EF9A9A" strokeWidth={1.5} />
        <span style={{
          fontFamily: "var(--font-inter)",
          fontSize: "12px",
          fontWeight: 500,
          color: "#EF9A9A",
          letterSpacing: "0.01em",
        }}>
          Store Closed
        </span>
      </div>

      {/* Reason text */}
      <p style={{
        fontFamily: "var(--font-inter)",
        fontSize: "13px",
        color: "rgba(255,255,255,0.60)",
        lineHeight: 1.65,
        marginBottom: "14px",
      }}>
        {reason}
      </p>

      {/* Next open time */}
      <div style={{
        display: "flex",
        alignItems: "center",
        gap: "10px",
        padding: "12px 14px",
        borderRadius: "12px",
        background: "rgba(46,125,50,0.10)",
        border: "1px solid rgba(165,214,167,0.15)",
      }}>
        <Clock size={14} color="#A5D6A7" strokeWidth={1.5} />
        <div>
          <p style={{
            fontFamily: "var(--font-inter)",
            fontSize: "10px",
            color: "rgba(165,214,167,0.55)",
            letterSpacing: "0.10em",
            textTransform: "uppercase",
            marginBottom: "2px",
          }}>
            Next Opening
          </p>
          <p style={{
            fontFamily: "var(--font-inter)",
            fontSize: "13px",
            fontWeight: 500,
            color: "#A5D6A7",
          }}>
            {nextOpen}
          </p>
        </div>
      </div>

      {/* Reassurance note */}
      <p style={{
        fontFamily: "var(--font-inter)",
        fontSize: "11px",
        color: "rgba(255,255,255,0.22)",
        textAlign: "center",
        marginTop: "14px",
        letterSpacing: "0.02em",
      }}>
        Your cart is saved — come back when we open!
      </p>
    </motion.div>
  );
}

/* ─── Shared styles ─── */
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

const qtyBtn: React.CSSProperties = {
  width: "28px", height: "28px",
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

const backBtn: React.CSSProperties = {
  display: "flex", alignItems: "center", gap: "4px",
  background: "none", border: "none",
  color: "rgba(165,214,167,0.70)",
  fontFamily: "var(--font-inter)", fontSize: "13px", fontWeight: 400,
  cursor: "pointer",
  padding: "4px 0",
  letterSpacing: "0.01em",
};
