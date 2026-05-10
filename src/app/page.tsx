"use client";
import { useEffect, useState } from "react";
import ScrollProgressBar from "@/components/ScrollProgressBar";
import Navbar from "@/components/Navbar";
import HeroSection from "@/components/HeroSection";
import CategoriesGrid from "@/components/CategoriesGrid";
import MenuSection from "@/components/MenuSection";
import WhyChooseUs from "@/components/WhyChooseUs";
import ReviewsCarousel from "@/components/ReviewsCarousel";
import AboutSection from "@/components/AboutSection";
import ContactSection from "@/components/ContactSection";
import Footer from "@/components/Footer";
import OwnerBillingPanel from "@/components/OwnerBillingPanel";

export default function Home() {
  const [ownerBillingOpen, setOwnerBillingOpen] = useState(false);

  /* Listen for the secret trigger dispatched by the Navbar's long-press */
  useEffect(() => {
    const handler = () => setOwnerBillingOpen(true);
    window.addEventListener("annachi:billing:open", handler);
    return () => window.removeEventListener("annachi:billing:open", handler);
  }, []);

  return (
    <>
      {/* Fixed overlays */}
      <ScrollProgressBar />

      {/* Navigation */}
      <Navbar />

      {/* Secret owner billing panel — invisible to customers */}
      <OwnerBillingPanel
        open={ownerBillingOpen}
        onClose={() => setOwnerBillingOpen(false)}
      />

      {/* Main content */}
      <main>
        <HeroSection />
        <CategoriesGrid />
        <MenuSection />
        <WhyChooseUs />
        <ReviewsCarousel />
        <AboutSection />
        <ContactSection />
      </main>

      <Footer />
    </>
  );
}
