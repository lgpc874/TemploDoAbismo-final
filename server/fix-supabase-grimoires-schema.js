import { createClient } from '@supabase/supabase-js';

// Configuração do Supabase
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('SUPABASE_URL e SUPABASE_SERVICE_ROLE_KEY são obrigatórios');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function fixGrimoireSchema() {
  console.log('🔧 Verificando e corrigindo schema da tabela grimoires...');

  try {
    // Verificar se a tabela existe e suas colunas
    const { data: columns, error: columnsError } = await supabase
      .from('information_schema.columns')
      .select('column_name, data_type')
      .eq('table_name', 'grimoires');

    if (columnsError) {
      console.log('Não foi possível verificar colunas via SQL, tentando operação direta...');
    } else {
      console.log('Colunas existentes:', columns?.map(c => c.column_name).join(', '));
    }

    // Tentar fazer um SELECT simples para verificar a estrutura
    const { data: testData, error: testError } = await supabase
      .from('grimoires')
      .select('*')
      .limit(1);

    if (testError) {
      console.error('Erro ao testar tabela grimoires:', testError.message);
      
      // Se a tabela não existe, vamos criá-la
      console.log('🚀 Criando tabela grimoires...');
      
      const createTableSQL = `
        CREATE TABLE IF NOT EXISTS grimoires (
          id BIGSERIAL PRIMARY KEY,
          title TEXT NOT NULL,
          content TEXT NOT NULL,
          section_id BIGINT REFERENCES library_sections(id),
          author_id BIGINT,
          price DECIMAL(10,2) DEFAULT 0,
          is_paid BOOLEAN DEFAULT FALSE,
          is_published BOOLEAN DEFAULT TRUE,
          is_featured BOOLEAN DEFAULT FALSE,
          unlock_order INTEGER DEFAULT 1,
          cover_image_url TEXT,
          excerpt TEXT,
          difficulty_level TEXT DEFAULT 'beginner',
          estimated_read_time INTEGER DEFAULT 30,
          word_count INTEGER DEFAULT 0,
          language TEXT DEFAULT 'pt-BR',
          content_type TEXT DEFAULT 'grimoire',
          access_level TEXT DEFAULT 'public',
          download_count INTEGER DEFAULT 0,
          view_count INTEGER DEFAULT 0,
          rating_average DECIMAL(3,2) DEFAULT 0,
          rating_count INTEGER DEFAULT 0,
          custom_css TEXT,
          background_color TEXT DEFAULT '#1a0a0a',
          is_restricted BOOLEAN DEFAULT FALSE,
          power_words TEXT,
          content_structure TEXT DEFAULT 'single',
          enable_pdf_download BOOLEAN DEFAULT FALSE,
          pdf_custom_styles TEXT,
          ai_prompt_used TEXT,
          generation_settings TEXT,
          display_order INTEGER DEFAULT 0,
          created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
          updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
        );
      `;

      const { error: createError } = await supabase.rpc('exec_sql', { 
        sql_query: createTableSQL 
      });

      if (createError) {
        console.error('Erro ao criar tabela:', createError.message);
        
        // Tentar abordagem alternativa - inserir um registro de teste
        console.log('Tentando criar grimório de teste para verificar campos...');
        
        const testGrimoire = {
          title: 'Teste Schema',
          content: '<p>Teste</p>',
          section_id: 1,
          is_published: false
        };

        const { data: insertData, error: insertError } = await supabase
          .from('grimoires')
          .insert(testGrimoire)
          .select()
          .single();

        if (insertError) {
          console.error('Erro ao inserir grimório de teste:', insertError.message);
          
          // Se o erro for sobre campos faltantes, vamos tentar um INSERT mais simples
          console.log('Tentando inserção mínima...');
          
          const minimalGrimoire = {
            title: 'Teste Mínimo',
            content: '<p>Teste mínimo</p>'
          };

          const { data: minimalData, error: minimalError } = await supabase
            .from('grimoires')
            .insert(minimalGrimoire)
            .select()
            .single();

          if (minimalError) {
            console.error('Erro na inserção mínima:', minimalError.message);
          } else {
            console.log('✅ Inserção mínima funcionou, grimório criado:', minimalData.id);
            
            // Deletar o grimório de teste
            await supabase
              .from('grimoires')
              .delete()
              .eq('id', minimalData.id);
          }
        } else {
          console.log('✅ Grimório de teste criado com sucesso:', insertData.id);
          
          // Deletar o grimório de teste
          await supabase
            .from('grimoires')
            .delete()
            .eq('id', insertData.id);
        }
      } else {
        console.log('✅ Tabela grimoires criada com sucesso');
      }
    } else {
      console.log('✅ Tabela grimoires já existe e é acessível');
      console.log(`Encontrados ${testData?.length || 0} registros na tabela`);
    }

    // Verificar se conseguimos fazer operações básicas
    console.log('🧪 Testando operações CRUD...');
    
    // Teste de criação
    const testGrimoire = {
      title: 'Grimório de Teste CRUD',
      content: '<h1>Teste</h1><p>Conteúdo de teste para verificar CRUD</p>',
      section_id: 1,
      is_published: false,
      custom_css: 'body { background: #000; }',
      background_color: '#1a0a0a'
    };

    const { data: createdGrimoire, error: createError } = await supabase
      .from('grimoires')
      .insert(testGrimoire)
      .select()
      .single();

    if (createError) {
      console.error('❌ Erro ao criar grimório de teste:', createError.message);
      
      // Tentar sem os campos que podem estar causando problema
      const simplifiedGrimoire = {
        title: 'Grimório Simplificado',
        content: '<p>Teste simplificado</p>',
        section_id: 1
      };

      const { data: simplifiedData, error: simplifiedError } = await supabase
        .from('grimoires')
        .insert(simplifiedGrimoire)
        .select()
        .single();

      if (simplifiedError) {
        console.error('❌ Erro mesmo com grimório simplificado:', simplifiedError.message);
        return;
      } else {
        console.log('✅ Grimório simplificado criado:', simplifiedData.id);
        
        // Deletar
        await supabase
          .from('grimoires')
          .delete()
          .eq('id', simplifiedData.id);
        
        console.log('✅ Grimório simplificado deletado');
      }
    } else {
      console.log('✅ Grimório de teste criado com sucesso:', createdGrimoire.id);
      
      // Teste de atualização
      const { data: updatedGrimoire, error: updateError } = await supabase
        .from('grimoires')
        .update({ title: 'Grimório Atualizado' })
        .eq('id', createdGrimoire.id)
        .select()
        .single();

      if (updateError) {
        console.error('❌ Erro ao atualizar grimório:', updateError.message);
      } else {
        console.log('✅ Grimório atualizado com sucesso');
      }

      // Teste de leitura
      const { data: readGrimoire, error: readError } = await supabase
        .from('grimoires')
        .select('*')
        .eq('id', createdGrimoire.id)
        .single();

      if (readError) {
        console.error('❌ Erro ao ler grimório:', readError.message);
      } else {
        console.log('✅ Grimório lido com sucesso');
      }

      // Teste de deleção
      const { error: deleteError } = await supabase
        .from('grimoires')
        .delete()
        .eq('id', createdGrimoire.id);

      if (deleteError) {
        console.error('❌ Erro ao deletar grimório:', deleteError.message);
      } else {
        console.log('✅ Grimório deletado com sucesso');
      }
    }

    console.log('\n🎉 Verificação de schema concluída!');
    
  } catch (error) {
    console.error('❌ Erro durante verificação de schema:', error.message);
    console.error('Stack:', error.stack);
  }
}

// Executar
fixGrimoireSchema().then(() => {
  console.log('✅ Script concluído');
  process.exit(0);
}).catch(error => {
  console.error('❌ Erro fatal:', error);
  process.exit(1);
});