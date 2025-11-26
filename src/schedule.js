// =============== LỊCH XUẤT BẢN ===============

// Các phần tử DOM
const calendarEl = document.getElementById('calendar');
const monthLabel = document.getElementById('monthLabel');
const prevBtn = document.getElementById('prevBtn');
const nextBtn = document.getElementById('nextBtn');
const todayBtn = document.getElementById('todayBtn');

const dateInput = document.getElementById('dateInput');
const titleInput = document.getElementById('titleInput');
const channelInput = document.getElementById('channelInput');
const noteInput = document.getElementById('noteInput');
const addBtn = document.getElementById('addBtn');
const upcomingEl = document.getElementById('upcoming');

// State
let view = new Date();     // tháng đang xem
let selectedISO = null;    // ngày đang chọn

// Data (demo)
const events = {};

(function seedDemo(){
  const now = new Date();
  const d2 = new Date(now.getFullYear(), now.getMonth(), 2);
  const key = iso(d2);

  events[key] = [
    { title: "FB: Giới thiệu menu Noel", channel: "fb", note: "" }
  ];
})();

// =============== Một số hàm tiện ích ===============
function pad(n){ return String(n).padStart(2, "0"); }
function iso(d){
  return `${d.getFullYear()}-${pad(d.getMonth()+1)}-${pad(d.getDate())}`;
}
function channelClass(ch){
  return ch === "fb" ? "fb" :
         ch === "yt" ? "yt" :
         ch === "tt" ? "tt" : "web";
}

// =============== RENDER CALENDAR ===============
function renderCalendar(){
  monthLabel.textContent = `Tháng ${view.getMonth()+1} / ${view.getFullYear()}`;

  // xóa day cũ
  [...calendarEl.querySelectorAll(".day")].forEach(n => n.remove());

  const first = new Date(view.getFullYear(), view.getMonth(), 1);
  const startIdx = (first.getDay()+6) % 7; // quy đổi CN về cuối tuần
  const daysInMonth = new Date(view.getFullYear(), view.getMonth()+1, 0).getDate();
  const total = 42; // 6 hàng

  for(let i = 0; i < total; i++){
    const dayCell = document.createElement("div");
    dayCell.className = "day";

    const dayNum = i - startIdx + 1;
    if(dayNum > 0 && dayNum <= daysInMonth){
      const dateObj = new Date(view.getFullYear(), view.getMonth(), dayNum);
      const key = iso(dateObj);

      // số ngày
      const label = document.createElement("div");
      label.className = "day-number";
      label.textContent = dayNum;
      dayCell.appendChild(label);

      // events
      (events[key] || []).forEach(ev=>{
        const evDiv = document.createElement("div");
        evDiv.className = `event ${channelClass(ev.channel)}`;
        evDiv.textContent = ev.title;
        evDiv.title = ev.note;
        dayCell.appendChild(evDiv);
      });

      // click chọn ngày
      dayCell.addEventListener("click", ()=>{
        selectedISO = key;
        dateInput.value = key;
        highlightSelected(key);
      });

      // highlight hôm nay
      if(key === iso(new Date())){
        dayCell.style.boxShadow = "inset 0 0 0 2px var(--blue-500)";
      }

    } else {
      dayCell.style.background = "#F8FAFC";
    }

    calendarEl.appendChild(dayCell);
  }

  renderUpcoming();
}

function highlightSelected(key){
  calendarEl.querySelectorAll(".day").forEach(c => c.classList.remove("selected"));

  const d = new Date(key);
  if(d.getMonth() !== view.getMonth()) return;

  const idx = ((d.getDay()+6)%7) + (d.getDate()-1);
  const cells = calendarEl.querySelectorAll(".day");
  if(cells[idx]) cells[idx].classList.add("selected");
}

function renderUpcoming(){
  const today = new Date();
  const list = [];

  for(const k in events){
    const dt = new Date(k);
    if(dt >= new Date(today.getFullYear(), today.getMonth(), today.getDate())){
      (events[k] || []).forEach(ev=>{
        list.push({ date: k, ...ev });
      });
    }
  }

  list.sort((a,b)=> a.date.localeCompare(b.date));

  upcomingEl.innerHTML =
    list.length === 0
    ? `<div style="color:var(--text-2)">Chưa có sự kiện sắp tới.</div>`
    : list.slice(0,8).map(ev=>`
      <div style="
        border:1px solid var(--border);
        border-radius:10px;
        padding:.5rem;
        margin:.4rem 0;
        display:flex;
        justify-content:space-between;
        gap:.5rem">
          <div>
            <strong>${ev.title}</strong>
            <div style="color:var(--text-2);font-size:.9rem">${ev.date}</div>
          </div>
          <span class="event ${channelClass(ev.channel)}" style="padding:.2rem .5rem">
            ${ev.channel.toUpperCase()}
          </span>
      </div>`).join("");
}

// =============== BUTTON EVENTS ===============
prevBtn.onclick = ()=>{
  view = new Date(view.getFullYear(), view.getMonth()-1, 1);
  renderCalendar();
};

nextBtn.onclick = ()=>{
  view = new Date(view.getFullYear(), view.getMonth()+1, 1);
  renderCalendar();
};

todayBtn.onclick = ()=>{
  view = new Date();
  renderCalendar();
};

addBtn.onclick = ()=>{
  const title = titleInput.value.trim();
  if(!title) return alert("Bạn chưa nhập tiêu đề!");

  const channel = channelInput.value;
  const dateStr = dateInput.value || selectedISO || iso(new Date());

  if(!events[dateStr]) events[dateStr] = [];
  events[dateStr].push({
    title,
    channel,
    note: noteInput.value.trim()
  });

  // reset form
  titleInput.value = "";
  noteInput.value = "";

  const d = new Date(dateStr);
  view = new Date(d.getFullYear(), d.getMonth(), 1);
  renderCalendar();
};

// =============== INIT ===============
(function init(){
  const now = new Date();
  dateInput.value = iso(now);

  view = new Date(now.getFullYear(), now.getMonth(), 1);
  renderCalendar();
})();
