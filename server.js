const express = require('express');
const path = require('path');
const app = express();

const PORT = process.env.PORT || 3000;

// Servir archivos estáticos en la raíz del proyecto
app.use(express.static(__dirname));

// Asegurar que cualquier ruta cargue el index.html (SPA routing)
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

app.listen(PORT, () => {
  console.log(`Servidor de SerAdulto corriendo exitosamente en el puerto ${PORT}`);
});
