import Navigation from "@/components/navigation";
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
    <div className="bg-abyss-black text-antique-gold min-h-screen relative overflow-hidden">
      <div className="rotating-seal fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 opacity-[0.08] pointer-events-none z-0">
        <svg viewBox="0 0 400 400" className="w-full h-full animate-spin-slow">
          <circle cx="200" cy="200" r="190" fill="none" stroke="currentColor" strokeWidth="2"/>
          <circle cx="200" cy="200" r="160" fill="none" stroke="currentColor" strokeWidth="1"/>
          <circle cx="200" cy="200" r="130" fill="none" stroke="currentColor" strokeWidth="1"/>
          
          <g transform="translate(200,200)">
            <polygon points="0,-80 23,-25 77,-25 38,8 49,62 0,31 -49,62 -38,8 -77,-25 -23,-25" 
                     fill="currentColor" opacity="0.6"/>
            
            <circle cx="0" cy="-60" r="8" fill="currentColor"/>
            <circle cx="45" cy="-18" r="6" fill="currentColor"/>
            <circle cx="28" cy="48" r="6" fill="currentColor"/>
            <circle cx="-28" cy="48" r="6" fill="currentColor"/>
            <circle cx="-45" cy="-18" r="6" fill="currentColor"/>
            
            <text x="0" y="-100" textAnchor="middle" fontSize="12" fill="currentColor">LUCIFER</text>
            <text x="0" y="120" textAnchor="middle" fontSize="10" fill="currentColor">TEMPLO DO ABISMO</text>
          </g>
          
          <g transform="translate(200,200)">
            <text fontSize="8" fill="currentColor">
              <textPath href="#circle-path" startOffset="0%">CONHECIMENTO • SABEDORIA • ILUMINAÇÃO • PODER</textPath>
            </text>
          </g>
          
          <defs>
            <path id="circle-path" d="M 200,40 A 160,160 0 1,1 199.9,40"/>
          </defs>
        </svg>
      </div>

      <Navigation />
      
      {/* Hero Section with Temple Introduction */}
      <section className="relative min-h-screen flex items-center justify-center px-6 py-20">
        <div className="max-w-4xl mx-auto text-center z-10">
          <h1 className="text-6xl md:text-8xl font-light mb-8 text-antique-gold">
            Templum Abyssi
          </h1>
          <h2 className="text-2xl md:text-3xl font-light mb-12 text-deep-red">
            Domus Luciferi Ancestralis
          </h2>
          
          <div className="space-y-8 text-lg leading-relaxed">
            <p className="fade-in-up">
              Bem-vindos ao <strong>Templo do Abismo</strong>, um santuário virtual dedicado aos 
              ensinamentos luciferianos ancestrais. Aqui, nas profundezas do conhecimento esotérico, 
              revelamos os mistérios que foram preservados através dos séculos.
            </p>
            
            <p className="fade-in-up">
              Nossa missão é iluminar aqueles que buscam a verdade além do véu da ignorância, 
              oferecendo acesso aos textos sagrados, grimórios perdidos e ensinamentos que 
              transcendem as limitações do conhecimento comum.
            </p>
            
            <div className="grid md:grid-cols-2 gap-8 mt-16">
              <div className="fade-in-up p-6 border border-deep-red/30 rounded-lg">
                <h3 className="text-xl font-semibold mb-4 text-deep-red">Nossa Filosofia</h3>
                <p className="text-sm">
                  O conhecimento verdadeiro não pode ser limitado por dogmas ou convenções. 
                  Exploramos as tradições luciferianas como um caminho de autodeificação 
                  e iluminação espiritual.
                </p>
              </div>
              
              <div className="fade-in-up p-6 border border-deep-red/30 rounded-lg">
                <h3 className="text-xl font-semibold mb-4 text-deep-red">Nosso Conteúdo</h3>
                <p className="text-sm">
                  Grimórios autênticos, cursos estruturados, textos raros, rituais ancestrais 
                  e ensinamentos práticos para aqueles que trilham o caminho da Mão Esquerda.
                </p>
              </div>
            </div>
            
            <div className="mt-16 p-8 border border-antique-gold/20 rounded-lg fade-in-up">
              <h3 className="text-2xl font-semibold mb-6 text-antique-gold">O Que Você Encontrará</h3>
              <div className="grid md:grid-cols-4 gap-6 text-sm">
                <div>
                  <h4 className="font-semibold text-deep-red mb-2">Grimórios</h4>
                  <p>Textos sagrados e livros de sombras autênticos</p>
                </div>
                <div>
                  <h4 className="font-semibold text-deep-red mb-2">Cursos</h4>
                  <p>Ensinamentos estruturados para iniciação e avanço</p>
                </div>
                <div>
                  <h4 className="font-semibold text-deep-red mb-2">Área VIP</h4>
                  <p>Conteúdo exclusivo para membros avançados</p>
                </div>
                <div>
                  <h4 className="font-semibold text-deep-red mb-2">Segredos</h4>
                  <p>Conhecimentos ocultos para os verdadeiros iniciados</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
