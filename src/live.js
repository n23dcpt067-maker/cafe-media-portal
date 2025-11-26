console.log("Livestream page with webcam demo loaded");

// ELEMENTS
const videoEl = document.getElementById("liveVideo");
const previewStatus = document.querySelector(".preview .status");
const previewMeta = document.querySelector(".preview .meta");

// 4 nút trên header: Kiểm tra kết nối, Ghi hình, Go Live, Kết thúc
const headerBtns = document.querySelectorAll(".panel header .btn");
const [btnCheck, btnRecord, btnGoLive, btnEnd] = headerBtns;

// 5 nút control: Mute, Monitor, Share, Layout, Refresh
const controlBtns = document.querySelectorAll(".controls .btn");
const [btnMute, btnMonitor, btnShare, btnLayout, btnRefresh] = controlBtns;

// Chat
const chatList = document.querySelector(".chat .list");
const chatInput = document.querySelector(".chat footer input");
const btnChatSend = document.querySelector(".chat footer button");

// STATE
let stream = null;
let isLive = false;
let isMuted = false;
let isMonitoring = false;

// =============== CAMERA PREVIEW ===============
async function startPreview() {
  if (!videoEl) return;

  if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
    alert("Trình duyệt không hỗ trợ camera (getUserMedia).");
    return;
  }

  if (stream) {
    // đã có stream rồi
    return;
  }

  try {
    stream = await navigator.mediaDevices.getUserMedia({
      video: true,
      audio: true,
    });

    videoEl.srcObject = stream;
    videoEl.play?.();

    previewStatus.textContent = isLive ? "LIVE" : "PREVIEW";
    previewStatus.style.background = isLive ? "red" : "rgba(14,124,102,.9)";
    previewMeta.textContent = isLive
      ? "Đang phát • 1080p30 • Nguồn: Camera"
      : "Xem trước nguồn từ camera • 1080p30";

    // đảm bảo trạng thái mute khớp với UI
    updateMute();
  } catch (err) {
    console.error(err);
    alert("Không truy cập được camera/mic. Hãy kiểm tra quyền truy cập (cho phép camera & mic).");
  }
}

function stopStream() {
  if (stream) {
    stream.getTracks().forEach((t) => t.stop());
    stream = null;
  }
  if (videoEl) {
    videoEl.srcObject = null;
  }
}

function updateMute() {
  if (!stream) return;
  stream.getAudioTracks().forEach((t) => {
    t.enabled = !isMuted;
  });
}

// =============== BUTTON HANDLERS ===============

// Kiểm tra kết nối -> chỉ mở preview, không live
if (btnCheck) {
  btnCheck.addEventListener("click", () => {
    isLive = false;
    startPreview();
  });
}

// Go Live
if (btnGoLive) {
  btnGoLive.addEventListener("click", async () => {
    if (isLive) return;
    isLive = true;

    await startPreview();

    previewStatus.textContent = "LIVE";
    previewStatus.style.background = "red";
    previewMeta.textContent = "Đang phát • 1080p30 • Nguồn: Camera";

    btnGoLive.style.opacity = "0.5";
    btnGoLive.style.pointerEvents = "none";
  });
}

// Kết thúc live
if (btnEnd) {
  btnEnd.addEventListener("click", () => {
    if (!isLive && !stream) return;

    isLive = false;
    previewStatus.textContent = "ENDED";
    previewStatus.style.background = "#475569";
    previewMeta.textContent = "Luồng đã kết thúc (demo)";

    stopStream();

    if (btnGoLive) {
      btnGoLive.style.opacity = "1";
      btnGoLive.style.pointerEvents = "auto";
    }
  });
}

// Ghi hình (demo)
if (btnRecord) {
  btnRecord.addEventListener("click", () => {
    alert("Demo: nút Ghi hình, sau này có thể gắn MediaRecorder để lưu file.");
  });
}

// Mute mic
if (btnMute) {
  btnMute.addEventListener("click", () => {
    isMuted = !isMuted;
    btnMute.textContent = isMuted ? "🔇 Mic muted" : "🎙️ Mute mic";
    btnMute.style.background = isMuted ? "#fee2e2" : "#fff";
    btnMute.style.borderColor = isMuted ? "#ef4444" : "var(--border)";
    updateMute();
  });
}

// Monitor (demo)
if (btnMonitor) {
  btnMonitor.addEventListener("click", () => {
    isMonitoring = !isMonitoring;
    btnMonitor.style.background = isMonitoring ? "#e0f2fe" : "#fff";
    btnMonitor.style.borderColor = isMonitoring ? "#38bdf8" : "var(--border)";
    btnMonitor.textContent = isMonitoring
      ? "🎧 Monitoring..."
      : "🎧 Monitor";
  });
}

// Share screen (demo)
if (btnShare) {
  btnShare.addEventListener("click", () => {
    alert("Demo: sau này có thể dùng getDisplayMedia để share màn hình.");
  });
}

// Layout (demo)
if (btnLayout) {
  btnLayout.addEventListener("click", () => {
    alert("Demo: mở popup chọn layout khách mời.");
  });
}

// Refresh devices (demo)
if (btnRefresh) {
  btnRefresh.addEventListener("click", () => {
    alert("Demo: làm mới danh sách thiết bị.");
  });
}

// =============== CHAT ===============
if (btnChatSend && chatInput && chatList) {
  const sendChat = () => {
    const text = chatInput.value.trim();
    if (!text) return;

    const now = new Date();
    const timeStr = now.toLocaleTimeString("vi-VN", {
      hour: "2-digit",
      minute: "2-digit",
    });

    const div = document.createElement("div");
    div.className = "msg";
    div.innerHTML = `
      <div class="meta"><strong>Bạn</strong> • Studio • ${timeStr}</div>
      <div>${text}</div>
    `;

    chatList.appendChild(div);
    chatList.scrollTop = chatList.scrollHeight;
    chatInput.value = "";
  };

  btnChatSend.addEventListener("click", sendChat);
  chatInput.addEventListener("keydown", (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      sendChat();
    }
  });
}
