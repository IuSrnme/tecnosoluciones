// Estos dos valores son PÚBLICOS por diseño (la seguridad la dan las reglas RLS de supabase.sql).
// Los encuentras en Supabase: Project Settings > API.
// NUNCA pegues aquí la clave "service_role".
const SUPABASE_URL = "https://pwmyjwwjdcdstpxkpfjd.supabase.co";
const SUPABASE_ANON_KEY = "sb_publishable_Udwg-M7AU3RSxuJCyOiCdg_34jvURR0";

const sb = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
