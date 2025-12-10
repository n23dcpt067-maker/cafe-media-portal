// src/editor/page.js
console.log("Editor page loaded (module)");

// 1. Import API chuyên cho editor (folder này)
import {
  saveDraft as saveDraftApi,
  submitArticle as submitArticleApi,
  addComment as addCommentApi,
  getComments as getCommentsApi,
} from "./api.js";

// 2. Biến state nội bộ
const DRAFT_KEY = "editor-draft-v1";
let currentArticleId = null;

// Lấy id bài từ query ?id=... nếu có
function getArticleIdFromURL() {
  const params = new URLSearchParams(window.location.search);
  const urlArticleId = params.get("id");
  return urlArticleId || null;
}

// HÀM KHỞI TẠO CHÍNH
export default function initEditorPage() {
  // ===== Lấy element chính =====
  const titleInput    = document.getElementById("title-input");
  const editor        = document.getElementById("editor");
  const toolbarButtons= document.querySelectorAll(".toolbar .tool");
  const categorySelect= document.querySelector("select");
  const tagElements   = document.querySelectorAll(".tag");

  const btnPreview    = document.getElementById("btn-preview");
  const btnDraft      = document.getElementById("btn-draft");
  const btnSubmitTop  = document.getElementById("btn-submit-top");
  const btnSubmitBottom = document.getElementById("btn-submit-bottom");
  const btnSchedule   = document.getElementById("btn-schedule");

  const commentInput  = document.getElementById("comment-input");
  const commentSend   = document.getElementById("comment-send");
  const commentList   = document.querySelector(".drawer .items");

  // ================== HELPER ==================
  function focusEditor() {
    editor && editor.focus();
  }

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
          applyBlock("H1"); break;
        case "h2":
          applyBlock("H2"); break;
        case "bold":
          applyInline("bold"); break;
        case "italic":
          applyInline("italic"); break;
        case "list":
          applyInline("insertUnorderedList"); break;
        case "quote":
          applyBlock("BLOCKQUOTE"); break;
        case "link": {
          const url = prompt("Nhập đường dẫn (URL):");
          if (url) applyInline("createLink", url);
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

  // ===== 2. Lưu nháp (API + localStorage) =====
  async function saveDraft() {
    const data = {
      id: currentArticleId || undefined,
      title: titleInput ? titleInput.value : "",
      content: editor ? editor.innerHTML : "",
      category: categorySelect ? categorySelect.value : "",
      tags: Array.from(tagElements)
        .filter((t) => t.classList.contains("active"))
        .map((t) => t.textContent.trim()),
      status: "draft",
    };

    // Lưu local trước (offline)
    localStorage.setItem(DRAFT_KEY, JSON.stringify(data));

    try {
      const saved = await saveDraftApi(data);
      currentArticleId = saved.id;

      localStorage.setItem(
        DRAFT_KEY,
        JSON.stringify({ ...data, id: currentArticleId })
      );

      alert("Đã lưu nháp lên server (và localStorage).");
    } catch (err) {
      console.error(err);
      alert("Lỗi khi lưu nháp lên server, tạm thời chỉ lưu localStorage.");
    }
  }

  if (btnDraft) {
    btnDraft.addEventListener("click", saveDraft);
  }

  // ===== 3. Tự load nháp nếu có (localStorage) =====
  (function loadDraft() {
    try {
      const raw = localStorage.getItem(DRAFT_KEY);
      if (!raw) return;
      const data = JSON.parse(raw);

      if (data.id) currentArticleId = data.id;
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

  // ===== 4. Xem trước =====
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

  // ===== 5. Gửi duyệt (gọi API) =====
  async function handleSubmit() {
    const title = titleInput ? titleInput.value.trim() : "";
    const content = editor ? editor.innerHTML.trim() : "";

    if (!title || !content) {
      alert("Vui lòng điền đầy đủ tiêu đề và nội dung trước khi gửi duyệt.");
      return;
    }

    // Nếu chưa có id -> lưu nháp 1 lần để tạo id
    if (!currentArticleId) {
      try {
        const draft = await saveDraftApi({
          title,
          content,
          category: categorySelect ? categorySelect.value : "",
          tags: Array.from(tagElements)
            .filter((t) => t.classList.contains("active"))
            .map((t) => t.textContent.trim()),
          status: "draft",
        });
        currentArticleId = draft.id;
        localStorage.setItem(
          DRAFT_KEY,
          JSON.stringify({ ...draft, id: currentArticleId })
        );
      } catch (err) {
        console.error(err);
        alert("Không thể lưu nháp trước khi gửi duyệt. Vui lòng thử lại.");
        return;
      }
    }

    try {
      await submitArticleApi(currentArticleId, { note: "Gửi duyệt từ editor" });
      alert("Đã gửi bài viết lên để duyệt thành công!");
    } catch (err) {
      console.error(err);
      alert("Gửi duyệt thất bại. Vui lòng thử lại sau.");
    }
  }

  if (btnSubmitTop)    btnSubmitTop.addEventListener("click", handleSubmit);
  if (btnSubmitBottom) btnSubmitBottom.addEventListener("click", handleSubmit);

  // ===== 6. Lên lịch (giữ nguyên) =====
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

  // ===== 8. COMMENT – dùng API =====
  function renderCommentItem(cmt) {
    const div = document.createElement("div");
    div.className = "comment";

    const time = cmt.createdAt
      ? new Date(cmt.createdAt).toLocaleTimeString("vi-VN", {
          hour: "2-digit",
          minute: "2-digit",
        })
      : "";

    div.innerHTML = `
      <div class="meta">
        <strong>${cmt.author || "Bạn"}</strong>
        ${time ? ` • ${time}` : ""}
        ${cmt.target ? ` • ${cmt.target}` : ""}
      </div>
      <div>${cmt.text}</div>
    `;
    return div;
  }

  async function loadCommentsOnInit() {
    if (!currentArticleId || !commentList) return;
    try {
      const list = await getCommentsApi(currentArticleId);
      commentList.innerHTML = "";
      list.forEach((c) => {
        commentList.appendChild(renderCommentItem(c));
      });
    } catch (err) {
      console.warn("Không load được comments:", err);
    }
  }

  async function sendComment() {
    const text = commentInput.value.trim();
    if (!text) return;

    if (!currentArticleId) {
      alert("Bạn cần lưu nháp hoặc gửi duyệt để tạo bài viết trước khi bình luận.");
      return;
    }

    try {
      const newCmt = await addCommentApi(currentArticleId, {
        author: "Bạn",
        text,
        target: "",
      });
      const node = renderCommentItem(newCmt);
      commentList.prepend(node);
      commentInput.value = "";
    } catch (err) {
      console.error(err);
      alert("Không gửi được bình luận. Vui lòng thử lại.");
    }
  }

  if (commentSend && commentInput && commentList) {
    commentSend.addEventListener("click", () => {
      sendComment();
    });
  }

  // Lấy id từ URL nếu có
  const urlId = getArticleIdFromURL();
  if (urlId) {
    currentArticleId = urlId;
    // Optional: có thể load bài từ backend nếu muốn
    // getArticle(urlId).then( ... )
  }

  // Load comment khi đã có id
  loadCommentsOnInit();
}
