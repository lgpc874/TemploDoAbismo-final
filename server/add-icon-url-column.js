import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('Credenciais do Supabase não encontradas');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function addIconUrlColumn() {
  try {
    console.log('Verificando estrutura da tabela library_sections...');
    
    // Testar se a coluna icon_url já existe
    const { data, error } = await supabase
      .from('library_sections')
      .select('id, name, description, icon_name, sort_order, is_active, color_scheme, access_level, icon_url')
      .limit(1);
    
    if (error) {
      if (error.message.includes('column "icon_url" does not exist')) {
        console.log('Coluna icon_url não existe. Você precisa executar este SQL no painel do Supabase:');
        console.log('\n--- SQL PARA EXECUTAR NO SUPABASE ---');
        console.log('ALTER TABLE library_sections ADD COLUMN icon_url TEXT;');
        console.log('--- FIM DO SQL ---\n');
        console.log('Depois de executar o SQL, reinicie o servidor.');
      } else {
        console.error('Erro ao verificar tabela:', error);
      }
    } else {
      console.log('✓ Coluna icon_url já existe na tabela library_sections');
      console.log(`Testado com ${data.length} registro(s)`);
    }
    
  } catch (error) {
    console.error('Erro:', error);
  }
}

addIconUrlColumn();