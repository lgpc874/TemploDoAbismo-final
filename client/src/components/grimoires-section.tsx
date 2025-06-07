import { useQuery } from "@tanstack/react-query";
import type { Grimoire } from "@shared/schema";

export default function GrimoiresSection() {
  const { data: grimoires = [], isLoading } = useQuery<Grimoire[]>({
    queryKey: ['/api/grimoires'],
  });

  const getGrimoireTypeInfo = (type: string) => {
    switch (type) {
      case 'free':
        return {
          title: "Grimórios Gratuitos",
          description: "Textos introdutórios aos mistérios",
          icon: "📜",
          bgColor: "bg-deep-red",
          buttonText: "Acessar Gratuitamente",
          buttonClass: "bg-antique-gold text-abyss-black hover:bg-blood-red hover:text-white"
        };
      case 'premium':
        return {
          title: "Grimórios Premium",
          description: "Conhecimentos avançados do abismo",
          icon: "🔥",
          bgColor: "bg-blood-red",
          buttonText: "Adquirir",
          buttonClass: "bg-deep-red text-white hover:bg-blood-red",
          isPremium: true
        };
      case 'lost':
        return {
          title: "Escrituras Perdidas",
          description: "Manuscritos raros recuperados",
          icon: "⚡",
          bgColor: "bg-antique-gold",
          buttonText: "Explorar Arquivo",
          buttonClass: "bg-antique-gold text-abyss-black hover:bg-blood-red hover:text-white"
        };
      default:
        return {
          title: "Grimório",
          description: "Conhecimento ancestral",
          icon: "📚",
          bgColor: "bg-deep-red",
          buttonText: "Acessar",
          buttonClass: "bg-antique-gold text-abyss-black hover:bg-blood-red hover:text-white"
        };
    }
  };

  const groupedGrimoires = grimoires.reduce((acc, grimoire) => {
    const type = grimoire.type;
    if (!acc[type]) {
      acc[type] = [];
    }
    acc[type].push(grimoire);
    return acc;
  }, {} as Record<string, Grimoire[]>);

  if (isLoading) {
    return (
      <section id="grimórios" className="py-20 scroll-reveal">
        <div className="container mx-auto px-6">
          <h2 className="font-cinzel text-4xl md:text-5xl font-bold text-center mb-16 text-shadow-gold">
            GRIMÓRIOS ANCESTRAIS
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[1, 2, 3].map((i) => (
              <div key={i} className="glass-effect p-6 border border-antique-gold/30 animate-pulse">
                <div className="h-16 w-16 bg-antique-gold/20 rounded-full mx-auto mb-4"></div>
                <div className="h-6 bg-antique-gold/20 rounded mb-2"></div>
                <div className="h-4 bg-antique-gold/20 rounded mb-4"></div>
                <div className="space-y-2 mb-6">
                  <div className="h-3 bg-antique-gold/20 rounded"></div>
                  <div className="h-3 bg-antique-gold/20 rounded"></div>
                  <div className="h-3 bg-antique-gold/20 rounded"></div>
                </div>
                <div className="h-10 bg-antique-gold/20 rounded"></div>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  return (
    <section id="grimórios" className="py-20 scroll-reveal">
      <div className="container mx-auto px-6">
        <h2 className="font-cinzel text-4xl md:text-5xl font-bold text-center mb-16 text-shadow-gold">
          GRIMÓRIOS ANCESTRAIS
        </h2>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {Object.entries(groupedGrimoires).map(([type, typeGrimoires]) => {
            const typeInfo = getGrimoireTypeInfo(type);
            return (
              <div
                key={type}
                className={`glass-effect p-6 border ${
                  typeInfo.isPremium ? 'border-blood-red/50 animate-pulse-glow' : 'border-antique-gold/30'
                } hover-mystic`}
              >
                <div className="text-center mb-4">
                  <div className={`w-16 h-16 ${typeInfo.bgColor} rounded-full flex items-center justify-center mx-auto mb-4`}>
                    <span className="text-2xl">{typeInfo.icon}</span>
                  </div>
                  <h3 className="font-cinzel text-xl font-bold mb-2">{typeInfo.title}</h3>
                  <p className="font-crimson text-aged-gray">{typeInfo.description}</p>
                </div>
                <ul className="font-crimson space-y-2 mb-6">
                  {typeGrimoires.map((grimoire) => (
                    <li key={grimoire.id}>• {grimoire.title}</li>
                  ))}
                </ul>
                <button className={`w-full py-2 font-cinzel-regular transition-all ${typeInfo.buttonClass}`}>
                  {type === 'premium' && typeGrimoires[0]?.price ? 
                    `${typeInfo.buttonText} - R$ ${typeGrimoires[0].price}` : 
                    typeInfo.buttonText
                  }
                </button>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
