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
        <div className="container mx-auto px-6 py-12">
          <h1 className="text-5xl md:text-7xl font-light text-center mb-8 text-antique-gold">
            Arcana Secreta
          </h1>
          <p className="text-xl text-center mb-16 text-deep-red">
            Occultissima Sapientia et Ritus Arcani
          </p>
        </div>
        <SecretSection />
      </div>
      <Footer />
    </div>
  );
}