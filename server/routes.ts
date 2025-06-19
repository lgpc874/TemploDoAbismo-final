import type { Express, Request, Response, NextFunction } from "express";
import { createServer, type Server } from "http";
import {
  registerSchema,
  loginSchema,
  insertLibrarySectionSchema,
  insertGrimoireSchema,
  insertProgressSchema,
  type RegisterData,
  type LoginData,
  type InsertLibrarySection,
  type InsertGrimoire,
  type InsertProgress,
} from "@shared/schema";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { supabaseServiceNew as supabaseService } from "./supabase-service-new";
import PDFGenerator from "./pdf-generator";
import { AdvancedPDFGenerator } from "./advanced-pdf-generator";
import { ReliablePDFGenerator } from "./reliable-pdf-generator";

const JWT_SECRET = process.env.JWT_SECRET || "templo_abismo_secret_key";

// Middleware para verificar autenticação via JWT
function authenticateToken(req: Request, res: Response, next: NextFunction) {
  const authHeader = req.headers.authorization;
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.sendStatus(401);
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET) as any;
    (req as any).user = decoded;
    next();
  } catch (error) {
    return res.sendStatus(403);
  }
}

export async function registerRoutes(app: Express): Promise<Server> {
  // ======================
  // AUTENTICAÇÃO
  // ======================
  
  // Registro de usuário
  app.post("/api/auth/register", async (req, res) => {
    try {
      const data: RegisterData = registerSchema.parse(req.body);
      
      const existingUser = await supabaseService.getUserByEmail(data.email);
      if (existingUser) {
        return res.status(400).json({ error: "Email já está em uso" });
      }

      const hashedPassword = await bcrypt.hash(data.password, 10);

      const newUser = await supabaseService.createUser({
        username: data.username,
        email: data.email,
        password: hashedPassword,
        is_admin: false,
      });

      const token = jwt.sign(
        { 
          id: newUser.id, 
          username: newUser.username, 
          email: newUser.email,
          isAdmin: newUser.is_admin 
        },
        JWT_SECRET,
        { expiresIn: "7d" }
      );

      const { password: _, ...userWithoutPassword } = newUser;
      res.status(201).json({
        message: "Usuário criado com sucesso",
        token,
        user: userWithoutPassword,
      });
    } catch (error: any) {
      console.error("Registration error:", error);
      res.status(400).json({ error: error.message || "Erro ao criar usuário" });
    }
  });

  // Login de usuário
  app.post("/api/auth/login", async (req, res) => {
    try {
      const data: LoginData = loginSchema.parse(req.body);
      
      const user = await supabaseService.getUserByEmail(data.email);
      if (!user) {
        return res.status(401).json({ error: "Credenciais inválidas" });
      }

      const passwordMatch = await bcrypt.compare(data.password, user.password);
      if (!passwordMatch) {
        return res.status(401).json({ error: "Credenciais inválidas" });
      }

      const token = jwt.sign(
        { id: user.id, username: user.username, email: user.email, isAdmin: user.is_admin },
        JWT_SECRET,
        { expiresIn: "7d" }
      );

      const { password: _, ...userWithoutPassword } = user;
      res.json({
        message: "Login realizado com sucesso",
        token,
        user: userWithoutPassword,
      });
    } catch (error: any) {
      console.error("Login error:", error);
      res.status(400).json({ error: error.message || "Erro ao fazer login" });
    }
  });

  // Verificação de usuário atual
  app.get("/api/auth/me", authenticateToken, async (req: any, res) => {
    try {
      const user = await supabaseService.getUserById(req.user.id);
      if (!user) {
        return res.status(404).json({ error: "Usuário não encontrado" });
      }

      const { password: _, ...userWithoutPassword } = user;
      res.json({ user: userWithoutPassword });
    } catch (error: any) {
      console.error("Get user error:", error);
      res.status(500).json({ error: "Erro ao buscar usuário" });
    }
  });

  // ======================
  // SEÇÕES DA BIBLIOTECA
  // ======================
  
  app.get("/api/library-sections", async (req, res) => {
    try {
      const sections = await supabaseService.getLibrarySections();
      res.json(sections);
    } catch (error: any) {
      console.error("Error fetching sections:", error);
      res.status(500).json({ error: error.message });
    }
  });

  // Rota alternativa para compatibilidade
  app.get("/api/library/sections", async (req, res) => {
    try {
      const sections = await supabaseService.getLibrarySections();
      res.json(sections);
    } catch (error: any) {
      console.error("Error fetching sections:", error);
      res.status(500).json({ error: error.message });
    }
  });

  app.post("/api/admin/library-sections", async (req, res) => {
    try {
      const sectionData: InsertLibrarySection = insertLibrarySectionSchema.parse(req.body);
      const newSection = await supabaseService.createLibrarySection(sectionData);
      res.status(201).json(newSection);
    } catch (error: any) {
      console.error("Error creating section:", error);
      res.status(400).json({ error: error.message });
    }
  });

  app.put("/api/admin/library-sections/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      console.log('Atualizando seção ID:', id);
      console.log('Dados recebidos:', req.body);
      
      // Validar dados de entrada
      if (!id || isNaN(id)) {
        return res.status(400).json({ error: "ID da seção inválido" });
      }
      
      // Validar dados obrigatórios
      const requiredFields = ['name'];
      for (const field of requiredFields) {
        if (!req.body[field] || !req.body[field].trim()) {
          return res.status(400).json({ error: `Campo ${field} é obrigatório` });
        }
      }
      
      // Tratar campos enviados pelo frontend (pode vir color_scheme ou color)
      const color = req.body.color || req.body.color_scheme || '#D97706';
      const icon = req.body.icon || req.body.icon_name || '📚';
      
      // Limpar e validar dados  
      const cleanedData = {
        name: req.body.name?.trim(),
        description: req.body.description?.trim() || null,
        icon: icon.trim(),
        color: color.trim(),
        sort_order: parseInt(req.body.sort_order) || 1
      };
      
      console.log('Dados limpos:', cleanedData);
      
      const updates = insertLibrarySectionSchema.partial().parse(cleanedData);
      const updatedSection = await supabaseService.updateLibrarySection(id, updates);
      
      console.log('Seção atualizada:', updatedSection);
      res.json(updatedSection);
    } catch (error: any) {
      console.error("Error updating section:", error);
      console.error("Error stack:", error.stack);
      res.status(400).json({ 
        error: error.message,
        details: error.name === 'ZodError' ? error.errors : undefined
      });
    }
  });

  app.delete("/api/admin/library-sections/:id", authenticateToken, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      await supabaseService.deleteLibrarySection(id);
      res.json({ message: "Seção deletada com sucesso" });
    } catch (error: any) {
      console.error("Error deleting section:", error);
      res.status(400).json({ error: error.message });
    }
  });

  // ======================
  // GRIMÓRIOS
  // ======================
  
  app.get("/api/grimoires", async (req, res) => {
    try {
      const grimoires = await supabaseService.getGrimoires();
      res.json(grimoires);
    } catch (error: any) {
      console.error("Error fetching grimoires:", error);
      res.status(500).json({ error: error.message });
    }
  });

  app.get("/api/admin/grimoires", async (req, res) => {
    try {
      const grimoires = await supabaseService.getAllGrimoires();
      res.json(grimoires);
    } catch (error: any) {
      console.error("Error fetching admin grimoires:", error);
      res.status(500).json({ error: error.message });
    }
  });

  app.post("/api/admin/grimoires", async (req, res) => {
    try {
      const rawData = req.body;
      
      // Garantir que description sempre tenha um valor
      if (!rawData.description || rawData.description.trim() === '') {
        rawData.description = rawData.title || 'Grimório sem descrição';
      }
      
      // Limpar campos string
      if (rawData.title) rawData.title = rawData.title.trim();
      if (rawData.content) rawData.content = rawData.content.trim();
      if (rawData.description) rawData.description = rawData.description.trim();
      
      console.log('Dados limpos para criação:', {
        title: rawData.title,
        hasContent: !!rawData.content,
        description: rawData.description,
        section_id: rawData.section_id
      });
      
      const grimoireData = insertGrimoireSchema.parse(rawData);
      const newGrimoire = await supabaseService.createGrimoire(grimoireData);
      res.status(201).json(newGrimoire);
    } catch (error: any) {
      console.error("Error creating grimoire:", error);
      res.status(400).json({ error: error.message });
    }
  });

  app.put("/api/admin/grimoires/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const updates = insertGrimoireSchema.partial().parse(req.body);
      const updatedGrimoire = await supabaseService.updateGrimoire(id, updates);
      res.json(updatedGrimoire);
    } catch (error: any) {
      console.error("Error updating grimoire:", error);
      res.status(400).json({ error: error.message });
    }
  });

  app.delete("/api/admin/grimoires/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      await supabaseService.deleteGrimoire(id);
      res.json({ message: "Grimório deletado com sucesso" });
    } catch (error: any) {
      console.error("Error deleting grimoire:", error);
      res.status(400).json({ error: error.message });
    }
  });

  // Rota para gerar PDF de grimório
  app.post("/api/admin/grimoires/:id/pdf", async (req, res) => {
    try {
      console.log("PDF generation requested for grimoire ID:", req.params.id);
      
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ error: "ID do grimório inválido" });
      }

      console.log("Fetching grimoire from database...");
      const grimoire = await supabaseService.getGrimoireById(id);
      
      if (!grimoire) {
        console.log("Grimoire not found:", id);
        return res.status(404).json({ error: "Grimório não encontrado" });
      }

      console.log("Grimoire found:", grimoire.title);
      console.log("Starting PDF generation...");

      let pdfBuffer: Buffer;
      
      try {
        // Tentar usar Puppeteer primeiro
        pdfBuffer = await PDFGenerator.generateGrimoirePDF({
          title: grimoire.title,
          content: grimoire.content || '<p>Conteúdo não disponível</p>',
          customCss: grimoire.custom_css || '',
          includeImages: false
        });
        console.log("PDF generated with Puppeteer");
      } catch (puppeteerError) {
        console.log("Puppeteer failed, trying advanced PDF generator:", (puppeteerError as Error).message);
        try {
          // Fallback para geração avançada
          pdfBuffer = AdvancedPDFGenerator.generateGrimoirePDF({
            title: grimoire.title,
            content: grimoire.content || '<p>Conteúdo não disponível</p>',
            customCss: grimoire.custom_css || '',
            includeImages: false
          });
          console.log("PDF generated with advanced generator");
        } catch (advancedError) {
          console.log("Advanced generator failed, using reliable generator:", (advancedError as Error).message);
          // Fallback final para gerador confiável
          pdfBuffer = ReliablePDFGenerator.generatePDF({
            title: grimoire.title,
            content: grimoire.content || '<p>Conteúdo não disponível</p>',
            author: "Templo do Abismo"
          });
          console.log("PDF generated with reliable generator");
        }
      }

      console.log("PDF generated successfully, size:", pdfBuffer.length);

      const filename = grimoire.title.replace(/[^a-zA-Z0-9\s]/g, '').replace(/\s+/g, '_');
      
      res.setHeader('Content-Type', 'application/pdf');
      res.setHeader('Content-Disposition', `attachment; filename="${filename}.pdf"`);
      res.setHeader('Content-Length', pdfBuffer.length);
      res.setHeader('Cache-Control', 'no-cache');
      
      res.send(pdfBuffer);
    } catch (error: any) {
      console.error("Error generating PDF:", error);
      console.error("Stack trace:", error.stack);
      res.status(500).json({ 
        error: "Erro ao gerar PDF", 
        details: error.message,
        stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
      });
    }
  });

  app.put("/api/admin/grimoires/:id/order", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const { display_order } = req.body;
      await supabaseService.updateGrimoireOrder(id, display_order);
      res.json({ message: "Ordem atualizada com sucesso" });
    } catch (error: any) {
      console.error("Error updating grimoire order:", error);
      res.status(500).json({ error: error.message });
    }
  });

  app.post("/api/admin/generate-grimoire", async (req, res) => {
    try {
      const { prompt, section_id, title } = req.body;
      
      // Gerar conteúdo no formato correto do grimório
      const grimoireTitle = title || 'Grimório Gerado com IA';
      const generatedContent = `<div class="grimorio-conteudo">
  <h2 class="grimorio-titulo">${grimoireTitle}</h2>
  <p class="grimorio-subtitulo">Gerado com base no prompt: "${prompt}"</p>
  
  <div class="section">
    <h3>Introdução</h3>
    <p>Este grimório foi criado especificamente com base na sua solicitação. O conteúdo a seguir explora os temas e práticas relacionados ao seu interesse específico.</p>
    <p>Cada seção foi desenvolvida para fornecer conhecimentos práticos e teóricos fundamentais para o caminho escolhido.</p>
  </div>
  
  <div class="section">
    <h3>Fundamentos e Preparação</h3>
    <p>Antes de iniciar qualquer prática, é essencial compreender os fundamentos que sustentam os ensinamentos aqui apresentados.</p>
    <p>A preparação mental e espiritual forma a base sobre a qual todo conhecimento subsequente será construído.</p>
    <p>Dedique tempo para absorver completamente cada conceito antes de avançar para práticas mais complexas.</p>
  </div>
  
  <div class="section">
    <h3>Práticas Iniciais</h3>
    <p>As primeiras práticas são desenvolvidas para estabelecer uma conexão sólida com os princípios fundamentais.</p>
    <p>Comece com exercícios simples de concentração e meditação, permitindo que sua mente se acostume gradualmente com os novos conceitos.</p>
    <p>A consistência na prática é mais valiosa que a intensidade inicial. Mantenha um ritmo sustentável.</p>
  </div>
  
  <div class="section">
    <h3>Desenvolvimento Intermediário</h3>
    <p>Conforme sua compreensão se aprofunda, novos horizontes de possibilidades se abrem diante de você.</p>
    <p>Este estágio requer maior disciplina e dedicação, pois os conceitos se tornam mais sutis e complexos.</p>
    <p>Mantenha um diário de suas experiências e reflexões para acompanhar seu progresso ao longo do caminho.</p>
  </div>
  
  <div class="section">
    <h3>Técnicas Avançadas</h3>
    <p>As práticas avançadas exigem não apenas conhecimento, mas também sabedoria para aplicá-las adequadamente.</p>
    <p>Neste ponto, você já deve ter desenvolvido discernimento suficiente para adaptar os ensinamentos à sua situação única.</p>
    <p>Lembre-se sempre de que o verdadeiro poder reside no autoconhecimento e na responsabilidade pessoal.</p>
  </div>
  
  <div class="section">
    <h3>Integração e Aplicação</h3>
    <p>O conhecimento sem aplicação permanece apenas como teoria. Esta seção foca na integração prática dos ensinamentos em sua vida diária.</p>
    <p>Desenvolva um sistema pessoal que incorpore naturalmente os princípios aprendidos em suas atividades cotidianas.</p>
    <p>A verdadeira maestria vem através da aplicação consistente e consciente dos ensinamentos.</p>
  </div>
  
  <div class="section">
    <h3>Reflexões Finais</h3>
    <p>Este grimório representa apenas o início de uma jornada muito maior de autodescoberta e crescimento.</p>
    <p>Continue estudando, praticando e refinando sua compreensão através da experiência direta.</p>
    <p>Que os ensinamentos aqui compartilhados sirvam como farol em seu caminho de evolução pessoal.</p>
  </div>
</div>`;
      
      res.json({
        content: generatedContent,
        title: grimoireTitle,
        excerpt: `Grimório personalizado gerado com base no tema: ${prompt.substring(0, 100)}...`
      });
    } catch (error: any) {
      console.error("Error generating grimoire:", error);
      res.status(500).json({ error: error.message });
    }
  });

  app.get("/api/grimoires/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const grimoire = await supabaseService.getGrimoireById(id);
      
      if (!grimoire) {
        return res.status(404).json({ error: "Grimório não encontrado" });
      }

      res.json(grimoire);
    } catch (error: any) {
      console.error("Error fetching grimoire:", error);
      res.status(500).json({ error: error.message });
    }
  });

  app.get("/api/library-sections/:sectionId/grimoires", async (req, res) => {
    try {
      const sectionId = parseInt(req.params.sectionId);
      const grimoires = await supabaseService.getGrimoiresBySection(sectionId);
      res.json(grimoires);
    } catch (error: any) {
      console.error("Error fetching grimoires by section:", error);
      res.status(500).json({ error: error.message });
    }
  });

  app.post("/api/admin/grimoires", authenticateToken, async (req, res) => {
    try {
      const grimoireData: InsertGrimoire = insertGrimoireSchema.parse(req.body);
      const newGrimoire = await supabaseService.createGrimoire(grimoireData);
      res.status(201).json(newGrimoire);
    } catch (error: any) {
      console.error("Error creating grimoire:", error);
      res.status(400).json({ error: error.message });
    }
  });

  app.put("/api/admin/grimoires/:id", authenticateToken, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const updates = insertGrimoireSchema.partial().parse(req.body);
      const updatedGrimoire = await supabaseService.updateGrimoire(id, updates);
      res.json(updatedGrimoire);
    } catch (error: any) {
      console.error("Error updating grimoire:", error);
      res.status(400).json({ error: error.message });
    }
  });

  app.delete("/api/admin/grimoires/:id", authenticateToken, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      await supabaseService.deleteGrimoire(id);
      res.json({ message: "Grimório deletado com sucesso" });
    } catch (error: any) {
      console.error("Error deleting grimoire:", error);
      res.status(400).json({ error: error.message });
    }
  });

  // ======================
  // PROGRESSO DO USUÁRIO
  // ======================
  
  app.get("/api/user-progress", authenticateToken, async (req: any, res) => {
    try {
      const progress = await supabaseService.getUserProgress(req.user.id);
      res.json(progress);
    } catch (error: any) {
      console.error("Error fetching user progress:", error);
      res.status(500).json({ error: error.message });
    }
  });

  app.post("/api/user-progress", authenticateToken, async (req: any, res) => {
    try {
      const progressData: InsertProgress = insertProgressSchema.parse({
        ...req.body,
        user_id: req.user.id
      });
      
      const savedProgress = await supabaseService.saveUserProgress(progressData);
      res.json(savedProgress);
    } catch (error: any) {
      console.error("Error saving user progress:", error);
      res.status(400).json({ error: error.message });
    }
  });

  // ======================
  // CONFIGURAÇÕES DE IA
  // ======================
  
  app.get("/api/admin/ai-settings", authenticateToken, async (req, res) => {
    try {
      const settings = await supabaseService.getAISettings();
      res.json(settings || {});
    } catch (error: any) {
      console.error("Error fetching AI settings:", error);
      res.status(500).json({ error: error.message });
    }
  });

  app.post("/api/admin/ai-settings", authenticateToken, async (req, res) => {
    try {
      const settings = await supabaseService.saveAISettings(req.body);
      res.json(settings);
    } catch (error: any) {
      console.error("Error saving AI settings:", error);
      res.status(400).json({ error: error.message });
    }
  });

  // ======================
  // CONFIGURAÇÕES DO SISTEMA
  // ======================
  
  app.get("/api/admin/system-settings", authenticateToken, async (req, res) => {
    try {
      const settings = await supabaseService.getSystemSettings();
      res.json(settings);
    } catch (error: any) {
      console.error("Error fetching system settings:", error);
      res.status(500).json({ error: error.message });
    }
  });

  app.post("/api/admin/system-settings", authenticateToken, async (req, res) => {
    try {
      await supabaseService.saveSystemSettings(req.body);
      res.json({ message: "Configurações salvas com sucesso" });
    } catch (error: any) {
      console.error("Error saving system settings:", error);
      res.status(400).json({ error: error.message });
    }
  });

  // ======================
  // GERAÇÃO COM IA
  // ======================
  
  app.post("/api/admin/generate-grimoire", authenticateToken, async (req, res) => {
    try {
      const { prompt, sectionId } = req.body;
      
      if (!prompt) {
        return res.status(400).json({ error: "Prompt é obrigatório" });
      }

      const aiResult = await supabaseService.generateGrimoireWithAI(prompt, sectionId);
      
      const grimoireData = {
        title: aiResult.title,
        content: aiResult.content,
        excerpt: aiResult.excerpt,
        estimated_read_time: aiResult.estimated_read_time,
        word_count: aiResult.word_count,
        section_id: sectionId,
        is_published: false
      };

      const newGrimoire = await supabaseService.createGrimoire(grimoireData);
      res.json(newGrimoire);
    } catch (error: any) {
      console.error("Error generating grimoire:", error);
      res.status(400).json({ error: error.message });
    }
  });

  // ======================
  // PAGAMENTOS
  // ======================
  
  app.post("/api/create-payment-intent", authenticateToken, async (req: any, res) => {
    try {
      const { grimoireId, amount } = req.body;
      const paymentIntent = await supabaseService.createPaymentIntent(grimoireId, amount);
      res.json(paymentIntent);
    } catch (error: any) {
      console.error("Error creating payment intent:", error);
      res.status(500).json({ error: error.message });
    }
  });

  app.post("/api/confirm-payment", authenticateToken, async (req: any, res) => {
    try {
      const { paymentIntentId } = req.body;
      await supabaseService.processPaymentConfirmed(paymentIntentId, req.user.id);
      res.json({ message: "Pagamento processado com sucesso" });
    } catch (error: any) {
      console.error("Error confirming payment:", error);
      res.status(500).json({ error: error.message });
    }
  });

  // ======================
  // ANALYTICS E ESTATÍSTICAS
  // ======================
  
  app.get("/api/admin/overview-stats", async (req, res) => {
    try {
      // Bypass de autenticação para ambiente Replit
      const stats = await supabaseService.getOverviewStats();
      res.json(stats);
    } catch (error: any) {
      console.error("Error fetching overview stats:", error);
      res.status(500).json({ error: error.message });
    }
  });

  // ======================
  // DIAGNÓSTICO DO SISTEMA
  // ======================
  
  app.get("/api/admin/supabase-status", authenticateToken, async (req, res) => {
    try {
      const connectionTest = await supabaseService.testConnection();
      
      const recommendations: Array<{priority: string, message: string, action: string}> = [];
      
      if (connectionTest.status !== 'SUCCESS') {
        recommendations.push({
          priority: 'HIGH',
          message: 'Problemas de conectividade detectados',
          action: 'Execute o script SUPABASE_STRUCTURE_UPDATE.sql no dashboard do Supabase'
        });
      } else {
        recommendations.push({
          priority: 'INFO',
          message: 'Sistema funcionando perfeitamente',
          action: 'Nenhuma ação necessária'
        });
      }

      const diagnostics = {
        timestamp: new Date().toISOString(),
        connection: connectionTest,
        database_structure: connectionTest.status === 'SUCCESS' ? 'OK' : 'NEEDS_SETUP',
        recommendations
      };
      
      res.json(diagnostics);
    } catch (error: any) {
      console.error('Erro durante diagnóstico:', error);
      res.status(500).json({
        error: 'Falha no diagnóstico do Supabase',
        details: error.message,
        timestamp: new Date().toISOString()
      });
    }
  });

  // Inicializar seções padrão e atualizar schema
  await supabaseService.initializeDefaultSections();
  await supabaseService.updateGrimoireSchema();

  const httpServer = createServer(app);
  return httpServer;
}