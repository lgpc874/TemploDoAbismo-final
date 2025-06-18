-- Execute este script no Editor SQL do Supabase para corrigir a tabela grimoires

-- Permitir description como opcional com valor padrão
ALTER TABLE grimoires ALTER COLUMN description DROP NOT NULL;
ALTER TABLE grimoires ALTER COLUMN description SET DEFAULT 'Grimório sem descrição';

-- Atualizar registros existentes
UPDATE grimoires SET description = 'Grimório sem descrição' WHERE description IS NULL;

-- Adicionar colunas que podem estar faltando
ALTER TABLE grimoires ADD COLUMN IF NOT EXISTS custom_css TEXT;
ALTER TABLE grimoires ADD COLUMN IF NOT EXISTS background_color TEXT DEFAULT '#1a0a0a';
ALTER TABLE grimoires ADD COLUMN IF NOT EXISTS excerpt TEXT;

-- Teste simples
INSERT INTO grimoires (title, content, section_id, is_published) 
VALUES ('Teste Fix', '<p>Teste</p>', 1, false);

-- Mostrar que funcionou
SELECT id, title, description FROM grimoires WHERE title = 'Teste Fix';

-- Limpar teste
DELETE FROM grimoires WHERE title = 'Teste Fix';