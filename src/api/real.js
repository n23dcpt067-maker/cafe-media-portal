const API_BASE = import.meta.env.VITE_API_URL || "https://api.your-domain.com";

export async function getDashboardData() {
  const res = await fetch(`${API_BASE}/dashboard`);
  if (!res.ok) throw new Error("Failed to fetch dashboard");
  return res.json();
}

export async function getTodayEvents() {
  const res = await fetch(`${API_BASE}/events/today`);
  if (!res.ok) throw new Error("Failed to fetch events");
  return res.json();
}
