// Formulario demostrativo: no envía nada a ningún servidor.
const form = document.getElementById("form-contacto")
const estado = document.getElementById("form-estado")

form.addEventListener("submit", (e) => {
    e.preventDefault();
    const nombre = form.nombre.value.trim();
    estado.textContent = `Gracias ${nombre}. Esto es una demostración: tu solicitud no se envió`;
    form.reset();
});