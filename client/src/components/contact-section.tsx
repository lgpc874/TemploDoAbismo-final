import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import type { InsertContact } from "@shared/schema";

export default function ContactSection() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: ""
  });
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const contactMutation = useMutation({
    mutationFn: async (contactData: InsertContact) => {
      const response = await fetch('/api/contact', {
        method: 'POST',
        body: JSON.stringify(contactData),
        headers: { 'Content-Type': 'application/json' },
      });
      if (!response.ok) throw new Error('Failed to send contact');
      return response.json();
    },
    onSuccess: () => {
      toast({
        title: "Invocação Enviada",
        description: "Sua mensagem foi enviada para os mestres do abismo.",
      });
      setFormData({ name: "", email: "", subject: "", message: "" });
    },
    onError: () => {
      toast({
        title: "Erro na Invocação",
        description: "Falha ao enviar mensagem. Tente novamente.",
        variant: "destructive",
      });
    },
  });

  const subjects = [
    "Dúvidas sobre Cursos",
    "Acesso VIP",
    "Conteúdo Premium",
    "Portal Secreto",
    "Outras Consultas"
  ];

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    contactMutation.mutate(formData);
  };

  return (
    <section id="contato" className="py-20 scroll-reveal">
      <div className="container mx-auto px-6">
        <h2 className="font-cinzel text-4xl md:text-5xl font-bold text-center mb-16 text-shadow-gold">
          INVOQUE-NOS
        </h2>
        
        <div className="max-w-2xl mx-auto">
          <div className="glass-effect p-8 border border-deep-red/30">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block font-cinzel-regular mb-2">Nome Iniciático</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  className="w-full bg-dark-accent border border-antique-gold/30 text-antique-gold px-4 py-3 font-crimson focus:border-blood-red focus:outline-none"
                  required
                />
              </div>
              
              <div>
                <label className="block font-cinzel-regular mb-2">Email Profano</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className="w-full bg-dark-accent border border-antique-gold/30 text-antique-gold px-4 py-3 font-crimson focus:border-blood-red focus:outline-none"
                  required
                />
              </div>
              
              <div>
                <label className="block font-cinzel-regular mb-2">Assunto</label>
                <select
                  name="subject"
                  value={formData.subject}
                  onChange={handleInputChange}
                  className="w-full bg-dark-accent border border-antique-gold/30 text-antique-gold px-4 py-3 font-crimson focus:border-blood-red focus:outline-none"
                  required
                >
                  <option value="">Selecione um assunto</option>
                  {subjects.map((subject) => (
                    <option key={subject} value={subject}>{subject}</option>
                  ))}
                </select>
              </div>
              
              <div>
                <label className="block font-cinzel-regular mb-2">Mensagem</label>
                <textarea
                  name="message"
                  value={formData.message}
                  onChange={handleInputChange}
                  rows={5}
                  className="w-full bg-dark-accent border border-antique-gold/30 text-antique-gold px-4 py-3 font-crimson focus:border-blood-red focus:outline-none resize-none"
                  required
                />
              </div>
              
              <button
                type="submit"
                disabled={contactMutation.isPending}
                className="w-full bg-deep-red hover:bg-blood-red text-white py-3 font-cinzel-regular hover-mystic disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {contactMutation.isPending ? "Enviando..." : "Enviar Invocação"}
              </button>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}
