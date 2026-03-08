---
name: universal-design
description: ユニバーサルデザインを意識したWeb制作ガイドライン。年齢、障害、環境に関わらず誰もが使いやすいサイトを実現します。
---

# ユニバーサルデザイン スキル

このスキルは、年齢、性別、障害の有無、国籍、利用環境などに関わらず、できる限り多くの人が利用できるWebサイトを制作するためのガイドラインです。

---

## 🌍 ユニバーサルデザインの7原則

| 原則 | 説明 | Webでの適用例 |
|-----|------|-------------|
| **1. 公平性** | 誰でも公平に使える | 代替テキスト、キーボード操作 |
| **2. 柔軟性** | 使う人の能力に応じて使える | フォントサイズ変更、ダークモード |
| **3. 単純性** | 使い方が簡単で直感的 | シンプルなナビゲーション |
| **4. 明確さ** | 必要な情報が理解しやすい | 明確なラベル、視覚的フィードバック |
| **5. 安全性** | 間違えても安全 | 確認ダイアログ、取り消し機能 |
| **6. 省体力** | 少ない労力で使える | 自動入力、ショートカット |
| **7. 空間性** | 適切なサイズと空間 | 十分なタップ領域、余白 |

---

## 👁️ 視覚への配慮

### 1. 色覚多様性（色覚異常）への対応

約20人に1人（男性の約5%）が色覚に特性があります。

#### カラーユニバーサルデザイン

```css
/* ❌ 避けるべき配色 */
/* 赤と緑の組み合わせ（最も識別困難） */
.error { color: #ff0000; }  /* 赤 */
.success { color: #00ff00; } /* 緑 */

/* ✅ 推奨配色 */
/* 色相だけでなく明度も変える */
.error { 
  color: #dc2626;  /* 赤系 */
  /* + アイコンやパターンを併用 */
}
.success { 
  color: #0284c7;  /* 青系（緑の代わり） */
  /* または明度の高い緑 */
  color: #16a34a;
}
```

#### 色だけに頼らない情報伝達

```html
<!-- ❌ 色だけで状態を示す -->
<span class="status-red">エラー</span>
<span class="status-green">成功</span>

<!-- ✅ 色 + アイコン + テキストで示す -->
<span class="status error">
  <svg aria-hidden="true"><!-- × アイコン --></svg>
  エラー: 入力内容を確認してください
</span>
<span class="status success">
  <svg aria-hidden="true"><!-- ✓ アイコン --></svg>
  成功: 送信が完了しました
</span>
```

```css
/* パターンや形状を追加 */
.error {
  color: #dc2626;
  border-left: 4px solid currentColor;
  background: url('pattern-diagonal.svg'); /* 斜線パターン */
}

.success {
  color: #16a34a;
  border-left: 4px solid currentColor;
  background: url('pattern-dots.svg'); /* ドットパターン */
}
```

#### グラフ・チャートの対応

```css
/* 棒グラフや円グラフでは色+パターンを使用 */
.chart-bar-1 { background: #3b82f6; } /* 青 - 無地 */
.chart-bar-2 { 
  background: 
    repeating-linear-gradient(
      45deg,
      #f97316,
      #f97316 5px,
      #fdba74 5px,
      #fdba74 10px
    ); /* オレンジ - 斜線 */
}
.chart-bar-3 { 
  background: 
    radial-gradient(
      circle,
      #8b5cf6 2px,
      #c4b5fd 2px
    ); /* 紫 - ドット */
  background-size: 8px 8px;
}
```

#### 色覚シミュレーションツール

| ツール | 用途 |
|-------|------|
| Chrome DevTools | Rendering > Emulate vision deficiencies |
| Stark (Figma/Adobe) | デザインツール用プラグイン |
| Color Oracle | OS全体のシミュレーション |
| Coblis | 画像の色覚シミュレーション |

### 2. 弱視・ロービジョンへの対応

視力が低い方や視野が狭い方への配慮。

#### コントラスト比の確保

```css
/* WCAG 2.1 基準 */
/* AAA レベル（推奨）: 7:1以上 */
/* AA レベル（最低限）: 4.5:1以上（通常テキスト）*/
/* AA レベル（最低限）: 3:1以上（大きいテキスト 18px以上 or 太字14px以上）*/

:root {
  /* 高コントラストな配色例 */
  --text-color: #1f2937;        /* 背景白との比: 約14:1 */
  --text-muted: #4b5563;        /* 背景白との比: 約7:1 */
  --bg-color: #ffffff;
  
  /* リンクは背景と本文の両方と区別 */
  --link-color: #1d4ed8;        /* 濃い青 */
}

/* 低コントラストを避ける */
/* ❌ 薄いグレー文字: #9ca3af (比率 2.7:1) */
/* ❌ 薄い背景に薄い文字 */
```

#### フォントサイズと拡大対応

```css
/* ベースフォントサイズを16px以上に */
html {
  font-size: 100%; /* = 16px */
}

body {
  font-size: 1rem; /* 16px */
  line-height: 1.6;
}

/* ブラウザの拡大（200%まで）に対応 */
/* 固定幅を避け、相対単位を使用 */
.container {
  max-width: 75rem; /* 1200px */
  width: 100%;
  padding: 0 clamp(1rem, 5vw, 3rem);
}

/* テキストの拡大時にはみ出さない */
p {
  overflow-wrap: break-word;
  word-wrap: break-word;
}
```

#### フォーカスインジケーターの強化

```css
/* 太く目立つフォーカスリング */
:focus-visible {
  outline: 3px solid #2563eb;
  outline-offset: 3px;
}

/* ボタンなどはさらに強調 */
button:focus-visible,
a:focus-visible {
  outline: 3px solid #2563eb;
  outline-offset: 3px;
  box-shadow: 0 0 0 6px rgba(37, 99, 235, 0.3);
}
```

### 3. 全盲への対応

スクリーンリーダーで読み上げられる設計。

#### 適切なalt属性

```html
<!-- 情報を持つ画像 -->
<img src="chart.png" alt="2024年の売上推移グラフ。1月100万円から12月300万円へ増加">

<!-- 装飾画像 -->
<img src="decorative.png" alt="" role="presentation">

<!-- ロゴ -->
<img src="logo.svg" alt="NEKOmalo ホームへ戻る">

<!-- 複雑な画像には詳細説明 -->
<figure>
  <img src="infographic.png" alt="Webアクセシビリティの概要図" aria-describedby="infographic-desc">
  <figcaption id="infographic-desc">
    この図は... [詳細な説明]
  </figcaption>
</figure>
```

#### スクリーンリーダー向けテキスト

```css
/* 視覚的には隠すがスクリーンリーダーには読み上げる */
.visually-hidden {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  border: 0;
}
```

```html
<!-- アイコンのみのボタン -->
<button aria-label="メニューを開く">
  <svg aria-hidden="true"><!-- ハンバーガーアイコン --></svg>
  <span class="visually-hidden">メニューを開く</span>
</button>

<!-- SNSリンク -->
<a href="https://twitter.com/..." aria-label="Twitter（新しいタブで開きます）">
  <svg aria-hidden="true"><!-- Twitterアイコン --></svg>
</a>
```

---

## 👂 聴覚への配慮

### 動画・音声コンテンツ

```html
<!-- 字幕付き動画 -->
<video controls>
  <source src="video.mp4" type="video/mp4">
  <track kind="captions" src="captions-ja.vtt" srclang="ja" label="日本語字幕" default>
  <track kind="captions" src="captions-en.vtt" srclang="en" label="English captions">
</video>

<!-- 文字起こしの提供 -->
<details>
  <summary>動画の文字起こしを見る</summary>
  <div class="transcript">
    [00:00] こんにちは、NEKOmaloです。
    [00:05] 今日は新作イラストについてお話しします...
  </div>
</details>
```

### 音声だけに頼らない通知

```javascript
// ❌ 音だけの通知
function notify() {
  playSound('notification.mp3');
}

// ✅ 音 + 視覚的通知
function notify(message) {
  playSound('notification.mp3');
  showVisualNotification(message); // 画面上に表示
  updateDocumentTitle(`(1) ${message}`); // タブタイトル更新
}
```

---

## 🖐️ 運動障害への配慮

### キーボード操作の完全対応

```javascript
// すべてのインタラクションをキーボードで可能に
document.querySelectorAll('.card').forEach(card => {
  card.setAttribute('tabindex', '0');
  card.setAttribute('role', 'button');
  
  card.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      card.click();
    }
  });
});
```

### タップ/クリック領域の確保

```css
/* 最小タップ領域: 44x44px（WCAG推奨: 48x48px） */
button,
a,
input,
select,
[role="button"] {
  min-width: 44px;
  min-height: 44px;
}

/* 小さい要素には周囲の余白で対応 */
.small-link {
  padding: 12px;
  margin: -12px; /* 視覚的なサイズを維持 */
}

/* リンク同士の間隔を確保 */
nav a {
  padding: 0.75rem 1rem;
}
```

### ドラッグ操作の代替手段

```html
<!-- ドラッグ&ドロップに代替UIを提供 -->
<div class="sortable-item" draggable="true">
  <span class="item-content">アイテム1</span>
  
  <!-- キーボード/スイッチ向け代替操作 -->
  <div class="item-controls">
    <button aria-label="上に移動" onclick="moveUp(this)">↑</button>
    <button aria-label="下に移動" onclick="moveDown(this)">↓</button>
  </div>
</div>
```

### 時間制限への配慮

```html
<!-- タイムアウトの警告と延長 -->
<div role="alert" aria-live="polite" id="timeout-warning" hidden>
  <p>セッションが5分後に切れます。</p>
  <button onclick="extendSession()">セッションを延長する</button>
</div>
```

```javascript
// 十分な操作時間を確保
const FORM_TIMEOUT = 30 * 60 * 1000; // 30分
const WARNING_BEFORE = 5 * 60 * 1000; // 5分前に警告

function showTimeoutWarning() {
  document.getElementById('timeout-warning').hidden = false;
}

function extendSession() {
  // セッション延長ロジック
  document.getElementById('timeout-warning').hidden = true;
}
```

---

## 🧠 認知・学習への配慮

### シンプルで一貫したデザイン

```css
/* 一貫したレイアウトパターン */
.page {
  /* すべてのページで同じ構造 */
  display: grid;
  grid-template-rows: auto 1fr auto;
  min-height: 100vh;
}

/* 視覚的な階層を明確に */
.section-title {
  font-size: var(--font-size-2xl);
  font-weight: 700;
  margin-bottom: 1rem;
  border-bottom: 3px solid var(--accent-color);
  padding-bottom: 0.5rem;
}
```

### 分かりやすい言葉づかい

```html
<!-- ❌ 専門用語や曖昧な表現 -->
<button>サブミット</button>
<p>インタラクティブなUIでUXを最適化</p>

<!-- ✅ 明確で具体的な表現 -->
<button>送信する</button>
<p>使いやすい操作画面で快適にご利用いただけます</p>
```

### エラーメッセージの明確化

```html
<!-- ❌ 曖昧なエラー -->
<p class="error">入力エラー</p>

<!-- ✅ 具体的な問題と解決方法 -->
<p class="error" role="alert">
  <strong>エラー:</strong>
  メールアドレスの形式が正しくありません。<br>
  <small>例: example@email.com のように入力してください</small>
</p>
```

### 進捗の可視化

```html
<!-- マルチステップフォームの進捗表示 -->
<nav aria-label="フォームの進捗">
  <ol class="progress-steps">
    <li class="step completed" aria-current="false">
      <span class="step-number">1</span>
      <span class="step-label">お客様情報</span>
    </li>
    <li class="step current" aria-current="step">
      <span class="step-number">2</span>
      <span class="step-label">お届け先</span>
    </li>
    <li class="step" aria-current="false">
      <span class="step-number">3</span>
      <span class="step-label">確認</span>
    </li>
  </ol>
</nav>
```

```css
.progress-steps {
  display: flex;
  justify-content: space-between;
  list-style: none;
  padding: 0;
  counter-reset: step;
}

.step {
  display: flex;
  flex-direction: column;
  align-items: center;
  position: relative;
  flex: 1;
}

.step-number {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: var(--color-muted);
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: bold;
}

.step.completed .step-number {
  background: var(--color-success);
  color: #fff;
}

.step.current .step-number {
  background: var(--color-primary);
  color: #fff;
  box-shadow: 0 0 0 4px rgba(99, 102, 241, 0.3);
}
```

---

## 👴 高齢者への配慮

### 大きなクリック領域

```css
/* ボタンは大きめに */
.btn {
  padding: 1rem 2rem;
  font-size: 1.125rem;
  min-height: 48px;
}

/* フォーム要素も大きめに */
input,
select,
textarea {
  font-size: 1rem; /* 16px以上で iOS のズームを防ぐ */
  padding: 0.875rem 1rem;
  min-height: 48px;
}
```

### 読みやすいフォント

```css
body {
  /* 読みやすいフォント */
  font-family: 
    "Hiragino Kaku Gothic ProN",
    "Hiragino Sans",
    "BIZ UDPGothic", /* ユニバーサルデザインフォント */
    "Meiryo",
    sans-serif;
  
  /* 十分な行間 */
  line-height: 1.8;
  
  /* 文字間隔 */
  letter-spacing: 0.05em;
}

/* 長文は狭めの幅で */
.article-content {
  max-width: 40em; /* 約640px */
}
```

### 分かりやすいリンク

```css
/* リンクは下線で明示 */
a {
  color: var(--link-color);
  text-decoration: underline;
  text-underline-offset: 3px;
}

a:hover {
  text-decoration-thickness: 2px;
}

/* ボタン風リンクは明確に */
.btn-link {
  display: inline-block;
  padding: 0.75rem 1.5rem;
  background: var(--color-primary);
  color: #fff;
  text-decoration: none;
  border-radius: 8px;
}
```

---

## 🌐 多言語・多文化への配慮

### 言語指定

```html
<!DOCTYPE html>
<html lang="ja">
<head>
  <meta charset="UTF-8">
</head>
<body>
  <p>日本語のコンテンツ</p>
  
  <!-- 部分的に他言語 -->
  <p lang="en">This is English content.</p>
  
  <!-- 言語切り替えリンク -->
  <nav aria-label="言語選択">
    <ul>
      <li><a href="/ja" lang="ja" hreflang="ja">日本語</a></li>
      <li><a href="/en" lang="en" hreflang="en">English</a></li>
      <li><a href="/zh" lang="zh" hreflang="zh">中文</a></li>
    </ul>
  </nav>
</body>
</html>
```

### 文字方向の対応

```css
/* RTL（右から左）言語への対応 */
[dir="rtl"] {
  text-align: right;
}

/* 論理プロパティを使用（推奨） */
.sidebar {
  /* ❌ 物理プロパティ */
  margin-left: 2rem;
  
  /* ✅ 論理プロパティ（LTR/RTL両対応） */
  margin-inline-start: 2rem;
}

.content {
  padding-inline: 2rem;  /* 左右 */
  padding-block: 1rem;   /* 上下 */
}
```

### 日付・数値のフォーマット

```javascript
// ロケールに応じた日付表示
const date = new Date();

// 日本語
console.log(date.toLocaleDateString('ja-JP')); // 2024/1/23

// 英語（米国）
console.log(date.toLocaleDateString('en-US')); // 1/23/2024

// 数値のフォーマット
const number = 1234567.89;
console.log(number.toLocaleString('ja-JP')); // 1,234,567.89
console.log(number.toLocaleString('de-DE')); // 1.234.567,89
```

---

## 🌙 環境への配慮

### ダークモード対応

```css
:root {
  /* ライトモード（デフォルト） */
  --color-bg: #ffffff;
  --color-text: #1f2937;
  --color-border: #e5e7eb;
}

@media (prefers-color-scheme: dark) {
  :root {
    /* ダークモード */
    --color-bg: #0f172a;
    --color-text: #f1f5f9;
    --color-border: #334155;
  }
}

body {
  background: var(--color-bg);
  color: var(--color-text);
  transition: background-color 0.3s ease, color 0.3s ease;
}
```

### 視覚効果の軽減

```css
/* 動きを減らす設定を尊重 */
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

/* 個別のアニメーション制御 */
.animated-element {
  animation: fadeIn 0.5s ease;
}

@media (prefers-reduced-motion: reduce) {
  .animated-element {
    animation: none;
    opacity: 1;
  }
}
```

### 低帯域幅への配慮

```css
/* データセーバーモードを検出 */
@media (prefers-reduced-data: reduce) {
  /* 装飾画像を非表示 */
  .decorative-image {
    display: none;
  }
  
  /* 背景画像を削除 */
  .hero {
    background-image: none;
    background-color: var(--color-primary);
  }
}
```

```html
<!-- 画像の遅延読み込み -->
<img src="small-placeholder.jpg" 
     data-src="large-image.jpg" 
     alt="説明" 
     loading="lazy"
     class="lazyload">
```

---

## ✅ ユニバーサルデザイン チェックリスト

### 視覚
- [ ] コントラスト比 4.5:1以上（AAA: 7:1）
- [ ] 色だけに頼らない情報伝達
- [ ] フォントサイズ 16px以上
- [ ] 200%拡大でもレイアウト崩れなし
- [ ] フォーカスインジケーターが明確
- [ ] すべての画像に適切なalt

### 聴覚
- [ ] 動画に字幕がある
- [ ] 音声コンテンツに文字起こしがある
- [ ] 音だけの通知をしていない

### 運動
- [ ] キーボードのみで操作可能
- [ ] タップ領域 44x44px以上
- [ ] ドラッグ操作に代替手段がある
- [ ] 時間制限に余裕がある

### 認知
- [ ] シンプルで一貫したデザイン
- [ ] 専門用語を避けた表現
- [ ] エラーメッセージが具体的
- [ ] 進捗が可視化されている

### 環境
- [ ] ダークモード対応
- [ ] prefers-reduced-motion対応
- [ ] 多言語対応（必要な場合）
- [ ] 低速回線でも動作

---

## 🛠️ テストツール

| ツール | 用途 | URL |
|-------|------|-----|
| WAVE | アクセシビリティ評価 | https://wave.webaim.org/ |
| axe DevTools | 自動アクセシビリティテスト | Chrome拡張 |
| Color Oracle | 色覚シミュレーション | https://colororacle.org/ |
| WebAIM Contrast Checker | コントラスト比計算 | https://webaim.org/resources/contrastchecker/ |
| NoCoffee | 視覚障害シミュレーション | Chrome拡張 |
| NVDA | スクリーンリーダー（無料） | https://www.nvaccess.org/ |
| VoiceOver | macOS/iOS標準スクリーンリーダー | システム設定 |

---

## 📚 参考リンク

- [WCAG 2.1 クイックリファレンス](https://www.w3.org/WAI/WCAG21/quickref/)
- [カラーユニバーサルデザイン機構](https://www.cudo.jp/)
- [アクセシビリティ・サポーテッド情報](https://waic.jp/docs/as/)
- [Inclusive Design Principles](https://inclusivedesignprinciples.org/)
- [A11y Project](https://www.a11yproject.com/)
