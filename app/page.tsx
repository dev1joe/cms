"use client";
import { HeroSection } from "@/components/HeroSection";
import { Navbar } from "@/components/Navbar";
import { ProductsSection } from "@/components/ProductsSection";

export default function Home() {
  return (
    <>
      <Navbar />

      <div className="px-8 py-8 lg:px-12 lg:py-10">

        {/* Hero Section */}
        <HeroSection />

        {/* products section */}
        <ProductsSection />
      </div>
    </>
  );
}

