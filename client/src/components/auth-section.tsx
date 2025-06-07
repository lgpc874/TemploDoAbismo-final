import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { InsertUser } from "@shared/schema";

export default function AuthSection() {
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: ""
  });
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const registerMutation = useMutation({
    mutationFn: async (userData: InsertUser) => {
      const response = await fetch('/api/register', {
        method: 'POST',
        body: JSON.stringify(userData),
        headers: { 'Content-Type': 'application/json' },
      });
      if (!response.ok) throw new Error('Failed to register');
      return response.json();
    },
    onSuccess: () => {
      toast({
        title: "Iniciação Completa",
        description: "Bem-vindo ao Templo do Abismo, iniciado.",
      });
      setFormData({ username: "", email: "", password: "", confirmPassword: "" });
    },
    onError: () => {
      toast({
        title: "Falha na Iniciação",
        description: "Erro ao criar conta. Verifique os dados e tente novamente.",
        variant: "destructive",
      });
    },
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!isLogin) {
      if (formData.password !== formData.confirmPassword) {
        toast({
          title: "Senhas não coincidem",
          description: "Verifique as senhas digitadas.",
          variant: "destructive",
        });
        return;
      }
      
      registerMutation.mutate({
        username: formData.username,
        email: formData.email,
        password: formData.password
      });
    } else {
      // Login logic would go here
      toast({
        title: "Acesso Negado",
        description: "Sistema de login em desenvolvimento.",
      });
    }
  };

  const toggleMode = () => {
    setIsLogin(!isLogin);
    setFormData({ username: "", email: "", password: "", confirmPassword: "" });
  };

  return (
    <section id="auth" className="py-20 scroll-reveal">
      <div className="container mx-auto px-6">
        <h2 className="font-cinzel text-4xl md:text-5xl font-bold text-center mb-16 text-shadow-gold">
          {isLogin ? "PORTAL DE ACESSO" : "RITUAL DE INICIAÇÃO"}
        </h2>
        
        <div className="max-w-md mx-auto">
          <div className="glass-effect p-8 border border-deep-red/30">
            <div className="text-center mb-6">
              <div className="w-16 h-16 bg-deep-red rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">{isLogin ? "🔑" : "🔥"}</span>
              </div>
              <h3 className="font-cinzel text-2xl font-bold mb-2">
                {isLogin ? "Entre no Templo" : "Torne-se Iniciado"}
              </h3>
              <p className="font-crimson text-aged-gray text-sm">
                {isLogin 
                  ? "Acesse sua conta para continuar sua jornada" 
                  : "Junte-se aos estudiosos dos mistérios ancestrais"
                }
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              {!isLogin && (
                <div>
                  <label className="block font-cinzel-regular text-sm mb-2">Nome Iniciático</label>
                  <input
                    type="text"
                    name="username"
                    value={formData.username}
                    onChange={handleInputChange}
                    className="w-full bg-dark-accent border border-antique-gold/30 text-antique-gold px-4 py-3 font-crimson focus:border-blood-red focus:outline-none"
                    required
                    placeholder="Seu nome no templo"
                  />
                </div>
              )}
              
              <div>
                <label className="block font-cinzel-regular text-sm mb-2">
                  {isLogin ? "Nome ou Email" : "Email"}
                </label>
                <input
                  type={isLogin ? "text" : "email"}
                  name={isLogin ? "username" : "email"}
                  value={isLogin ? formData.username : formData.email}
                  onChange={handleInputChange}
                  className="w-full bg-dark-accent border border-antique-gold/30 text-antique-gold px-4 py-3 font-crimson focus:border-blood-red focus:outline-none"
                  required
                  placeholder={isLogin ? "Nome ou email" : "seu@email.com"}
                />
              </div>
              
              <div>
                <label className="block font-cinzel-regular text-sm mb-2">Senha Arcana</label>
                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  className="w-full bg-dark-accent border border-antique-gold/30 text-antique-gold px-4 py-3 font-crimson focus:border-blood-red focus:outline-none"
                  required
                  placeholder="Sua senha secreta"
                />
              </div>

              {!isLogin && (
                <div>
                  <label className="block font-cinzel-regular text-sm mb-2">Confirmar Senha</label>
                  <input
                    type="password"
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleInputChange}
                    className="w-full bg-dark-accent border border-antique-gold/30 text-antique-gold px-4 py-3 font-crimson focus:border-blood-red focus:outline-none"
                    required
                    placeholder="Confirme sua senha"
                  />
                </div>
              )}
              
              <button
                type="submit"
                disabled={registerMutation.isPending}
                className="w-full bg-deep-red hover:bg-blood-red text-white py-3 font-cinzel-regular hover-mystic disabled:opacity-50 disabled:cursor-not-allowed mt-6"
              >
                {registerMutation.isPending 
                  ? (isLogin ? "Acessando..." : "Iniciando...") 
                  : (isLogin ? "Entrar no Templo" : "Realizar Iniciação")
                }
              </button>
            </form>

            <div className="text-center mt-6">
              <button
                onClick={toggleMode}
                className="text-antique-gold hover:text-blood-red transition-colors font-crimson text-sm"
              >
                {isLogin 
                  ? "Ainda não é iniciado? Realize sua iniciação" 
                  : "Já possui acesso? Entre no templo"
                }
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}