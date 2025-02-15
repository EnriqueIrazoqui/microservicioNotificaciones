const { io } = require("socket.io-client");

const socket = io("http://localhost:4000", {
  transports: ["websocket"],
  withCredentials: true
});

socket.on("connect", () => {
  console.log("✅ Conectado a WebSockets con ID:", socket.id);
  socket.emit("subscribe", "123");
});

socket.on("subscribed", (data) => {
  console.log("✅ Suscripción confirmada:", data);
});

socket.on("notification", (msg) => {
  console.log("🔔 Notificación recibida:", msg);
});

socket.on("disconnect", (reason) => {
  console.log("❌ Desconectado:", reason);
});

socket.on("connect_error", (err) => {
  console.error("🚨 Error de conexión:", err);
});
