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