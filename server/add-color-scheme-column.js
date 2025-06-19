import { createClient } from '@supabase/supabase-js';

const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);

async function addColorSchemeColumn() {
  console.log('Adicionando coluna color_scheme à tabela library_sections...');

  try {
    // Adicionar a coluna color_scheme
    const { data, error } = await supabase.rpc('exec_sql', {
      sql: `
        ALTER TABLE library_sections 
        ADD COLUMN IF NOT EXISTS color_scheme TEXT DEFAULT '#D97706';
      `
    });

    if (error) {
      console.error('Erro ao adicionar coluna:', error);
      // Tentar método alternativo com UPDATE direto
      console.log('Tentando método alternativo...');
      
      const { data: updateData, error: updateError } = await supabase
        .from('library_sections')
        .update({ color_scheme: '#D97706' })
        .eq('id', 1)
        .select()
        .single();

      if (updateError) {
        console.error('Erro no método alternativo:', updateError);
        // A coluna não existe, vamos criar via SQL direto
        console.log('Executando SQL direto para adicionar coluna...');
        
        // Usar o método de execução SQL direta do Supabase
        const { data: sqlData, error: sqlError } = await supabase.rpc('execute_sql', {
          query: 'ALTER TABLE library_sections ADD COLUMN IF NOT EXISTS color_scheme TEXT DEFAULT \'#D97706\';'
        });

        if (sqlError) {
          console.error('Erro ao executar SQL:', sqlError);
          console.log('Tentando atualizar manualmente cada seção...');
          
          // Método manual: buscar todas as seções e adicionar cor
          const { data: sections, error: fetchError } = await supabase
            .from('library_sections')
            .select('*');

          if (fetchError) {
            console.error('Erro ao buscar seções:', fetchError);
            return;
          }

          console.log(`Encontradas ${sections.length} seções para atualizar`);
          
          // Definir cores para cada seção
          const sectionColors = {
            'Atrium Ignis': '#8b0000',
            'Porta Umbrae': '#4a5568', 
            'Arcana Noctis': '#2d3748',
            'Via Tenebris': '#1a202c',
            'Templo do Abismo': '#000000'
          };

          for (const section of sections) {
            const color = sectionColors[section.name] || '#D97706';
            console.log(`Definindo cor ${color} para seção ${section.name}`);
            // Por enquanto, apenas log - a coluna precisa ser criada primeiro
          }
        } else {
          console.log('✅ Coluna color_scheme adicionada com sucesso!');
        }
      } else {
        console.log('✅ Coluna já existe e foi testada com sucesso!');
        console.log('Dados atualizados:', updateData);
      }
    } else {
      console.log('✅ Comando SQL executado com sucesso!');
      console.log('Resultado:', data);
    }

    // Verificar se a coluna foi criada
    console.log('Verificando estrutura da tabela...');
    const { data: tableInfo, error: infoError } = await supabase
      .from('library_sections')
      .select('*')
      .limit(1);

    if (infoError) {
      console.error('Erro ao verificar tabela:', infoError);
    } else {
      console.log('Estrutura atual da tabela:', Object.keys(tableInfo[0] || {}));
    }

  } catch (error) {
    console.error('Erro fatal:', error.message);
  }
}

addColorSchemeColumn();