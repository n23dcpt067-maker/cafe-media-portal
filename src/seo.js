console.log("SEO page loaded");

// =======================
// DATA DEMO
// =======================
export const pages = [
  {
    name: 'Trang chủ',
    url: '/',
    type: 'landing',
    seo: 88,
    speed: 1.1,
    issues: ['Thiếu heading H2 chứa từ khoá'],
    issuesCount: 1,
    lastAudit: '2025-11-10'
  },
  {
    name: 'Menu Noel 2025',
    url: '/menu/noel-2025',
    type: 'landing',
    seo: 79,
    speed: 1.5,
    issues: ['Ảnh dung lượng lớn', 'Thiếu mô tả ALT cho hình ảnh'],
    issuesCount: 2,
    lastAudit: '2025-11-09'
  },
  {
    name: 'Blog: 5 tips gọi món nhanh',
    url: '/blog/5-tips-goi-mon-nhanh',
    type: 'blog',
    seo: 84,
    speed: 1.3,
    issues: ['Meta description hơi ngắn'],
    issuesCount: 1,
    lastAudit: '2025-11-08'
  },
  {
    name: 'Landing: Đăng ký thành viên',
    url: '/membership',
    type: 'landing',
    seo: 72,
    speed: 2.0,
    issues: ['Thời gian phản hồi server cao', 'Nhiều script chưa tối ưu'],
    issuesCount: 2,
    lastAudit: '2025-11-07'
  },
  {
    name: 'Trang liên hệ',
    url: '/contact',
    type: 'other',
    seo: 90,
    speed: 1.0,
    issues: [],
    issuesCount: 0,
    lastAudit: '2025-11-06'
  }
];

export const issuesHighlight = [
  {
    title: 'Ảnh chưa nén / dung lượng lớn',
    severity: 'high',
    count: 5,
    desc: 'Ảnh lớn làm tăng thời gian tải trang trên mobile, ảnh hưởng Core Web Vitals.',
    tip: 'Nén ảnh xuống dưới 200KB, dùng định dạng WebP.'
  },
  {
    title: 'Thiếu meta description',
    severity: 'medium',
    count: 3,
    desc: 'Một số trang chưa có meta description tối ưu cho SEO.',
    tip: 'Thêm đoạn mô tả 120–160 ký tự, có chứa từ khóa chính.'
  },
  {
    title: 'Không có heading H1 duy nhất',
    severity: 'low',
    count: 2,
    desc: 'Cấu trúc heading chưa rõ ràng trên một số bài blog.',
    tip: 'Đảm bảo mỗi trang có đúng 1 thẻ H1.'
  }
];

// =======================
// ELEMENTS
// =======================
const pagesBody = document.getElementById('pagesBody');
const issueList = document.getElementById('issueList');
const searchInput = document.getElementById('searchInput');
const typeButtons = document.querySelectorAll('.toolbar .btn[data-type]');
let currentType = 'all';

// =======================
// HELPERS
// =======================
function badgeClass(score){
  if(score >= 85) return 'good';
  if(score >= 70) return 'warn';
  return 'bad';
}

function speedBadgeClass(sec){
  if(sec <= 1.3) return 'good';
  if(sec <= 1.8) return 'warn';
  return 'bad';
}

// =======================
// RENDER PAGES LIST
// =======================
function renderPages(){
  const term = (searchInput.value || '').toLowerCase();
  pagesBody.innerHTML = '';

  pages
    .filter(p => currentType === 'all' || p.type === currentType)
    .filter(p => {
      if(!term) return true;
      return p.name.toLowerCase().includes(term) || p.url.toLowerCase().includes(term);
    })
    .forEach(page => {
      const tr = document.createElement('tr');

      tr.innerHTML = `
        <td>
          <div>${page.name}</div>
          <div class="url">${page.url}</div>
        </td>
        <td><span class="badge ${badgeClass(page.seo)}">${page.seo}</span></td>
        <td><span class="badge ${speedBadgeClass(page.speed)}">${page.speed.toFixed(1)}s</span></td>
        <td>
          ${
            page.issuesCount > 0
            ? page.issues.map(i => `<span class="chip">${i}</span>`).join('')
            : `<span style="font-size:.8rem;color:var(--text-2)">Không có vấn đề nổi bật</span>`
          }
        </td>
        <td>${page.lastAudit}</td>
      `;

      pagesBody.appendChild(tr);
    });

  if(!pagesBody.innerHTML){
    pagesBody.innerHTML = `
      <tr><td colspan="5" style="text-align:center;color:var(--text-2);padding:1rem;">
        Không tìm thấy trang phù hợp
      </td></tr>`;
  }
}

// =======================
// RENDER ISSUES
// =======================
function renderIssues(){
  issueList.innerHTML = issuesHighlight.map(i => `
    <div class="issue-item">
      <div class="issue-header">
        <div>
          <div class="issue-title">${i.title}</div>
          <div class="issue-count">${i.count} trang bị ảnh hưởng</div>
        </div>
        <div class="issue-severity ${i.severity}">
          ${
            i.severity === 'high' ? 'Cao'
          : i.severity === 'medium' ? 'Trung bình'
          : 'Thấp'
          }
        </div>
      </div>
      <div class="issue-desc">${i.desc}</div>
      <div class="issue-foot">
        <span>${i.tip}</span>
        <span class="link-like">Xem danh sách trang</span>
      </div>
    </div>
  `).join('');
}

// =======================
// EVENT LISTENERS
// =======================
typeButtons.forEach(btn => {
  btn.addEventListener('click', () => {
    typeButtons.forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    currentType = btn.getAttribute('data-type');
    renderPages();
  });
});

searchInput.addEventListener('input', renderPages);

// =======================
// INIT
// =======================
renderPages();
renderIssues();
