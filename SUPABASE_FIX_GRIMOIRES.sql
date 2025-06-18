-- Script para corrigir a tabela grimoires no Supabase
-- Execute este script no Editor SQL do Supabase

-- 1. Tornar a coluna description opcional ou com valor padrão
ALTER TABLE grimoires 
ALTER COLUMN description SET DEFAULT 'Grimório sem descrição';

-- 2. Atualizar registros existentes que podem ter description nulo
UPDATE grimoires 
SET description = COALESCE(description, title || ' - Descrição automática')
WHERE description IS NULL;

-- 3. Verificar se a coluna custom_css existe, se não, criar
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'grimoires' AND column_name = 'custom_css') THEN
        ALTER TABLE grimoires ADD COLUMN custom_css TEXT;
    END IF;
END $$;

-- 4. Verificar se a coluna background_color existe, se não, criar
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'grimoires' AND column_name = 'background_color') THEN
        ALTER TABLE grimoires ADD COLUMN background_color TEXT DEFAULT '#1a0a0a';
    END IF;
END $$;

-- 5. Adicionar outras colunas que podem estar faltando
DO $$ 
BEGIN
    -- Coluna excerpt se não existir
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'grimoires' AND column_name = 'excerpt') THEN
        ALTER TABLE grimoires ADD COLUMN excerpt TEXT;
    END IF;
    
    -- Coluna word_count se não existir
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'grimoires' AND column_name = 'word_count') THEN
        ALTER TABLE grimoires ADD COLUMN word_count INTEGER DEFAULT 0;
    END IF;
    
    -- Coluna estimated_read_time se não existir
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'grimoires' AND column_name = 'estimated_read_time') THEN
        ALTER TABLE grimoires ADD COLUMN estimated_read_time INTEGER DEFAULT 30;
    END IF;
    
    -- Coluna difficulty_level se não existir
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'grimoires' AND column_name = 'difficulty_level') THEN
        ALTER TABLE grimoires ADD COLUMN difficulty_level TEXT DEFAULT 'beginner';
    END IF;
    
    -- Coluna is_featured se não existir
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'grimoires' AND column_name = 'is_featured') THEN
        ALTER TABLE grimoires ADD COLUMN is_featured BOOLEAN DEFAULT false;
    END IF;
    
    -- Coluna unlock_order se não existir
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'grimoires' AND column_name = 'unlock_order') THEN
        ALTER TABLE grimoires ADD COLUMN unlock_order INTEGER DEFAULT 1;
    END IF;
    
    -- Coluna cover_image_url se não existir
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'grimoires' AND column_name = 'cover_image_url') THEN
        ALTER TABLE grimoires ADD COLUMN cover_image_url TEXT;
    END IF;
    
    -- Coluna display_order se não existir
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'grimoires' AND column_name = 'display_order') THEN
        ALTER TABLE grimoires ADD COLUMN display_order INTEGER DEFAULT 0;
    END IF;
END $$;

-- 6. Tornar a coluna description NOT NULL mas com valor padrão
ALTER TABLE grimoires 
ALTER COLUMN description SET NOT NULL;

-- 7. Verificar a estrutura final
SELECT column_name, data_type, is_nullable, column_default 
FROM information_schema.columns 
WHERE table_name = 'grimoires' 
ORDER BY ordinal_position;

-- 8. Teste de inserção para verificar se está funcionando
DO $$
DECLARE
    test_id BIGINT;
BEGIN
    -- Inserir grimório de teste
    INSERT INTO grimoires (title, content, description, section_id, is_published)
    VALUES ('Teste SQL', '<p>Conteúdo de teste</p>', 'Grimório criado via SQL', 1, false)
    RETURNING id INTO test_id;
    
    RAISE NOTICE 'Grimório de teste criado com ID: %', test_id;
    
    -- Deletar o teste
    DELETE FROM grimoires WHERE id = test_id;
    
    RAISE NOTICE 'Teste limpo com sucesso';
END $$;