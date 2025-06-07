import Navigation from "@/components/navigation";
import VipSection from "@/components/vip-section";
import Footer from "@/components/footer";
import { useScrollReveal } from "@/hooks/use-scroll-reveal";

export default function Vip() {
  useScrollReveal();

  return (
    <div className="bg-abyss-black text-antique-gold min-h-screen">
      <Navigation />
      <div className="pt-20">
        <VipSection />
      </div>
      <Footer />
    </div>
  );
}