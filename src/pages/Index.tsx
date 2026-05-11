import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Hero } from "@/components/sections/Hero";
import { Demo } from "@/components/sections/Demo";
import { Features } from "@/components/sections/Features";
import { HowItWorks } from "@/components/sections/HowItWorks";
import { Disclaimer } from "@/components/sections/Disclaimer";
import { CTA } from "@/components/sections/CTA";

const Index = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1">
        <Hero />
        <Demo />
        <Features />
        <HowItWorks />
        <Disclaimer />
        <CTA />
      </main>
      <Footer />
    </div>
  );
};

export default Index;
