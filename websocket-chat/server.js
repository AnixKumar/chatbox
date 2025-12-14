const WebSocket = require("ws");

const wss = new WebSocket.Server({ port: 8080 });

// username -> websocket
const users = new Map();

console.log("WebSocket server running on ws://localhost:8080");

wss.on("connection", (ws) => {
  console.log("Client connected");

  ws.on("message", (data) => {
    const msg = JSON.parse(data.toString());

    // 1️⃣ Register user
    if (msg.type === "register") {
      users.set(msg.username, ws);
      ws.username = msg.username;
      console.log(`${msg.username} registered`);
      return;
    }

    // 2️⃣ Private chat
    if (msg.type === "chat") {
      const target = users.get(msg.to);
      if (target && target.readyState === WebSocket.OPEN) {
        target.send(
          JSON.stringify({
            from: ws.username,
            text: msg.text,
          })
        );
      }
    }
  });

  ws.on("close", () => {
    if (ws.username) {
      users.delete(ws.username);
      console.log(`${ws.username} disconnected`);
    }
  });
});