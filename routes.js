// routes.js
const express = require("express");
const router = express.Router();

// Memoria temporal para almacenar feedbacks
let feedbacks = [];

/**
 * POST /feedback
 * Recibe un feedback (nombre, calificación y opinión) y lo guarda en memoria.
 */
router.post("/feedback", (req, res) => {
  const { nombre, calificacion, opinion } = req.body;

  // Validación básica de campos
  if (!nombre || !calificacion || !opinion) {
    return res.status(400).json({
      message: "Todos los campos son obligatorios",
      success: false,
    });
  }

  // Crear un nuevo feedback
  const newFeedback = {
    id: Date.now(),
    nombre: nombre.trim(),
    calificacion: parseInt(calificacion),
    opinion: opinion.trim(),
    fecha: new Date().toLocaleString(),
  };

  // Guardar en el array
  feedbacks.push(newFeedback);

  // Respuesta creativa en español
  res.json({
    message: `🎉 ¡Gracias, ${nombre}! Tu opinión se convirtió en parte de la historia de este proyecto.`,
    success: true,
  });
});

/**
 * GET /feedbacks
 * Devuelve todos los feedbacks almacenados.
 */
router.get("/feedbacks", (req, res) => {
  res.json(feedbacks);
});

module.exports = router;
