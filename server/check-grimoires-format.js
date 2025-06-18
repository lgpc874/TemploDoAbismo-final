import { createClient } from '@supabase/supabase-js';

const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);

async function checkGrimoireFormatting() {
  // Verificar grimório existente formatado
  const { data: existing } = await supabase
    .from('grimoires')
    .select('*')
    .eq('id', 47)
    .single();
    
  // Verificar grimório novo criado
  const { data: newGrimoire } = await supabase
    .from('grimoires')
    .select('*')
    .eq('id', 63)
    .single();
    
  console.log('=== GRIMÓRIO EXISTENTE (Bem formatado) ===');
  console.log('Título:', existing?.title);
  console.log('Custom CSS presente:', !!existing?.custom_css);
  console.log('Conteúdo (200 chars):');
  console.log(existing?.content?.substring(0, 200));
  console.log('Background color:', existing?.background_color);
  
  console.log('\n=== GRIMÓRIO NOVO (Problema de formatação) ===');
  console.log('Título:', newGrimoire?.title);
  console.log('Custom CSS presente:', !!newGrimoire?.custom_css);
  console.log('Conteúdo (200 chars):');
  console.log(newGrimoire?.content?.substring(0, 200));
  console.log('Background color:', newGrimoire?.background_color);

  if (newGrimoire?.custom_css) {
    console.log('\nCSS do grimório novo:');
    console.log(newGrimoire.custom_css.substring(0, 300));
  }
}

checkGrimoireFormatting();