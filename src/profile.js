console.log("Profile page loaded");

// ===========================
// ELEMENTS
// ===========================
const avatarInput = document.getElementById("avatarInput");
const avatarPreview = document.getElementById("avatarPreview");
const avatarInitial = document.getElementById("avatarInitial");
const removeAvatarBtn = document.getElementById("removeAvatarBtn");

const fullNameInput = document.getElementById("fullNameInput");
const emailInput = document.getElementById("emailInput");

const logoutTop = document.getElementById("logoutTop");

const toggles = document.querySelectorAll(".toggle input");

const saveBtn = document.querySelector(".card .btn.primary.full");

// KEY localStorage
const PROFILE_KEY = "user-profile-data";

// ===========================
// LOAD EXISTING DATA
// ===========================
function loadProfile() {
  const raw = localStorage.getItem(PROFILE_KEY);
  if (!raw) return;

  const data = JSON.parse(raw);

  if (data.fullname) fullNameInput.value = data.fullname;
  if (data.email) emailInput.value = data.email;

  if (data.avatar) {
    avatarPreview.style.background = "none";
    avatarPreview.innerHTML = `<img src="${data.avatar}" />`;
  }

  if (data.toggles) {
    toggles.forEach((tg, i) => {
      tg.checked = data.toggles[i];
    });
  }
}

loadProfile();

// ===========================
// SAVE PROFILE
// ===========================
function saveProfile() {
  const data = {
    fullname: fullNameInput.value.trim(),
    email: emailInput.value.trim(),
    avatar: null,
    toggles: Array.from(toggles).map(t => t.checked)
  };

  const img = avatarPreview.querySelector("img");
  if (img) data.avatar = img.src;

  localStorage.setItem(PROFILE_KEY, JSON.stringify(data));

  alert("Đã lưu thay đổi!");
}

if (saveBtn) saveBtn.addEventListener("click", saveProfile);

// ===========================
// AVATAR UPLOAD
// ===========================
avatarInput?.addEventListener("change", e => {
  const file = e.target.files?.[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onload = () => {
    avatarPreview.style.background = "none";
    avatarPreview.innerHTML = `<img src="${reader.result}" />`;
  };
  reader.readAsDataURL(file);
});

// ===========================
// REMOVE AVATAR
// ===========================
removeAvatarBtn?.addEventListener("click", () => {
  avatarPreview.innerHTML = `<span id="avatarInitial">${fullNameInput.value.charAt(0) || "A"}</span>`;
  avatarPreview.style.background = "#F1F5F9";
});

// ===========================
// TOPBAR LOGOUT → VỀ auth.html
// ===========================
logoutTop?.addEventListener("click", () => {
  const ok = confirm("Bạn có chắc muốn đăng xuất?");
  if (!ok) return;

  // sau này backend sẽ xoá token, session...
  // ở bản demo này mình chỉ chuyển trang
  window.location.href = "/auth.html";
});
