// backend/server.js
const express = require("express");
const cors = require("cors");

const app = express();
const PORT = 5000;

// Cho phép frontend gọi API
app.use(cors());

// Cho phép backend đọc JSON trong body request
app.use(express.json());

// ==========================
// DATA GIẢ LƯU TRONG RAM
// (chưa dùng database, tắt server là mất dữ liệu)
// ==========================
let campaigns = [
  {
    id: 1,
    name: "Noel 2025 – Ấm cùng Cà phê",
    start: "2025-12-01",
    end: "2025-12-25",
    channel: "Facebook, TikTok",
    goal: "Tăng 25% tương tác",
    status: "Đang chạy",
    desc: "Chiến dịch lan tỏa thương hiệu dịp Giáng sinh.",
    progress: 60,
  },
];

// Tạo biến id tăng dần
let nextId = 2;

// ==========================
// 1) GET /api/campaigns
//    → Lấy danh sách chiến dịch
// ==========================
app.get("/api/campaigns", (req, res) => {
  res.json(campaigns);
});

// ==========================
// 2) POST /api/campaigns
//    → Tạo chiến dịch mới
// ==========================
app.post("/api/campaigns", (req, res) => {
  const { name, start, end, channel, goal, desc } = req.body;

  if (!name || !start || !end) {
    return res.status(400).json({
      message: "Thiếu name / start / end",
    });
  }

  const newCampaign = {
    id: nextId++,
    name,
    start,
    end,
    channel: channel || "",
    goal: goal || "",
    desc: desc || goal || "",
    status: "Chuẩn bị",
    progress: Math.floor(Math.random() * 40) + 10,
  };

  campaigns.push(newCampaign);

  res.status(201).json(newCampaign);
});

// ==========================
// 3) PUT /api/campaigns/:id
//    → Sửa chiến dịch
// ==========================
app.put("/api/campaigns/:id", (req, res) => {
  const id = Number(req.params.id);
  const idx = campaigns.findIndex((c) => c.id === id);

  if (idx === -1) {
    return res.status(404).json({ message: "Không tìm thấy campaign" });
  }

  const { name, start, end, channel, goal, desc, status, progress } = req.body;

  campaigns[idx] = {
    ...campaigns[idx],
    // chỉ update nếu có giá trị mới
    name: name ?? campaigns[idx].name,
    start: start ?? campaigns[idx].start,
    end: end ?? campaigns[idx].end,
    channel: channel ?? campaigns[idx].channel,
    goal: goal ?? campaigns[idx].goal,
    desc: desc ?? campaigns[idx].desc,
    status: status ?? campaigns[idx].status,
    progress:
      typeof progress === "number" ? progress : campaigns[idx].progress,
  };

  res.json(campaigns[idx]);
});

// ==========================
// 4) DELETE /api/campaigns/:id
//    → Xoá chiến dịch
// ==========================
app.delete("/api/campaigns/:id", (req, res) => {
  const id = Number(req.params.id);
  const idx = campaigns.findIndex((c) => c.id === id);

  if (idx === -1) {
    return res.status(404).json({ message: "Không tìm thấy campaign" });
  }

  campaigns.splice(idx, 1);

  res.json({ success: true });
});

// ==========================
// Server listen
// ==========================
app.listen(PORT, () => {
  console.log(`✅ Campaign API server đang chạy tại http://localhost:${PORT}`);
});
