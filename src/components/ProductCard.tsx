"use client";
import { useState } from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import { ShoppingBag, Check, Ban } from "lucide-react";
import type { MenuItem } from "@/lib/data";
import { useCart } from "@/contexts/CartContext";

interface Props {
  item: MenuItem;
  index: number;
  unavailable?: boolean;
}

export default function ProductCard({ item, index, unavailable = false }: Props) {
  const { addItem } = useCart();
  const [added, setAdded] = useState(false);

  const handleAdd = () => {
    if (unavailable) return;
    addItem(item);
    setAdded(true);
    setTimeout(() => setAdded(false), 1800);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 28, scale: 0.95 }}
      whileInView={{ opacity: 1, y: 0, scale: 1 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{
        delay: (index % 6) * 0.05,
        duration: 0.5,
        ease: [0.22, 1, 0.36, 1],
      }}
      className="product-card-wrapper"
      style={{
        position: "relative",
        display: "flex",
        flexDirection: "column",
        height: "100%",
        overflow: "visible",
        opacity: unavailable ? 0.52 : 1,
        transition: "opacity 300ms",
      }}
    >
      {/* Floating food image */}
      <div className="product-card-img" style={{
        position: "absolute",
        top: "-10px",
        left: "50%",
        transform: "translateX(-50%)",
        zIndex: 10,
        pointerEvents: "none",
        filter: unavailable ? "grayscale(0.7)" : "none",
        transition: "filter 300ms",
      }}>
        {item.image ? (
          <Image
            src={item.image}
            alt={item.name}
            fill
            style={{
              objectFit: "contain",
              filter: "drop-shadow(0 12px 28px rgba(0,0,0,0.40))",
            }}
          />
        ) : (
          <div style={{
            width: "100%", height: "100%",
            borderRadius: "24px",
            background: "rgba(255,255,255,0.06)",
            display: "flex", alignItems: "center", justifyContent: "center",
          }}>
            <span style={{ fontSize: "48px" }}>🍽️</span>
          </div>
        )}
      </div>

      {/* Card body */}
      <div
        className="product-card-body"
        style={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          alignItems: "flex-start",
          gap: "6px",
        }}
      >
        {/* Name */}
        <h4
          className="font-display"
          style={{
            color: unavailable ? "rgba(255,255,255,0.45)" : "#fff",
            fontSize: "clamp(14px, 1.6vw, 16px)",
            fontWeight: 400,
            lineHeight: 1.25,
            letterSpacing: "-0.01em",
            textAlign: "left",
            transition: "color 300ms",
          }}
        >
          {item.name}
        </h4>

        {/* Price */}
        <div style={{ display: "flex", alignItems: "baseline", gap: "4px" }}>
          <span
            className="number-display"
            style={{
              color: unavailable ? "rgba(255,255,255,0.30)" : "rgba(255,255,255,0.65)",
              fontSize: "clamp(13px, 1.4vw, 15px)",
              fontWeight: 400,
              letterSpacing: "-0.02em",
              transition: "color 300ms",
            }}
          >
            ₹{item.price}
          </span>
          <span style={{
            fontFamily: "var(--font-inter)",
            fontSize: "10px",
            color: "rgba(255,255,255,0.40)",
            fontWeight: 400
          }}>
            / plate
          </span>
        </div>

        {/* Unavailable badge OR Add to Cart button */}
        {unavailable ? (
          <div style={{
            marginTop: "4px",
            width: "100%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: "7px",
            background: "rgba(239,68,68,0.08)",
            border: "1px solid rgba(239,68,68,0.20)",
            borderRadius: "12px",
            padding: "10px 12px",
            color: "rgba(239,68,68,0.65)",
            fontFamily: "var(--font-inter)",
            fontSize: "12px",
            fontWeight: 400,
            letterSpacing: "0.02em",
            cursor: "default",
          }}>
            <Ban size={13} />
            Not Available
          </div>
        ) : (
          <button
            id={`add-to-cart-${item.id}`}
            onClick={handleAdd}
            style={{
              marginTop: "4px",
              width: "100%",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "7px",
              background: added
                ? "rgba(46,125,50,0.55)"
                : "rgba(255,255,255,0.10)",
              border: added
                ? "1px solid rgba(165,214,167,0.40)"
                : "1px solid rgba(255,255,255,0.18)",
              borderRadius: "12px",
              padding: "10px 12px",
              color: added ? "#A5D6A7" : "rgba(255,255,255,0.80)",
              fontFamily: "var(--font-inter)",
              fontSize: "12px",
              fontWeight: 400,
              cursor: "pointer",
              transition: "background 250ms, border-color 250ms, color 250ms",
              letterSpacing: "0.02em",
            }}
          >
            {added ? (
              <>
                <Check size={13} />
                Added
              </>
            ) : (
              <>
                <ShoppingBag size={13} />
                Add to Cart
              </>
            )}
          </button>
        )}
      </div>
    </motion.div>
  );
}
