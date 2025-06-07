import Navigation from "@/components/navigation";
import GrimoiresSection from "@/components/grimoires-section";
import Footer from "@/components/footer";
import { useScrollReveal } from "@/hooks/use-scroll-reveal";

export default function Grimoires() {
  useScrollReveal();

  return (
    <div className="bg-abyss-black text-antique-gold min-h-screen">
      <Navigation />
      <div className="pt-20">
        <GrimoiresSection />
      </div>
      <Footer />
    </div>
  );
}