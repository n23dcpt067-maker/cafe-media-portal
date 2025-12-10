export async function getDashboardData() {
  await new Promise(r => setTimeout(r, 300));

  return {
    posts: 124,
    livestreams: 18,
    views: 48200,
    seoScore: 87,
  };
}

export async function getTodayEvents() {
  await new Promise(r => setTimeout(r, 200));

  return [
    { type: "live", title: "Livestream “Giới thiệu sản phẩm mới”", time: "09:00 • YouTube + TikTok" },
    { type: "post", title: "Bài viết “5 công thức cà phê mùa đông”", time: "10:00 • Web + Facebook" },
  ];
}
// ================== MOCK API CHO EDITOR ==================

let mockArticles = [];
let mockComments = {}; // { [articleId]: [ { id, author, text, createdAt, target } ] }

function randomId(prefix = "art") {
  return `${prefix}_${Date.now()}_${Math.floor(Math.random() * 1000)}`;
}

/**
 * Tạo / cập nhật nháp bài viết
 * Nếu có payload.id -> update
 * Nếu chưa có -> tạo mới
 */
export async function saveDraft(payload) {
  await new Promise(r => setTimeout(r, 200));

  let article;
  if (payload.id) {
    const idx = mockArticles.findIndex(a => a.id === payload.id);
    if (idx >= 0) {
      article = {
        ...mockArticles[idx],
        ...payload,
        status: payload.status || mockArticles[idx].status || "draft",
        updatedAt: new Date().toISOString(),
      };
      mockArticles[idx] = article;
    } else {
      article = {
        ...payload,
        id: payload.id,
        status: payload.status || "draft",
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      mockArticles.push(article);
    }
  } else {
    article = {
      ...payload,
      id: randomId("art"),
      status: payload.status || "draft",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    mockArticles.push(article);
  }

  return article;
}

export async function getArticle(id) {
  await new Promise(r => setTimeout(r, 150));
  const art = mockArticles.find(a => a.id === id);
  if (!art) throw new Error("Không tìm thấy bài viết");
  return art;
}

export async function submitArticle(id, extra = {}) {
  await new Promise(r => setTimeout(r, 200));
  const idx = mockArticles.findIndex(a => a.id === id);
  if (idx < 0) throw new Error("Không tìm thấy bài viết để gửi duyệt");

  mockArticles[idx] = {
    ...mockArticles[idx],
    status: "pending_review",
    updatedAt: new Date().toISOString(),
    ...extra,
  };
  return mockArticles[idx];
}

// ========= COMMENTS =========

export async function getComments(articleId) {
  await new Promise(r => setTimeout(r, 150));
  return mockComments[articleId] || [];
}

export async function addComment(articleId, comment) {
  await new Promise(r => setTimeout(r, 150));
  if (!mockComments[articleId]) mockComments[articleId] = [];

  const newCmt = {
    id: randomId("cmt"),
    author: comment.author || "Bạn",
    text: comment.text,
    target: comment.target || "",
    createdAt: new Date().toISOString(),
  };

  mockComments[articleId].unshift(newCmt);
  return newCmt;
}
