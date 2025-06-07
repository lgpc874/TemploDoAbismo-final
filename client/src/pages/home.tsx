import Navigation from "@/components/navigation";
import HeroSection from "@/components/hero-section";
import GrimoiresSection from "@/components/grimoires-section";
import CoursesSection from "@/components/courses-section";
import VipSection from "@/components/vip-section";
import SecretSection from "@/components/secret-section";
import ContactSection from "@/components/contact-section";
import Footer from "@/components/footer";
import { useScrollReveal } from "@/hooks/use-scroll-reveal";
import { useEffect } from "react";

export default function Home() {
  useScrollReveal();

  useEffect(() => {
    // Add mystical particle effects
    function createParticle() {
      const particle = document.createElement('div');
      particle.className = 'fixed w-1 h-1 bg-antique-gold rounded-full pointer-events-none z-0';
      particle.style.left = Math.random() * window.innerWidth + 'px';
      particle.style.top = window.innerHeight + 'px';
      particle.style.opacity = String(Math.random() * 0.5 + 0.2);
      
      document.body.appendChild(particle);
      
      const duration = Math.random() * 3000 + 2000;
      const animation = particle.animate([
        { transform: 'translateY(0px)', opacity: particle.style.opacity },
        { transform: `translateY(-${window.innerHeight + 100}px)`, opacity: '0' }
      ], {
        duration: duration,
        easing: 'linear'
      });
      
      animation.onfinish = () => particle.remove();
    }

    // Create particles periodically
    const particleInterval = setInterval(createParticle, 2000);

    // Add cursor trail effect
    let mouseTrail: Array<{x: number, y: number, time: number}> = [];
    const maxTrailLength = 10;

    function handleMouseMove(e: MouseEvent) {
      mouseTrail.push({ x: e.clientX, y: e.clientY, time: Date.now() });
      
      if (mouseTrail.length > maxTrailLength) {
        mouseTrail.shift();
      }
      
      // Update existing trail elements or create new ones
      mouseTrail.forEach((point, index) => {
        let trailElement = document.getElementById(`trail-${index}`);
        if (!trailElement) {
          trailElement = document.createElement('div');
          trailElement.id = `trail-${index}`;
          trailElement.className = 'fixed w-2 h-2 bg-antique-gold rounded-full pointer-events-none z-10';
          trailElement.style.opacity = '0.3';
          document.body.appendChild(trailElement);
        }
        
        const age = Date.now() - point.time;
        const opacity = Math.max(0, 0.3 - (age / 1000));
        const size = Math.max(1, 8 - (age / 100));
        
        trailElement.style.left = point.x - size/2 + 'px';
        trailElement.style.top = point.y - size/2 + 'px';
        trailElement.style.opacity = String(opacity);
        trailElement.style.width = size + 'px';
        trailElement.style.height = size + 'px';
      });
    }

    document.addEventListener('mousemove', handleMouseMove);

    // Clean up old trail elements
    const trailCleanup = setInterval(() => {
      mouseTrail = mouseTrail.filter(point => Date.now() - point.time < 1000);
      
      // Remove orphaned trail elements
      for (let i = mouseTrail.length; i < maxTrailLength; i++) {
        const element = document.getElementById(`trail-${i}`);
        if (element) {
          element.remove();
        }
      }
    }, 100);

    return () => {
      clearInterval(particleInterval);
      clearInterval(trailCleanup);
      document.removeEventListener('mousemove', handleMouseMove);
    };
  }, []);

  return (
    <div className="bg-abyss-black text-antique-gold min-h-screen overflow-x-hidden">
      <Navigation />
      <HeroSection />
      <GrimoiresSection />
      <CoursesSection />
      <VipSection />
      <SecretSection />
      <ContactSection />
      <Footer />
    </div>
  );
}
