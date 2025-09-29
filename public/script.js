// ============== CONFIGURACIÓN INICIAL ==============

/**
 * Configuración de la URL base del API
 * Si estamos en localhost, usa http://localhost:3000
 * Si estamos en producción, usa la URL actual del sitio
 */
const API_BASE_URL =
  window.location.hostname === "localhost"
    ? "http://localhost:3000"
    : window.location.origin;

// Referencias a elementos del DOM que usaremos frecuentemente
const verComentariosBtn = document.getElementById("verComentariosBtn"); // Botón para mostrar/ocultar comentarios
const listaComentarios = document.getElementById("listaComentarios"); // Contenedor de la lista de comentarios
const opinionForm = document.getElementById("opinionForm"); // Formulario de opiniones
const mensajeDiv = document.getElementById("mensaje"); // Div para mostrar mensajes de éxito/error

/**
 * Manejo del envío del formulario de opiniones
 * Se ejecuta cuando el usuario envía el formulario
 */
opinionForm.addEventListener("submit", async (e) => {
  e.preventDefault(); // Previene el comportamiento por defecto del formulario

  // Obtiene y limpia los valores del formulario
  const nombre = document.getElementById("nombre").value.trim();
  const calificacion = document.getElementById("calificacion").value;
  const opinion = document.getElementById("opinion").value.trim();

  // Validación de campos obligatorios
  if (!nombre || !calificacion || !opinion) {
    mensajeDiv.innerHTML = "⚠️ Todos los campos son obligatorios";
    mensajeDiv.style.color = "var(--marron-elegante)";
    return;
  }

  try {
    // Envía la opinión al servidor
    const response = await fetch(`${API_BASE_URL}/feedback`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        nombre,
        calificacion: parseInt(calificacion),
        opinion,
      }),
    });

    const result = await response.json();

    // Manejo de respuesta exitosa
    if (result.success) {
      mensajeDiv.innerHTML = `✅ ${result.message}`;
      mensajeDiv.style.color = "var(--verde-esmeralda)";
      opinionForm.reset(); // Limpia el formulario
      // Si hay comentarios visibles, actualiza la lista
      if (listaComentarios.children.length > 0) {
        cargarComentarios();
      }
    } else {
      throw new Error(result.message);
    }
  } catch (error) {
    // Manejo de errores
    mensajeDiv.innerHTML = `❌ Error: ${error.message}`;
    mensajeDiv.style.color = "#e74c3c";
  }
});

/**
 * Función para cargar y mostrar los comentarios desde el servidor
 * Esta función se llama cuando se hace clic en "Ver comentarios" y después de enviar un nuevo comentario
 */
async function cargarComentarios() {
  try {
    // Obtiene los comentarios del servidor
    const response = await fetch(`${API_BASE_URL}/feedbacks`);
    const opiniones = await response.json();
    listaComentarios.innerHTML = ""; // Limpia la lista actual

    // Si no hay comentarios, muestra un mensaje
    if (opiniones.length === 0) {
      listaComentarios.innerHTML =
        '<li class="comentario-vacio">No hay comentarios todavía.</li>';
      return;
    }

    // Procesa y muestra cada comentario
    opiniones.forEach((op) => {
      const li = document.createElement("li");
      li.className = "comentario-item";
      // Crea una cadena de estrellas basada en la calificación
      const estrellas = "⭐".repeat(op.calificacion);

      // Estructura HTML para cada comentario
      li.innerHTML = `
        <div class="comentario-header">
          <strong class="comentario-nombre">${op.nombre}</strong>
          <span class="comentario-calificacion">${estrellas} (${
        op.calificacion
      }/5)</span>
        </div>
        <p class="comentario-texto">${op.opinion}</p>
        ${op.fecha ? `<small class="comentario-fecha">${op.fecha}</small>` : ""}
      `;

      listaComentarios.appendChild(li);
    });
  } catch (error) {
    // Manejo de errores al cargar comentarios
    listaComentarios.innerHTML =
      '<li class="comentario-error">❌ Error al cargar comentarios</li>';
  }
}

/**
 * Manejador del botón para mostrar/ocultar comentarios
 * Alterna la visibilidad de la lista de comentarios y actualiza el texto del botón
 */
verComentariosBtn.addEventListener("click", () => {
  if (listaComentarios.style.display === "block") {
    // Si los comentarios están visibles, los oculta
    listaComentarios.style.display = "none";
    verComentariosBtn.textContent = "Ver comentarios";
  } else {
    // Si los comentarios están ocultos, los muestra y los carga
    listaComentarios.style.display = "block";
    verComentariosBtn.textContent = "Ocultar comentarios";
    cargarComentarios();
  }
});

// ============== CARRUSEL DE IMÁGENES ==============

// Referencias a elementos del carrusel
const track = document.querySelector(".carousel-track"); // Contenedor de imágenes
const images = document.querySelectorAll(".carousel-track img"); // Todas las imágenes
const prevBtn = document.querySelector(".carousel-btn.prev"); // Botón anterior
const nextBtn = document.querySelector(".carousel-btn.next"); // Botón siguiente

// Variables de control del carrusel
let index = 0; // Índice de la imagen actual
const total = images.length; // Número total de imágenes

/**
 * Función para mostrar la imagen actual en el carrusel
 * Usa transformación CSS para mover el track horizontalmente
 */
function mostrarImagen() {
  track.style.transform = `translateX(-${index * 100}%)`;
}

/**
 * Función para mostrar la siguiente imagen
 * Incrementa el índice y usa el operador módulo para volver al inicio
 */
function siguiente() {
  index = (index + 1) % total;
  mostrarImagen();
}

/**
 * Función para mostrar la imagen anterior
 * Decrementa el índice y usa el operador módulo para volver al final
 */
function anterior() {
  index = (index - 1 + total) % total;
  mostrarImagen();
}

// Eventos para los botones del carrusel
nextBtn.addEventListener("click", siguiente);
prevBtn.addEventListener("click", anterior);

// Cambio automático de imagen cada 5 segundos
setInterval(siguiente, 5000);
