export default function GrimoiresSection() {
  const grimoires = [
    {
      id: 1,
      title: "Grimórios Gratuitos",
      description: "Textos introdutórios aos mistérios",
      icon: "📜",
      bgColor: "bg-deep-red",
      items: [
        "Fundamentos do Luciferianismo",
        "Rituais Básicos de Proteção",
        "Símbolos e Sigilos Elementares"
      ],
      buttonText: "Acessar Gratuitamente",
      buttonClass: "bg-antique-gold text-abyss-black hover:bg-blood-red hover:text-white"
    },
    {
      id: 2,
      title: "Grimórios Premium",
      description: "Conhecimentos avançados do abismo",
      icon: "🔥",
      bgColor: "bg-blood-red",
      items: [
        "Rituais de Evocação Avançados",
        "Pactos e Juramentos Infernais",
        "Textos Perdidos Restaurados"
      ],
      buttonText: "Adquirir - R$ 97",
      buttonClass: "bg-deep-red text-white hover:bg-blood-red",
      isPremium: true
    },
    {
      id: 3,
      title: "Escrituras Perdidas",
      description: "Manuscritos raros recuperados",
      icon: "⚡",
      bgColor: "bg-antique-gold",
      items: [
        "Códices Medievais Restaurados",
        "Pergaminhos do Século XIII",
        "Traduções Exclusivas"
      ],
      buttonText: "Explorar Arquivo",
      buttonClass: "bg-antique-gold text-abyss-black hover:bg-blood-red hover:text-white"
    }
  ];

  return (
    <section id="grimórios" className="py-20 scroll-reveal">
      <div className="container mx-auto px-6">
        <h2 className="font-cinzel text-4xl md:text-5xl font-bold text-center mb-16 text-shadow-gold">
          GRIMÓRIOS ANCESTRAIS
        </h2>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {grimoires.map((grimoire) => (
            <div
              key={grimoire.id}
              className={`glass-effect p-6 border ${
                grimoire.isPremium ? 'border-blood-red/50 animate-pulse-glow' : 'border-antique-gold/30'
              } hover-mystic`}
            >
              <div className="text-center mb-4">
                <div className={`w-16 h-16 ${grimoire.bgColor} rounded-full flex items-center justify-center mx-auto mb-4`}>
                  <span className="text-2xl">{grimoire.icon}</span>
                </div>
                <h3 className="font-cinzel text-xl font-bold mb-2">{grimoire.title}</h3>
                <p className="font-crimson text-aged-gray">{grimoire.description}</p>
              </div>
              <ul className="font-crimson space-y-2 mb-6">
                {grimoire.items.map((item, index) => (
                  <li key={index}>• {item}</li>
                ))}
              </ul>
              <button className={`w-full py-2 font-cinzel-regular transition-all ${grimoire.buttonClass}`}>
                {grimoire.buttonText}
              </button>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
