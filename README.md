# 清水慈聖宮｜純靜態官網

React + Vite 純前端，保留 GSAP／Three.js 香煙開場、響應式版面、活動公告與詳情頁、參香查詢及交通資訊。

**沒有管理後台、密碼、API、資料庫或常駐 Node 服務。** Node 只用於開發及建置；部署產物是 `dist/` 的 HTML、CSS、JavaScript、JSON 與圖片。

## 部署到 Vercel

匯入專案 Git 儲存庫，設定：

| 項目 | 設定 |
| --- | --- |
| Framework Preset | Vite |
| Build Command | `npm run build` |
| Output Directory | `dist` |
| Install Command | `npm ci` |
| 環境變數 | 不需要 |

`vercel.json` 已設定 SPA rewrite，讓 `/events/活動-id` 可直接開啟及重新整理，依據 [Vercel 官方文件](https://vercel.com/docs/frameworks/frontend/vite#using-vite-to-make-spas)。不需 Functions、Storage 或密碼。

請部署專案原始碼，讓 Vercel 自動建置。其他靜態主機可上傳 `dist/` 全部內容，但也需設定詳情路由回退至 `index.html`。本次僅修改本機專案，尚未部署到你的 Vercel 帳號。

## 本機開發與預覽

建議 Node.js 24。PowerShell 使用 `npm.cmd` 可避免執行原則問題。

```powershell
npm.cmd ci
npm.cmd run dev
```

開啟終端機顯示的網址（通常是 `http://127.0.0.1:5173`；占用時改用其他埠）。正式產物檢查：

```powershell
npm.cmd run build
npm.cmd test
npm.cmd run preview
```

預覽通常是 `http://127.0.0.1:4173`。部署到 Vercel 後不需保持電腦開啟或執行這些指令。

## 更新活動

1. 編輯 `content/events.json` 的 `events` 陣列。
2. 封面放在 `public/images/`，`poster` 填 `/images/檔名.webp`。使用英數檔名，支援 JPG、PNG、WebP。
3. 核對後設定 `published: true`；`false` 不會輸出到官網。
4. 提交至 Git，讓 Vercel 重新部署；訪客重新整理後讀取新版本。

以下僅是欄位格式說明，沒有新增至正式資料：

```json
{
  "id": "event-2026-001",
  "title": "請填正式活動名稱",
  "date": "2026-12-15",
  "time": "09:00",
  "location": "請填已確認的活動地點",
  "category": "other",
  "summary": "列表上的簡介",
  "description": "完整活動說明",
  "poster": "",
  "schedule": [],
  "stops": [],
  "notice": "",
  "lunarDate": "",
  "showRegistration": false,
  "published": false
}
```

`id` 必須唯一，可用英數、底線及連字號；`date` 為有效的 YYYY-MM-DD 日期。類別可用 `birthday`、`pilgrimage`、`ceremony`、`other`。流程格式為 `[{ "time": "09:00", "text": "流程內容" }]`，參香站點 `stops` 是文字陣列。

開發與建置指令會先執行 `scripts/build-events.mjs`，檢查已發布活動並產生 `public/data/events.json`。瀏覽器只讀這個靜態檔，不呼叫 API。**不要直接修改產生的檔案，下次建置會覆蓋。** 開發時更新內容後，執行 `npm.cmd run content:build` 再重新整理，或重啟開發指令。

原有兩筆活動已完整遷移至 `content/events.json`，仍為未發布，沒有擅自公開。草稿不進入 `dist/`，但仍存在原始碼儲存庫；不要在公開儲存庫放機密內容。`public/` 下的圖片與檔案都是公開素材。

## 檔案與設定

- `src/config/site.js`：宮名、電話、地址、外部連結及攝影配置。
- `src/site/TempleSite.jsx`、`temple.css`：首頁、活動詳情、導覽、頁尾。
- `src/site/intro/`：開場動畫及手機／WebGL 備援。
- `src/data/store.js`：靜態 JSON 讀取。
- `content/events.json`：活動編輯來源。
- `scripts/`：只在建置或測試時執行的工具，並非後端服務。
- `vercel.json`：Vercel 建置、靜態目錄及路由設定。

已移除 `server/`、`src/admin/`、登入路由、宮務管理入口、密碼設定指令及舊後端測試。沒有新增 npm 依賴。舊環境設定、資料備份及上傳目錄排除於 Git 和 Vercel 上傳；網站不再使用管理者環境變數。

## 驗證與限制

本次執行 production build 及靜態測試，驗證草稿不公開、資料格式檢查、封面檔案存在、靜態 JSON 產生與 HTTP 讀取，以及輸出沒有後台 bundle 或 API 呼叫。測試使用暫存目錄並清除測試資料。舊版後端 11 項測試已移除，現行結果以 `npm.cmd test` 為準。

尚未部署到 Vercel，也未完成桌機／手機的實際畫面驗收；先前 Computer Use 因網址辨識限制停止。既有宮廟資料、官方連結、沿革及實景照片仍待廟方核對。

Three.js 延遲載入檔約 526 KB（gzip 約 130 KB），建置會提示 chunk 大小；手機、減少動態與已觀看工作階段不載入。正式網域與 OG 分享圖片仍待設定。
