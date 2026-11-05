# TecnoSoluciones con blog administrable (Supabase)

## Archivos
- NUEVOS/CAMBIADOS: `blog.html`, `post.html`, `blog.js`, `panel-x7k2.html`, `admin.js`, `supabase-config.js`, `supabase.sql`, `styles.css`
- SIN CAMBIOS: `index.html`, `ayuda.html`, `tyc.html`, `script.js`
- BORRA: `post-1.html` y `Plantilla_post.html` (ya no se usan).

## Configuración (una sola vez)
1. Crea un proyecto gratis en supabase.com.
2. **Authentication > Users > Add user**: crea tu usuario admin (correo + contraseña fuerte, marca "Auto confirm").
3. **Authentication > Sign In / Providers**: desactiva **"Allow new users to sign up"** (sin registro público).
4. **SQL Editor**: abre `supabase.sql`, reemplaza `TU_CORREO_ADMIN@ejemplo.com` por tu correo y ejecútalo.
5. **Project Settings > API**: copia *Project URL* y la clave *anon public* en `supabase-config.js`. (Nunca la `service_role`.)
6. Sube todo a tu hosting. Entra a `tudominio/panel-x7k2.html` (puedes renombrarlo a algo que solo tú sepas; no lo enlaces desde la página).

## Uso del panel
Título, etiqueta, resumen, portada (sube la foto) y texto. En el texto: párrafos separados por línea en blanco, `## Subtítulo`, listas con `- ` y el botón "Insertar imagen en el texto". Desde la lista puedes editar, ocultar/publicar y borrar.

## Seguridad
La protección real son las reglas RLS de `supabase.sql`: aunque alguien vea el código o encuentre el panel, el servidor solo acepta escrituras de tu correo. Activa verificación en dos pasos en tu cuenta de Supabase y usa una contraseña única.
