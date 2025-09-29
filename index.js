// index.js
const express = require("express");
const cors = require("cors");
const path = require("path");
const routes = require("./routes");

const app = express();
const PORT = process.env.PORT || 3000;

// Habilitar CORS (útil para despliegues en Render u otros entornos)
app.use(cors());

// Middleware para parsear JSON y formularios
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Servir archivos estáticos desde la carpeta /public
app.use(express.static(path.join(__dirname, "public")));

// Usar las rutas definidas en routes.js
app.use("/", routes);

// Fallback: cualquier otra ruta devuelve index.html
app.get(/.*/, (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

// Arrancar el servidor
app.listen(PORT, () => {
  console.log(`✅ Server is running on port ${PORT}`);
});
