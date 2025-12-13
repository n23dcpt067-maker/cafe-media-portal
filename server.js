const http = require("http");

let livestreamStatus = "stopped";
let chatMessages = [];

const server = http.createServer((req, res) => {
  res.setHeader("Content-Type", "application/json");
  res.setHeader("Access-Control-Allow-Origin", "*");

  if (req.url === "/api/livestream/start" && req.method === "POST") {
    livestreamStatus = "live";
    res.end(JSON.stringify({ message: "Livestream started" }));
  }

  else if (req.url === "/api/livestream/stop" && req.method === "POST") {
    livestreamStatus = "stopped";
    res.end(JSON.stringify({ message: "Livestream stopped" }));
  }

  else if (req.url === "/api/livestream/status" && req.method === "GET") {
    res.end(JSON.stringify({ status: livestreamStatus }));
  }

  else if (req.url === "/api/chat" && req.method === "GET") {
    res.end(JSON.stringify(chatMessages));
  }

  else if (req.url === "/api/chat" && req.method === "POST") {
    let body = "";

    req.on("data", chunk => {
      body += chunk;
    });

    req.on("end", () => {
      const data = JSON.parse(body);
      chatMessages.push({
        message: data.message,
        time: new Date()
      });
      res.end(JSON.stringify({ message: "Chat message added" }));
    });
  }

  else {
    res.statusCode = 404;
    res.end(JSON.stringify({ error: "API not found" }));
  }
});

server.listen(3000, () => {
  console.log("✅ Server running at http://localhost:3000");
});
