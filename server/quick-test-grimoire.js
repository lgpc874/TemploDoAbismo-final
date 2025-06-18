import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function quickTest() {
  console.log('Testando criação de grimório com dados do editor...');

  const grimoireData = {
    title: 'Teste Editor Interface',
    content: '<h1>Teste</h1><p>Conteúdo de teste</p>',
    description: 'Teste de grimório criado pela interface',
    section_id: 1,
    is_published: false,
    custom_css: 'body { background: #1a0a0a; }',
    background_color: '#1a0a0a'
  };

  console.log('Dados a serem enviados:', JSON.stringify(grimoireData, null, 2));

  try {
    const { data, error } = await supabase
      .from('grimoires')
      .insert(grimoireData)
      .select()
      .single();

    if (error) {
      console.error('Erro:', error.message);
      console.error('Detalhes completos:', error);
      return;
    }

    console.log('Sucesso! ID:', data.id);
    
    // Limpar
    await supabase.from('grimoires').delete().eq('id', data.id);
    console.log('Teste limpo');

  } catch (error) {
    console.error('Erro fatal:', error.message);
  }
}

quickTest();