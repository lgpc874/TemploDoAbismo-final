import { useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import type { LibrarySection, Grimoire } from '@shared/schema';

interface SimpleGrimoireEditorProps {
  grimoire?: Grimoire;
  onClose: () => void;
}

export default function SimpleGrimoireEditor({ grimoire, onClose }: SimpleGrimoireEditorProps) {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const [title, setTitle] = useState(grimoire?.title || '');
  const [content, setContent] = useState(grimoire?.content || '');
  const [excerpt, setExcerpt] = useState(grimoire?.excerpt || '');
  const [sectionId, setSectionId] = useState(grimoire?.section_id || 1);

  // Buscar seções
  const { data: sections = [] } = useQuery<LibrarySection[]>({
    queryKey: ['/api/library-sections'],
  });

  // Mutation para salvar
  const saveMutation = useMutation({
    mutationFn: async () => {
      const endpoint = grimoire ? `/api/admin/grimoires/${grimoire.id}` : '/api/admin/grimoires';
      const method = grimoire ? 'PUT' : 'POST';
      const token = localStorage.getItem('auth_token');
      
      const response = await fetch(endpoint, {
        method,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': token ? `Bearer ${token}` : ''
        },
        body: JSON.stringify({
          title,
          content,
          excerpt,
          section_id: sectionId,
          is_published: false
        })
      });
      
      if (!response.ok) {
        throw new Error('Erro ao salvar grimório');
      }
      
      return response.json();
    },
    onSuccess: () => {
      toast({
        title: "Sucesso!",
        description: grimoire ? "Grimório atualizado!" : "Grimório criado!",
      });
      queryClient.invalidateQueries({ queryKey: ['/api/admin/grimoires'] });
      onClose();
    },
    onError: (error: any) => {
      toast({
        title: "Erro",
        description: error.message || "Erro ao salvar grimório",
        variant: "destructive",
      });
    },
  });

  const handleSave = () => {
    if (!title.trim()) {
      toast({
        title: "Erro",
        description: "Título é obrigatório",
        variant: "destructive",
      });
      return;
    }
    
    saveMutation.mutate();
  };

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ 
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        backdropFilter: 'blur(4px)'
      }}
    >
      <div 
        className="w-full max-w-2xl max-h-[90vh] overflow-auto rounded-lg border"
        style={{
          backgroundColor: 'rgba(10, 5, 5, 0.95)',
          borderColor: 'rgba(212, 175, 55, 0.3)'
        }}
      >
        
        {/* Header */}
        <div 
          className="p-6 border-b flex items-center justify-between"
          style={{ borderColor: 'rgba(212, 175, 55, 0.3)' }}
        >
          <h2 
            className="text-2xl font-bold font-cinzel"
            style={{ color: '#d4af37' }}
          >
            {grimoire ? 'Editar Grimório' : 'Criar Grimório'}
          </h2>
          <Button onClick={onClose} variant="outline" size="sm">
            ✕
          </Button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          
          {/* Título */}
          <div>
            <label 
              className="block text-sm font-medium mb-2"
              style={{ color: '#f5f5dc' }}
            >
              Título do Grimório
            </label>
            <Input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Digite o título..."
              className="w-full"
              style={{
                backgroundColor: 'rgba(0, 0, 0, 0.5)',
                borderColor: 'rgba(212, 175, 55, 0.3)',
                color: '#f5f5dc'
              }}
            />
          </div>

          {/* Seção */}
          <div>
            <label 
              className="block text-sm font-medium mb-2"
              style={{ color: '#f5f5dc' }}
            >
              Seção da Biblioteca
            </label>
            <select
              value={sectionId}
              onChange={(e) => setSectionId(parseInt(e.target.value))}
              className="w-full px-3 py-2 rounded-md border"
              style={{
                backgroundColor: 'rgba(0, 0, 0, 0.5)',
                borderColor: 'rgba(212, 175, 55, 0.3)',
                color: '#f5f5dc'
              }}
            >
              {sections.map(section => (
                <option key={section.id} value={section.id}>
                  {section.name}
                </option>
              ))}
            </select>
          </div>

          {/* Descrição */}
          <div>
            <label 
              className="block text-sm font-medium mb-2"
              style={{ color: '#f5f5dc' }}
            >
              Descrição/Sinopse
            </label>
            <Textarea
              value={excerpt}
              onChange={(e) => setExcerpt(e.target.value)}
              placeholder="Breve descrição do grimório..."
              className="w-full h-20 resize-none"
              style={{
                backgroundColor: 'rgba(0, 0, 0, 0.5)',
                borderColor: 'rgba(212, 175, 55, 0.3)',
                color: '#f5f5dc'
              }}
            />
          </div>

          {/* Conteúdo */}
          <div>
            <label 
              className="block text-sm font-medium mb-2"
              style={{ color: '#f5f5dc' }}
            >
              Conteúdo HTML
            </label>
            <Textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Digite o conteúdo HTML do grimório..."
              className="w-full h-64 font-mono text-sm resize-none"
              style={{
                backgroundColor: 'rgba(0, 0, 0, 0.5)',
                borderColor: 'rgba(212, 175, 55, 0.3)',
                color: '#f5f5dc'
              }}
            />
          </div>

        </div>

        {/* Footer */}
        <div 
          className="p-6 border-t flex justify-end gap-3"
          style={{ borderColor: 'rgba(212, 175, 55, 0.3)' }}
        >
          <Button onClick={onClose} variant="outline">
            Cancelar
          </Button>
          <Button 
            onClick={handleSave} 
            disabled={saveMutation.isPending}
            style={{
              backgroundColor: '#d4af37',
              color: '#000'
            }}
            className="hover:opacity-80"
          >
            {saveMutation.isPending ? 'Salvando...' : 'Salvar'}
          </Button>
        </div>

      </div>
    </div>
  );
}