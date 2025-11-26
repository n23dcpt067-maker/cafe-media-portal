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
// LOAD EXISTING CAMPAIGNS
// ===========================
function loadCampaigns() {
  const data = JSON.parse(localStorage.getItem("campaigns") || "[]");
  renderCampaignList(data);
}

function saveCampaigns(list) {
  localStorage.setItem("campaigns", JSON.stringify(list));
}

// ===========================
// CREATE CAMPAIGN
// ===========================
btnCreate.addEventListener("click", () => {
  const name = inputName.value.trim();
  const start = inputStart.value;
  const end = inputEnd.value;
  const channel = inputChannel.value;
  const goal = inputGoal.value.trim();

  if (!name || !start || !end) {
    alert("Vui lòng nhập đầy đủ tên chiến dịch, ngày bắt đầu và kết thúc.");
    return;
  }

  const list = JSON.parse(localStorage.getItem("campaigns") || "[]");

  const newCampaign = {
    id: Date.now(),
    name,
    start,
    end,
    channel,
    goal,
    progress: Math.floor(Math.random() * 40) + 10, // random tiến độ
    status: "Chuẩn bị",
    desc: goal || "Không có mô tả"
  };

  list.push(newCampaign);
  saveCampaigns(list);
  loadCampaigns();

  alert("Tạo chiến dịch thành công!");

  inputName.value = "";
  inputStart.value = "";
  inputEnd.value = "";
  inputGoal.value = "";
});

// ===========================
// RENDER LIST
// ===========================
function renderCampaignList(data) {
  if (!listEl) return;

  listEl.innerHTML = "";

  data.forEach(item => {
    const div = document.createElement("div");
    div.className = "campaign";

    div.innerHTML = `
      <div class="campaign-header">
        <h4>${item.name}</h4>
        <div class="tags">
          <div class="tag">${item.status}</div>
          <div class="tag">${item.channel}</div>
        </div>
      </div>

      <p>${item.desc}</p>

      <div class="metrics">
        <div>📅 ${item.start} – ${item.end}</div>
        <div>🎯 ${item.goal ? item.goal.substring(0, 50) + "..." : "Không có mục tiêu"}</div>
      </div>

      <div class="progress"><span style="width:${item.progress}%"></span></div>
    `;

    listEl.prepend(div);
  });
}

// ===========================
// INIT
// ===========================
loadCampaigns();
