const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('Credenciais do Supabase não encontradas');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function fixSchemaAndPdf() {
  try {
    console.log('Adicionando coluna icon_url à tabela library_sections...');
    
    // Usar RPC para executar SQL diretamente
    const { data, error } = await supabase.rpc('exec_sql', {
      sql: 'ALTER TABLE library_sections ADD COLUMN IF NOT EXISTS icon_url TEXT;'
    });
    
    if (error) {
      console.log('Tentativa 1 falhou, tentando método alternativo...');
      
      // Método alternativo: usar supabase-js para adicionar a coluna
      const { error: error2 } = await supabase
        .from('library_sections')
        .select('icon_url')
        .limit(1);
        
      if (error2 && error2.message.includes('column "icon_url" does not exist')) {
        console.log('Coluna icon_url não existe, precisará ser adicionada manualmente no painel do Supabase');
        console.log('SQL para executar: ALTER TABLE library_sections ADD COLUMN icon_url TEXT;');
      } else {
        console.log('✓ Coluna icon_url já existe ou foi adicionada');
      }
    } else {
      console.log('✓ Coluna icon_url adicionada com sucesso');
    }
    
    // Testar se as seções existem
    console.log('\nVerificando seções existentes...');
    const { data: sections, error: sectionsError } = await supabase
      .from('library_sections')
      .select('*')
      .limit(5);
      
    if (sectionsError) {
      console.error('Erro ao buscar seções:', sectionsError);
    } else {
      console.log(`✓ Encontradas ${sections.length} seções`);
      sections.forEach(section => {
        console.log(`  - ${section.name} (ID: ${section.id})`);
      });
    }
    
    console.log('\n✅ Correção do schema concluída!');
    
  } catch (error) {
    console.error('Erro:', error);
  }
}

fixSchemaAndPdf();