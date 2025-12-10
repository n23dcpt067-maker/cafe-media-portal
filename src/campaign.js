const API_BASE = "http://localhost:5000/api";

console.log("Campaign page loaded");

// ===========================
// QUERY DOM
// ===========================
const listEl = document.querySelector(".campaign-list");
const btnCreate = document.querySelector(".right .btn.primary");

const inputName = document.querySelector('input[placeholder^="VD:"]');
const inputStart = document.querySelectorAll('.right input[type="date"]')[0];
const inputEnd = document.querySelectorAll('.right input[type="date"]')[1];
const inputChannel = document.querySelector(".right select");
const inputGoal = document.querySelector(".right textarea");

// ===========================
// LOAD CAMPAIGNS TỪ BACKEND
// ===========================
async function loadCampaigns() {
  try {
    const res = await fetch(`${API_BASE}/campaigns`);

    if (!res.ok) {
      throw new Error("Không tải được campaigns");
    }

    const data = await res.json();
    renderCampaignList(data);
  } catch (err) {
    console.error(err);
    alert("Lỗi khi tải danh sách chiến dịch.");
  }
}

// ===========================
// TẠO CHIẾN DỊCH (GỌI API)
// ===========================
btnCreate.addEventListener("click", async () => {
  const name = inputName.value.trim();
  const start = inputStart.value;
  const end = inputEnd.value;
  const channel = inputChannel.value;
  const goal = inputGoal.value.trim();

  if (!name || !start || !end) {
    alert("Vui lòng nhập đầy đủ tên chiến dịch, ngày bắt đầu và kết thúc.");
    return;
  }

  try {
    const res = await fetch(`${API_BASE}/campaigns`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name,
        start,
        end,
        channel,
        goal,
        desc: goal, // dùng mục tiêu làm mô tả ngắn
      }),
    });

    if (!res.ok) {
      throw new Error("Không tạo được chiến dịch");
    }

    await res.json();

    alert("Tạo chiến dịch thành công!");

    // Reset form
    inputName.value = "";
    inputStart.value = "";
    inputEnd.value = "";
    inputGoal.value = "";

    // Tải lại danh sách từ backend
    loadCampaigns();
  } catch (err) {
    console.error(err);
    alert("Có lỗi khi tạo chiến dịch, vui lòng thử lại.");
  }
});

// ===========================
// RENDER LIST
// ===========================
function renderCampaignList(data) {
  if (!listEl) return;

  listEl.innerHTML = "";

  data.forEach((item) => {
    const div = document.createElement("div");
    div.className = "campaign";

    div.innerHTML = `
      <div class="campaign-header">
        <h4>${item.name}</h4>
        <div class="tags">
          <div class="tag">${item.status || "Không rõ trạng thái"}</div>
          <div class="tag">${item.channel || "Không rõ kênh"}</div>
        </div>
      </div>

      <p>${item.desc || item.goal || "Không có mô tả"}</p>

      <div class="metrics">
        <div>📅 ${item.start} – ${item.end}</div>
        <div>🎯 ${
          item.goal ? item.goal.substring(0, 50) + "..." : "Không có mục tiêu"
        }</div>
      </div>

      <div class="progress">
        <span style="width:${item.progress || 10}%"></span>
      </div>
    `;

    listEl.prepend(div);
  });
}

// ===========================
// INIT
// ===========================
loadCampaigns();
