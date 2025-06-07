import { useState } from "react";

export default function SecretSection() {
  const [secretCode, setSecretCode] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle secret access attempt
    console.log("Secret code attempt:", secretCode);
  };

  return (
    <section id="secreto" className="py-20 scroll-reveal">
      <div className="container mx-auto px-6">
        <div className="max-w-2xl mx-auto text-center">
          <h2 className="font-cinzel text-4xl md:text-5xl font-bold mb-8 text-shadow-gold">
            PORTAL SECRETO
          </h2>
          
          <div className="glass-effect p-8 border border-antique-gold/20 relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-r from-deep-red/10 to-blood-red/10"></div>
            <div className="relative z-10">
              <div className="w-16 h-16 bg-abyss-black border-2 border-antique-gold rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="text-2xl">🔒</span>
              </div>
              
              <h3 className="font-cinzel text-2xl font-bold mb-4">Área Restrita</h3>
              <p className="font-crimson text-aged-gray mb-6">
                Para aqueles que demonstraram dedicação e compreensão dos mistérios mais profundos. 
                O acesso é concedido apenas por convite especial.
              </p>
              
              <form onSubmit={handleSubmit} className="mb-6">
                <input
                  type="password"
                  placeholder="Código de Acesso Secreto"
                  value={secretCode}
                  onChange={(e) => setSecretCode(e.target.value)}
                  className="w-full bg-dark-accent border border-antique-gold/30 text-antique-gold px-4 py-3 font-crimson focus:border-blood-red focus:outline-none mb-4"
                />
                
                <button
                  type="submit"
                  className="bg-antique-gold text-abyss-black px-8 py-3 font-cinzel-regular hover:bg-blood-red hover:text-white transition-all"
                >
                  Tentar Acesso
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
