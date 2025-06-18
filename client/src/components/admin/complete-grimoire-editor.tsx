import { useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { ArrowLeft, Upload, FileText, Code, Palette } from 'lucide-react';
import type { LibrarySection, Grimoire } from '@shared/schema';

interface CompleteGrimoireEditorProps {
  grimoire?: Grimoire;
  onClose: () => void;
}

export default function CompleteGrimoireEditor({ grimoire, onClose }: CompleteGrimoireEditorProps) {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const [title, setTitle] = useState(grimoire?.title || '');
  const [content, setContent] = useState(grimoire?.content || '');
  const [excerpt, setExcerpt] = useState(grimoire?.excerpt || '');
  const [sectionId, setSectionId] = useState(grimoire?.section_id || 1);
  const [customCss, setCustomCss] = useState('');
  const [activeTab, setActiveTab] = useState<'content' | 'css' | 'preview'>('content');

  // Buscar seções
  const { data: sections = [] } = useQuery<LibrarySection[]>({
    queryKey: ['/api/library-sections'],
  });

  // Função para ler arquivos
  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>, type: 'html' | 'txt' | 'css') => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      const text = e.target?.result as string;
      
      if (type === 'css') {
        setCustomCss(text);
        setActiveTab('css');
        toast({
          title: "CSS carregado!",
          description: `Arquivo ${file.name} foi carregado com sucesso.`,
        });
      } else {
        setContent(text);
        setActiveTab('content');
        toast({
          title: `${type.toUpperCase()} carregado!`,
          description: `Arquivo ${file.name} foi carregado com sucesso.`,
        });
      }
    };
    reader.readAsText(file);
    
    // Limpar o input
    event.target.value = '';
  };

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
          is_published: false,
          custom_css: customCss
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

  const renderPreview = () => {
    const previewContent = `
      <style>
        ${customCss}
        body { 
          font-family: 'EB Garamond', serif; 
          background: black; 
          color: #f5f5dc; 
          padding: 20px;
          line-height: 1.6;
        }
      </style>
      <div>
        <h1 style="color: #d4af37; font-family: 'Cinzel', serif;">${title}</h1>
        ${content}
      </div>
    `;
    
    return (
      <div className="w-full h-96 border border-amber-500/30 rounded-lg overflow-hidden">
        <iframe
          srcDoc={previewContent}
          className="w-full h-full bg-black"
          title="Preview do Grimório"
        />
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-purple-950/20 to-black p-2 sm:p-4">
      <div className="max-w-6xl mx-auto">
        
        {/* Header */}
        <div className="mb-6 flex items-center gap-4">
          <Button 
            onClick={onClose} 
            variant="outline" 
            size="sm"
            className="flex items-center gap-2 border-amber-500/30 text-amber-200 hover:bg-amber-500/10"
          >
            <ArrowLeft className="w-4 h-4" />
            Voltar
          </Button>
          <h1 className="text-2xl font-bold font-cinzel text-amber-400">
            {grimoire ? 'Editar Grimório' : 'Criar Grimório'}
          </h1>
        </div>

        {/* Informações básicas */}
        <div className="bg-black/60 backdrop-blur-sm border border-amber-500/30 rounded-lg p-6 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            {/* Título */}
            <div>
              <label className="block text-sm font-medium mb-2 text-amber-200">
                Título do Grimório
              </label>
              <Input
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Digite o título..."
                className="bg-black/50 border-amber-500/30 text-amber-100 placeholder:text-amber-300/50"
              />
            </div>

            {/* Seção */}
            <div>
              <label className="block text-sm font-medium mb-2 text-amber-200">
                Seção da Biblioteca
              </label>
              <select
                value={sectionId}
                onChange={(e) => setSectionId(parseInt(e.target.value))}
                className="w-full px-3 py-2 rounded-md border bg-black/50 border-amber-500/30 text-amber-100"
              >
                {sections.map(section => (
                  <option key={section.id} value={section.id} className="bg-black text-amber-100">
                    {section.name}
                  </option>
                ))}
              </select>
            </div>

          </div>

          {/* Descrição */}
          <div className="mt-6">
            <label className="block text-sm font-medium mb-2 text-amber-200">
              Descrição/Sinopse
            </label>
            <Textarea
              value={excerpt}
              onChange={(e) => setExcerpt(e.target.value)}
              placeholder="Breve descrição do grimório..."
              className="w-full h-20 resize-none bg-black/50 border-amber-500/30 text-amber-100 placeholder:text-amber-300/50"
            />
          </div>
        </div>

        {/* Upload de arquivos */}
        <div className="bg-black/60 backdrop-blur-sm border border-amber-500/30 rounded-lg p-6 mb-6">
          <h3 className="text-lg font-semibold text-amber-400 mb-4">Upload de Arquivos</h3>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            
            {/* Upload HTML */}
            <div>
              <label className="block">
                <input
                  type="file"
                  accept=".html,.htm"
                  onChange={(e) => handleFileUpload(e, 'html')}
                  className="hidden"
                />
                <div className="flex items-center gap-2 p-3 border border-amber-500/30 rounded-lg cursor-pointer hover:bg-amber-500/10 transition-colors">
                  <FileText className="w-5 h-5 text-amber-400" />
                  <span className="text-amber-200 text-sm">Upload HTML</span>
                </div>
              </label>
            </div>

            {/* Upload TXT */}
            <div>
              <label className="block">
                <input
                  type="file"
                  accept=".txt"
                  onChange={(e) => handleFileUpload(e, 'txt')}
                  className="hidden"
                />
                <div className="flex items-center gap-2 p-3 border border-amber-500/30 rounded-lg cursor-pointer hover:bg-amber-500/10 transition-colors">
                  <Upload className="w-5 h-5 text-amber-400" />
                  <span className="text-amber-200 text-sm">Upload TXT</span>
                </div>
              </label>
            </div>

            {/* Upload CSS */}
            <div>
              <label className="block">
                <input
                  type="file"
                  accept=".css"
                  onChange={(e) => handleFileUpload(e, 'css')}
                  className="hidden"
                />
                <div className="flex items-center gap-2 p-3 border border-amber-500/30 rounded-lg cursor-pointer hover:bg-amber-500/10 transition-colors">
                  <Palette className="w-5 h-5 text-amber-400" />
                  <span className="text-amber-200 text-sm">Upload CSS</span>
                </div>
              </label>
            </div>

          </div>
        </div>

        {/* Tabs de edição */}
        <div className="bg-black/60 backdrop-blur-sm border border-amber-500/30 rounded-lg overflow-hidden">
          
          {/* Tab Headers */}
          <div className="flex border-b border-amber-500/30">
            <button
              onClick={() => setActiveTab('content')}
              className={`px-6 py-3 flex items-center gap-2 transition-colors ${
                activeTab === 'content' 
                  ? 'bg-amber-500/20 text-amber-300 border-b-2 border-amber-500' 
                  : 'text-amber-200 hover:bg-amber-500/10'
              }`}
            >
              <Code className="w-4 h-4" />
              Conteúdo
            </button>
            <button
              onClick={() => setActiveTab('css')}
              className={`px-6 py-3 flex items-center gap-2 transition-colors ${
                activeTab === 'css' 
                  ? 'bg-amber-500/20 text-amber-300 border-b-2 border-amber-500' 
                  : 'text-amber-200 hover:bg-amber-500/10'
              }`}
            >
              <Palette className="w-4 h-4" />
              CSS Personalizado
            </button>
            <button
              onClick={() => setActiveTab('preview')}
              className={`px-6 py-3 flex items-center gap-2 transition-colors ${
                activeTab === 'preview' 
                  ? 'bg-amber-500/20 text-amber-300 border-b-2 border-amber-500' 
                  : 'text-amber-200 hover:bg-amber-500/10'
              }`}
            >
              <FileText className="w-4 h-4" />
              Preview
            </button>
          </div>

          {/* Tab Content */}
          <div className="p-6">
            
            {activeTab === 'content' && (
              <div>
                <label className="block text-sm font-medium mb-2 text-amber-200">
                  Conteúdo HTML
                </label>
                <Textarea
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  placeholder="Digite o conteúdo HTML do grimório ou faça upload de um arquivo..."
                  className="w-full h-96 font-mono text-sm resize-none bg-black/50 border-amber-500/30 text-amber-100 placeholder:text-amber-300/50"
                />
                <p className="text-xs text-amber-300/70 mt-2">
                  Use HTML para formatação. Exemplo: &lt;h2&gt;Capítulo&lt;/h2&gt; &lt;p&gt;texto&lt;/p&gt;
                </p>
              </div>
            )}

            {activeTab === 'css' && (
              <div>
                <label className="block text-sm font-medium mb-2 text-amber-200">
                  CSS Personalizado
                </label>
                <Textarea
                  value={customCss}
                  onChange={(e) => setCustomCss(e.target.value)}
                  placeholder="Digite CSS personalizado ou faça upload de um arquivo .css..."
                  className="w-full h-96 font-mono text-sm resize-none bg-black/50 border-amber-500/30 text-amber-100 placeholder:text-amber-300/50"
                />
                <p className="text-xs text-amber-300/70 mt-2">
                  CSS será aplicado ao grimório. Exemplo: h1 {'{color: #d4af37; font-size: 2rem;}'}
                </p>
              </div>
            )}

            {activeTab === 'preview' && (
              <div>
                <label className="block text-sm font-medium mb-2 text-amber-200">
                  Preview do Grimório
                </label>
                {renderPreview()}
                <p className="text-xs text-amber-300/70 mt-2">
                  Visualização de como o grimório aparecerá com o CSS aplicado
                </p>
              </div>
            )}

          </div>
        </div>

        {/* Botões de ação */}
        <div className="flex justify-end gap-3 mt-6">
          <Button 
            onClick={onClose} 
            variant="outline"
            className="border-amber-500/30 text-amber-200 hover:bg-amber-500/10"
          >
            Cancelar
          </Button>
          <Button 
            onClick={handleSave} 
            disabled={saveMutation.isPending}
            className="bg-amber-600 hover:bg-amber-700 text-black font-semibold"
          >
            {saveMutation.isPending ? 'Salvando...' : 'Salvar Grimório'}
          </Button>
        </div>

      </div>
    </div>
  );
}