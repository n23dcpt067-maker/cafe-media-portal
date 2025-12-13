const http = require("http");

let livestreamStatus = "stopped";
let chatMessages = [];

const server = http.createServer((req, res) => {
  console.log("URL:", req.url, "METHOD:", req.method);

  res.setHeader("Content-Type", "application/json");
  res.setHeader("Access-Control-Allow-Origin", "*");

  // Livestream status
  if (req.method === "GET" && req.url === "/api/livestream/status") {
    return res.end(JSON.stringify({ status: livestreamStatus }));
  }

  // Start livestream
  if (req.method === "GET" && req.url === "/api/livestream/start") {
    livestreamStatus = "running";
    return res.end(JSON.stringify({ message: "Livestream started" }));
  }

  // Stop livestream
  if (req.method === "GET" && req.url === "/api/livestream/stop") {
    livestreamStatus = "stopped";
    return res.end(JSON.stringify({ message: "Livestream stopped" }));
  }

  // Chat GET
  if (req.method === "GET" && req.url === "/api/chat") {
    return res.end(JSON.stringify(chatMessages));
  }

  // Chat POST
  if (req.method === "POST" && req.url === "/api/chat") {
    let body = "";
    req.on("data", chunk => body += chunk);
    req.on("end", () => {
      const data = JSON.parse(body);
      chatMessages.push({
        user: data.user,
        message: data.message,
        time: new Date()
      });
      res.end(JSON.stringify({ success: true }));
    });
    return;
  }

  // SEO API
  if (req.method === "GET" && req.url === "/api/seo") {
    return res.end(JSON.stringify({
      title: "Cafe Media",
      description: "SEO data for frontend",
      keywords: ["cafe", "media", "livestream"]
    }));
  }

  // Not found
  res.statusCode = 404;
  res.end(JSON.stringify({ error: "API not found" }));
});

server.listen(3000, () => {
  console.log("✅ Server running at http://localhost:3000");
});
