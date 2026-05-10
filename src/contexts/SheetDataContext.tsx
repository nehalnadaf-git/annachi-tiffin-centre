"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
  ReactNode,
} from "react";
import { SheetData, SheetProduct, SheetSettings, DEFAULT_SETTINGS } from "@/lib/sheet-types";
import { MENU_ITEMS, MenuItem } from "@/lib/data";

/* ────────────────────────────────────────────────────────────
   Types
──────────────────────────────────────────────────────────── */
export interface LiveMenuItem extends MenuItem {
  /** True when this item is marked inactive in the Google Sheet */
  unavailable: boolean;
}

interface SheetDataContextValue {
  /** Only active items — default "Available" view */
  liveMenuItems: LiveMenuItem[];
  /** All items including inactive ones (with unavailable:true) — "Full Menu" view */
  allMenuItems: LiveMenuItem[];
  /** Live store settings (hours, manual status) */
  settings: SheetSettings;
  /** True while the first fetch is in progress */
  loading: boolean;
  /** True if the last fetch failed */
  error: boolean;
}

/* ────────────────────────────────────────────────────────────
   Context
──────────────────────────────────────────────────────────── */
const SheetDataContext = createContext<SheetDataContextValue>({
  liveMenuItems: MENU_ITEMS.map((i) => ({ ...i, unavailable: false })),
  allMenuItems: MENU_ITEMS.map((i) => ({ ...i, unavailable: false })),
  settings: DEFAULT_SETTINGS,
  loading: false,
  error: false,
});

/* ────────────────────────────────────────────────────────────
   Provider
──────────────────────────────────────────────────────────── */
export function SheetDataProvider({ children }: { children: ReactNode }) {
  const [sheetData, setSheetData] = useState<SheetData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  const fetchData = useCallback(async () => {
    try {
      const res = await fetch("/api/menu", { cache: "no-store" });
      if (!res.ok) throw new Error("non-ok response");
      const data: SheetData = await res.json();
      setSheetData(data);
      setError(false);
    } catch {
      setError(true);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
    // Poll every 60 seconds so prices/status stay fresh
    const interval = setInterval(fetchData, 60_000);
    return () => clearInterval(interval);
  }, [fetchData]);

  /* Build allMenuItems — every item merged with live price + unavailable flag */
  const allMenuItems: LiveMenuItem[] = MENU_ITEMS.map((item) => {
    const override = sheetData?.products.find((p: SheetProduct) => p.id === item.id);
    return {
      ...item,
      price: override && override.price > 0 ? override.price : item.price,
      unavailable: override ? !override.active : false,
    };
  });

  /* Active-only subset — default "Available" view */
  const liveMenuItems: LiveMenuItem[] = allMenuItems.filter((item) => !item.unavailable);

  const settings: SheetSettings = sheetData?.settings ?? DEFAULT_SETTINGS;

  return (
    <SheetDataContext.Provider value={{ liveMenuItems, allMenuItems, settings, loading, error }}>
      {children}
    </SheetDataContext.Provider>
  );
}

/* ────────────────────────────────────────────────────────────
   Hook
──────────────────────────────────────────────────────────── */
export function useSheetData() {
  return useContext(SheetDataContext);
}
