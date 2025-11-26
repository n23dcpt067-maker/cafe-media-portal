console.log("ok");
import { getDashboardData, getTodayEvents } from "./api/index.js";

async function init() {
  const data = await getDashboardData();
  console.log("Dashboard data:", data);

  const events = await getTodayEvents();
  console.log("Today events:", events);
}

init();
const createBtn = document.querySelector("#btn-create");

if (createBtn) {
  createBtn.addEventListener("click", () => {
    window.location.href = "/editor.html?from=dashboard";
  });
}
const userBtn = document.querySelector("#btn-user");

if (userBtn) {
  userBtn.addEventListener("click", () => {
    window.location.href = "/profile.html";
  });
}

