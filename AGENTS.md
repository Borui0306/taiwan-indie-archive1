# AGENTS.md - 台灣獨立音樂與音樂祭圖鑑開發規範

## 1. 專案目的 (Project Purpose)
本專案是一個互動式的「台灣獨立樂團與音樂祭圖鑑」網頁。
目標是建立一套標準化的資料結構與視覺卡片模板，讓 AI 能夠依照同一套規範，快速且無誤差地持續新增樂團介紹、音樂祭攻略或專輯推薦。

## 2. 視覺風格與設計語言 (Design System)
- **風格定位**：獨立音樂誌（Indie Zine）與黑膠唱片行質感，高對比復古暖色調。
- **CSS 變數**（嚴格遵守 `css/style.css` 定義）：
  - 紙張底色：`--bg-paper: #f4f1ea`
  - 卡片底色：`--bg-card: #ffffff`
  - 主墨水色：`--ink-black: #18181b`
  - 強調色（海報橘紅）：`--accent-orange: #e14d2a`
  - 強調色（復古芥末黃）：`--accent-yellow: #eab308`
- **元件特色**：所有卡片與按鈕均採用 `2px solid #18181b` 的粗黑邊框，搭配硬邊陰影（`box-shadow: 4px 4px 0px #18181b`），營造實體印刷刊物感。

## 3. 檔案職責與命名規則 (File Architecture)
- `index.html`：僅負責頁面骨架（Header、篩選列、`<main id="card-grid">` 容器、`<dialog id="detail-modal">` 詳情彈窗）。禁止將資料寫死在 HTML 中。
- `css/style.css`：全站樣式表，使用 CSS Grid 排版（桌機版 3 欄、平板 2 欄、手機 1 欄）。
- `js/bands-data.js`：唯一的資料來源，匯出全域陣列 `MUSIC_ARCHIVE`。
- `js/render.js`：負責讀取 `MUSIC_ARCHIVE` 並動態生成 DOM 元素、篩選邏輯，以及將樂團代表作文字連結至對應的 YouTube 搜尋結果頁。

## 4. 新增內容標準流程 (How to Add New Entries)
當使用者要求「新增一個樂團」或「新增一個音樂祭」時，AI **必須**開啟 `js/bands-data.js`，在 `MUSIC_ARCHIVE` 陣列末端新增一筆物件，並嚴格遵守以下 Schema：

```javascript
{
  id: "kebab-case-english-id",        // 必填：全小寫英文連字號，例如 "no-party-for-cao-dong"
  type: "樂團" | "音樂祭",             // 必填：只能二選一
  name: "樂團或音樂祭中文名稱",         // 必填
  enName: "English Name",             // 必填：英文名稱或副標
  genre: ["曲風1", "曲風2"],           // 必填：最多 3 個標籤（如："草根搖滾"、"後龐克"、"城市民謠"、"港邊祭典"）
  originOrLocation: "發跡地或舉辦城市", // 必填：例如 "台北"、"高雄駁二"
  activeYear: "成立年份或創辦年",       // 必填：例如 "2012"、"2006"
  eventDate: "2026/MM/DD - MM/DD",    // 僅音樂祭必填：當年度舉辦日期（例如 "2026/03/21 - 03/22"），樂團不需填寫此欄位
  themeColor: "#e14d2a",              // 必填：卡片頂部色塊 Hex 色碼（需與深色文字具備高對比）
  oneLiner: "一句話靈魂標語（限 25 字內）",
  mustListenOrHighlight: [            // 必填：樂團請以「〈歌名〉—— 簡介」格式撰寫
    "〈歌名一〉—— 簡介",
    "〈歌名二〉—— 簡介",
    "〈歌名三〉—— 簡介"
  ],
  description: "100 到 150 字的完整介紹，說明其音樂風格、現場魅力與代表性。"
}