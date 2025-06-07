export default function Footer() {
  const footerLinks = [
    { href: "#", label: "Política de Privacidade" },
    { href: "#", label: "Termos de Uso" },
    { href: "#", label: "FAQ" }
  ];

  return (
    <footer className="border-t border-deep-red/30 py-12">
      <div className="container mx-auto px-6 text-center">
        <div className="mb-8">
          <img
            src="https://i.postimg.cc/g20gqmdX/IMG-20250527-182235-1.png"
            alt="Selo do Templo"
            className="w-12 h-12 mx-auto mb-4 opacity-70"
          />
        </div>
        
        <div className="font-cinzel text-lg font-bold mb-4">TEMPLO DO ABISMO</div>
        <p className="font-crimson text-aged-gray mb-6">
          Portal dos Ensinamentos Luciferiano Ancestrais
        </p>
        
        <div className="flex justify-center space-x-8 mb-6">
          {footerLinks.map((link) => (
            <a
              key={link.label}
              href={link.href}
              className="text-antique-gold hover:text-blood-red transition-colors"
            >
              {link.label}
            </a>
          ))}
        </div>
        
        <div className="text-sm text-aged-gray font-crimson">
          © 2024 Templo do Abismo. Todos os direitos reservados aos mistérios ancestrais.
        </div>
      </div>
    </footer>
  );
}
