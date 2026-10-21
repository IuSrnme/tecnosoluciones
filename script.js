// ---------- Menú del celular ----------
const toggle = document.querySelector(".nav-toggle");
const menu = document.getElementById("menu");

if (toggle && menu) {
  toggle.addEventListener("click", () => {
    const abierto = menu.classList.toggle("open");
    toggle.setAttribute("aria-expanded", abierto);
    toggle.setAttribute("aria-label", abierto ? "Cerrar menú" : "Abrir menú");
  });

  // Cierra el menú al elegir una opción
  menu.querySelectorAll("a").forEach((enlace) => {
    enlace.addEventListener("click", () => {
      menu.classList.remove("open");
      toggle.setAttribute("aria-expanded", "false");
      toggle.setAttribute("aria-label", "Abrir menú");
    });
  });
}

// ---------- Formulario demostrativo ----------
// No envía nada a ningún servidor.
const form = document.getElementById("form-contacto");
const estado = document.getElementById("form-estado");

if (form && estado) {
  form.addEventListener("submit", (e) => {
    e.preventDefault();
    const nombre = form.nombre.value.trim();
    estado.textContent = `Gracias, ${nombre}. Esto es una demostración: tu solicitud no se envió.`;
    form.reset();
  });
}

// ---------- Selector personalizado (despliegue con esquinas redondeadas) ----------
(function () {
  const wrap = document.querySelector(".select");
  if (!wrap) return;
  const native = wrap.querySelector("select");
  const btn = document.createElement("button");
  btn.type = "button";
  btn.className = "select-btn";
  btn.setAttribute("role", "combobox");
  btn.setAttribute("aria-haspopup", "listbox");
  btn.setAttribute("aria-expanded", "false");
  btn.setAttribute("aria-controls", native.id + "-list");
  const list = document.createElement("ul");
  list.className = "select-list";
  list.id = native.id + "-list";
  list.setAttribute("role", "listbox");
  let active = native.selectedIndex;

  [...native.options].forEach((o, i) => {
    const li = document.createElement("li");
    li.setAttribute("role", "option");
    li.id = `${native.id}-opt-${i}`;
    li.textContent = o.textContent;
    li.addEventListener("click", () => { choose(i); close(); btn.focus(); });
    list.appendChild(li);
  });
  wrap.append(btn, list);
  wrap.classList.add("is-enhanced");
  native.tabIndex = -1;
  native.setAttribute("aria-hidden", "true");
  const opts = [...list.children];

  function isOpen() { return wrap.classList.contains("open"); }
  function paint() {
    btn.textContent = native.options[native.selectedIndex].textContent;
    opts.forEach((li, i) => {
      li.setAttribute("aria-selected", i === native.selectedIndex);
      li.classList.toggle("active", i === active);
    });
    btn.setAttribute("aria-activedescendant", isOpen() ? opts[active].id : "");
  }
  function choose(i) { native.selectedIndex = i; active = i; paint(); }
  function open() { wrap.classList.add("open"); btn.setAttribute("aria-expanded", "true"); active = native.selectedIndex; paint(); }
  function close() { wrap.classList.remove("open"); btn.setAttribute("aria-expanded", "false"); paint(); }

  btn.addEventListener("click", () => (isOpen() ? close() : open()));
  btn.addEventListener("keydown", (e) => {
    if (e.key === "ArrowDown" || e.key === "ArrowUp") {
      e.preventDefault();
      if (!isOpen()) { open(); return; }
      active = Math.max(0, Math.min(opts.length - 1, active + (e.key === "ArrowDown" ? 1 : -1)));
      paint();
    } else if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      if (isOpen()) { choose(active); close(); } else { open(); }
    } else if (e.key === "Escape" && isOpen()) {
      e.preventDefault(); close();
    } else if (e.key === "Tab" && isOpen()) {
      close();
    }
  });
  document.addEventListener("click", (e) => { if (!wrap.contains(e.target)) close(); });
  const label = document.querySelector(`label[for="${native.id}"]`);
  if (label) label.addEventListener("click", () => btn.focus());
  native.form.addEventListener("reset", () => setTimeout(() => { active = native.selectedIndex; paint(); }));
  paint();
})();