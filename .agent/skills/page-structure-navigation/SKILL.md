---
name: page-structure-navigation
description: 分かりやすいページ構成とナビゲーションを設計するためのガイドライン。ユーザーが迷わずに目的の情報にたどり着ける設計を実現します。
---

# ページ構成とナビゲーション スキル

このスキルは、ユーザーが直感的に操作でき、目的の情報に素早くアクセスできるページ構成とナビゲーションを設計するためのガイドラインです。

---

## 🎯 設計の基本原則

### 3クリックルール
ユーザーは**最大3クリック以内**で目的の情報に到達できるべきです。

### 7±2の法則
ナビゲーション項目は**5〜9個**に収めましょう。人間が一度に記憶できる項目数には限界があります。

### F型パターン
ユーザーは画面を**F字型**にスキャンします。重要な情報は左上に配置してください。

```
┌─────────────────────────────┐
│ ████████████████████        │ ← 最初に水平にスキャン
│ ██████████████              │ ← 少し下で再び水平に
│ ██                          │
│ ██                          │ ← 左側を縦にスキャン
│ ██                          │
│ ██                          │
└─────────────────────────────┘
```

---

## 📐 ページ構成の基本レイアウト

### シングルページ構成（ポートフォリオ向け）

```
┌─────────────────────────────────────────┐
│              ヘッダー / ナビ              │
├─────────────────────────────────────────┤
│                                         │
│              ヒーロー                    │
│     (ファーストビュー / キャッチ)         │
│                                         │
├─────────────────────────────────────────┤
│            自己紹介 / About              │
├─────────────────────────────────────────┤
│            作品一覧 / Works              │
├─────────────────────────────────────────┤
│            スキル / Services             │
├─────────────────────────────────────────┤
│          お問い合わせ / Contact           │
├─────────────────────────────────────────┤
│              フッター                    │
└─────────────────────────────────────────┘
```

### HTML構造

```html
<body>
  <!-- スキップリンク（アクセシビリティ） -->
  <a href="#main-content" class="skip-link">メインコンテンツへスキップ</a>

  <!-- ヘッダー -->
  <header class="header" role="banner">
    <div class="header__container">
      <a href="/" class="header__logo">
        <img src="/logo.svg" alt="NEKOmalo ホームへ戻る">
      </a>
      <nav class="header__nav" role="navigation" aria-label="メインナビゲーション">
        <!-- ナビゲーション -->
      </nav>
    </div>
  </header>

  <!-- メインコンテンツ -->
  <main id="main-content" role="main">
    <!-- ヒーローセクション -->
    <section id="hero" class="hero" aria-labelledby="hero-title">
      <h1 id="hero-title">NEKOmalo</h1>
      <p class="hero__tagline">VTuber & イラストレーター</p>
      <a href="#contact" class="hero__cta">お問い合わせ</a>
    </section>

    <!-- About セクション -->
    <section id="about" class="section" aria-labelledby="about-title">
      <h2 id="about-title" class="section__title">About</h2>
      <!-- コンテンツ -->
    </section>

    <!-- Works セクション -->
    <section id="works" class="section" aria-labelledby="works-title">
      <h2 id="works-title" class="section__title">Works</h2>
      <!-- コンテンツ -->
    </section>

    <!-- Contact セクション -->
    <section id="contact" class="section" aria-labelledby="contact-title">
      <h2 id="contact-title" class="section__title">Contact</h2>
      <!-- コンテンツ -->
    </section>
  </main>

  <!-- フッター -->
  <footer class="footer" role="contentinfo">
    <!-- フッターコンテンツ -->
  </footer>
</body>
```

---

## 🧭 ナビゲーションパターン

### 1. グローバルナビゲーション（メインナビ）

全ページで一貫して表示される主要ナビゲーション。

```html
<nav class="nav" role="navigation" aria-label="メインナビゲーション">
  <ul class="nav__list">
    <li class="nav__item">
      <a href="#hero" class="nav__link" aria-current="page">ホーム</a>
    </li>
    <li class="nav__item">
      <a href="#about" class="nav__link">私について</a>
    </li>
    <li class="nav__item">
      <a href="#works" class="nav__link">作品</a>
    </li>
    <li class="nav__item">
      <a href="#contact" class="nav__link nav__link--cta">お問い合わせ</a>
    </li>
  </ul>
</nav>
```

```css
.nav {
  display: flex;
  align-items: center;
}

.nav__list {
  display: flex;
  gap: 2rem;
  list-style: none;
  margin: 0;
  padding: 0;
}

.nav__link {
  color: var(--text-color);
  text-decoration: none;
  padding: 0.5rem 0;
  position: relative;
  transition: color 0.3s ease;
}

/* ホバーエフェクト（アンダーライン） */
.nav__link::after {
  content: '';
  position: absolute;
  bottom: 0;
  left: 0;
  width: 0;
  height: 2px;
  background: var(--accent-color);
  transition: width 0.3s ease;
}

.nav__link:hover::after,
.nav__link[aria-current="page"]::after {
  width: 100%;
}

/* CTA ボタンスタイル */
.nav__link--cta {
  background: var(--accent-color);
  color: #fff;
  padding: 0.75rem 1.5rem;
  border-radius: 9999px;
}

.nav__link--cta::after {
  display: none;
}
```

### 2. 固定ヘッダー（スティッキーナビ）

スクロールしても常に表示されるナビゲーション。

```css
.header {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 1000;
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(10px);
  transition: all 0.3s ease;
}

/* スクロール時のスタイル変更 */
.header.scrolled {
  box-shadow: 0 2px 20px rgba(0, 0, 0, 0.1);
  padding: 0.5rem 0;
}

/* メインコンテンツの余白確保 */
main {
  padding-top: 80px; /* ヘッダーの高さ分 */
}
```

```javascript
// スクロール時のヘッダースタイル変更
const header = document.querySelector('.header');

window.addEventListener('scroll', () => {
  if (window.scrollY > 50) {
    header.classList.add('scrolled');
  } else {
    header.classList.remove('scrolled');
  }
});
```

### 3. モバイルナビゲーション（ハンバーガーメニュー）

```html
<header class="header">
  <a href="/" class="header__logo">Logo</a>
  
  <!-- ハンバーガーボタン -->
  <button 
    class="menu-toggle" 
    aria-label="メニューを開く"
    aria-expanded="false"
    aria-controls="mobile-menu"
  >
    <span class="menu-toggle__bar"></span>
    <span class="menu-toggle__bar"></span>
    <span class="menu-toggle__bar"></span>
  </button>
  
  <!-- モバイルメニュー -->
  <nav id="mobile-menu" class="mobile-nav" aria-label="モバイルナビゲーション">
    <ul class="mobile-nav__list">
      <li><a href="#hero" class="mobile-nav__link">ホーム</a></li>
      <li><a href="#about" class="mobile-nav__link">私について</a></li>
      <li><a href="#works" class="mobile-nav__link">作品</a></li>
      <li><a href="#contact" class="mobile-nav__link">お問い合わせ</a></li>
    </ul>
  </nav>
</header>
```

```css
/* ハンバーガーボタン */
.menu-toggle {
  display: none;
  flex-direction: column;
  justify-content: center;
  gap: 6px;
  width: 44px;
  height: 44px;
  background: none;
  border: none;
  cursor: pointer;
  padding: 10px;
  z-index: 1001;
}

.menu-toggle__bar {
  display: block;
  width: 24px;
  height: 2px;
  background: var(--text-color);
  border-radius: 2px;
  transition: all 0.3s ease;
}

/* アニメーション（開いた状態） */
.menu-toggle[aria-expanded="true"] .menu-toggle__bar:nth-child(1) {
  transform: translateY(8px) rotate(45deg);
}

.menu-toggle[aria-expanded="true"] .menu-toggle__bar:nth-child(2) {
  opacity: 0;
}

.menu-toggle[aria-expanded="true"] .menu-toggle__bar:nth-child(3) {
  transform: translateY(-8px) rotate(-45deg);
}

/* モバイルメニュー */
.mobile-nav {
  position: fixed;
  top: 0;
  right: -100%;
  width: 80%;
  max-width: 320px;
  height: 100vh;
  background: var(--bg-color);
  padding: 6rem 2rem 2rem;
  box-shadow: -4px 0 20px rgba(0, 0, 0, 0.1);
  transition: right 0.3s ease;
  z-index: 1000;
}

.mobile-nav.is-open {
  right: 0;
}

.mobile-nav__list {
  list-style: none;
  padding: 0;
  margin: 0;
}

.mobile-nav__link {
  display: block;
  padding: 1rem 0;
  font-size: 1.25rem;
  color: var(--text-color);
  text-decoration: none;
  border-bottom: 1px solid var(--border-color);
}

/* オーバーレイ */
.overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  opacity: 0;
  visibility: hidden;
  transition: all 0.3s ease;
  z-index: 999;
}

.overlay.is-visible {
  opacity: 1;
  visibility: visible;
}

/* レスポンシブ */
@media (max-width: 767px) {
  .nav {
    display: none;
  }
  
  .menu-toggle {
    display: flex;
  }
}

@media (min-width: 768px) {
  .mobile-nav,
  .overlay {
    display: none;
  }
}
```

```javascript
// モバイルメニューの制御
const menuToggle = document.querySelector('.menu-toggle');
const mobileNav = document.querySelector('.mobile-nav');
const overlay = document.querySelector('.overlay');
const mobileLinks = document.querySelectorAll('.mobile-nav__link');

function openMenu() {
  menuToggle.setAttribute('aria-expanded', 'true');
  menuToggle.setAttribute('aria-label', 'メニューを閉じる');
  mobileNav.classList.add('is-open');
  overlay.classList.add('is-visible');
  document.body.style.overflow = 'hidden';
}

function closeMenu() {
  menuToggle.setAttribute('aria-expanded', 'false');
  menuToggle.setAttribute('aria-label', 'メニューを開く');
  mobileNav.classList.remove('is-open');
  overlay.classList.remove('is-visible');
  document.body.style.overflow = '';
}

menuToggle.addEventListener('click', () => {
  const isExpanded = menuToggle.getAttribute('aria-expanded') === 'true';
  if (isExpanded) {
    closeMenu();
  } else {
    openMenu();
  }
});

overlay.addEventListener('click', closeMenu);

// リンククリックでメニューを閉じる
mobileLinks.forEach(link => {
  link.addEventListener('click', closeMenu);
});

// Escキーでメニューを閉じる
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') {
    closeMenu();
  }
});
```

### 4. パンくずリスト

ユーザーの現在位置を示すナビゲーション。

```html
<nav aria-label="パンくずリスト" class="breadcrumb">
  <ol class="breadcrumb__list">
    <li class="breadcrumb__item">
      <a href="/" class="breadcrumb__link">ホーム</a>
    </li>
    <li class="breadcrumb__item">
      <a href="/works" class="breadcrumb__link">作品一覧</a>
    </li>
    <li class="breadcrumb__item" aria-current="page">
      <span class="breadcrumb__current">イラスト作品</span>
    </li>
  </ol>
</nav>
```

```css
.breadcrumb__list {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  list-style: none;
  padding: 0;
  margin: 0;
  font-size: 0.875rem;
}

.breadcrumb__item {
  display: flex;
  align-items: center;
}

.breadcrumb__item:not(:last-child)::after {
  content: '/';
  margin-left: 0.5rem;
  color: var(--text-muted);
}

.breadcrumb__link {
  color: var(--accent-color);
  text-decoration: none;
}

.breadcrumb__link:hover {
  text-decoration: underline;
}

.breadcrumb__current {
  color: var(--text-muted);
}
```

### 5. ページ内ナビゲーション（スムーススクロール）

```css
html {
  scroll-behavior: smooth;
}

/* スクロール位置の調整（固定ヘッダー対応） */
section[id] {
  scroll-margin-top: 100px;
}
```

```javascript
// スムーススクロール（より細かい制御が必要な場合）
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function(e) {
    const targetId = this.getAttribute('href');
    if (targetId === '#') return;
    
    const target = document.querySelector(targetId);
    if (target) {
      e.preventDefault();
      
      const headerHeight = document.querySelector('.header').offsetHeight;
      const targetPosition = target.getBoundingClientRect().top + window.pageYOffset - headerHeight - 20;
      
      window.scrollTo({
        top: targetPosition,
        behavior: 'smooth'
      });
      
      // フォーカス管理（アクセシビリティ）
      target.setAttribute('tabindex', '-1');
      target.focus();
    }
  });
});
```

### 6. 現在位置のハイライト（スクロールスパイ）

```javascript
// アクティブなセクションをハイライト
const sections = document.querySelectorAll('section[id]');
const navLinks = document.querySelectorAll('.nav__link');

function highlightNav() {
  const scrollPos = window.scrollY + 150;
  
  sections.forEach(section => {
    const sectionTop = section.offsetTop;
    const sectionHeight = section.offsetHeight;
    const sectionId = section.getAttribute('id');
    
    if (scrollPos >= sectionTop && scrollPos < sectionTop + sectionHeight) {
      navLinks.forEach(link => {
        link.removeAttribute('aria-current');
        if (link.getAttribute('href') === `#${sectionId}`) {
          link.setAttribute('aria-current', 'page');
        }
      });
    }
  });
}

window.addEventListener('scroll', highlightNav);
highlightNav(); // 初期化
```

---

## 📍 視覚的ヒエラルキー

### セクション間の区切り

```css
.section {
  padding: var(--space-section, 5rem) var(--space-container, 2rem);
}

/* 交互の背景色 */
.section:nth-child(even) {
  background: var(--bg-alt);
}

/* セクションタイトル */
.section__title {
  text-align: center;
  margin-bottom: 3rem;
  position: relative;
}

/* 装飾ライン */
.section__title::after {
  content: '';
  display: block;
  width: 60px;
  height: 3px;
  background: var(--accent-color);
  margin: 1rem auto 0;
  border-radius: 2px;
}
```

### カード型レイアウト

```html
<div class="card-grid">
  <article class="card">
    <div class="card__image">
      <img src="work.jpg" alt="作品タイトル" loading="lazy">
    </div>
    <div class="card__content">
      <h3 class="card__title">作品タイトル</h3>
      <p class="card__description">作品の説明文がここに入ります。</p>
      <a href="/works/1" class="card__link">詳細を見る</a>
    </div>
  </article>
</div>
```

```css
.card-grid {
  display: grid;
  gap: 2rem;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
}

.card {
  background: var(--card-bg);
  border-radius: 16px;
  overflow: hidden;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.card:hover {
  transform: translateY(-8px);
  box-shadow: 0 12px 40px rgba(0, 0, 0, 0.15);
}

.card__image {
  aspect-ratio: 16 / 10;
  overflow: hidden;
}

.card__image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.3s ease;
}

.card:hover .card__image img {
  transform: scale(1.05);
}

.card__content {
  padding: 1.5rem;
}

.card__title {
  margin-bottom: 0.5rem;
}

.card__description {
  color: var(--text-muted);
  margin-bottom: 1rem;
}

.card__link {
  color: var(--accent-color);
  font-weight: 600;
  text-decoration: none;
}

.card__link:hover {
  text-decoration: underline;
}
```

---

## 🔘 CTA（Call To Action）の配置

### 効果的なCTA配置パターン

```
1. ヒーローセクション     → メインCTA（お問い合わせ等）
2. セクション末尾         → 関連アクション
3. 固定フッターCTA       → 常時表示（モバイル）
4. ナビゲーション内       → 重要なアクション
```

### フローティングCTA（モバイル用）

```html
<a href="#contact" class="floating-cta">
  <span class="floating-cta__text">お問い合わせ</span>
  <svg class="floating-cta__icon" aria-hidden="true"><!-- アイコン --></svg>
</a>
```

```css
.floating-cta {
  display: none;
  position: fixed;
  bottom: 20px;
  right: 20px;
  background: var(--accent-color);
  color: #fff;
  padding: 1rem 1.5rem;
  border-radius: 9999px;
  text-decoration: none;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.2);
  z-index: 900;
  transition: transform 0.3s ease;
}

.floating-cta:hover {
  transform: scale(1.05);
}

@media (max-width: 767px) {
  .floating-cta {
    display: flex;
    align-items: center;
    gap: 0.5rem;
  }
}
```

---

## ♿ アクセシビリティ対応

### スキップリンク

```html
<a href="#main-content" class="skip-link">メインコンテンツへスキップ</a>
```

```css
.skip-link {
  position: absolute;
  top: -100%;
  left: 50%;
  transform: translateX(-50%);
  background: var(--accent-color);
  color: #fff;
  padding: 1rem 2rem;
  border-radius: 0 0 8px 8px;
  text-decoration: none;
  z-index: 9999;
  transition: top 0.3s ease;
}

.skip-link:focus {
  top: 0;
}
```

### フォーカス管理

```css
/* フォーカスインジケーター */
:focus-visible {
  outline: 3px solid var(--accent-color);
  outline-offset: 2px;
}

/* 非キーボード操作時はアウトラインを非表示 */
:focus:not(:focus-visible) {
  outline: none;
}
```

### キーボードナビゲーション

```javascript
// Tabキーでのナビゲーション
// すべてのインタラクティブ要素にtabindex="0"が設定されていることを確認

// ドロップダウンメニューのキーボード操作
const dropdown = document.querySelector('.dropdown');
const dropdownItems = dropdown.querySelectorAll('a');

dropdown.addEventListener('keydown', (e) => {
  const currentIndex = Array.from(dropdownItems).indexOf(document.activeElement);
  
  switch(e.key) {
    case 'ArrowDown':
      e.preventDefault();
      dropdownItems[Math.min(currentIndex + 1, dropdownItems.length - 1)].focus();
      break;
    case 'ArrowUp':
      e.preventDefault();
      dropdownItems[Math.max(currentIndex - 1, 0)].focus();
      break;
    case 'Escape':
      closeDropdown();
      break;
  }
});
```

---

## ✅ チェックリスト

### ページ構成
- [ ] 論理的なセクション順序になっているか
- [ ] 見出しの階層が正しいか（h1→h2→h3）
- [ ] 各セクションに明確なIDがあるか
- [ ] ファーストビューで価値が伝わるか

### ナビゲーション
- [ ] ナビゲーション項目は7個以内か
- [ ] 現在位置が分かるハイライトがあるか
- [ ] モバイルでハンバーガーメニューが機能するか
- [ ] スムーススクロールが実装されているか
- [ ] 固定ヘッダーの場合、スクロール位置が調整されているか

### アクセシビリティ
- [ ] スキップリンクがあるか
- [ ] aria-label / aria-current が適切に設定されているか
- [ ] キーボードのみで操作できるか
- [ ] フォーカスインジケーターが見えるか
- [ ] Escキーでメニューが閉じるか

### ビジュアル
- [ ] CTAボタンが目立つか
- [ ] セクション間の区切りが明確か
- [ ] カードやコンテンツの配置にリズムがあるか
- [ ] ホバー/アクティブ状態が分かりやすいか

---

## 📚 参考リンク

- [MDN - ARIA ランドマーク](https://developer.mozilla.org/ja/docs/Web/Accessibility/ARIA/Roles#landmark_roles)
- [Web Content Accessibility Guidelines (WCAG)](https://www.w3.org/WAI/standards-guidelines/wcag/)
- [Nielsen Norman Group - Navigation](https://www.nngroup.com/topic/navigation/)
