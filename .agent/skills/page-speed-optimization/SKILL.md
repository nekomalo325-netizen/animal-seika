---
name: page-speed-optimization
description: 高速なページ表示速度を実現するためのガイドライン。Core Web Vitals、画像・CSS・JS最適化、キャッシュ戦略などを網羅します。
---

# ページ表示速度最適化 スキル

このスキルは、Webサイトの表示速度を最適化し、ユーザー体験とSEOを向上させるためのガイドラインです。Core Web Vitalsの目標達成を目指します。

---

## 📊 Core Web Vitals 目標値

| 指標 | 良好 | 改善が必要 | 不良 |
|-----|------|----------|------|
| **LCP** (Largest Contentful Paint) | ≤ 2.5秒 | ≤ 4.0秒 | > 4.0秒 |
| **INP** (Interaction to Next Paint) | ≤ 200ms | ≤ 500ms | > 500ms |
| **CLS** (Cumulative Layout Shift) | ≤ 0.1 | ≤ 0.25 | > 0.25 |

### その他の重要指標

| 指標 | 目標値 | 説明 |
|-----|-------|------|
| **FCP** (First Contentful Paint) | ≤ 1.8秒 | 最初のコンテンツ表示 |
| **TTFB** (Time to First Byte) | ≤ 800ms | サーバー応答時間 |
| **Speed Index** | ≤ 3.4秒 | コンテンツ表示の体感速度 |
| **TBT** (Total Blocking Time) | ≤ 200ms | メインスレッドのブロック時間 |

---

## 🖼️ 1. 画像最適化

### 🔴 次世代フォーマットの使用

```html
<!-- picture要素で最適なフォーマットを提供 -->
<picture>
  <!-- AVIFが最も軽量（対応ブラウザのみ） -->
  <source srcset="image.avif" type="image/avif">
  <!-- WebPも軽量（広く対応） -->
  <source srcset="image.webp" type="image/webp">
  <!-- フォールバック -->
  <img src="image.jpg" alt="説明" loading="lazy">
</picture>
```

### フォーマット比較

| フォーマット | 圧縮率 | 対応ブラウザ | 用途 |
|------------|-------|-------------|------|
| **AVIF** | 最高 | Chrome, Firefox | 写真、複雑な画像 |
| **WebP** | 高 | ほぼ全て | 写真、イラスト |
| **PNG** | 中 | 全て | 透過、ロゴ |
| **SVG** | - | 全て | アイコン、ロゴ |
| **JPEG** | 中 | 全て | 写真（フォールバック） |

### 🔴 レスポンシブ画像

```html
<!-- srcsetで画面サイズに応じた画像を提供 -->
<img 
  src="image-800.jpg"
  srcset="
    image-400.jpg 400w,
    image-800.jpg 800w,
    image-1200.jpg 1200w,
    image-1600.jpg 1600w
  "
  sizes="
    (max-width: 600px) 100vw,
    (max-width: 1200px) 50vw,
    800px
  "
  alt="説明"
  loading="lazy"
  decoding="async"
>
```

### 🔴 遅延読み込み（Lazy Loading）

```html
<!-- ファーストビュー外の画像 -->
<img src="image.jpg" alt="説明" loading="lazy" decoding="async">

<!-- ファーストビュー内の画像（LCP候補） -->
<img src="hero.jpg" alt="説明" loading="eager" fetchpriority="high">
```

### 🔴 サイズ指定でCLS防止

```html
<!-- 幅と高さを必ず指定 -->
<img 
  src="image.jpg" 
  alt="説明" 
  width="800" 
  height="600"
  loading="lazy"
>
```

```css
/* アスペクト比でCLS防止 */
.image-container {
  aspect-ratio: 16 / 9;
  width: 100%;
}

.image-container img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}
```

### 🟠 画像圧縮

```bash
# Squooshでの圧縮（CLI）
npx @aspect-ratio/cli --quality 80 --output dist/ src/*.jpg

# sharpを使用（Node.js）
const sharp = require('sharp');

await sharp('input.jpg')
  .resize(1200, null, { withoutEnlargement: true })
  .webp({ quality: 80 })
  .toFile('output.webp');
```

### チェックリスト

| 項目 | 影響 | 確認 |
|-----|------|-----|
| WebP/AVIFを使用しているか | LCP | □ |
| srcsetでレスポンシブ対応か | LCP | □ |
| loading="lazy"を設定しているか | LCP | □ |
| 幅と高さを指定しているか | CLS | □ |
| 画像を圧縮しているか | LCP | □ |
| LCP画像にfetchpriority="high"があるか | LCP | □ |

---

## 🎨 2. CSS最適化

### 🔴 クリティカルCSSのインライン化

```html
<head>
  <!-- ファーストビューに必要なCSSをインライン化 -->
  <style>
    /* クリティカルCSS（ファーストビュー用） */
    *,*::before,*::after{box-sizing:border-box}
    body{margin:0;font-family:system-ui,sans-serif}
    .header{position:fixed;top:0;width:100%;height:60px;background:#fff}
    .hero{min-height:100vh;display:flex;align-items:center}
    /* 約14KB以下に抑える */
  </style>
  
  <!-- 残りのCSSは非同期で読み込み -->
  <link rel="preload" href="/css/main.css" as="style" onload="this.onload=null;this.rel='stylesheet'">
  <noscript><link rel="stylesheet" href="/css/main.css"></noscript>
</head>
```

### 🟠 未使用CSSの削除

```javascript
// PurgeCSSの設定例
// purgecss.config.js
module.exports = {
  content: ['./src/**/*.html', './src/**/*.js'],
  css: ['./src/css/**/*.css'],
  output: './dist/css/',
  safelist: ['active', 'is-open', /^modal-/] // 動的クラスを保護
};
```

```bash
# PurgeCSSの実行
npx purgecss --config purgecss.config.js
```

### 🟠 CSSの圧縮（Minify）

```javascript
// cssnanoの設定例（PostCSS）
// postcss.config.js
module.exports = {
  plugins: [
    require('autoprefixer'),
    require('cssnano')({
      preset: ['default', {
        discardComments: { removeAll: true },
        normalizeWhitespace: true
      }]
    })
  ]
};
```

### 🟠 効率的なセレクタ

```css
/* ❌ 非効率：深いネスト */
.header .nav .menu .item .link { }

/* ✅ 効率的：シンプルなセレクタ */
.nav-link { }

/* ❌ 非効率：ユニバーサルセレクタ */
* { box-sizing: border-box; }

/* ✅ 効率的：疑似要素も含める */
*,
*::before,
*::after {
  box-sizing: border-box;
}
```

### 🟡 containプロパティ

```css
/* 再計算の範囲を制限 */
.card {
  contain: layout style paint;
}

/* 固定サイズの要素 */
.fixed-widget {
  contain: strict;
  width: 300px;
  height: 200px;
}
```

### チェックリスト

| 項目 | 影響 | 確認 |
|-----|------|-----|
| クリティカルCSSをインライン化しているか | FCP, LCP | □ |
| 未使用CSSを削除しているか | TBT | □ |
| CSSを圧縮しているか | 転送量 | □ |
| セレクタがシンプルか | TBT | □ |
| @importを使用していないか | FCP | □ |

---

## ⚡ 3. JavaScript最適化

### 🔴 非同期読み込み

```html
<!-- defer: DOMパース後に実行（順序保証） -->
<script src="/js/main.js" defer></script>

<!-- async: ダウンロード完了後すぐ実行（順序不保証） -->
<script src="/js/analytics.js" async></script>

<!-- module: 自動でdefer扱い -->
<script type="module" src="/js/app.js"></script>
```

| 属性 | 実行タイミング | 順序 | 用途 |
|-----|---------------|------|------|
| なし | パース中断して即実行 | 順序通り | 非推奨 |
| `defer` | DOMContentLoaded前 | 順序通り | メインJS |
| `async` | ダウンロード完了時 | 不定 | 分析、広告 |
| `type="module"` | DOMContentLoaded前 | 順序通り | ESモジュール |

### 🔴 コード分割（Code Splitting）

```javascript
// 動的インポートで必要時に読み込み
button.addEventListener('click', async () => {
  const { openModal } = await import('./modal.js');
  openModal();
});

// React での例
const LazyComponent = React.lazy(() => import('./HeavyComponent'));

// Vite / Webpack での設定
// 自動的にチャンクに分割される
```

### 🟠 Tree Shaking

```javascript
// ❌ 全体をインポート（未使用コードも含む）
import _ from 'lodash';
_.debounce(fn, 300);

// ✅ 必要な関数のみインポート
import debounce from 'lodash/debounce';
debounce(fn, 300);

// ✅ ES Modules を使用
import { debounce } from 'lodash-es';
```

### 🟠 JavaScript圧縮

```javascript
// Terserの設定例（Vite / Webpack）
// vite.config.js
export default {
  build: {
    minify: 'terser',
    terserOptions: {
      compress: {
        drop_console: true, // console.logを削除
        drop_debugger: true
      }
    }
  }
};
```

### 🟠 長時間タスクの分割

```javascript
// ❌ メインスレッドをブロック
function processLargeArray(items) {
  items.forEach(item => heavyProcess(item));
}

// ✅ タスクを分割
async function processLargeArray(items) {
  const CHUNK_SIZE = 100;
  
  for (let i = 0; i < items.length; i += CHUNK_SIZE) {
    const chunk = items.slice(i, i + CHUNK_SIZE);
    chunk.forEach(item => heavyProcess(item));
    
    // ブラウザに制御を返す
    await new Promise(resolve => setTimeout(resolve, 0));
  }
}

// ✅ requestIdleCallback を使用
function processWhenIdle(items) {
  let index = 0;
  
  function processChunk(deadline) {
    while (index < items.length && deadline.timeRemaining() > 0) {
      heavyProcess(items[index++]);
    }
    
    if (index < items.length) {
      requestIdleCallback(processChunk);
    }
  }
  
  requestIdleCallback(processChunk);
}
```

### 🟡 Web Workers

```javascript
// メインスレッドから重い処理を分離
// worker.js
self.onmessage = function(e) {
  const result = heavyCalculation(e.data);
  self.postMessage(result);
};

// main.js
const worker = new Worker('worker.js');
worker.postMessage(data);
worker.onmessage = function(e) {
  console.log('Result:', e.data);
};
```

### チェックリスト

| 項目 | 影響 | 確認 |
|-----|------|-----|
| スクリプトにdefer/asyncがあるか | TBT, INP | □ |
| コード分割を使用しているか | TBT | □ |
| Tree Shakingを有効にしているか | 転送量 | □ |
| JSを圧縮しているか | 転送量 | □ |
| 長時間タスクを分割しているか | INP, TBT | □ |
| サードパーティJSを最小限にしているか | TBT | □ |

---

## 🔤 4. フォント最適化

### 🔴 font-display: swap

```css
@font-face {
  font-family: 'MyFont';
  src: url('/fonts/myfont.woff2') format('woff2');
  font-display: swap; /* システムフォントで先に表示 */
  font-weight: 400;
  font-style: normal;
}
```

| 値 | 説明 | 用途 |
|---|------|------|
| `swap` | すぐにフォールバックで表示 | 本文テキスト |
| `optional` | 高速接続時のみWebフォント | 装飾フォント |
| `fallback` | 短時間だけブロック | バランス重視 |

### 🔴 フォントのプリロード

```html
<head>
  <!-- 重要なフォントをプリロード -->
  <link 
    rel="preload" 
    href="/fonts/main.woff2" 
    as="font" 
    type="font/woff2" 
    crossorigin
  >
</head>
```

### 🟠 woff2フォーマットを使用

```css
@font-face {
  font-family: 'MyFont';
  src: url('/fonts/myfont.woff2') format('woff2'), /* 最優先 */
       url('/fonts/myfont.woff') format('woff');   /* フォールバック */
}
```

### 🟠 サブセット化（日本語フォント）

```css
/* Google Fontsのサブセット */
@import url('https://fonts.googleapis.com/css2?family=Noto+Sans+JP:wght@400;700&display=swap&subset=japanese');

/* 自前でサブセット化 */
/* pyftsubset を使用 */
```

```bash
# 日本語フォントのサブセット化
pip install fonttools
pyftsubset NotoSansJP-Regular.otf --text-file=used-chars.txt --output-file=NotoSansJP-subset.woff2 --flavor=woff2
```

### 🟡 可変フォント（Variable Fonts）

```css
/* 複数ウェイトを1ファイルで */
@font-face {
  font-family: 'MyVariableFont';
  src: url('/fonts/variable.woff2') format('woff2-variations');
  font-weight: 100 900; /* 範囲指定 */
  font-display: swap;
}

.light { font-weight: 300; }
.regular { font-weight: 400; }
.bold { font-weight: 700; }
```

### チェックリスト

| 項目 | 影響 | 確認 |
|-----|------|-----|
| font-display: swapを設定しているか | FCP, LCP | □ |
| 重要フォントをプリロードしているか | LCP | □ |
| woff2フォーマットを使用しているか | 転送量 | □ |
| 日本語フォントをサブセット化しているか | 転送量 | □ |
| フォントファイル数を最小限にしているか | リクエスト数 | □ |

---

## 🔗 5. リソース優先順位

### プリロード（Preload）

```html
<head>
  <!-- 現在のページで必須のリソース -->
  <link rel="preload" href="/fonts/main.woff2" as="font" type="font/woff2" crossorigin>
  <link rel="preload" href="/css/critical.css" as="style">
  <link rel="preload" href="/images/hero.webp" as="image">
  <link rel="preload" href="/js/main.js" as="script">
</head>
```

### プリフェッチ（Prefetch）

```html
<head>
  <!-- 次のページで使う可能性があるリソース -->
  <link rel="prefetch" href="/about.html">
  <link rel="prefetch" href="/js/modal.js">
</head>
```

### プリコネクト（Preconnect）

```html
<head>
  <!-- 外部ドメインへの事前接続 -->
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link rel="preconnect" href="https://api.example.com">
</head>
```

### DNSプリフェッチ（DNS-Prefetch）

```html
<head>
  <!-- DNS解決だけ先に行う（preconnectより軽量） -->
  <link rel="dns-prefetch" href="https://www.googletagmanager.com">
  <link rel="dns-prefetch" href="https://www.google-analytics.com">
</head>
```

### fetchpriority

```html
<!-- LCP画像を高優先度に -->
<img src="hero.jpg" fetchpriority="high" alt="ヒーロー画像">

<!-- ファーストビュー外の画像を低優先度に -->
<img src="footer-logo.jpg" fetchpriority="low" loading="lazy" alt="ロゴ">
```

### 優先順位のまとめ

| 属性 | 用途 | タイミング |
|-----|------|----------|
| `preload` | 現在のページで必須 | 即座にダウンロード |
| `prefetch` | 将来のナビゲーション用 | アイドル時にダウンロード |
| `preconnect` | 外部ドメインへの接続 | 即座に接続確立 |
| `dns-prefetch` | DNS解決のみ | 即座にDNS解決 |
| `fetchpriority="high"` | 重要なリソース | 優先度を上げる |
| `fetchpriority="low"` | 重要度の低いリソース | 優先度を下げる |

---

## 💾 6. キャッシュ戦略

### ブラウザキャッシュ

```apache
# .htaccess（Apache）
<IfModule mod_expires.c>
  ExpiresActive On
  
  # 画像（1年）
  ExpiresByType image/jpeg "access plus 1 year"
  ExpiresByType image/png "access plus 1 year"
  ExpiresByType image/webp "access plus 1 year"
  ExpiresByType image/avif "access plus 1 year"
  ExpiresByType image/svg+xml "access plus 1 year"
  
  # フォント（1年）
  ExpiresByType font/woff2 "access plus 1 year"
  ExpiresByType font/woff "access plus 1 year"
  
  # CSS/JS（1年、ハッシュ付きファイル名使用時）
  ExpiresByType text/css "access plus 1 year"
  ExpiresByType application/javascript "access plus 1 year"
  
  # HTML（キャッシュしない）
  ExpiresByType text/html "access plus 0 seconds"
</IfModule>

<IfModule mod_headers.c>
  # 静的アセット（ハッシュ付き）
  <FilesMatch "\.(css|js|jpg|jpeg|png|webp|avif|woff2)$">
    Header set Cache-Control "public, max-age=31536000, immutable"
  </FilesMatch>
  
  # HTML
  <FilesMatch "\.html$">
    Header set Cache-Control "no-cache, must-revalidate"
  </FilesMatch>
</IfModule>
```

```nginx
# nginx.conf
location ~* \.(jpg|jpeg|png|webp|avif|gif|ico|svg)$ {
  expires 1y;
  add_header Cache-Control "public, immutable";
}

location ~* \.(css|js|woff2)$ {
  expires 1y;
  add_header Cache-Control "public, immutable";
}

location ~* \.html$ {
  expires -1;
  add_header Cache-Control "no-cache, must-revalidate";
}
```

### ファイル名にハッシュを付ける

```javascript
// Vite の設定
// vite.config.js
export default {
  build: {
    rollupOptions: {
      output: {
        // main.abc123.js のようなファイル名
        entryFileNames: '[name].[hash].js',
        chunkFileNames: '[name].[hash].js',
        assetFileNames: '[name].[hash].[ext]'
      }
    }
  }
};
```

### Service Worker

```javascript
// sw.js
const CACHE_NAME = 'v1';
const STATIC_ASSETS = [
  '/',
  '/css/main.css',
  '/js/main.js',
  '/images/logo.svg'
];

// インストール時にキャッシュ
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => {
      return cache.addAll(STATIC_ASSETS);
    })
  );
});

// リクエスト時にキャッシュ優先
self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request).then(response => {
      return response || fetch(event.request);
    })
  );
});
```

---

## 🖥️ 7. サーバー最適化

### Gzip / Brotli 圧縮

```apache
# .htaccess（Apache）
<IfModule mod_deflate.c>
  AddOutputFilterByType DEFLATE text/html text/css application/javascript application/json
</IfModule>
```

```nginx
# nginx.conf
gzip on;
gzip_types text/plain text/css application/json application/javascript text/xml application/xml;
gzip_min_length 1000;

# Brotli（より高圧縮）
brotli on;
brotli_types text/plain text/css application/json application/javascript;
```

### HTTP/2 または HTTP/3

```nginx
# nginx.conf
server {
  listen 443 ssl http2;
  # または
  listen 443 ssl http3;
  
  ssl_certificate /path/to/cert.pem;
  ssl_certificate_key /path/to/key.pem;
}
```

### CDN の活用

```html
<!-- 静的アセットをCDNから配信 -->
<link rel="stylesheet" href="https://cdn.example.com/css/main.abc123.css">
<script src="https://cdn.example.com/js/main.abc123.js" defer></script>
<img src="https://cdn.example.com/images/hero.webp" alt="ヒーロー">
```

---

## 📐 8. レンダリング最適化

### 🔴 レイアウトシフト（CLS）対策

```css
/* 画像のアスペクト比を予約 */
img {
  max-width: 100%;
  height: auto;
}

/* または aspect-ratio */
.hero-image {
  aspect-ratio: 16 / 9;
  width: 100%;
  object-fit: cover;
}

/* 埋め込みコンテンツのスペース確保 */
.video-container {
  position: relative;
  padding-top: 56.25%; /* 16:9 */
}

.video-container iframe {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
}

/* フォントによるシフト対策 */
body {
  font-family: system-ui, -apple-system, sans-serif;
}

/* Webフォント読み込み後も同じサイズを維持 */
@font-face {
  font-family: 'MyFont';
  src: url('/fonts/myfont.woff2') format('woff2');
  font-display: swap;
  size-adjust: 100%; /* 必要に応じて調整 */
}
```

### 🟠 will-changeの適切な使用

```css
/* ❌ 過剰な使用 */
* { will-change: transform; }

/* ✅ アニメーション直前にのみ適用 */
.card {
  transition: transform 0.3s ease;
}

.card:hover {
  will-change: transform;
  transform: translateY(-10px);
}

/* JavaScript で動的に適用 */
element.addEventListener('mouseenter', () => {
  element.style.willChange = 'transform';
});
element.addEventListener('animationend', () => {
  element.style.willChange = 'auto';
});
```

### 🟠 GPUアクセラレーション

```css
/* transform でGPU処理 */
.animate {
  /* ❌ top/left（CPUで再計算） */
  /* position: relative; top: 10px; */
  
  /* ✅ transform（GPU処理） */
  transform: translateY(10px);
}

/* opacity もGPU処理される */
.fade {
  opacity: 0;
  transition: opacity 0.3s ease;
}
```

---

## ✅ パフォーマンスチェックリスト

### 画像
- [ ] WebP/AVIF を使用
- [ ] srcset でレスポンシブ対応
- [ ] loading="lazy" を設定
- [ ] 幅と高さを指定（CLS対策）
- [ ] LCP画像を fetchpriority="high" に

### CSS
- [ ] クリティカルCSSをインライン化
- [ ] 未使用CSSを削除
- [ ] 圧縮（minify）済み
- [ ] @import を使用していない

### JavaScript
- [ ] defer または async を使用
- [ ] コード分割を実施
- [ ] 圧縮（minify）済み
- [ ] サードパーティJSを最小限に

### フォント
- [ ] font-display: swap を設定
- [ ] woff2 を使用
- [ ] 重要フォントをプリロード
- [ ] 日本語フォントをサブセット化

### サーバー
- [ ] Gzip/Brotli 圧縮
- [ ] 適切なキャッシュヘッダー
- [ ] HTTP/2 または HTTP/3
- [ ] CDN を使用

### レンダリング
- [ ] CLS が 0.1 以下
- [ ] アニメーションは transform/opacity のみ
- [ ] will-change を適切に使用

---

## 🛠️ 測定ツール

| ツール | 用途 | URL |
|-------|------|-----|
| PageSpeed Insights | 総合評価 | https://pagespeed.web.dev/ |
| Lighthouse | 詳細分析 | Chrome DevTools |
| WebPageTest | 詳細な読み込み分析 | https://webpagetest.org/ |
| GTmetrix | パフォーマンス分析 | https://gtmetrix.com/ |
| Chrome DevTools | Network / Performance タブ | ブラウザ内蔵 |
| web.dev/measure | Core Web Vitals | https://web.dev/measure/ |
| Bundlephobia | パッケージサイズ確認 | https://bundlephobia.com/ |

---

## 📊 目標スコア

| 指標 | 目標 |
|-----|------|
| Lighthouse Performance | 90+ |
| LCP | < 2.5秒 |
| INP | < 200ms |
| CLS | < 0.1 |
| TBT | < 200ms |
| PageSpeed (Mobile) | 80+ |
| PageSpeed (Desktop) | 90+ |

---

## 📚 参考リンク

- [Web.dev - Performance](https://web.dev/performance/)
- [Core Web Vitals](https://web.dev/vitals/)
- [Google PageSpeed Insights](https://pagespeed.web.dev/)
- [MDN - Performance](https://developer.mozilla.org/en-US/docs/Web/Performance)
