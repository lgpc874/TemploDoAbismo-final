import Navigation from "@/components/navigation";
import SecretSection from "@/components/secret-section";
import Footer from "@/components/footer";
import { useScrollReveal } from "@/hooks/use-scroll-reveal";

export default function Secret() {
  useScrollReveal();

  return (
    <div className="bg-abyss-black text-antique-gold min-h-screen">
      <Navigation />
      <div className="pt-20">
        <SecretSection />
      </div>
      <Footer />
    </div>
  );
}