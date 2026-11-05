const $ = (id) => document.getElementById(id);
let editId = null;

const aviso = (t, err) => { const e = $("a-estado"); e.textContent = t; e.className = err ? "error" : ""; };

// ---------- Sesión ----------
function mostrar(on) {
  $("login").classList.toggle("hidden", on);
  $("editor").classList.toggle("hidden", !on);
  $("lista-sec").classList.toggle("hidden", !on);
  if (on) cargar();
}
sb.auth.getSession().then(({ data }) => mostrar(!!data.session));

$("form-login").addEventListener("submit", async (e) => {
  e.preventDefault();
  const { error } = await sb.auth.signInWithPassword({ email: $("l-correo").value.trim(), password: $("l-clave").value });
  $("l-estado").textContent = error ? "Correo o contraseña incorrectos." : "";
  if (!error) { $("l-clave").value = ""; mostrar(true); }
});
$("salir").addEventListener("click", async () => { await sb.auth.signOut(); mostrar(false); });

// ---------- Imágenes (Storage) ----------
async function subir(file) {
  const ext = (file.name.split(".").pop() || "jpg").toLowerCase().replace(/[^a-z0-9]/g, "");
  const ruta = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${ext}`;
  const { error } = await sb.storage.from("blog-images").upload(ruta, file, { contentType: file.type });
  if (error) throw error;
  return sb.storage.from("blog-images").getPublicUrl(ruta).data.publicUrl;
}

$("f-portada-file").addEventListener("change", async (e) => {
  const f = e.target.files[0];
  if (!f) return;
  $("f-portada-info").textContent = "Subiendo imagen…";
  try { $("f-portada").value = await subir(f); $("f-portada-info").textContent = "Portada lista: " + f.name; }
  catch { $("f-portada-info").textContent = "No se pudo subir la imagen."; }
});

$("btn-img").addEventListener("click", () => $("f-img-file").click());
$("f-img-file").addEventListener("change", async (e) => {
  const f = e.target.files[0];
  if (!f) return;
  aviso("Subiendo imagen…");
  try {
    const url = await subir(f);
    const ta = $("f-contenido"), pos = ta.selectionStart;
    const ins = `\n\n![Describe la imagen](${url})\n\n`;
    ta.value = ta.value.slice(0, pos) + ins + ta.value.slice(pos);
    aviso("Imagen insertada. Cambia “Describe la imagen” por una descripción.");
  } catch { aviso("No se pudo subir la imagen.", true); }
  e.target.value = "";
});

// ---------- Guardar ----------
function limpiar() {
  editId = null;
  $("form-post").reset();
  $("f-portada").value = "";
  $("f-portada-info").textContent = "";
  $("editor-titulo").textContent = "Nueva publicación";
  $("btn-guardar").textContent = "Guardar publicación";
}
$("btn-cancelar").addEventListener("click", () => { limpiar(); aviso(""); });

$("form-post").addEventListener("submit", async (e) => {
  e.preventDefault();
  const fila = {
    title: $("f-titulo").value.trim(),
    tag: $("f-tag").value.trim() || null,
    summary: $("f-resumen").value.trim(),
    content: $("f-contenido").value,
    cover_url: $("f-portada").value || null,
    published: $("f-pub").checked,
  };
  const q = editId ? sb.from("posts").update(fila).eq("id", editId) : sb.from("posts").insert(fila);
  const { error } = await q;
  if (error) { aviso("No se pudo guardar: " + error.message, true); return; }
  aviso("Publicación guardada.");
  limpiar();
  cargar();
});

// ---------- Lista ----------
async function cargar() {
  const cont = $("lista-admin");
  const { data, error } = await sb.from("posts").select("*").order("created_at", { ascending: false });
  cont.textContent = "";
  if (error) { cont.textContent = "No se pudieron cargar las publicaciones."; return; }
  if (!data.length) { cont.textContent = "Todavía no hay publicaciones."; return; }

  data.forEach((p) => {
    const fila = document.createElement("div");
    fila.className = "admin-row";
    const info = document.createElement("div");
    const a = document.createElement("a");
    a.href = "post.html?id=" + encodeURIComponent(p.id);
    a.textContent = p.title;
    info.append(a, document.createTextNode(p.published ? " · Publicada" : " · Borrador (oculta)"));
    const acts = document.createElement("div");
    acts.className = "acts";
    const mk = (txt, fn, cls = "") => {
      const b = document.createElement("button");
      b.type = "button"; b.className = "btn btn-sm " + cls; b.textContent = txt;
      b.addEventListener("click", fn);
      acts.append(b);
    };
    mk("Editar", () => {
      editId = p.id;
      $("f-titulo").value = p.title; $("f-tag").value = p.tag || ""; $("f-resumen").value = p.summary;
      $("f-contenido").value = p.content; $("f-portada").value = p.cover_url || "";
      $("f-portada-info").textContent = p.cover_url ? "Portada actual conservada (sube otra para cambiarla)." : "";
      $("f-pub").checked = p.published;
      $("editor-titulo").textContent = "Editando publicación";
      $("btn-guardar").textContent = "Guardar cambios";
      $("editor").scrollIntoView({ behavior: "smooth" });
    });
    mk(p.published ? "Ocultar" : "Publicar", async () => {
      await sb.from("posts").update({ published: !p.published }).eq("id", p.id); cargar();
    });
    mk("Borrar", async () => {
      if (!confirm("¿Borrar esta publicación? No se puede deshacer.")) return;
      await sb.from("posts").delete().eq("id", p.id); cargar();
    }, "btn-danger");
    fila.append(info, acts);
    cont.append(fila);
  });
}
