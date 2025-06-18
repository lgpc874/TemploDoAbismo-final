import { createClient } from '@supabase/supabase-js';

const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);

async function fixGrimoire63() {
  console.log('Corrigindo formatação do grimório ID 63...');

  // Novo conteúdo no formato correto
  const correctContent = `<div class="grimorio-conteudo">
  <h2 class="grimorio-titulo">Teste</h2>
  <p class="grimorio-subtitulo">Grimório de Teste - Editor Completo</p>
  
  <div class="section">
    <h3>Introdução</h3>
    <p>Este é um grimório de teste criado com o novo editor completo. O conteúdo agora está formatado corretamente para funcionar com o sistema de paginação.</p>
    <p>Cada seção é dividida em divs com a classe "section" para permitir que o sistema de paginação funcione adequadamente.</p>
  </div>
  
  <div class="section">
    <h3>Primeiro Capítulo</h3>
    <p>Este é o primeiro capítulo do grimório de teste. O conteúdo está estruturado de forma que cada parágrafo e seção seja corretamente processado pelo sistema de paginação.</p>
    <p>A formatação segue o mesmo padrão dos grimórios existentes, garantindo consistência visual e funcional.</p>
    <p>Este parágrafo adicional demonstra como o conteúdo flui naturalmente entre as páginas.</p>
  </div>
  
  <div class="section">
    <h3>Segundo Capítulo</h3>
    <p>O segundo capítulo continua expandindo o conteúdo do grimório de teste.</p>
    <p>Aqui podemos incluir mais detalhes e ensinamentos específicos relacionados ao tema escolhido.</p>
    <p>A estrutura em seções permite que o leitor navegue facilmente pelo conteúdo.</p>
  </div>
  
  <div class="section">
    <h3>Práticas e Exercícios</h3>
    <p>Esta seção contém práticas e exercícios relacionados aos ensinamentos apresentados.</p>
    <p>Cada exercício é explicado de forma clara e detalhada para facilitar a compreensão.</p>
    <p>A aplicação prática dos conceitos é fundamental para o desenvolvimento completo.</p>
  </div>
  
  <div class="section">
    <h3>Considerações Finais</h3>
    <p>As considerações finais resumem os pontos principais abordados no grimório.</p>
    <p>Este é o momento de reflexão sobre os ensinamentos apresentados e sua aplicação pessoal.</p>
    <p>O conhecimento adquirido deve ser integrado gradualmente na prática diária.</p>
  </div>
</div>`;

  try {
    const { data, error } = await supabase
      .from('grimoires')
      .update({
        content: correctContent,
        custom_css: null // Remover CSS duplicado
      })
      .eq('id', 63)
      .select()
      .single();

    if (error) {
      console.error('Erro ao atualizar grimório:', error.message);
      return;
    }

    console.log('✅ Grimório ID 63 atualizado com sucesso!');
    console.log('Título:', data.title);
    console.log('Conteúdo corrigido: Sim');
    console.log('Primeiros 150 chars do novo conteúdo:');
    console.log(data.content.substring(0, 150) + '...');

  } catch (error) {
    console.error('Erro fatal:', error.message);
  }
}

fixGrimoire63();