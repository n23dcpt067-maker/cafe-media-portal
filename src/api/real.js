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
// ================== REAL API CHO EDITOR ==================

export async function saveDraft(payload) {
  const method = payload.id ? "PUT" : "POST";
  const url = payload.id
    ? `${API_BASE}/articles/${encodeURIComponent(payload.id)}`
    : `${API_BASE}/articles`;

  const res = await fetch(url, {
    method,
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  if (!res.ok) throw new Error("Failed to save draft");
  return res.json();
}

export async function getArticle(id) {
  const res = await fetch(`${API_BASE}/articles/${encodeURIComponent(id)}`);
  if (!res.ok) throw new Error("Failed to fetch article");
  return res.json();
}

export async function submitArticle(id, extra = {}) {
  const res = await fetch(
    `${API_BASE}/articles/${encodeURIComponent(id)}/submit`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(extra),
    }
  );
  if (!res.ok) throw new Error("Failed to submit article");
  return res.json();
}

export async function getComments(articleId) {
  const res = await fetch(
    `${API_BASE}/articles/${encodeURIComponent(articleId)}/comments`
  );
  if (!res.ok) throw new Error("Failed to fetch comments");
  return res.json();
}

export async function addComment(articleId, comment) {
  const res = await fetch(
    `${API_BASE}/articles/${encodeURIComponent(articleId)}/comments`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(comment),
    }
  );
  if (!res.ok) throw new Error("Failed to add comment");
  return res.json();
}
