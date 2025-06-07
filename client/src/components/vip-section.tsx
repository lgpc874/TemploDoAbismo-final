export default function VipSection() {
  const exclusiveContent = [
    "Rituais Avançados de Alta Magia",
    "Sessões de Mentoramento Individual",
    "Grimórios Raros e Únicos",
    "Acesso ao Círculo Interior"
  ];

  const vipBenefits = [
    "Suporte Prioritário 24/7",
    "Webinários Mensais Exclusivos",
    "Comunidade Privada",
    "Downloads Ilimitados"
  ];

  return (
    <section id="vip" className="py-20 scroll-reveal">
      <div className="container mx-auto px-6">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="font-cinzel text-4xl md:text-5xl font-bold mb-8 text-shadow-gold">
            CÂMARA VIP DO ABISMO
          </h2>
          
          <div className="glass-effect p-8 border-2 border-blood-red animate-pulse-glow">
            <div className="mb-6">
              <div className="w-20 h-20 bg-blood-red rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-3xl">👑</span>
              </div>
              <h3 className="font-cinzel text-2xl font-bold mb-4">Acesso Exclusivo aos Mistérios Profundos</h3>
            </div>
            
            <div className="grid md:grid-cols-2 gap-8 mb-8">
              <div>
                <h4 className="font-cinzel text-lg font-bold mb-3">Conteúdo Exclusivo</h4>
                <ul className="font-crimson text-left space-y-2">
                  {exclusiveContent.map((item, index) => (
                    <li key={index}>• {item}</li>
                  ))}
                </ul>
              </div>
              <div>
                <h4 className="font-cinzel text-lg font-bold mb-3">Benefícios VIP</h4>
                <ul className="font-crimson text-left space-y-2">
                  {vipBenefits.map((item, index) => (
                    <li key={index}>• {item}</li>
                  ))}
                </ul>
              </div>
            </div>
            
            <div className="text-center">
              <div className="text-3xl font-bold text-antique-gold mb-4">R$ 497/mês</div>
              <button className="bg-blood-red hover:bg-deep-red text-white px-12 py-4 font-cinzel-regular text-lg hover-mystic">
                Ascender ao VIP
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
