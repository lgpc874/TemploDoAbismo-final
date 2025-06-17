import { useState, useEffect, useRef } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useLocation, useRoute } from "wouter";
import { PageTransition } from "@/components/page-transition";
import ContentProtection from "@/components/content-protection";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { ArrowLeft, ChevronLeft, ChevronRight, BookOpen } from "lucide-react";
import type { Grimoire } from "@shared/schema";
import { apiRequest } from "@/lib/queryClient";

interface Page {
  content: string;
  pageNumber: number;
  wordCount: number;
}

export default function SmartGrimoireReader() {
  const [, params] = useRoute("/grimoire/:id");
  const [, setLocation] = useLocation();
  
  // Estados do leitor
  const [currentPage, setCurrentPage] = useState(1);
  const [pages, setPages] = useState<Page[]>([]);

  const [saveStatus, setSaveStatus] = useState<'saving' | 'saved' | 'error' | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [primaryColor, setPrimaryColor] = useState('#D97706'); // amber-600 padrão
  const [showFooter, setShowFooter] = useState(false);

  const grimoireId = params?.id ? parseInt(params.id) : null;
  const measureRef = useRef<HTMLDivElement>(null);

  // Função para extrair cor principal do grimório
  const extractPrimaryColor = (content: string): string => {
    if (!content) return '#D97706'; // amber padrão
    
    // Procurar por cores hex específicas primeiro
    const hexColors = content.match(/#[0-9A-Fa-f]{6}/g) || [];
    
    // Procurar por cores RGB
    const rgbColors = content.match(/rgb\(\s*\d+\s*,\s*\d+\s*,\s*\d+\s*\)/g) || [];
    
    // Procurar por propriedades de cor em styles
    const styleColors = content.match(/color:\s*#[0-9A-Fa-f]{6}/g) || [];
    
    // Combinar todas as cores encontradas
    const allColors = [...hexColors, ...styleColors.map(s => s.replace('color:', '').trim())];
    
    // Filtrar cores significativas (não preto, branco, cinza)
    const significantColors = allColors.filter(color => {
      const cleanColor = color.toLowerCase();
      return !cleanColor.match(/#(000|fff|[0-9a-f]{3,6})\b/) ||
             cleanColor.includes('#d6342c') || // vermelho específico do Vozes do Fogo
             cleanColor.includes('#b91c1c') || // vermelho escuro
             cleanColor.includes('#dc2626') || // vermelho
             cleanColor.includes('#ef4444') || // vermelho claro
             cleanColor.includes('#d97706') || // amber
             cleanColor.includes('#f59e0b') || // amber claro
             (!cleanColor.includes('#000') && !cleanColor.includes('#fff'));
    });
    
    // Priorizar cores vermelhas para grimórios luciferianos
    const redColors = significantColors.filter(color => 
      color.toLowerCase().includes('#d6342c') ||
      color.toLowerCase().includes('#b91c1c') ||
      color.toLowerCase().includes('#dc2626')
    );
    
    if (redColors.length > 0) return redColors[0];
    if (significantColors.length > 0) return significantColors[0];
    
    return '#D97706'; // amber padrão
  };

  // Buscar grimório
  const { data: grimoire, isLoading: grimoireLoading } = useQuery<Grimoire>({
    queryKey: [`/api/grimoires/${grimoireId}`],
    enabled: !!grimoireId,
  });

  // Buscar progresso do usuário
  const { data: userProgress } = useQuery({
    queryKey: [`/api/progress/user`],
    enabled: !!grimoireId,
  });

  // Mutação para salvar progresso
  const saveProgressMutation = useMutation({
    mutationFn: async (data: { grimoireId: number; currentPage: number; totalPages: number }) => {
      return apiRequest("/api/progress", {
        method: "POST",
        body: JSON.stringify({
          user_id: 1,
          grimoire_id: data.grimoireId,
          current_page: data.currentPage,
          total_pages: data.totalPages,
          last_read_at: new Date()
        }),
        headers: {
          "Content-Type": "application/json",
        },
      });
    },
    onMutate: () => setSaveStatus('saving'),
    onSuccess: () => {
      setSaveStatus('saved');
      setTimeout(() => setSaveStatus(null), 2000);
    },
    onError: () => {
      setSaveStatus('error');
      setTimeout(() => setSaveStatus(null), 3000);
    },
  });

  // Função simplificada para dividir conteúdo em páginas
  const createPagesFromContent = (content: string): Page[] => {
    if (!content || typeof content !== 'string') return [];
    
    setIsProcessing(true);
    
    // Configuração para paginação baseada em altura da tela
    const wordsPerPage = window.innerWidth < 768 ? 200 : 350; // mobile vs desktop
    
    // Garantir que content é string antes de usar replace
    const contentStr = String(content);
    
    // Remover tags HTML para contagem de palavras
    const textContent = contentStr.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim();
    const words = textContent.split(' ').filter(word => word.length > 0);
    
    // Dividir HTML por elementos para respeitar a estrutura
    const parser = new DOMParser();
    const doc = parser.parseFromString(`<div>${content}</div>`, 'text/html');
    const elements = Array.from(doc.body.firstChild?.childNodes || []);
    
    const pages: Page[] = [];
    let currentPageContent = '';
    let currentWordCount = 0;
    let pageNumber = 1;
    
    for (const element of elements) {
      if (element.nodeType === Node.ELEMENT_NODE) {
        const elementHTML = (element as Element).outerHTML;
        const elementText = element.textContent || '';
        const elementWordCount = elementText.split(' ').filter(word => word.length > 0).length;
        
        // Verificar se elemento cabe na página atual
        if (currentWordCount + elementWordCount <= wordsPerPage) {
          currentPageContent += elementHTML;
          currentWordCount += elementWordCount;
        } else {
          // Finalizar página atual se houver conteúdo
          if (currentPageContent) {
            pages.push({
              content: currentPageContent,
              pageNumber: pageNumber++,
              wordCount: currentWordCount
            });
          }
          
          // Começar nova página
          currentPageContent = elementHTML;
          currentWordCount = elementWordCount;
        }
      } else if (element.nodeType === Node.TEXT_NODE) {
        const textContent = element.textContent || '';
        if (textContent.trim()) {
          const textWordCount = textContent.split(' ').filter(word => word.length > 0).length;
          
          if (currentWordCount + textWordCount <= wordsPerPage) {
            currentPageContent += textContent;
            currentWordCount += textWordCount;
          } else {
            if (currentPageContent) {
              pages.push({
                content: currentPageContent,
                pageNumber: pageNumber++,
                wordCount: currentWordCount
              });
            }
            currentPageContent = textContent;
            currentWordCount = textWordCount;
          }
        }
      }
    }
    
    // Adicionar última página se houver conteúdo
    if (currentPageContent) {
      pages.push({
        content: currentPageContent,
        pageNumber: pageNumber,
        wordCount: currentWordCount
      });
    }
    
    setIsProcessing(false);
    return pages;
  };

  // Processar conteúdo em páginas quando grimório carregar
  useEffect(() => {
    if (grimoire && grimoire.content) {
      const newPages = createPagesFromContent(grimoire.content);
      setPages(newPages);
      
      // Extrair cor principal do grimório
      const extractedColor = extractPrimaryColor(grimoire.content);
      setPrimaryColor(extractedColor);
      
      // Restaurar página salva
      if (grimoireId) {
        const savedPage = localStorage.getItem(`grimoire_${grimoireId}_page`);
        if (savedPage) {
          setCurrentPage(parseInt(savedPage));
        } else {
          setCurrentPage(1);
        }
      }
      

    }
  }, [grimoire, grimoireId]);

  // Auto-save do progresso
  useEffect(() => {
    if (!grimoire || pages.length === 0) return;

    const timer = setInterval(() => {
      // Auto-save a cada 30 segundos
      saveProgressMutation.mutate({
        grimoireId: grimoire.id,
        currentPage,
        totalPages: pages.length
      });
    }, 30000);

    return () => clearInterval(timer);
  }, [grimoire, currentPage, pages.length]);

  // Navegação por teclado
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft' || e.key === 'PageUp') {
        e.preventDefault();
        goToPreviousPage();
      } else if (e.key === 'ArrowRight' || e.key === 'PageDown') {
        e.preventDefault();
        goToNextPage();
      } else if (e.key === 'Home') {
        e.preventDefault();
        setCurrentPage(1);
        window.scrollTo({ top: 0, behavior: 'smooth' });
      } else if (e.key === 'End') {
        e.preventDefault();
        setCurrentPage(pages.length);
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [pages.length]);

  // Salvar página atual no localStorage
  useEffect(() => {
    if (grimoireId && currentPage) {
      localStorage.setItem(`grimoire_${grimoireId}_page`, currentPage.toString());
    }
  }, [grimoireId, currentPage]);

  // Detectar scroll para mostrar footer apenas no final da página
  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
      const scrollHeight = document.documentElement.scrollHeight;
      const clientHeight = document.documentElement.clientHeight;
      
      // Mostrar footer quando estiver próximo do final (últimos 100px)
      const isNearBottom = scrollTop + clientHeight >= scrollHeight - 100;
      setShowFooter(isNearBottom);
    };

    window.addEventListener('scroll', handleScroll);
    // Verificar posição inicial
    handleScroll();
    
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Funções de navegação
  const goToPreviousPage = () => {
    setCurrentPage(prev => {
      const newPage = Math.max(1, prev - 1);
      // Scroll suave para o topo quando trocar de página
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return newPage;
    });
  };

  const goToNextPage = () => {
    setCurrentPage(prev => {
      const newPage = Math.min(pages.length, prev + 1);
      // Scroll suave para o topo quando trocar de página
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return newPage;
    });
  };

  // Verificar se páginas podem navegar
  const canGoBack = currentPage > 1;
  const canGoForward = currentPage < pages.length;

  // Obter página atual
  const currentPageData = pages.find(page => page.pageNumber === currentPage);

  if (grimoireLoading) {
    return (
      <PageTransition>
        <div className="min-h-screen bg-gradient-to-br from-black via-red-950/20 to-black flex items-center justify-center">
          <div className="text-center">
            <BookOpen className="w-12 h-12 text-amber-500 animate-pulse mx-auto mb-4" />
            <p className="text-gray-300">Carregando grimório...</p>
          </div>
        </div>
      </PageTransition>
    );
  }

  if (!grimoire) {
    return (
      <PageTransition>
        <div className="min-h-screen bg-gradient-to-br from-black via-red-950/20 to-black flex items-center justify-center">
          <div className="text-center">
            <p className="text-gray-300 mb-4">Grimório não encontrado</p>
            <Button onClick={() => setLocation('/biblioteca')} variant="outline">
              Voltar à Biblioteca
            </Button>
          </div>
        </div>
      </PageTransition>
    );
  }

  return (
    <PageTransition>
      <ContentProtection>
        <div className="min-h-screen bg-gradient-to-br from-black via-red-950/20 to-black">
          
          {/* Header com botão voltar e nome do grimório */}
          <div className="fixed top-0 left-0 right-0 bg-black/90 backdrop-blur-sm border-b border-amber-500/20 z-50">
            <div className="max-w-6xl mx-auto flex items-center justify-between p-3 md:p-4 gap-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setLocation('/biblioteca')}
                className="text-amber-500 hover:text-amber-400 hover:bg-amber-500/10 flex-shrink-0"
              >
                <ArrowLeft className="w-4 h-4 mr-1 md:mr-2" />
                <span className="hidden sm:inline">Biblioteca</span>
                <span className="sm:hidden">Voltar</span>
              </Button>
              
              <div className="flex-1 text-center px-2 min-w-0">
                <h1 
                  className="font-medium text-[10px] sm:text-xs md:text-base lg:text-lg truncate"
                  style={{ color: primaryColor }}
                >
                  {grimoire.title}
                </h1>
              </div>
              
              <div className="flex-shrink-0">
                {saveStatus && (
                  <div className={`text-xs ${
                    saveStatus === 'saving' ? 'text-blue-400' : 
                    saveStatus === 'saved' ? 'text-green-400' : 'text-red-400'
                  }`}>
                    {saveStatus === 'saving' && 'Salvando...'}
                    {saveStatus === 'saved' && '✓ Salvo'}
                    {saveStatus === 'error' && '⚠ Erro'}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Container para medição (invisível) */}
          <div
            ref={measureRef}
            className="fixed top-[-9999px] left-0 w-full max-w-4xl mx-auto px-4 md:px-8 pointer-events-none opacity-0"
            style={{ height: `${window.innerHeight - 200}px` }}
          />

          {/* Conteúdo principal com paginação */}
          <div className="pt-20 pb-20">
            <div className="max-w-4xl mx-auto px-4 md:px-8">
              <motion.div
                key={currentPage}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                className="bg-black/40 backdrop-blur-sm border border-amber-500/20 rounded-lg p-6 md:p-8 shadow-2xl min-h-[calc(100vh-200px)]"
              >
                {isProcessing ? (
                  <div className="flex items-center justify-center h-64">
                    <div className="text-center">
                      <BookOpen className="w-12 h-12 text-amber-500 animate-pulse mx-auto mb-4" />
                      <p className="text-gray-300">Preparando páginas...</p>
                    </div>
                  </div>
                ) : currentPageData ? (
                  <div
                    className="prose prose-invert prose-lg max-w-none
                      prose-headings:text-amber-500 
                      prose-p:text-gray-200 prose-p:leading-relaxed
                      prose-a:text-amber-400 prose-a:no-underline hover:prose-a:underline
                      prose-strong:text-amber-300
                      prose-em:text-gray-300
                      prose-blockquote:border-l-amber-500 prose-blockquote:text-gray-300
                      prose-ul:text-gray-200 prose-ol:text-gray-200
                      prose-li:text-gray-200
                      prose-code:text-amber-300 prose-code:bg-black/40
                      prose-pre:bg-black/60 prose-pre:border prose-pre:border-amber-500/20"
                    dangerouslySetInnerHTML={{ __html: currentPageData.content }}
                    style={{
                      fontSize: 'inherit',
                      lineHeight: 'inherit',
                      fontFamily: 'inherit'
                    }}
                  />
                ) : (
                  <div className="flex items-center justify-center h-64">
                    <div className="text-center">
                      <BookOpen className="w-12 h-12 text-amber-500 mx-auto mb-4" />
                      <p className="text-gray-300">Carregando conteúdo...</p>
                    </div>
                  </div>
                )}
              </motion.div>
            </div>
          </div>

          {/* Controles de navegação com informações da página - só aparece quando rolar até o final */}
          {showFooter && (
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              transition={{ duration: 0.3 }}
              className="fixed bottom-0 left-0 right-0 bg-black/90 backdrop-blur-sm border-t border-amber-500/20 p-4 z-50"
            >
              <div className="max-w-md mx-auto flex items-center justify-center gap-4">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={goToPreviousPage}
                  disabled={!canGoBack || isProcessing}
                  className="text-amber-500 border-amber-500/30 hover:bg-amber-500/10 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <ChevronLeft className="w-4 h-4 mr-1" />
                  Anterior
                </Button>
                
                <div className="text-sm text-gray-400 text-center min-w-[100px]">
                  {pages.length > 0 ? `${currentPage} / ${pages.length}` : '...'}
                </div>
                
                <Button
                  variant="outline"
                  size="sm"
                  onClick={goToNextPage}
                  disabled={!canGoForward || isProcessing}
                  className="text-amber-500 border-amber-500/30 hover:bg-amber-500/10 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Próxima
                  <ChevronRight className="w-4 h-4 ml-1" />
                </Button>
              </div>
            </motion.div>
          )}

          {/* Áreas de clique invisíveis para navegação */}
          {!isProcessing && (
            <>
              <div
                className="fixed left-0 top-20 bottom-20 w-1/3 cursor-pointer z-30"
                onClick={goToPreviousPage}
                style={{ display: canGoBack ? 'block' : 'none' }}
              />
              <div
                className="fixed right-0 top-20 bottom-20 w-1/3 cursor-pointer z-30"
                onClick={goToNextPage}
                style={{ display: canGoForward ? 'block' : 'none' }}
              />
            </>
          )}
        </div>
      </ContentProtection>
    </PageTransition>
  );
}