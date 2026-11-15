document.addEventListener("DOMContentLoaded", () => {
  const cardGrid = document.getElementById("card-grid");
  const filterContainer = document.getElementById("filter-buttons");
  const detailModal = document.getElementById("detail-modal");
  const modalContent = document.getElementById("modal-content");

  let currentFilter = "全部";

  // 1. 動態生成分類篩選按鈕
  function renderFilters() {
    const types = ["全部", ...new Set(MUSIC_ARCHIVE.map((item) => item.type))];
    filterContainer.innerHTML = "";

    types.forEach((type) => {
      const btn = document.createElement("button");
      btn.type = "button";
      btn.className = `filter-btn ${type === currentFilter ? "active" : ""}`;
      btn.textContent = type === "全部" ? `全部收錄 (${MUSIC_ARCHIVE.length})` : type;

      btn.addEventListener("click", () => {
        currentFilter = type;
        renderFilters();
        renderCards();
      });

      filterContainer.appendChild(btn);
    });
  }

  // 2. 渲染圖鑑卡片網格
  function renderCards() {
    const filteredData =
      currentFilter === "全部"
        ? MUSIC_ARCHIVE
        : MUSIC_ARCHIVE.filter((item) => item.type === currentFilter);

    cardGrid.innerHTML = "";

    filteredData.forEach((item) => {
      const card = document.createElement("article");
      card.className = "archive-card";
      card.setAttribute("tabindex", "0");
      card.setAttribute("role", "button");
      card.setAttribute("aria-label", `查看 ${item.name} 詳細介紹`);

      const genreTagsHTML = item.genre
        .map((g) => `<span class="genre-tag">#${g}</span>`)
        .join("");

      const eventDateHTML =
        item.type === "音樂祭" && item.eventDate
          ? `<div class="event-date-badge">🗓️ ${item.eventDate}</div>`
          : "";

      card.innerHTML = `
        <div class="card-banner" style="background-color: ${item.themeColor};">
          <span class="type-pill">${item.type}</span>
          <span class="meta-year">EST. ${item.activeYear}</span>
        </div>
        <div class="card-body">
          <h2 class="card-title">${item.name}</h2>
          <div class="card-en">${item.enName}</div>
          ${eventDateHTML}
          <p class="card-oneliner">「${item.oneLiner}」</p>
          <div class="genre-list">${genreTagsHTML}</div>
        </div>
        <div class="card-footer">
          <span>📍 ${item.originOrLocation}</span>
          <span>查看檔案 →</span>
        </div>
      `;

      const openHandler = () => openDetailModal(item);
      card.addEventListener("click", openHandler);
      card.addEventListener("keydown", (e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          openHandler();
        }
      });

      cardGrid.appendChild(card);
    });
  }

  // 3. 建立必聽代表作 / 祭典亮點列表項目（全部統一連至 YouTube 搜尋結果頁）
  function buildHighlightItemHTML(item, point) {
    if (item.type === "樂團") {
      const songMatch = point.match(/〈([^〉]+)〉/);
      const songName = songMatch ? songMatch[1] : point.split("——")[0].trim();
      const searchUrl = `https://www.youtube.com/results?search_query=${encodeURIComponent(
        `${item.name} ${songName}`
      )}`;

      return `
        <li>
          <a href="${searchUrl}"
             target="_blank"
             rel="noopener noreferrer"
             class="yt-song-link">
            ${point}
          </a>
        </li>
      `;
    }
    return `<li>${point}</li>`;
  }

  // 4. 開啟海報風格詳情彈窗 Modal
  function openDetailModal(item) {
    const highlightTitle =
      item.type === "樂團" ? "必聽代表作 // MUST LISTEN" : "祭典必看亮點 // HIGHLIGHTS";

    const highlightsHTML = item.mustListenOrHighlight
      .map((point) => buildHighlightItemHTML(item, point))
      .join("");

    const genreTagsHTML = item.genre
      .map((g) => `<span class="genre-tag">#${g}</span>`)
      .join("");

    const modalDateHTML =
      item.type === "音樂祭" && item.eventDate
        ? `<span>🗓️ 舉辦日期：${item.eventDate}</span>`
        : "";

    modalContent.innerHTML = `
      <div class="modal-header" style="background-color: ${item.themeColor};">
        <div class="modal-header-info">
          <span class="type-pill">${item.type} ARCHIVE</span>
          <h2>${item.name}</h2>
          <div class="modal-en">${item.enName}</div>
        </div>
        <button type="button" class="close-btn" id="close-modal-btn" aria-label="關閉視窗">✕ CLOSE</button>
      </div>
      <div class="modal-body">
        <div class="modal-meta-strip">
          <span>📍 據點／地點：${item.originOrLocation}</span>
          <span>📅 成立／創辦：${item.activeYear}</span>
          ${modalDateHTML}
        </div>
        <div class="modal-oneliner">「${item.oneLiner}」</div>
        <p class="modal-desc">${item.description}</p>
        <div class="highlight-box">
          <h3>${highlightTitle}</h3>
          <ul class="highlight-list">${highlightsHTML}</ul>
        </div>
        <div class="genre-list" style="margin-top: 1.25rem;">${genreTagsHTML}</div>
      </div>
    `;

    document.getElementById("close-modal-btn").addEventListener("click", () => {
      detailModal.close();
    });

    detailModal.showModal();
  }

  // 點擊彈窗外部背景時關閉
  detailModal.addEventListener("click", (e) => {
    const rect = detailModal.getBoundingClientRect();
    const isInDialog =
      rect.top <= e.clientY &&
      e.clientY <= rect.top + rect.height &&
      rect.left <= e.clientX &&
      e.clientX <= rect.left + rect.width;
    if (!isInDialog) {
      detailModal.close();
    }
  });

  // 初始化渲染
  renderFilters();
  renderCards();
});