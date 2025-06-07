import { useState } from "react";
import { Menu, X } from "lucide-react";
import { Link, useLocation } from "wouter";

export default function Navigation() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [location] = useLocation();

  const navItems = [
    { href: "/", label: "Templum" },
    { href: "/libri-umbrarum", label: "Libri Umbrarum" },
    { href: "/cursus-mysticus", label: "Cursus Mysticus" },
    { href: "/sanctum-vip", label: "Sanctum VIP" },
    { href: "/arcana-secreta", label: "Arcana Secreta" },
    { href: "/porta-templi", label: "Porta Templi" },
  ];

  return (
    <nav className="fixed top-0 w-full z-50 glass-effect border-b border-deep-red/30">
      <div className="container mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          <Link href="/" className="font-cinzel text-2xl font-bold text-shadow-gold hover:text-blood-red transition-colors">
            Templo do Abismo
          </Link>
          
          <div className="hidden md:flex space-x-8 font-cinzel-regular">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={`hover:text-blood-red transition-colors duration-300 ${
                  location === item.href ? 'text-blood-red border-b border-blood-red' : ''
                }`}
              >
                {item.label}
              </Link>
            ))}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden text-antique-gold hover:text-blood-red"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden mt-4 pb-4 font-cinzel-regular">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setMobileMenuOpen(false)}
                className={`block w-full text-left py-2 hover:text-blood-red transition-colors ${
                  location === item.href ? 'text-blood-red' : ''
                }`}
              >
                {item.label}
              </Link>
            ))}
          </div>
        )}
      </div>
    </nav>
  );
}
