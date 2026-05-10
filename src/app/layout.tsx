import type { Metadata, Viewport } from "next";
import "./globals.css";
import { CartProvider } from "@/contexts/CartContext";
import { SheetDataProvider } from "@/contexts/SheetDataContext";
import CartDrawer from "@/components/CartDrawer";

export const metadata: Metadata = {
  title: "Annachi Tiffin Centre – The Real Taste of the Tamilian | Shanti Nagar, Hubli",
  description:
    "Authentic South Indian tiffin breakfast in Shanti Nagar, Hubli. Fresh Dosa, Idli, Vada & Pongal made daily. Open Mon–Sat 8 AM – 9 PM.",
  keywords: [
    "Annachi Tiffin Centre",
    "South Indian breakfast Hubli",
    "Tiffin Shanti Nagar",
    "Dosa Hubli",
    "Idli Vada Hubli",
    "Tamil food Hubli",
  ],
  manifest: "/manifest.json",
  openGraph: {
    title: "Annachi Tiffin Centre – The Real Taste of the Tamilian",
    description:
      "Freshly made, authentic South Indian tiffin in Shanti Nagar, Hubli. Best Dosa, Idli, Vada & Pongal in town.",
    type: "website",
    locale: "en_IN",
    siteName: "Annachi Tiffin Centre",
  },
  twitter: { card: "summary_large_image" },
  other: {
    "application-name": "Annachi Tiffin Centre",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  themeColor: "#2E7D32",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en-IN" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Outfit:wght@400;500;600;700;800&family=Inter:ital,wght@0,300;0,400;0,500;0,600;0,700;0,800;0,900;1,300;1,400;1,500;1,600;1,700;1,800;1,900&family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;1,300;1,400;1,500&display=swap"
        />
      </head>
      <body>
        <SheetDataProvider>
          <CartProvider>
            {children}
            <CartDrawer />
          </CartProvider>
        </SheetDataProvider>
      </body>
    </html>
  );
}
