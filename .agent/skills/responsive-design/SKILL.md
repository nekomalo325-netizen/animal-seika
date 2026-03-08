---
name: responsive-design
description: レスポンシブデザインを実装するためのガイドライン。モバイル、タブレット、デスクトップに対応した柔軟なレイアウトを構築します。
---

# レスポンシブデザイン スキル

このスキルは、Webサイトやアプリケーションをあらゆるデバイス（モバイル、タブレット、デスクトップ）で美しく表示するためのレスポンシブデザインを実装するガイドラインです。

---

## 📱 ブレイクポイント定義

以下の標準ブレイクポイントを使用してください：

```css
/* === ブレイクポイント定義 === */

/* スマートフォン（縦向き）: 0 - 479px */
/* スマートフォン（横向き）: 480px - 767px */
/* タブレット: 768px - 1023px */
/* デスクトップ: 1024px - 1279px */
/* 大型デスクトップ: 1280px以上 */

:root {
  --breakpoint-sm: 480px;   /* スマホ横向き */
  --breakpoint-md: 768px;   /* タブレット */
  --breakpoint-lg: 1024px;  /* デスクトップ */
  --breakpoint-xl: 1280px;  /* 大型デスクトップ */
}
```

---

## 🎯 モバイルファーストアプローチ

**常にモバイルファーストで設計してください。** 基本スタイルはモバイル向けに書き、`min-width` メディアクエリで大きな画面に対応します。

### 基本パターン

```css
/* ベーススタイル（モバイル） */
.container {
  padding: 1rem;
  width: 100%;
}

/* タブレット以上 */
@media (min-width: 768px) {
  .container {
    padding: 2rem;
    max-width: 720px;
    margin: 0 auto;
  }
}

/* デスクトップ以上 */
@media (min-width: 1024px) {
  .container {
    padding: 3rem;
    max-width: 960px;
  }
}

/* 大型デスクトップ */
@media (min-width: 1280px) {
  .container {
    max-width: 1200px;
  }
}
```

---

## 📐 レイアウトパターン

### 1. フレックスボックスによるレスポンシブレイアウト

```css
.flex-container {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

@media (min-width: 768px) {
  .flex-container {
    flex-direction: row;
    flex-wrap: wrap;
  }
  
  .flex-item {
    flex: 1 1 calc(50% - 0.5rem);
  }
}

@media (min-width: 1024px) {
  .flex-item {
    flex: 1 1 calc(33.333% - 0.67rem);
  }
}
```

### 2. CSSグリッドによるレスポンシブレイアウト

```css
.grid-container {
  display: grid;
  gap: 1rem;
  grid-template-columns: 1fr;
}

@media (min-width: 768px) {
  .grid-container {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (min-width: 1024px) {
  .grid-container {
    grid-template-columns: repeat(3, 1fr);
    gap: 1.5rem;
  }
}

@media (min-width: 1280px) {
  .grid-container {
    grid-template-columns: repeat(4, 1fr);
    gap: 2rem;
  }
}
```

### 3. 自動調整グリッド（auto-fit/auto-fill）

```css
/* カード等に最適な自動調整グリッド */
.auto-grid {
  display: grid;
  gap: 1.5rem;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
}
```

---

## 🖼️ レスポンシブ画像

### 基本設定

```css
img {
  max-width: 100%;
  height: auto;
  display: block;
}
```

### picture要素による最適化

```html
<picture>
  <source media="(min-width: 1024px)" srcset="image-large.webp">
  <source media="(min-width: 768px)" srcset="image-medium.webp">
  <img src="image-small.webp" alt="説明文" loading="lazy">
</picture>
```

### 背景画像のレスポンシブ対応

```css
.hero {
  background-image: url('hero-mobile.webp');
  background-size: cover;
  background-position: center;
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
```

---

## 📝 レスポンシブタイポグラフィ

### clamp()を使用した流動的なフォントサイズ

```css
:root {
  /* 流動的なフォントサイズ */
  --font-size-xs: clamp(0.75rem, 0.7rem + 0.25vw, 0.875rem);
  --font-size-sm: clamp(0.875rem, 0.8rem + 0.375vw, 1rem);
  --font-size-base: clamp(1rem, 0.9rem + 0.5vw, 1.125rem);
  --font-size-lg: clamp(1.125rem, 1rem + 0.625vw, 1.375rem);
  --font-size-xl: clamp(1.25rem, 1rem + 1.25vw, 1.75rem);
  --font-size-2xl: clamp(1.5rem, 1rem + 2.5vw, 2.5rem);
  --font-size-3xl: clamp(2rem, 1rem + 4vw, 3.5rem);
  --font-size-4xl: clamp(2.5rem, 1rem + 6vw, 5rem);
}

h1 { font-size: var(--font-size-3xl); }
h2 { font-size: var(--font-size-2xl); }
h3 { font-size: var(--font-size-xl); }
p { font-size: var(--font-size-base); }
```

---

## 🧭 レスポンシブナビゲーション

### ハンバーガーメニュー実装

```html
<nav class="navbar">
  <a href="/" class="logo">Logo</a>
  <button class="menu-toggle" aria-label="メニューを開く" aria-expanded="false">
    <span class="hamburger"></span>
  </button>
  <ul class="nav-menu">
    <li><a href="#home">ホーム</a></li>
    <li><a href="#about">私について</a></li>
    <li><a href="#works">作品</a></li>
    <li><a href="#contact">お問い合わせ</a></li>
  </ul>
</nav>
```

```css
.navbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem;
  position: relative;
}

.menu-toggle {
  display: flex;
  flex-direction: column;
  gap: 5px;
  background: none;
  border: none;
  cursor: pointer;
  padding: 0.5rem;
  z-index: 1001;
}

.hamburger,
.hamburger::before,
.hamburger::after {
  display: block;
  width: 25px;
  height: 3px;
  background: currentColor;
  border-radius: 2px;
  transition: transform 0.3s ease;
}

.hamburger::before,
.hamburger::after {
  content: '';
}

.hamburger::before { transform: translateY(-8px); }
.hamburger::after { transform: translateY(8px); }

/* メニュー開閉アニメーション */
.menu-toggle[aria-expanded="true"] .hamburger {
  background: transparent;
}
.menu-toggle[aria-expanded="true"] .hamburger::before {
  transform: rotate(45deg);
}
.menu-toggle[aria-expanded="true"] .hamburger::after {
  transform: rotate(-45deg);
}

.nav-menu {
  position: fixed;
  top: 0;
  right: -100%;
  width: 80%;
  max-width: 300px;
  height: 100vh;
  background: var(--bg-color, #fff);
  padding: 5rem 2rem 2rem;
  transition: right 0.3s ease;
  z-index: 1000;
  list-style: none;
  margin: 0;
}

.nav-menu.active {
  right: 0;
}

.nav-menu li {
  margin-bottom: 1.5rem;
}

/* デスクトップ表示 */
@media (min-width: 768px) {
  .menu-toggle {
    display: none;
  }
  
  .nav-menu {
    position: static;
    display: flex;
    gap: 2rem;
    width: auto;
    height: auto;
    padding: 0;
    background: transparent;
  }
  
  .nav-menu li {
    margin-bottom: 0;
  }
}
```

```javascript
// ハンバーガーメニューのJavaScript
const menuToggle = document.querySelector('.menu-toggle');
const navMenu = document.querySelector('.nav-menu');

menuToggle.addEventListener('click', () => {
  const isExpanded = menuToggle.getAttribute('aria-expanded') === 'true';
  menuToggle.setAttribute('aria-expanded', !isExpanded);
  navMenu.classList.toggle('active');
  document.body.style.overflow = isExpanded ? '' : 'hidden';
});

// メニュー外クリックで閉じる
document.addEventListener('click', (e) => {
  if (!navMenu.contains(e.target) && !menuToggle.contains(e.target)) {
    menuToggle.setAttribute('aria-expanded', 'false');
    navMenu.classList.remove('active');
    document.body.style.overflow = '';
  }
});
```

---

## 📏 余白・スペーシング

### レスポンシブなスペーシング変数

```css
:root {
  /* 流動的なスペーシング */
  --space-xs: clamp(0.25rem, 0.2rem + 0.25vw, 0.5rem);
  --space-sm: clamp(0.5rem, 0.4rem + 0.5vw, 0.75rem);
  --space-md: clamp(1rem, 0.8rem + 1vw, 1.5rem);
  --space-lg: clamp(1.5rem, 1rem + 2.5vw, 3rem);
  --space-xl: clamp(2rem, 1rem + 5vw, 5rem);
  --space-2xl: clamp(3rem, 1.5rem + 7.5vw, 8rem);
}

section {
  padding: var(--space-xl) var(--space-md);
}
```

---

## ✅ チェックリスト

レスポンシブ対応時は以下を確認してください：

### デザイン
- [ ] モバイルファーストで設計されているか
- [ ] すべてのブレイクポイントで適切に表示されるか
- [ ] タッチデバイスで操作しやすいか（最小タップ領域 44x44px）
- [ ] 横スクロールが発生していないか

### 画像・メディア
- [ ] 画像が `max-width: 100%` で設定されているか
- [ ] 適切なサイズの画像が読み込まれているか
- [ ] 動画やiframeがレスポンシブか

### ナビゲーション
- [ ] モバイルでハンバーガーメニューが機能するか
- [ ] メニューの開閉がスムーズか
- [ ] キーボード操作でアクセス可能か

### タイポグラフィ
- [ ] 文字サイズが各画面サイズで読みやすいか
- [ ] 行の長さが適切か（推奨: 45〜75文字）

### テスト
- [ ] 実機での動作確認
- [ ] Chrome DevToolsのデバイスモード確認
- [ ] Safari/Firefox等のクロスブラウザテスト

---

## 🛠️ デバッグ用CSS

開発時に使用できるデバッグ用スタイル：

```css
/* 現在のブレイクポイントを表示 */
body::before {
  content: "📱 Mobile";
  position: fixed;
  bottom: 10px;
  right: 10px;
  background: rgba(0, 0, 0, 0.8);
  color: #fff;
  padding: 0.5rem 1rem;
  border-radius: 4px;
  font-size: 12px;
  z-index: 9999;
}

@media (min-width: 480px) {
  body::before { content: "📱 Mobile (Landscape)"; }
}

@media (min-width: 768px) {
  body::before { content: "📟 Tablet"; background: #2563eb; }
}

@media (min-width: 1024px) {
  body::before { content: "💻 Desktop"; background: #16a34a; }
}

@media (min-width: 1280px) {
  body::before { content: "🖥️ Large Desktop"; background: #9333ea; }
}
```

---

## 📚 参考リンク

- [MDN - レスポンシブデザイン](https://developer.mozilla.org/ja/docs/Learn/CSS/CSS_layout/Responsive_Design)
- [CSS-Tricks - A Complete Guide to Flexbox](https://css-tricks.com/snippets/css/a-guide-to-flexbox/)
- [CSS-Tricks - A Complete Guide to Grid](https://css-tricks.com/snippets/css/complete-guide-grid/)
