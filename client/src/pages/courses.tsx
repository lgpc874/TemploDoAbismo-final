import Navigation from "@/components/navigation";
import CoursesSection from "@/components/courses-section";
import Footer from "@/components/footer";
import { useScrollReveal } from "@/hooks/use-scroll-reveal";

export default function Courses() {
  useScrollReveal();

  return (
    <div className="bg-abyss-black text-antique-gold min-h-screen">
      <Navigation />
      <div className="pt-20">
        <CoursesSection />
      </div>
      <Footer />
    </div>
  );
}