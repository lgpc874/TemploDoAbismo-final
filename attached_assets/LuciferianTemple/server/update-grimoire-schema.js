import { SupabaseServiceNew } from './supabase-service-new.ts';

async function updateGrimoireSchema() {
  const service = new SupabaseServiceNew();
  
  try {
    console.log('Atualizando schema da tabela grimoires...');
    
    const queries = [
      "ALTER TABLE grimoires ADD COLUMN IF NOT EXISTS custom_css TEXT;",
      "ALTER TABLE grimoires ADD COLUMN IF NOT EXISTS background_color TEXT DEFAULT '#1a0a0a';",
      "ALTER TABLE grimoires ADD COLUMN IF NOT EXISTS is_restricted BOOLEAN DEFAULT false;",
      "ALTER TABLE grimoires ADD COLUMN IF NOT EXISTS power_words TEXT;",
      "ALTER TABLE grimoires ADD COLUMN IF NOT EXISTS content_structure TEXT DEFAULT 'single';",
      "ALTER TABLE grimoires ADD COLUMN IF NOT EXISTS enable_pdf_download BOOLEAN DEFAULT false;",
      "ALTER TABLE grimoires ADD COLUMN IF NOT EXISTS pdf_custom_styles TEXT;",
      "ALTER TABLE grimoires ADD COLUMN IF NOT EXISTS ai_prompt_used TEXT;",
      "ALTER TABLE grimoires ADD COLUMN IF NOT EXISTS generation_settings TEXT;"
    ];

    for (const query of queries) {
      console.log(`Executando: ${query}`);
      const result = await service.executeDirectSQL(query);
      console.log('✓ Sucesso');
    }

    // Verificar se tudo foi criado
    console.log('\nVerificando colunas criadas...');
    const verification = await service.executeDirectSQL(`
      SELECT column_name, data_type, is_nullable, column_default
      FROM information_schema.columns
      WHERE table_name = 'grimoires'
      AND column_name IN ('custom_css', 'background_color', 'is_restricted', 'power_words', 'content_structure', 'enable_pdf_download', 'pdf_custom_styles', 'ai_prompt_used', 'generation_settings')
      ORDER BY ordinal_position;
    `);
    
    console.log('Colunas adicionadas:', verification);
    console.log('✅ Schema atualizado com sucesso!');
    
  } catch (error) {
    console.error('❌ Erro ao atualizar schema:', error);
  }
}

updateGrimoireSchema();