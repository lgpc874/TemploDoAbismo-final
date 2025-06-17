-- Atualização da tabela grimoires para suportar funcionalidades avançadas de edição
-- Execute este SQL no Supabase SQL Editor

-- Adicionar novos campos à tabela grimoires
ALTER TABLE grimoires ADD COLUMN IF NOT EXISTS custom_css TEXT;
ALTER TABLE grimoires ADD COLUMN IF NOT EXISTS background_color TEXT DEFAULT '#1a0a0a';
ALTER TABLE grimoires ADD COLUMN IF NOT EXISTS is_restricted BOOLEAN DEFAULT false;
ALTER TABLE grimoires ADD COLUMN IF NOT EXISTS power_words TEXT; -- JSON array
ALTER TABLE grimoires ADD COLUMN IF NOT EXISTS content_structure TEXT DEFAULT 'single'; -- 'single' ou 'chapters'
ALTER TABLE grimoires ADD COLUMN IF NOT EXISTS enable_pdf_download BOOLEAN DEFAULT false;
ALTER TABLE grimoires ADD COLUMN IF NOT EXISTS pdf_custom_styles TEXT;
ALTER TABLE grimoires ADD COLUMN IF NOT EXISTS ai_prompt_used TEXT;
ALTER TABLE grimoires ADD COLUMN IF NOT EXISTS generation_settings TEXT; -- JSON

-- Comentários para documentação
COMMENT ON COLUMN grimoires.custom_css IS 'CSS personalizado para o grimório';
COMMENT ON COLUMN grimoires.background_color IS 'Cor de fundo hex do grimório';
COMMENT ON COLUMN grimoires.is_restricted IS 'Se requer palavras de poder para acesso';
COMMENT ON COLUMN grimoires.power_words IS 'JSON array das palavras de poder necessárias';
COMMENT ON COLUMN grimoires.content_structure IS 'Estrutura: single (texto corrido) ou chapters (capítulos)';
COMMENT ON COLUMN grimoires.enable_pdf_download IS 'Se permite download em PDF';
COMMENT ON COLUMN grimoires.pdf_custom_styles IS 'Estilos específicos para PDF';
COMMENT ON COLUMN grimoires.ai_prompt_used IS 'Prompt usado para geração com IA';
COMMENT ON COLUMN grimoires.generation_settings IS 'JSON das configurações da IA usadas';

-- Atualizar RLS policies se necessário
-- As policies existentes já cobrem INSERT, UPDATE, DELETE para admins

-- Verificar se tudo foi criado corretamente
SELECT column_name, data_type, is_nullable, column_default
FROM information_schema.columns
WHERE table_name = 'grimoires'
AND column_name IN ('custom_css', 'background_color', 'is_restricted', 'power_words', 'content_structure', 'enable_pdf_download', 'pdf_custom_styles', 'ai_prompt_used', 'generation_settings')
ORDER BY ordinal_position;