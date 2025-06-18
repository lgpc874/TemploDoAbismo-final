import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function testGrimoireCreation() {
  console.log('🧪 Testando criação de grimório...');

  const testGrimoire = {
    title: 'Editor Teste Completo',
    content: '<h1>Teste do Editor</h1><p>Este grimório foi criado pelo novo editor com upload de arquivos.</p>',
    description: 'Grimório de teste criado pelo editor completo',
    section_id: 1,
    is_published: false,
    custom_css: 'body { background: linear-gradient(135deg, #1a0a0a 0%, #8B0000 100%); } h1 { color: #d4af37; }',
    background_color: '#1a0a0a'
  };

  try {
    const { data, error } = await supabase
      .from('grimoires')
      .insert(testGrimoire)
      .select()
      .single();

    if (error) {
      console.error('❌ Erro ao criar grimório:', error.message);
      console.error('Detalhes:', error);
      return false;
    }

    console.log('✅ Grimório criado com sucesso!');
    console.log('ID:', data.id);
    console.log('Título:', data.title);
    console.log('CSS personalizado salvo:', !!data.custom_css);

    // Testar atualização
    const updateData = {
      title: 'Editor Teste Atualizado',
      custom_css: data.custom_css + '\n\n/* CSS atualizado */ p { color: #f5f5dc; }'
    };

    const { data: updatedData, error: updateError } = await supabase
      .from('grimoires')
      .update(updateData)
      .eq('id', data.id)
      .select()
      .single();

    if (updateError) {
      console.error('❌ Erro ao atualizar grimório:', updateError.message);
    } else {
      console.log('✅ Grimório atualizado com sucesso!');
    }

    // Limpar - deletar o grimório de teste
    const { error: deleteError } = await supabase
      .from('grimoires')
      .delete()
      .eq('id', data.id);

    if (deleteError) {
      console.error('❌ Erro ao deletar grimório de teste:', deleteError.message);
    } else {
      console.log('✅ Grimório de teste deletado');
    }

    return true;

  } catch (error) {
    console.error('❌ Erro fatal:', error.message);
    return false;
  }
}

testGrimoireCreation().then(success => {
  if (success) {
    console.log('\n🎉 Teste concluído com sucesso! O editor está funcionando.');
  } else {
    console.log('\n❌ Teste falhou. Há problemas com o editor.');
  }
  process.exit(success ? 0 : 1);
});