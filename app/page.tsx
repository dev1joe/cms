"use client";
import { HeroSection } from "@/components/HeroSection";
import { Navbar } from "@/components/Navbar";
import { ProductsSection } from "@/components/ProductsSection";

export default function Home() {
  return (
    <>
      {/* isolated session management here */}
      {/* allowing other sections to load/render without blocking the whole page */}
      <Navbar />

      <div className="px-8 py-8 lg:px-12 lg:py-10">

        {/* Hero Section */}
        <HeroSection />

        {/* products section */}
        {/* fetching products, no need to check the session */}
        <ProductsSection />
      </div>
    </>
  );
}

