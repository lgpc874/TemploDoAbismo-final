import Navigation from "@/components/navigation";
import AuthSection from "@/components/auth-section";
import Footer from "@/components/footer";
import { useScrollReveal } from "@/hooks/use-scroll-reveal";

export default function Acesso() {
  useScrollReveal();

  return (
    <div className="bg-abyss-black text-antique-gold min-h-screen">
      <Navigation />
      <div className="pt-20">
        <AuthSection />
      </div>
      <Footer />
    </div>
  );
}