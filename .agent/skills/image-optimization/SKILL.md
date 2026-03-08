---
name: image-optimization
description: Web画像を最適化するためのガイドライン。フォーマット選択、圧縮、レスポンシブ画像、遅延読み込み、アクセシビリティまで網羅します。
---

# 画像最適化 スキル

このスキルは、Webサイトの画像を最適化し、ページ速度とユーザー体験を向上させるためのガイドラインです。

---

## 📊 画像がパフォーマンスに与える影響

| 問題 | 影響する指標 | 対策 |
|-----|-------------|------|
| ファイルサイズが大きい | LCP、転送量 | 圧縮、フォーマット選択 |
| 表示サイズより大きい画像 | LCP、転送量 | レスポンシブ画像 |
| 全画像を一度に読み込み | LCP、FCP | 遅延読み込み |
| サイズ未指定 | CLS | width/height指定 |
| 不適切なフォーマット | 転送量 | フォーマット選択 |

---

## 🖼️ 1. 画像フォーマットの選択

### フォーマット比較表

| フォーマット | 圧縮 | 透過 | アニメ | 用途 | ブラウザ対応 |
|------------|------|------|--------|------|-------------|
| **AVIF** | 最高 | ✅ | ✅ | 写真、複雑な画像 | Chrome, Firefox, Safari 16+ |
| **WebP** | 高 | ✅ | ✅ | 写真、イラスト | ほぼ全て |
| **JPEG** | 中 | ❌ | ❌ | 写真（フォールバック） | 全て |
| **PNG** | 低 | ✅ | ❌ | ロゴ、透過画像 | 全て |
| **SVG** | - | ✅ | ✅ | アイコン、ロゴ、図形 | 全て |
| **GIF** | 低 | ✅ | ✅ | シンプルなアニメ | 全て |

### 選択フローチャート

```
画像は何ですか？
│
├─ アイコン・ロゴ・図形 → SVG
│
├─ アニメーション → WebP (アニメ) or AVIF
│
├─ 透過が必要 → WebP or PNG
│
└─ 写真・複雑な画像
    │
    ├─ 最高画質が必要 → AVIF > WebP > JPEG
    │
    └─ 互換性重視 → WebP > JPEG
```

### picture要素で最適なフォーマットを提供

```html
<picture>
  <!-- 最も圧縮率の高いAVIF -->
  <source srcset="image.avif" type="image/avif">
  <!-- 広くサポートされたWebP -->
  <source srcset="image.webp" type="image/webp">
  <!-- フォールバック用JPEG -->
  <img src="image.jpg" alt="説明文" loading="lazy" width="800" height="600">
</picture>
```

---

## 🗜️ 2. 画像圧縮

### 推奨圧縮設定

| フォーマット | 品質設定 | 用途 |
|------------|---------|------|
| AVIF | 50-70 | 写真（JPEG品質80相当） |
| WebP | 75-85 | 写真 |
| WebP | 90-100 | イラスト、テキスト含む画像 |
| JPEG | 75-85 | 写真 |
| PNG | - | 可逆圧縮（品質設定なし） |

### Squooshで圧縮（オンライン）

1. https://squoosh.app/ にアクセス
2. 画像をドラッグ＆ドロップ
3. フォーマットと品質を選択
4. ダウンロード

### CLIツールでの圧縮

```bash
# sharpを使用（Node.js）
npm install sharp

# JPEGをWebPに変換
npx sharp -i input.jpg -o output.webp -f webp -q 80

# 複数ファイルを一括変換
npx sharp -i "src/*.jpg" -o dist/ -f webp -q 80
```

```javascript
// sharp の Node.js スクリプト
const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

async function optimizeImage(inputPath, outputDir) {
  const filename = path.basename(inputPath, path.extname(inputPath));
  
  // WebP 生成
  await sharp(inputPath)
    .resize(1920, null, { withoutEnlargement: true })
    .webp({ quality: 80 })
    .toFile(path.join(outputDir, `${filename}.webp`));
  
  // AVIF 生成
  await sharp(inputPath)
    .resize(1920, null, { withoutEnlargement: true })
    .avif({ quality: 60 })
    .toFile(path.join(outputDir, `${filename}.avif`));
  
  // 複数サイズ生成（レスポンシブ用）
  const sizes = [400, 800, 1200, 1600];
  for (const size of sizes) {
    await sharp(inputPath)
      .resize(size, null, { withoutEnlargement: true })
      .webp({ quality: 80 })
      .toFile(path.join(outputDir, `${filename}-${size}.webp`));
  }
}
```

### ImageMagickでの圧縮

```bash
# JPEG圧縮
convert input.jpg -quality 80 -strip output.jpg

# WebP変換
convert input.jpg -quality 80 output.webp

# リサイズ + 圧縮
convert input.jpg -resize 1200x -quality 80 output.jpg

# 一括変換
for f in *.jpg; do convert "$f" -quality 80 "${f%.jpg}.webp"; done
```

### ImageOptim（macOS GUI）

1. https://imageoptim.com/ からダウンロード
2. 画像をドラッグ＆ドロップ
3. 自動で最適化される

---

## 📐 3. レスポンシブ画像

### srcset と sizes

```html
<img 
  src="image-800.jpg"
  srcset="
    image-400.jpg 400w,
    image-800.jpg 800w,
    image-1200.jpg 1200w,
    image-1600.jpg 1600w,
    image-2000.jpg 2000w
  "
  sizes="
    (max-width: 600px) 100vw,
    (max-width: 900px) 75vw,
    (max-width: 1200px) 50vw,
    800px
  "
  alt="説明文"
  loading="lazy"
  width="800"
  height="600"
>
```

### sizes属性の書き方

| sizes値 | 意味 |
|---------|------|
| `100vw` | ビューポート幅いっぱい |
| `50vw` | ビューポート幅の半分 |
| `(max-width: 600px) 100vw` | 600px以下では100vw |
| `calc(100vw - 2rem)` | 計算式も使用可能 |
| `800px` | 固定幅 |

### picture要素でアートディレクション

```html
<picture>
  <!-- モバイル用（縦長・クロップ版） -->
  <source 
    media="(max-width: 767px)" 
    srcset="
      image-mobile-400.webp 400w,
      image-mobile-800.webp 800w
    "
    sizes="100vw"
    type="image/webp"
  >
  
  <!-- デスクトップ用（横長・フル版） -->
  <source 
    media="(min-width: 768px)" 
    srcset="
      image-desktop-800.webp 800w,
      image-desktop-1200.webp 1200w,
      image-desktop-1600.webp 1600w
    "
    sizes="(max-width: 1200px) 100vw, 1200px"
    type="image/webp"
  >
  
  <img 
    src="image-desktop-1200.jpg" 
    alt="説明文"
    loading="lazy"
  >
</picture>
```

### 高解像度（Retina）対応

```html
<!-- 2x, 3x 対応 -->
<img 
  src="logo.png"
  srcset="
    logo.png 1x,
    logo@2x.png 2x,
    logo@3x.png 3x
  "
  alt="ロゴ"
  width="200"
  height="50"
>

<!-- または解像度に応じたサイズ -->
<img 
  src="logo-200.png"
  srcset="
    logo-200.png 200w,
    logo-400.png 400w,
    logo-600.png 600w
  "
  sizes="200px"
  alt="ロゴ"
  width="200"
  height="50"
>
```

---

## ⏳ 4. 遅延読み込み（Lazy Loading）

### ネイティブ lazy loading

```html
<!-- ファーストビュー外の画像 -->
<img 
  src="image.jpg" 
  alt="説明" 
  loading="lazy"
  decoding="async"
>

<!-- ファーストビュー内の画像（LCP候補） -->
<img 
  src="hero.jpg" 
  alt="ヒーロー画像" 
  loading="eager"
  fetchpriority="high"
>
```

### loading属性の使い分け

| 値 | 用途 |
|---|------|
| `lazy` | ファーストビュー外の画像 |
| `eager` | ファーストビュー内の重要な画像 |
| （なし） | デフォルト（eager相当） |

### Intersection Observer（高度な制御）

```javascript
// 低品質プレースホルダー → 高品質画像の読み込み
document.addEventListener('DOMContentLoaded', () => {
  const lazyImages = document.querySelectorAll('img[data-src]');
  
  const imageObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const img = entry.target;
        
        // srcset がある場合
        if (img.dataset.srcset) {
          img.srcset = img.dataset.srcset;
        }
        
        // src を設定
        img.src = img.dataset.src;
        
        // data属性を削除
        img.removeAttribute('data-src');
        img.removeAttribute('data-srcset');
        
        observer.unobserve(img);
      }
    });
  }, {
    rootMargin: '50px 0px' // 50px 手前で読み込み開始
  });
  
  lazyImages.forEach(img => imageObserver.observe(img));
});
```

```html
<!-- HTML -->
<img 
  src="placeholder-blur.jpg"
  data-src="full-image.jpg"
  data-srcset="image-400.jpg 400w, image-800.jpg 800w"
  alt="説明"
  class="lazy"
>
```

### ぼかしプレースホルダー（LQIP）

```css
.lazy {
  filter: blur(10px);
  transition: filter 0.3s ease;
}

.lazy.loaded {
  filter: blur(0);
}
```

```javascript
img.onload = () => {
  img.classList.add('loaded');
};
```

---

## 📏 5. サイズ指定とCLS対策

### 必ず幅と高さを指定

```html
<!-- ✅ 推奨：width と height を指定 -->
<img 
  src="image.jpg" 
  alt="説明"
  width="800" 
  height="600"
  loading="lazy"
>
```

### CSSでアスペクト比を維持

```css
/* aspect-ratio プロパティ */
.image-container {
  width: 100%;
  aspect-ratio: 16 / 9;
}

.image-container img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

/* パディングハック（古いブラウザ対応） */
.image-wrapper {
  position: relative;
  width: 100%;
  padding-top: 56.25%; /* 16:9 = 9/16 = 0.5625 */
}

.image-wrapper img {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
}
```

### 一般的なアスペクト比

| 比率 | padding-top | 用途 |
|-----|-------------|------|
| 16:9 | 56.25% | 動画、ヒーロー画像 |
| 4:3 | 75% | 従来のディスプレイ |
| 1:1 | 100% | サムネイル、アイコン |
| 3:2 | 66.67% | 写真（一眼レフ） |
| 21:9 | 42.86% | シネマスコープ |

### object-fit の使い方

```css
.image {
  width: 100%;
  height: 300px;
}

/* 画像全体を表示（余白ができる場合あり） */
.image.contain {
  object-fit: contain;
}

/* コンテナを埋める（切り取られる場合あり） */
.image.cover {
  object-fit: cover;
  object-position: center; /* 切り取り位置 */
}

/* 引き伸ばし */
.image.fill {
  object-fit: fill;
}
```

---

## 🌅 6. 背景画像の最適化

### レスポンシブ背景画像

```css
.hero {
  background-image: url('hero-mobile.webp');
  background-size: cover;
  background-position: center;
  min-height: 60vh;
}

@media (min-width: 768px) {
  .hero {
    background-image: url('hero-tablet.webp');
  }
}

@media (min-width: 1024px) {
  .hero {
    background-image: url('hero-desktop.webp');
  }
}

@media (min-width: 1440px) {
  .hero {
    background-image: url('hero-large.webp');
  }
}
```

### image-set() で複数フォーマット

```css
.hero {
  background-image: 
    image-set(
      url('hero.avif') type('image/avif'),
      url('hero.webp') type('image/webp'),
      url('hero.jpg') type('image/jpeg')
    );
}

/* Retina対応 */
.logo {
  background-image: 
    image-set(
      url('logo.png') 1x,
      url('logo@2x.png') 2x
    );
}
```

### 背景画像の遅延読み込み

```html
<!-- data属性で遅延 -->
<div class="hero" data-bg="hero.webp"></div>
```

```javascript
// Intersection Observer で読み込み
const lazyBgs = document.querySelectorAll('[data-bg]');

const bgObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const el = entry.target;
      el.style.backgroundImage = `url('${el.dataset.bg}')`;
      el.removeAttribute('data-bg');
      bgObserver.unobserve(el);
    }
  });
});

lazyBgs.forEach(el => bgObserver.observe(el));
```

---

## 🎯 7. アイコンの最適化

### SVGアイコン（推奨）

```html
<!-- インラインSVG（色変更可能） -->
<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
  <path d="M12 2L2 7l10 5 10-5-10-5z"/>
  <path d="M2 17l10 5 10-5"/>
</svg>

<!-- 外部SVGファイル -->
<img src="icon.svg" alt="アイコン" width="24" height="24">

<!-- SVGスプライト -->
<svg class="icon">
  <use href="icons.svg#icon-home"></use>
</svg>
```

### SVGスプライトの作成

```html
<!-- icons.svg -->
<svg xmlns="http://www.w3.org/2000/svg" style="display: none;">
  <symbol id="icon-home" viewBox="0 0 24 24">
    <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>
  </symbol>
  <symbol id="icon-user" viewBox="0 0 24 24">
    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
    <circle cx="12" cy="7" r="4"/>
  </symbol>
</svg>

<!-- 使用 -->
<svg class="icon" aria-hidden="true">
  <use href="#icon-home"></use>
</svg>
```

```css
.icon {
  width: 24px;
  height: 24px;
  fill: none;
  stroke: currentColor;
  stroke-width: 2;
}
```

### アイコンフォントからSVGへの移行

| アイコンフォント | SVG |
|----------------|-----|
| フォントファイル全体を読み込み | 使用するアイコンのみ |
| 色は単色のみ | 複数色可能 |
| ぼやけることがある | 常にシャープ |
| アクセシビリティ問題 | 適切なaria属性可能 |

---

## ⭐ 8. ファビコンの設定

### 完全なファビコンセット

```html
<head>
  <!-- 基本ファビコン -->
  <link rel="icon" href="/favicon.ico" sizes="32x32">
  <link rel="icon" href="/favicon.svg" type="image/svg+xml">
  
  <!-- Apple Touch Icon -->
  <link rel="apple-touch-icon" href="/apple-touch-icon.png">
  <!-- 180x180px 推奨 -->
  
  <!-- Android Chrome -->
  <link rel="manifest" href="/site.webmanifest">
  
  <!-- Windows タイル -->
  <meta name="msapplication-TileColor" content="#6366f1">
  <meta name="msapplication-TileImage" content="/mstile-144x144.png">
  
  <!-- テーマカラー -->
  <meta name="theme-color" content="#6366f1">
</head>
```

### site.webmanifest

```json
{
  "name": "サイト名",
  "short_name": "短い名前",
  "icons": [
    {
      "src": "/android-chrome-192x192.png",
      "sizes": "192x192",
      "type": "image/png"
    },
    {
      "src": "/android-chrome-512x512.png",
      "sizes": "512x512",
      "type": "image/png"
    }
  ],
  "theme_color": "#6366f1",
  "background_color": "#ffffff",
  "display": "standalone"
}
```

### 必要なファビコンサイズ

| ファイル | サイズ | 用途 |
|---------|-------|------|
| favicon.ico | 32x32 | ブラウザタブ |
| favicon.svg | - | モダンブラウザ |
| apple-touch-icon.png | 180x180 | iOS |
| android-chrome-192x192.png | 192x192 | Android |
| android-chrome-512x512.png | 512x512 | Android（スプラッシュ） |

### ファビコン生成ツール

- https://realfavicongenerator.net/
- https://favicon.io/

---

## 📱 9. OGP画像の最適化

### 推奨サイズ

| プラットフォーム | 推奨サイズ | アスペクト比 |
|----------------|-----------|-------------|
| Facebook / LinkedIn | 1200 x 630 | 1.91:1 |
| Twitter | 1200 x 628（large） | 1.91:1 |
| Twitter | 800 x 418（summary） | 1.91:1 |
| Instagram（ストーリー） | 1080 x 1920 | 9:16 |

### OGPタグ

```html
<head>
  <!-- Open Graph -->
  <meta property="og:type" content="website">
  <meta property="og:title" content="ページタイトル">
  <meta property="og:description" content="ページの説明">
  <meta property="og:url" content="https://example.com/page">
  <meta property="og:image" content="https://example.com/ogp.jpg">
  <meta property="og:image:width" content="1200">
  <meta property="og:image:height" content="630">
  <meta property="og:image:alt" content="画像の説明">
  
  <!-- Twitter Card -->
  <meta name="twitter:card" content="summary_large_image">
  <meta name="twitter:site" content="@username">
  <meta name="twitter:title" content="ページタイトル">
  <meta name="twitter:description" content="ページの説明">
  <meta name="twitter:image" content="https://example.com/twitter.jpg">
</head>
```

### OGP画像の注意点

- ファイルサイズは **8MB以下**（Twitter は 5MB以下）
- 絶対URLで指定
- HTTPSを使用
- 重要なテキストは中央に配置（端が切れる場合あり）

---

## ♿ 10. アクセシビリティ（alt属性）

### alt属性の書き方

```html
<!-- ✅ 良い例：具体的で意味のある説明 -->
<img src="team.jpg" alt="NEKOmaloチームの集合写真。5人のメンバーがオフィスで笑顔を見せている">

<!-- ✅ 良い例：機能を説明 -->
<img src="search.svg" alt="検索">

<!-- ✅ 装飾画像：空のalt -->
<img src="decorative-line.svg" alt="" role="presentation">

<!-- ❌ 悪い例：意味がない -->
<img src="image.jpg" alt="画像">
<img src="photo.jpg" alt="photo.jpg">
<img src="hero.jpg" alt="">  <!-- 装飾でないのにalt空 -->
```

### alt属性のルール

| 画像の種類 | alt属性 |
|-----------|---------|
| コンテンツ画像 | 画像の内容を説明 |
| 機能的な画像（ボタン等） | 機能を説明（「検索」「送信」等） |
| 装飾画像 | `alt=""` + `role="presentation"` |
| 複雑な画像（グラフ等） | 概要 + 詳細は別途提供 |
| テキストを含む画像 | テキスト内容を含める |

### 複雑な画像の説明

```html
<figure>
  <img 
    src="sales-chart.png" 
    alt="2024年の売上推移グラフ"
    aria-describedby="chart-description"
  >
  <figcaption id="chart-description">
    2024年の月別売上推移。1月の100万円から開始し、
    6月に一時的に80万円に減少したが、
    12月には300万円に達した。
  </figcaption>
</figure>
```

---

## 🌐 11. 画像CDN

### 主要な画像CDN

| サービス | 特徴 |
|---------|------|
| Cloudinary | 変換API、無料枠あり |
| imgix | 高機能、URL経由で変換 |
| Cloudflare Images | CDNと統合、低価格 |
| ImageKit | 使いやすい、日本語対応 |

### Cloudinaryの例

```html
<!-- URLで画像変換 -->
<img src="https://res.cloudinary.com/demo/image/upload/w_400,h_300,c_fill,q_auto,f_auto/sample.jpg" alt="サンプル">

<!-- パラメータ -->
<!-- w_400: 幅400px -->
<!-- h_300: 高さ300px -->
<!-- c_fill: クロップ -->
<!-- q_auto: 品質自動 -->
<!-- f_auto: フォーマット自動（WebP/AVIF） -->
```

### 自前での最適化 vs CDN

| 項目 | 自前 | CDN |
|-----|------|-----|
| 初期コスト | 開発時間 | 無料〜月額 |
| メンテナンス | 必要 | 不要 |
| 柔軟性 | 高い | サービス依存 |
| 配信速度 | サーバー依存 | 高速 |

---

## 🛠️ 12. 自動最適化ツール

### ビルドツール統合

```javascript
// Vite プラグイン
// vite.config.js
import { imagetools } from 'vite-imagetools';

export default {
  plugins: [
    imagetools({
      defaultDirectives: (url) => {
        return new URLSearchParams({
          format: 'webp',
          quality: '80',
          w: '400;800;1200;1600'
        });
      }
    })
  ]
};
```

### Gulp タスク

```javascript
const gulp = require('gulp');
const imagemin = require('gulp-imagemin');
const webp = require('gulp-webp');

gulp.task('images', () => {
  return gulp.src('src/images/**/*.{jpg,png}')
    .pipe(imagemin([
      imagemin.mozjpeg({ quality: 80 }),
      imagemin.optipng({ optimizationLevel: 5 })
    ]))
    .pipe(gulp.dest('dist/images'))
    .pipe(webp({ quality: 80 }))
    .pipe(gulp.dest('dist/images'));
});
```

### npm スクリプト

```json
{
  "scripts": {
    "images:webp": "npx sharp -i 'src/images/*.{jpg,png}' -o dist/images/ -f webp -q 80",
    "images:resize": "npx sharp -i 'src/images/*.jpg' -o dist/images/ --width 800 --width 1200 --width 1600"
  }
}
```

---

## ✅ 画像最適化チェックリスト

### フォーマット
- [ ] 適切なフォーマットを選択しているか
- [ ] WebP/AVIF を提供しているか
- [ ] フォールバック（JPEG/PNG）があるか

### 圧縮
- [ ] 画像を圧縮しているか
- [ ] 品質が適切か（見た目とサイズのバランス）

### レスポンシブ
- [ ] srcset を使用しているか
- [ ] sizes を適切に設定しているか
- [ ] 表示サイズに合った画像を提供しているか

### パフォーマンス
- [ ] loading="lazy" を設定しているか
- [ ] LCP画像に fetchpriority="high" があるか
- [ ] width と height を指定しているか（CLS対策）

### アクセシビリティ
- [ ] すべての画像に適切な alt があるか
- [ ] 装飾画像は alt="" になっているか

### その他
- [ ] ファビコンを設定しているか
- [ ] OGP画像を設定しているか
- [ ] 画像CDNを検討したか

---

## 📊 目標指標

| 指標 | 目標 |
|-----|------|
| Lighthouse Images | 警告0 |
| 画像1枚あたりサイズ | < 200KB（多くの場合） |
| LCP（画像が原因の場合） | < 2.5秒 |
| CLS（画像が原因の場合） | < 0.1 |

---

## 📚 参考リンク

- [Web.dev - 画像の最適化](https://web.dev/fast/#optimize-your-images)
- [Squoosh](https://squoosh.app/)
- [Sharp ドキュメント](https://sharp.pixelplumbing.com/)
- [MDN - レスポンシブ画像](https://developer.mozilla.org/ja/docs/Learn/HTML/Multimedia_and_embedding/Responsive_images)
