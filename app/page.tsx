import Footer from "@/components/landingPage/Footer";
import HeroSection from "@/components/landingPage/HeroSection";
import Navbar from "@/components/landingPage/Navbar";
import Pricing from "@/components/landingPage/Pricing";
import Services from "@/components/landingPage/Services";
import Why from "@/components/landingPage/Why";

export default function Home() {
  return (
    <div className="bg-[#f1edf9] poppins">
      <Navbar />
      <HeroSection />
      <Why />
      <Services />
      <Pricing />
      <Footer />
    </div>
  );
}
