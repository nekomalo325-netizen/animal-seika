---
name: animation-transition
description: CSSアニメーション・トランジションを実装するためのガイドライン。ホバーエフェクト、スクロールアニメーション、マイクロインタラクション、パフォーマンス最適化を網羅します。
---

# アニメーション・トランジション スキル

このスキルは、Webサイトに魅力的なアニメーションとトランジションを実装するためのガイドラインです。パフォーマンスとアクセシビリティを考慮した実装を目指します。

---

## 🎯 アニメーションの目的

| 目的 | 例 |
|-----|-----|
| **フィードバック** | ボタンのホバー、クリック反応 |
| **状態変化** | メニュー開閉、タブ切り替え |
| **注目誘導** | CTAボタンの強調、新着表示 |
| **待機時間の軽減** | ローディングアニメーション |
| **ストーリーテリング** | スクロールに応じた演出 |

---

## ⚡ 1. CSSトランジションの基本

### 基本構文

```css
.element {
  /* 個別指定 */
  transition-property: transform, opacity;
  transition-duration: 0.3s;
  transition-timing-function: ease-out;
  transition-delay: 0s;
  
  /* ショートハンド */
  transition: transform 0.3s ease-out, opacity 0.3s ease-out;
}
```

### トランジション可能なプロパティ（推奨）

| プロパティ | パフォーマンス | 用途 |
|-----------|--------------|------|
| `transform` | 🟢 高速（GPU） | 移動、回転、拡大 |
| `opacity` | 🟢 高速（GPU） | フェード |
| `filter` | 🟡 中程度 | ぼかし、色調整 |
| `background-color` | 🟡 中程度 | 背景色変化 |
| `color` | 🟡 中程度 | テキスト色変化 |
| `box-shadow` | 🟠 やや遅い | 影の変化 |
| `width/height` | 🔴 遅い（避ける） | サイズ変化 |
| `top/left` | 🔴 遅い（避ける） | 位置変化 |

### パフォーマンスの高いアニメーション

```css
/* ❌ 避ける：レイアウト再計算が発生 */
.box {
  left: 0;
  transition: left 0.3s;
}
.box:hover {
  left: 100px;
}

/* ✅ 推奨：GPU処理で高速 */
.box {
  transform: translateX(0);
  transition: transform 0.3s;
}
.box:hover {
  transform: translateX(100px);
}
```

---

## 🎨 2. イージング関数

### 基本イージング

```css
:root {
  /* 標準 */
  --ease-linear: linear;
  --ease-in: ease-in;
  --ease-out: ease-out;
  --ease-in-out: ease-in-out;
  
  /* カスタム（より自然な動き） */
  --ease-out-expo: cubic-bezier(0.16, 1, 0.3, 1);
  --ease-out-cubic: cubic-bezier(0.33, 1, 0.68, 1);
  --ease-out-quart: cubic-bezier(0.25, 1, 0.5, 1);
  --ease-in-out-cubic: cubic-bezier(0.65, 0, 0.35, 1);
  
  /* バウンス */
  --ease-out-back: cubic-bezier(0.34, 1.56, 0.64, 1);
  --ease-out-bounce: cubic-bezier(0.34, 1.56, 0.64, 1);
  
  /* スプリング風 */
  --ease-spring: cubic-bezier(0.175, 0.885, 0.32, 1.275);
}
```

### イージングの使い分け

| イージング | 用途 |
|-----------|------|
| `ease-out` | 要素の出現、展開 |
| `ease-in` | 要素の退出、収縮 |
| `ease-in-out` | 循環するアニメーション |
| `ease-out-expo` | 素早く出現してゆっくり止まる |
| `ease-out-back` | 少し行き過ぎて戻る（弾む感じ） |

### イージングビジュアライザー

https://cubic-bezier.com/

---

## 🖱️ 3. ホバーエフェクト

### ボタンホバー

```css
/* 基本のボタンホバー */
.btn {
  background: var(--accent-color);
  color: #fff;
  padding: 0.875rem 1.75rem;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  transition: 
    background 0.2s ease-out,
    transform 0.2s ease-out,
    box-shadow 0.2s ease-out;
}

.btn:hover {
  background: var(--accent-hover);
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

.btn:active {
  transform: translateY(0);
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.1);
}

/* フォーカス */
.btn:focus-visible {
  outline: 3px solid var(--accent-color);
  outline-offset: 3px;
}
```

### リンクホバー（下線アニメーション）

```css
/* 左から右へ広がる下線 */
.link {
  position: relative;
  color: var(--accent-color);
  text-decoration: none;
}

.link::after {
  content: '';
  position: absolute;
  bottom: -2px;
  left: 0;
  width: 0;
  height: 2px;
  background: currentColor;
  transition: width 0.3s ease-out;
}

.link:hover::after {
  width: 100%;
}

/* 中央から広がる下線 */
.link-center::after {
  left: 50%;
  transform: translateX(-50%);
  width: 0;
}

.link-center:hover::after {
  width: 100%;
}
```

### カードホバー

```css
.card {
  background: #fff;
  border-radius: 16px;
  overflow: hidden;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
  transition: 
    transform 0.3s ease-out,
    box-shadow 0.3s ease-out;
}

.card:hover {
  transform: translateY(-8px);
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.12);
}

/* 画像のズーム */
.card__image {
  overflow: hidden;
}

.card__image img {
  transition: transform 0.4s ease-out;
}

.card:hover .card__image img {
  transform: scale(1.05);
}
```

### アイコンホバー

```css
/* 回転 */
.icon-rotate {
  transition: transform 0.3s ease-out;
}
.icon-rotate:hover {
  transform: rotate(90deg);
}

/* バウンス */
.icon-bounce {
  transition: transform 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
}
.icon-bounce:hover {
  transform: scale(1.2);
}

/* シェイク */
@keyframes shake {
  0%, 100% { transform: translateX(0); }
  20% { transform: translateX(-4px); }
  40% { transform: translateX(4px); }
  60% { transform: translateX(-4px); }
  80% { transform: translateX(4px); }
}

.icon-shake:hover {
  animation: shake 0.5s ease-in-out;
}
```

---

## 🔄 4. CSSアニメーション（@keyframes）

### 基本構文

```css
@keyframes fadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

/* 複数のキーフレーム */
@keyframes slideInUp {
  0% {
    opacity: 0;
    transform: translateY(30px);
  }
  100% {
    opacity: 1;
    transform: translateY(0);
  }
}

.element {
  animation: slideInUp 0.6s ease-out forwards;
}
```

### アニメーションプロパティ

```css
.element {
  animation-name: fadeIn;
  animation-duration: 0.5s;
  animation-timing-function: ease-out;
  animation-delay: 0s;
  animation-iteration-count: 1; /* infinite で無限 */
  animation-direction: normal; /* reverse, alternate */
  animation-fill-mode: forwards; /* none, backwards, both */
  animation-play-state: running; /* paused */
  
  /* ショートハンド */
  animation: fadeIn 0.5s ease-out forwards;
}
```

### fill-mode の違い

| 値 | 説明 |
|---|------|
| `none` | アニメ前後はスタイル適用なし |
| `forwards` | アニメ終了後も最終状態を維持 |
| `backwards` | アニメ開始前から初期状態を適用 |
| `both` | forwards + backwards |

---

## 📥 5. エントリーアニメーション

### フェードイン

```css
@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes fadeInDown {
  from {
    opacity: 0;
    transform: translateY(-20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes fadeInLeft {
  from {
    opacity: 0;
    transform: translateX(-20px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
}

@keyframes fadeInRight {
  from {
    opacity: 0;
    transform: translateX(20px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
}
```

### スケールイン

```css
@keyframes scaleIn {
  from {
    opacity: 0;
    transform: scale(0.9);
  }
  to {
    opacity: 1;
    transform: scale(1);
  }
}

@keyframes scaleInBounce {
  0% {
    opacity: 0;
    transform: scale(0.5);
  }
  70% {
    transform: scale(1.05);
  }
  100% {
    opacity: 1;
    transform: scale(1);
  }
}
```

### 遅延付きスタガーアニメーション

```css
.stagger-item {
  opacity: 0;
  animation: fadeInUp 0.6s ease-out forwards;
}

.stagger-item:nth-child(1) { animation-delay: 0s; }
.stagger-item:nth-child(2) { animation-delay: 0.1s; }
.stagger-item:nth-child(3) { animation-delay: 0.2s; }
.stagger-item:nth-child(4) { animation-delay: 0.3s; }
.stagger-item:nth-child(5) { animation-delay: 0.4s; }

/* CSS変数で動的に */
.stagger-item {
  animation-delay: calc(var(--index, 0) * 0.1s);
}
```

```html
<div class="stagger-item" style="--index: 0">Item 1</div>
<div class="stagger-item" style="--index: 1">Item 2</div>
<div class="stagger-item" style="--index: 2">Item 3</div>
```

---

## ⏳ 6. ローディングアニメーション

### スピナー

```css
/* シンプルスピナー */
.spinner {
  width: 40px;
  height: 40px;
  border: 3px solid var(--border-color);
  border-top-color: var(--accent-color);
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

/* ドットスピナー */
.dots-spinner {
  display: flex;
  gap: 8px;
}

.dots-spinner span {
  width: 12px;
  height: 12px;
  background: var(--accent-color);
  border-radius: 50%;
  animation: dotPulse 1.4s ease-in-out infinite;
}

.dots-spinner span:nth-child(2) { animation-delay: 0.16s; }
.dots-spinner span:nth-child(3) { animation-delay: 0.32s; }

@keyframes dotPulse {
  0%, 80%, 100% {
    transform: scale(0.6);
    opacity: 0.5;
  }
  40% {
    transform: scale(1);
    opacity: 1;
  }
}
```

### プログレスバー

```css
.progress-bar {
  width: 100%;
  height: 4px;
  background: var(--bg-alt);
  border-radius: 2px;
  overflow: hidden;
}

.progress-bar__fill {
  height: 100%;
  background: var(--accent-color);
  border-radius: 2px;
  transition: width 0.3s ease-out;
}

/* 不確定プログレス */
.progress-bar--indeterminate .progress-bar__fill {
  width: 30%;
  animation: indeterminate 1.5s ease-in-out infinite;
}

@keyframes indeterminate {
  0% { transform: translateX(-100%); }
  100% { transform: translateX(400%); }
}
```

### スケルトンローディング

```css
.skeleton {
  background: linear-gradient(
    90deg,
    var(--bg-alt) 0%,
    var(--bg-skeleton-highlight, #e5e7eb) 50%,
    var(--bg-alt) 100%
  );
  background-size: 200% 100%;
  animation: skeleton-shimmer 1.5s ease-in-out infinite;
  border-radius: 4px;
}

@keyframes skeleton-shimmer {
  0% { background-position: 200% 0; }
  100% { background-position: -200% 0; }
}

.skeleton-text {
  height: 1em;
  margin-bottom: 0.5em;
}

.skeleton-text:last-child {
  width: 60%;
}

.skeleton-avatar {
  width: 48px;
  height: 48px;
  border-radius: 50%;
}
```

---

## 📜 7. スクロールアニメーション

### Intersection Observer

```javascript
// スクロールで要素が見えたらアニメーション
const observerOptions = {
  root: null,
  rootMargin: '0px 0px -10% 0px',
  threshold: 0.1
};

const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('is-visible');
      observer.unobserve(entry.target); // 一度だけ
    }
  });
}, observerOptions);

document.querySelectorAll('.animate-on-scroll').forEach(el => {
  observer.observe(el);
});
```

```css
.animate-on-scroll {
  opacity: 0;
  transform: translateY(30px);
  transition: opacity 0.6s ease-out, transform 0.6s ease-out;
}

.animate-on-scroll.is-visible {
  opacity: 1;
  transform: translateY(0);
}

/* バリエーション */
.animate-on-scroll--left {
  transform: translateX(-30px);
}
.animate-on-scroll--left.is-visible {
  transform: translateX(0);
}

.animate-on-scroll--scale {
  transform: scale(0.9);
}
.animate-on-scroll--scale.is-visible {
  transform: scale(1);
}
```

### CSS scroll-driven animations（新しいAPI）

```css
/* スクロールに連動するアニメーション */
@keyframes fadeInOnScroll {
  from {
    opacity: 0;
    transform: translateY(50px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.scroll-animate {
  animation: fadeInOnScroll linear both;
  animation-timeline: view();
  animation-range: entry 0% entry 100%;
}
```

### パララックス効果

```css
.parallax-container {
  perspective: 1px;
  height: 100vh;
  overflow-x: hidden;
  overflow-y: auto;
}

.parallax-layer {
  position: absolute;
  inset: 0;
}

.parallax-layer--back {
  transform: translateZ(-1px) scale(2);
}

.parallax-layer--front {
  transform: translateZ(0);
}
```

```javascript
// JavaScript パララックス
window.addEventListener('scroll', () => {
  const scrollY = window.scrollY;
  
  document.querySelectorAll('[data-parallax]').forEach(el => {
    const speed = parseFloat(el.dataset.parallax) || 0.5;
    el.style.transform = `translateY(${scrollY * speed}px)`;
  });
});
```

---

## 🔀 8. 状態変化アニメーション

### アコーディオン

```css
.accordion__content {
  display: grid;
  grid-template-rows: 0fr;
  transition: grid-template-rows 0.3s ease-out;
}

.accordion__content.is-open {
  grid-template-rows: 1fr;
}

.accordion__content-inner {
  overflow: hidden;
}
```

### モーダル

```css
.modal {
  opacity: 0;
  visibility: hidden;
  transition: opacity 0.3s ease-out, visibility 0.3s;
}

.modal.is-open {
  opacity: 1;
  visibility: visible;
}

.modal__content {
  transform: scale(0.95) translateY(20px);
  transition: transform 0.3s ease-out;
}

.modal.is-open .modal__content {
  transform: scale(1) translateY(0);
}

/* バックドロップ */
.modal__backdrop {
  background: rgba(0, 0, 0, 0);
  transition: background 0.3s ease-out;
}

.modal.is-open .modal__backdrop {
  background: rgba(0, 0, 0, 0.5);
}
```

### ハンバーガーメニュー

```css
.hamburger {
  display: flex;
  flex-direction: column;
  gap: 6px;
  background: none;
  border: none;
  cursor: pointer;
  padding: 8px;
}

.hamburger span {
  display: block;
  width: 24px;
  height: 2px;
  background: currentColor;
  border-radius: 2px;
  transition: transform 0.3s ease-out, opacity 0.3s ease-out;
  transform-origin: center;
}

.hamburger[aria-expanded="true"] span:nth-child(1) {
  transform: translateY(8px) rotate(45deg);
}

.hamburger[aria-expanded="true"] span:nth-child(2) {
  opacity: 0;
}

.hamburger[aria-expanded="true"] span:nth-child(3) {
  transform: translateY(-8px) rotate(-45deg);
}
```

---

## ✨ 9. マイクロインタラクション

### いいねボタン

```css
.like-btn {
  background: none;
  border: none;
  cursor: pointer;
  font-size: 24px;
  transition: transform 0.2s ease-out;
}

.like-btn:active {
  transform: scale(0.9);
}

.like-btn.is-liked {
  animation: likePopup 0.4s ease-out;
}

@keyframes likePopup {
  0% { transform: scale(1); }
  25% { transform: scale(1.3); }
  50% { transform: scale(0.95); }
  100% { transform: scale(1); }
}
```

### コピーボタン

```css
.copy-btn {
  position: relative;
}

.copy-btn__tooltip {
  position: absolute;
  bottom: 100%;
  left: 50%;
  transform: translateX(-50%) translateY(10px);
  opacity: 0;
  visibility: hidden;
  background: var(--text-color);
  color: var(--bg-color);
  padding: 0.25rem 0.5rem;
  border-radius: 4px;
  font-size: 0.75rem;
  white-space: nowrap;
  transition: opacity 0.2s, transform 0.2s, visibility 0.2s;
}

.copy-btn.copied .copy-btn__tooltip {
  opacity: 1;
  visibility: visible;
  transform: translateX(-50%) translateY(-5px);
}
```

### 入力フィールドのフォーカス

```css
.input-group {
  position: relative;
}

.input-group input {
  width: 100%;
  padding: 1rem;
  border: 2px solid var(--border-color);
  border-radius: 8px;
  transition: border-color 0.2s ease-out;
}

.input-group label {
  position: absolute;
  left: 1rem;
  top: 50%;
  transform: translateY(-50%);
  color: var(--text-muted);
  pointer-events: none;
  transition: 
    top 0.2s ease-out,
    transform 0.2s ease-out,
    font-size 0.2s ease-out,
    color 0.2s ease-out;
}

.input-group input:focus,
.input-group input:not(:placeholder-shown) {
  border-color: var(--accent-color);
}

.input-group input:focus + label,
.input-group input:not(:placeholder-shown) + label {
  top: 0;
  transform: translateY(-50%);
  font-size: 0.75rem;
  color: var(--accent-color);
  background: var(--bg-color);
  padding: 0 0.25rem;
}
```

---

## 🎭 10. SVGアニメーション

### パスアニメーション

```css
.svg-path {
  stroke-dasharray: 1000;
  stroke-dashoffset: 1000;
  animation: drawPath 2s ease-out forwards;
}

@keyframes drawPath {
  to {
    stroke-dashoffset: 0;
  }
}
```

```html
<svg viewBox="0 0 100 100">
  <path class="svg-path" d="M10,50 Q50,10 90,50" fill="none" stroke="#6366f1" stroke-width="2"/>
</svg>
```

### モーフィング

```css
.morph-icon {
  transition: d 0.3s ease-out;
}

.morph-icon.is-active {
  d: path("新しいパスのd属性");
}
```

---

## ♿ 11. アクセシビリティ

### prefers-reduced-motion

```css
/* アニメーションを減らす設定を尊重 */
@media (prefers-reduced-motion: reduce) {
  *,
  *::before,
  *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
    scroll-behavior: auto !important;
  }
}

/* または個別に対応 */
.animated-element {
  transition: transform 0.3s ease-out;
}

@media (prefers-reduced-motion: reduce) {
  .animated-element {
    transition: none;
  }
}
```

### フォーカス可視性

```css
/* キーボードフォーカス時のみアウトライン */
:focus-visible {
  outline: 3px solid var(--accent-color);
  outline-offset: 2px;
}

/* マウスクリック時はアウトラインなし */
:focus:not(:focus-visible) {
  outline: none;
}
```

---

## 🚀 12. パフォーマンス最適化

### will-change

```css
/* アニメーション直前にのみ適用 */
.card {
  transition: transform 0.3s;
}

.card:hover {
  will-change: transform;
}

/* アニメーション終了後に解除 */
```

```javascript
element.addEventListener('mouseenter', () => {
  element.style.willChange = 'transform';
});

element.addEventListener('transitionend', () => {
  element.style.willChange = 'auto';
});
```

### GPU アクセラレーション

```css
/* transform: translate3d() でGPUレイヤーを強制 */
.accelerated {
  transform: translate3d(0, 0, 0);
  /* または */
  will-change: transform;
}
```

### contain プロパティ

```css
.animated-container {
  contain: layout style paint;
}
```

---

## 📦 13. JavaScript アニメーション

### Web Animations API

```javascript
// 基本的なアニメーション
const element = document.querySelector('.box');

element.animate([
  { transform: 'translateX(0)', opacity: 1 },
  { transform: 'translateX(100px)', opacity: 0.5 }
], {
  duration: 500,
  easing: 'ease-out',
  fill: 'forwards'
});

// アニメーションの制御
const animation = element.animate(keyframes, options);
animation.pause();
animation.play();
animation.reverse();
animation.cancel();
animation.finish();

// 完了を待つ
await animation.finished;
```

### GSAP（GreenSock）

```html
<script src="https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.2/gsap.min.js"></script>
<script src="https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.2/ScrollTrigger.min.js"></script>
```

```javascript
// 基本
gsap.to('.box', {
  x: 100,
  opacity: 0.5,
  duration: 0.5,
  ease: 'power2.out'
});

// スクロールトリガー
gsap.registerPlugin(ScrollTrigger);

gsap.from('.section', {
  y: 50,
  opacity: 0,
  duration: 0.8,
  stagger: 0.2,
  scrollTrigger: {
    trigger: '.section',
    start: 'top 80%',
    end: 'bottom 20%',
    toggleActions: 'play none none reverse'
  }
});

// タイムライン
const tl = gsap.timeline();
tl.to('.element1', { x: 100, duration: 0.3 })
  .to('.element2', { y: 50, duration: 0.3 }, '-=0.1')
  .to('.element3', { scale: 1.2, duration: 0.3 });
```

---

## ✅ アニメーションチェックリスト

### パフォーマンス
- [ ] transform と opacity のみを使用しているか
- [ ] will-change を適切に使用しているか
- [ ] アニメーションが60fps で動作しているか
- [ ] 不要なリペイント/リフローがないか

### アクセシビリティ
- [ ] prefers-reduced-motion に対応しているか
- [ ] アニメーションが意味を持っているか（装飾だけでない）
- [ ] 点滅するアニメーションを避けているか
- [ ] フォーカスインジケーターがあるか

### UX
- [ ] アニメーション時間が適切か（0.2〜0.5秒）
- [ ] イージングが自然か
- [ ] 目的に合ったアニメーションか

---

## 📏 推奨デュレーション

| 種類 | デュレーション |
|-----|---------------|
| ホバー | 0.15 - 0.25s |
| ボタンクリック | 0.1 - 0.2s |
| モーダル開閉 | 0.2 - 0.3s |
| ページトランジション | 0.3 - 0.5s |
| スクロールアニメーション | 0.4 - 0.8s |
| 複雑なアニメーション | 0.5 - 1.0s |

---

## 📚 参考リンク

- [MDN - CSS Animations](https://developer.mozilla.org/ja/docs/Web/CSS/CSS_Animations)
- [MDN - CSS Transitions](https://developer.mozilla.org/ja/docs/Web/CSS/CSS_Transitions)
- [Cubic Bezier](https://cubic-bezier.com/)
- [GSAP](https://greensock.com/gsap/)
- [Animate.css](https://animate.style/)
