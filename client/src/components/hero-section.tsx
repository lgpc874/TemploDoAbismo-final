export default function HeroSection() {
  return (
    <section id="inicio" className="min-h-screen flex items-center justify-center relative pt-20">
      <div className="text-center z-10">
        
        <h1 className="font-cinzel text-5xl md:text-7xl font-bold mb-6 text-shadow-gold animate-float">
          TEMPLO DO ABISMO
        </h1>
        
        <p className="font-cinzel-regular text-xl md:text-2xl mb-8 max-w-2xl mx-auto px-4">
          Portal dos Ensinamentos Luciferiano Ancestrais
        </p>
        
        <div className="space-y-4 md:space-y-0 md:space-x-6 md:flex md:justify-center px-4">
          <button className="w-full md:w-auto bg-deep-red hover:bg-blood-red text-white px-8 py-3 font-cinzel-regular hover-mystic border border-antique-gold">
            Iniciar Jornada
          </button>
          <button className="w-full md:w-auto bg-transparent border-2 border-antique-gold text-antique-gold hover:bg-antique-gold hover:text-abyss-black px-8 py-3 font-cinzel-regular hover-mystic">
            Explorar Mistérios
          </button>
        </div>
      </div>
      
      {/* Floating Elements */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-2 h-2 bg-antique-gold rounded-full animate-pulse"></div>
        <div className="absolute top-3/4 right-1/4 w-1 h-1 bg-blood-red rounded-full animate-pulse" style={{ animationDelay: '1s' }}></div>
        <div className="absolute bottom-1/4 left-1/3 w-1.5 h-1.5 bg-antique-gold rounded-full animate-pulse" style={{ animationDelay: '2s' }}></div>
      </div>
    </section>
  );
}
