const { Server } = require("socket.io");

let clients = {};
global.ioInstance = null;  // 🔥 Se hace global para que esté disponible en todos lados

const configureSockets = (server) => {
    const io = new Server(server, {
        cors: { origin: "*", methods: ["GET", "POST"], credentials: true },
        transports: ["websocket", "polling"],
    });

    global.ioInstance = io; // 🔥 Ahora está disponible en `global.ioInstance`

    console.log("✅ ioInstance ha sido inicializado correctamente.");

    io.on("connection", (socket) => {
        console.log(`✅ Usuario conectado: ${socket.id}`);

        socket.onAny((event, ...args) => {
            console.log(`📩 Evento recibido: ${event}`, args);
        });

        socket.on("subscribe", (userId) => {
            if (!userId) {
                console.log("❌ Error: userId no proporcionado");
                return;
            }
            clients[userId] = socket.id;
            console.log(`✅ Usuario ${userId} suscrito con socket ${socket.id}`);
            socket.emit("subscribed", { userId, socketId: socket.id });
        });

        socket.on("disconnect", (reason) => {
            console.log(`❌ Usuario desconectado: ${socket.id}, razón: ${reason}`);
            Object.keys(clients).forEach((userId) => {
                if (clients[userId] === socket.id) {
                    delete clients[userId];
                }
            });
        });
    });

    return io;
};

// ✅ Función para obtener `ioInstance` en cualquier parte del código
const getIoInstance = () => global.ioInstance;

// ✅ Función para establecer `ioInstance` manualmente
const setIoInstance = (io) => {
    global.ioInstance = io;
    console.log("✅ ioInstance ha sido manualmente establecido.");
};

// ✅ Función para enviar notificaciones
const sendNotification = (userId, message) => {
    console.log(`📢 Intentando enviar mensaje a usuario ${userId}`);

    if (!global.ioInstance) {
        console.log("❌ Error: ioInstance no está definido");
        return;
    }

    console.log("✅ ioInstance está definido correctamente.");

    const socketId = clients[userId];
    console.log(`🔍 Buscando usuario ${userId} en clients:`, clients);

    if (socketId) {
        global.ioInstance.to(socketId).emit("notification", message);
        console.log(`✅ Notificación enviada a usuario ${userId}: ${message}`);
    } else {
        console.log(`❌ Usuario ${userId} no está conectado.`);
    }
};

// ✅ Exportamos `getIoInstance`
module.exports = { configureSockets, sendNotification, setIoInstance, getIoInstance };
