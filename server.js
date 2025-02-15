require("dotenv").config();
const express = require("express");
const cors = require("cors");
const http = require("http");
const { configureSockets, setIoInstance, sendNotification } = require("./src/sockets");

const app = express();
const PORT = process.env.PORT || 4000;

const corsOptions = {
    origin: "*",
    methods: ["GET", "POST"],
    allowedHeaders: ["Content-Type"],
    credentials: true,
};

// Crear servidor HTTP
const server = http.createServer(app);

// Configurar CORS y JSON
app.use(cors(corsOptions));
app.use(express.json());

// Ruta de prueba
app.get("/", (req, res) => {
    res.json({ message: "Microservicio de Notificaciones Activo" });
});

// ruta para probar las notificaciones
app.get("/testNotification", (req, res) => {
    const userId = req.query.userId || "123"; // Si no se pasa userId, usa "123" por defecto
    const message = req.query.message || "¡Hola desde el backend!";

    console.log(`🔍 Prueba manual de sendNotification para el usuario ${userId}`);

    sendNotification(userId, message);
    res.json({ success: true, message: `Notificación enviada a ${userId}` });
});


// Configurar WebSockets correctamente
const io = configureSockets(server);
setIoInstance(io); // 🔥 Asegurar que ioInstance esté listo

// Iniciar servidor
server.listen(PORT, () => {
    console.log(`🚀 Servidor corriendo en puerto ${PORT}`);
});
