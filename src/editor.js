console.log("Editor page loaded");

// ===== Lấy element chính =====
const titleInput = document.getElementById("title-input");
const editor = document.getElementById("editor");
const toolbarButtons = document.querySelectorAll(".toolbar .tool");
const categorySelect = document.querySelector("select");
const tagElements = document.querySelectorAll(".tag");

const btnPreview = document.getElementById("btn-preview");
const btnDraft = document.getElementById("btn-draft");
const btnSubmitTop = document.getElementById("btn-submit-top");
const btnSubmitBottom = document.getElementById("btn-submit-bottom");
const btnSchedule = document.getElementById("btn-schedule");

const commentInput = document.getElementById("comment-input");
const commentSend = document.getElementById("comment-send");
const commentList = document.querySelector(".drawer .items");

const DRAFT_KEY = "editor-draft-v1";

// ===== Helper: focus lại editor sau khi format =====
function focusEditor() {
  editor && editor.focus();
}

// ===== Helper: apply command format =====
function applyBlock(tag) {
  document.execCommand("formatBlock", false, tag);
  focusEditor();
}

function applyInline(cmd, value = null) {
  document.execCommand(cmd, false, value);
  focusEditor();
}

// ===== 1. Toolbar hành động =====
toolbarButtons.forEach((btn) => {
  const action = btn.dataset.action;
  if (!action) return;

  btn.addEventListener("click", () => {
    switch (action) {
      case "h1":
        applyBlock("H1");
        break;
      case "h2":
        applyBlock("H2");
        break;
      case "bold":
        applyInline("bold");
        break;
      case "italic":
        applyInline("italic");
        break;
      case "list":
        applyInline("insertUnorderedList");
        break;
      case "quote":
        applyBlock("BLOCKQUOTE");
        break;
      case "link": {
        const url = prompt("Nhập đường dẫn (URL):");
        if (url) {
          applyInline("createLink", url);
        }
        break;
      }
      case "image": {
        const url = prompt("Nhập link ảnh (URL):");
        if (url) {
          const html = `<figure><img src="${url}" alt="" style="max-width:100%;border-radius:12px"/><figcaption style="font-size:0.85rem;color:#6b7280">Chú thích ảnh</figcaption></figure>`;
          document.execCommand("insertHTML", false, html);
          focusEditor();
        }
        break;
      }
      case "video": {
        const url = prompt("Nhập link video (YouTube, v.v.):");
        if (url) {
          const html = `<div class="embed" aria-label="Video embed">▶️ Nhúng video: ${url}</div>`;
          document.execCommand("insertHTML", false, html);
          focusEditor();
        }
        break;
      }
      case "embed": {
        const code = prompt("Nhập mã nhúng (embed code) hoặc link:");
        if (code) {
          const html = `<div class="embed" aria-label="Embed">${code}</div>`;
          document.execCommand("insertHTML", false, html);
          focusEditor();
        }
        break;
      }
      default:
        break;
    }
  });
});

// ===== 2. Lưu nháp vào localStorage =====
function saveDraft() {
  const data = {
    title: titleInput ? titleInput.value : "",
    content: editor ? editor.innerHTML : "",
    category: categorySelect ? categorySelect.value : "",
    tags: Array.from(tagElements)
      .filter((t) => t.classList.contains("active"))
      .map((t) => t.textContent.trim()),
  };

  localStorage.setItem(DRAFT_KEY, JSON.stringify(data));
  alert("Đã lưu nháp trên trình duyệt (localStorage).");
}

if (btnDraft) {
  btnDraft.addEventListener("click", saveDraft);
}

// ===== 3. Tự load nháp nếu có =====
(function loadDraft() {
  try {
    const raw = localStorage.getItem(DRAFT_KEY);
    if (!raw) return;
    const data = JSON.parse(raw);

    if (data.title && titleInput) titleInput.value = data.title;
    if (data.content && editor) editor.innerHTML = data.content;
    if (data.category && categorySelect) categorySelect.value = data.category;

    if (Array.isArray(data.tags)) {
      tagElements.forEach((el) => {
        const text = el.textContent.trim();
        if (data.tags.includes(text)) {
          el.classList.add("active");
        }
      });
    }
  } catch (err) {
    console.warn("Không load được draft:", err);
  }
})();

// ===== 4. Xem trước: mở cửa sổ preview =====
if (btnPreview) {
  btnPreview.addEventListener("click", () => {
    const title = titleInput ? titleInput.value || "Không có tiêu đề" : "";
    const content = editor ? editor.innerHTML : "";

    const w = window.open("", "_blank", "width=960,height=600");
    if (!w) {
      alert("Trình duyệt chặn popup, hãy cho phép popup để xem trước.");
      return;
    }

    w.document.write(`
      <!doctype html>
      <html lang="vi">
      <head>
        <meta charset="utf-8" />
        <title>Xem trước bài viết</title>
        <style>
          body{
            font-family: system-ui, -apple-system, BlinkMacSystemFont, "Inter", sans-serif;
            padding:24px;
            background:#f8fafc;
            color:#0f172a;
          }
          h1{font-size:28px;margin-bottom:16px;}
          .content{background:#fff;border-radius:12px;padding:16px;line-height:1.7;}
          .content img{max-width:100%;border-radius:12px;}
          .meta{font-size:14px;color:#64748b;margin-bottom:8px;}
        </style>
      </head>
      <body>
        <h1>${title}</h1>
        <div class="meta">Bản xem trước (demo, chưa xuất bản)</div>
        <div class="content">${content}</div>
      </body>
      </html>
    `);
    w.document.close();
  });
}

// ===== 5. Gửi duyệt (2 nút) =====
function handleSubmit() {
  alert("Đã gửi duyệt (demo). Sau này sẽ gọi API backend tại đây.");
}

if (btnSubmitTop) btnSubmitTop.addEventListener("click", handleSubmit);
if (btnSubmitBottom) btnSubmitBottom.addEventListener("click", handleSubmit);

// ===== 6. Lên lịch: chuyển sang trang Lịch xuất bản =====
if (btnSchedule) {
  btnSchedule.addEventListener("click", () => {
    window.location.href = "/schedule.html?from=editor";
  });
}

// ===== 7. Bấm vào tag để chọn / bỏ chọn =====
tagElements.forEach((tagEl) => {
  tagEl.style.cursor = "pointer";
  tagEl.addEventListener("click", () => {
    tagEl.classList.toggle("active");
  });
});

// ===== 8. Gửi bình luận nội bộ =====
if (commentSend && commentInput && commentList) {
  commentSend.addEventListener("click", () => {
    const text = commentInput.value.trim();
    if (!text) return;

    const now = new Date();
    const timeStr = now.toLocaleTimeString("vi-VN", {
      hour: "2-digit",
      minute: "2-digit",
    });

    const div = document.createElement("div");
    div.className = "comment";
    div.innerHTML = `
      <div class="meta"><strong>Bạn</strong> • ${timeStr}</div>
      <div>${text}</div>
    `;

    commentList.prepend(div);
    commentInput.value = "";
  });
}
