const express = require("express");
const cors = require("cors");
const connectDB = require("./config/db");

const app = express();

// Middlewares
app.use(cors());
app.use(express.json());

// Fake DB
let livestreams = [];

// Routes
app.post("/api/livestream/start", (req, res) => {
  const { title } = req.body;

  const newLive = {
    id: livestreams.length + 1,
    title,
    startedAt: new Date(),
  };

  livestreams.push(newLive);

  res.json({
    message: "Livestream started successfully!",
    data: newLive,
  });
});

app.get("/api/livestream/list", (req, res) => {
  res.json(livestreams);
});

// Start server
app.listen(5000, () => {
  connectDB();
  console.log("Server running on port 5000");
});

