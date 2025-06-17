import React, { useState, useEffect } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Save, X, Folder } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import type { LibrarySection } from '@shared/schema';

interface SectionEditorProps {
  section?: LibrarySection;
  isOpen: boolean;
  onClose: () => void;
}

interface SectionFormData {
  name: string;
  description: string;
  icon_name: string;
  sort_order: number;
  color_scheme: string;
  icon_url?: string;
}

export default function SectionEditor({ section, isOpen, onClose }: SectionEditorProps) {
  const [formData, setFormData] = useState<SectionFormData>({
    name: '',
    description: '',
    icon_name: '📚',
    sort_order: 1,
    color_scheme: '#D97706'
  });

  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Preencher formulário quando seção é carregada
  useEffect(() => {
    if (section) {
      setFormData({
        name: section.name || '',
        description: section.description || '',
        icon_name: section.icon_name || '📚',
        sort_order: section.sort_order || 1,
        color_scheme: section.color_scheme || '#D97706'
      });
    } else {
      setFormData({
        name: '',
        description: '',
        icon_name: '📚',
        sort_order: 1,
        color_scheme: '#D97706'
      });
    }
  }, [section]);

  // Mutation para salvar seção
  const saveMutation = useMutation({
    mutationFn: async (data: Partial<SectionFormData>) => {
      const endpoint = section ? `/api/admin/library-sections/${section.id}` : '/api/admin/library-sections';
      const method = section ? 'PUT' : 'POST';
      const token = localStorage.getItem('auth_token');
      
      const response = await fetch(endpoint, {
        method,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': token ? `Bearer ${token}` : ''
        },
        body: JSON.stringify(data)
      });
      
      if (!response.ok) {
        const error = await response.text();
        throw new Error(`Erro ao salvar seção: ${error}`);
      }
      
      return response.json();
    },
    onSuccess: () => {
      toast({
        title: "Sucesso!",
        description: section ? "Seção atualizada com sucesso!" : "Seção criada com sucesso!",
      });
      queryClient.invalidateQueries({ queryKey: ['/api/library-sections'] });
      queryClient.invalidateQueries({ queryKey: ['/api/admin/library-sections'] });
      onClose();
    },
    onError: (error: any) => {
      toast({
        title: "Erro",
        description: error.message || "Erro ao salvar seção",
        variant: "destructive",
      });
    },
  });

  const handleInputChange = (field: string, value: string | number) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSave = () => {
    if (!formData.name.trim()) {
      toast({
        title: "Erro",
        description: "Nome da seção é obrigatório",
        variant: "destructive",
      });
      return;
    }

    saveMutation.mutate(formData);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="bg-black border-amber-500/30 text-amber-100 max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-amber-400 flex items-center gap-2">
            <Folder className="w-5 h-5" />
            {section ? 'Editar Seção' : 'Nova Seção'}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Informações Básicas */}
          <Card className="bg-black/50 border-amber-500/30">
            <CardHeader className="p-4">
              <CardTitle className="text-amber-400 text-sm">Informações Básicas</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 p-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label className="text-amber-200 text-sm">Nome da Seção</Label>
                  <Input
                    value={formData.name}
                    onChange={(e) => handleInputChange('name', e.target.value)}
                    placeholder="Ex: Atrium Ignis"
                    className="bg-black/50 border-amber-500/30 text-amber-100"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label className="text-amber-200 text-sm">Cor da Seção</Label>
                  <div className="flex gap-2">
                    <Input
                      type="color"
                      value={formData.color_scheme}
                      onChange={(e) => handleInputChange('color_scheme', e.target.value)}
                      className="w-16 h-10 bg-black/50 border-amber-500/30 rounded cursor-pointer"
                    />
                    <Input
                      value={formData.color_scheme}
                      onChange={(e) => handleInputChange('color_scheme', e.target.value)}
                      placeholder="#D97706"
                      className="flex-1 bg-black/50 border-amber-500/30 text-amber-100"
                    />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label className="text-amber-200 text-sm">Ícone (Emoji)</Label>
                  <Input
                    value={formData.icon_name}
                    onChange={(e) => handleInputChange('icon_name', e.target.value)}
                    placeholder="📚"
                    className="bg-black/50 border-amber-500/30 text-amber-100"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label className="text-amber-200 text-sm">URL do Ícone (Opcional)</Label>
                  <Input
                    value={formData.icon_url || ''}
                    onChange={(e) => handleInputChange('icon_url', e.target.value)}
                    placeholder="https://exemplo.com/icone.png"
                    className="bg-black/50 border-amber-500/30 text-amber-100"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label className="text-amber-200 text-sm">Descrição</Label>
                <Textarea
                  value={formData.description}
                  onChange={(e) => handleInputChange('description', e.target.value)}
                  placeholder="Descrição da seção da biblioteca..."
                  className="bg-black/50 border-amber-500/30 text-amber-100 h-24 resize-none"
                />
              </div>

              <div className="space-y-2">
                <Label className="text-amber-200 text-sm">Ordem de Exibição</Label>
                <Input
                  type="number"
                  value={formData.sort_order}
                  onChange={(e) => handleInputChange('sort_order', parseInt(e.target.value) || 1)}
                  className="bg-black/50 border-amber-500/30 text-amber-100"
                  min="1"
                />
              </div>
            </CardContent>
          </Card>

          {/* Botões de Ação */}
          <div className="flex flex-col sm:flex-row gap-3">
            <Button
              onClick={handleSave}
              disabled={saveMutation.isPending}
              className="flex-1 bg-amber-600 hover:bg-amber-700 text-black"
            >
              <Save className="w-4 h-4 mr-2" />
              {saveMutation.isPending ? 'Salvando...' : (section ? 'Atualizar Seção' : 'Criar Seção')}
            </Button>
            
            <Button
              onClick={onClose}
              variant="outline"
              className="flex-1 border-amber-500/30 text-amber-200 hover:bg-amber-500/10"
            >
              <X className="w-4 h-4 mr-2" />
              Cancelar
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}