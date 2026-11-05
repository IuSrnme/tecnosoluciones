// ---------- Utilidades ----------
const esc = (s) => String(s ?? "").replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
const fecha = (iso) => new Date(iso).toLocaleDateString("es-CO", { day: "numeric", month: "long", year: "numeric" });
const portada = (url, alt = "") =>
  /^https:\/\//.test(url || "")
    ? `<figure class="post-media"><img src="${esc(url)}" alt="${esc(alt)}" width="1280" height="720" onerror="this.remove()"></figure>`
    : "";

// Convierte el texto del admin en HTML seguro (todo se escapa primero).
function renderTexto(texto) {
  return esc(texto)
    .split(/\n{2,}/)
    .map((b) => {
      b = b.trim();
      if (!b) return "";
      let m;
      if ((m = b.match(/^## (.+)$/))) return `<h2>${m[1]}</h2>`;
      if (/^- /.test(b)) return "<ul>" + b.split("\n").map((l) => `<li>${l.replace(/^- /, "")}</li>`).join("") + "</ul>";
      if ((m = b.match(/^!\[(.*)\]\((https:\/\/[^\s)]+)\)$/)))
        return `<figure><img src="${m[2]}" alt="${m[1]}" loading="lazy"></figure>`;
      return `<p>${b.replace(/\n/g, "<br>")}</p>`;
    })
    .join("");
}

function tarjeta(p, destacada) {
  return `<article class="post ${destacada ? "post-featured" : "post-card"}">
    ${portada(p.cover_url, p.title)}
    <div class="post-body">
      <div class="post-meta">${p.tag ? `<span class="post-tag">${esc(p.tag)}</span>` : ""}<time datetime="${esc(p.created_at)}">${fecha(p.created_at)}</time></div>
      ${destacada ? "<h2>" : "<h3>"}${esc(p.title)}${destacada ? "</h2>" : "</h3>"}
      <p>${esc(p.summary)}</p>
      <a class="post-link" href="post.html?id=${encodeURIComponent(p.id)}">Leer completo</a>
    </div></article>`;
}

// ---------- Lista de publicaciones (blog.html) ----------
(async function () {
  const lista = document.getElementById("lista");
  if (!lista) return;
  const estado = document.getElementById("blog-estado");
  const { data, error } = await sb
    .from("posts")
    .select("id,title,summary,tag,cover_url,created_at")
    .eq("published", true)
    .order("created_at", { ascending: false });

  if (error) { estado.textContent = "No pudimos cargar las publicaciones. Inténtalo más tarde."; return; }
  if (!data.length) { estado.textContent = "Aún no hay publicaciones. ¡Vuelve pronto!"; return; }

  estado.remove();
  const dest = document.getElementById("destacado");
  dest.innerHTML = tarjeta(data[0], true);
  dest.classList.remove("hidden");
  if (data.length > 1) {
    lista.innerHTML = data.slice(1).map((p) => tarjeta(p, false)).join("");
    document.getElementById("publicaciones").classList.remove("hidden");
  }
})();

// ---------- Publicación individual (post.html) ----------
(async function () {
  const cuerpo = document.getElementById("p-cuerpo");
  if (!cuerpo) return;
  const id = new URLSearchParams(location.search).get("id");
  const titulo = document.getElementById("p-titulo");
  const { data, error } = id
    ? await sb.from("posts").select("*").eq("id", id).maybeSingle()
    : { data: null, error: null };

  if (error || !data) {
    titulo.textContent = "Publicación no encontrada";
    cuerpo.innerHTML = '<p>Es posible que haya sido retirada. <a href="blog.html">Ver todas las noticias</a>.</p>';
    return;
  }
  document.title = `${data.title} - TecnoSoluciones`;
  titulo.textContent = data.title;
  document.getElementById("p-resumen").textContent = data.summary;
  const tag = document.getElementById("p-tag");
  data.tag ? (tag.textContent = data.tag) : tag.remove();
  const t = document.getElementById("p-fecha");
  t.textContent = fecha(data.created_at);
  t.dateTime = data.created_at;
  document.getElementById("p-portada").innerHTML = portada(data.cover_url, data.title);
  cuerpo.innerHTML = renderTexto(data.content);
})();
