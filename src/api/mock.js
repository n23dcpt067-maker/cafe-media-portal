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
