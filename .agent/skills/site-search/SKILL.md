---
name: site-search
description: サイト内検索機能を実装するためのガイドライン。検索UI、検索ロジック、オートコンプリート、結果表示、アクセシビリティまで網羅します。
---

# サイト内検索 スキル

このスキルは、Webサイトにサイト内検索機能を実装するためのガイドラインです。シンプルなクライアントサイド検索から、高度な検索機能まで対応します。

---

## 🎯 検索機能の選択

| 方式 | 適した規模 | 特徴 |
|-----|-----------|------|
| **クライアントサイド検索** | 〜100ページ | シンプル、サーバー不要 |
| **静的サイト検索（Pagefind等）** | 〜10,000ページ | ビルド時にインデックス生成 |
| **サーバーサイド検索** | 大規模 | データベース検索 |
| **外部サービス（Algolia等）** | あらゆる規模 | 高機能、即時反映 |

---

## 🔍 1. 検索UIの実装

### 基本的な検索フォーム

```html
<form role="search" class="search-form" action="/search" method="GET">
  <label for="search-input" class="visually-hidden">サイト内検索</label>
  <div class="search-input-wrapper">
    <svg class="search-icon" aria-hidden="true" width="20" height="20" viewBox="0 0 24 24">
      <circle cx="11" cy="11" r="8" stroke="currentColor" stroke-width="2" fill="none"/>
      <path d="M21 21l-4.35-4.35" stroke="currentColor" stroke-width="2"/>
    </svg>
    <input 
      type="search" 
      id="search-input"
      name="q"
      placeholder="キーワードで検索..."
      autocomplete="off"
      aria-describedby="search-hint"
    >
    <button type="submit" aria-label="検索">
      <span class="visually-hidden">検索</span>
      <svg aria-hidden="true" width="20" height="20"><!-- 矢印アイコン --></svg>
    </button>
  </div>
  <p id="search-hint" class="visually-hidden">
    作品名やカテゴリで検索できます
  </p>
</form>
```

### 検索フォームのCSS

```css
.search-form {
  width: 100%;
  max-width: 500px;
}

.search-input-wrapper {
  position: relative;
  display: flex;
  align-items: center;
  background: var(--bg-color, #fff);
  border: 2px solid var(--border-color, #e5e7eb);
  border-radius: 9999px;
  padding: 0.75rem 1rem;
  transition: border-color 0.2s ease, box-shadow 0.2s ease;
}

.search-input-wrapper:focus-within {
  border-color: var(--accent-color, #6366f1);
  box-shadow: 0 0 0 3px rgba(99, 102, 241, 0.2);
}

.search-icon {
  color: var(--text-muted, #9ca3af);
  flex-shrink: 0;
  margin-right: 0.75rem;
}

.search-input-wrapper input {
  flex: 1;
  border: none;
  background: transparent;
  font-size: 1rem;
  color: var(--text-color, #1f2937);
  outline: none;
}

.search-input-wrapper input::placeholder {
  color: var(--text-muted, #9ca3af);
}

/* 検索クリアボタン（ブラウザ標準） */
.search-input-wrapper input[type="search"]::-webkit-search-cancel-button {
  -webkit-appearance: none;
  appearance: none;
  width: 20px;
  height: 20px;
  background: url('data:image/svg+xml,...') center/contain no-repeat;
  cursor: pointer;
}

.search-input-wrapper button {
  background: var(--accent-color, #6366f1);
  color: #fff;
  border: none;
  border-radius: 50%;
  width: 36px;
  height: 36px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: background 0.2s ease;
}

.search-input-wrapper button:hover {
  background: var(--accent-hover, #4f46e5);
}

/* visually-hidden */
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

### モーダル検索（オーバーレイ）

```html
<!-- 検索トリガーボタン -->
<button 
  type="button" 
  class="search-trigger"
  aria-label="検索を開く"
  aria-expanded="false"
  aria-controls="search-modal"
>
  <svg aria-hidden="true"><!-- 検索アイコン --></svg>
  <span>検索</span>
  <kbd>⌘K</kbd>
</button>

<!-- 検索モーダル -->
<div id="search-modal" class="search-modal" role="dialog" aria-modal="true" aria-label="サイト内検索" hidden>
  <div class="search-modal__backdrop"></div>
  <div class="search-modal__content">
    <form role="search" class="search-modal__form">
      <input 
        type="search" 
        placeholder="検索..."
        aria-label="検索キーワード"
        autofocus
      >
    </form>
    <div class="search-modal__results" role="listbox"></div>
    <div class="search-modal__footer">
      <span><kbd>↑↓</kbd> 移動</span>
      <span><kbd>Enter</kbd> 選択</span>
      <span><kbd>Esc</kbd> 閉じる</span>
    </div>
  </div>
</div>
```

```css
.search-modal {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 9999;
  display: flex;
  align-items: flex-start;
  justify-content: center;
  padding-top: 15vh;
}

.search-modal[hidden] {
  display: none;
}

.search-modal__backdrop {
  position: absolute;
  inset: 0;
  background: rgba(0, 0, 0, 0.5);
  backdrop-filter: blur(4px);
}

.search-modal__content {
  position: relative;
  width: 90%;
  max-width: 600px;
  max-height: 70vh;
  background: var(--bg-color, #fff);
  border-radius: 16px;
  box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
  overflow: hidden;
  display: flex;
  flex-direction: column;
}

.search-modal__form {
  padding: 1rem;
  border-bottom: 1px solid var(--border-color, #e5e7eb);
}

.search-modal__form input {
  width: 100%;
  border: none;
  font-size: 1.25rem;
  padding: 0.5rem;
  outline: none;
  background: transparent;
}

.search-modal__results {
  flex: 1;
  overflow-y: auto;
  padding: 0.5rem;
}

.search-modal__footer {
  padding: 0.75rem 1rem;
  border-top: 1px solid var(--border-color, #e5e7eb);
  display: flex;
  gap: 1.5rem;
  font-size: 0.875rem;
  color: var(--text-muted);
}

.search-modal__footer kbd {
  background: var(--bg-alt, #f3f4f6);
  padding: 0.125rem 0.375rem;
  border-radius: 4px;
  font-family: inherit;
  font-size: 0.75rem;
}
```

---

## ⚡ 2. クライアントサイド検索

### シンプルなJavaScript検索

```javascript
// 検索データ
const searchData = [
  {
    title: 'キャラクターデザイン作品',
    description: 'オリジナルキャラクターのデザイン作品集',
    url: '/works/character-design',
    tags: ['イラスト', 'キャラクター'],
    category: 'works'
  },
  {
    title: '私について',
    description: 'NEKOmaloのプロフィールと経歴',
    url: '/about',
    tags: ['プロフィール'],
    category: 'page'
  },
  // ... 他の項目
];

// 検索関数
function search(query) {
  if (!query || query.trim() === '') {
    return [];
  }
  
  const normalizedQuery = query.toLowerCase().trim();
  const terms = normalizedQuery.split(/\s+/);
  
  return searchData
    .map(item => {
      // スコア計算
      let score = 0;
      const searchableText = `${item.title} ${item.description} ${item.tags.join(' ')}`.toLowerCase();
      
      terms.forEach(term => {
        // タイトルに含まれる場合は高スコア
        if (item.title.toLowerCase().includes(term)) {
          score += 10;
        }
        // 説明に含まれる場合
        if (item.description.toLowerCase().includes(term)) {
          score += 5;
        }
        // タグに含まれる場合
        if (item.tags.some(tag => tag.toLowerCase().includes(term))) {
          score += 3;
        }
      });
      
      return { ...item, score };
    })
    .filter(item => item.score > 0)
    .sort((a, b) => b.score - a.score);
}

// 検索の実行
const input = document.getElementById('search-input');
const resultsContainer = document.getElementById('search-results');

input.addEventListener('input', debounce((e) => {
  const results = search(e.target.value);
  renderResults(results);
}, 300));

// デバウンス関数
function debounce(fn, delay) {
  let timeoutId;
  return function(...args) {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => fn.apply(this, args), delay);
  };
}
```

### 検索結果の表示

```javascript
function renderResults(results) {
  if (results.length === 0) {
    resultsContainer.innerHTML = `
      <div class="search-no-results">
        <p>検索結果が見つかりませんでした</p>
        <p class="text-muted">別のキーワードで検索してみてください</p>
      </div>
    `;
    return;
  }
  
  resultsContainer.innerHTML = results.map((item, index) => `
    <a 
      href="${item.url}" 
      class="search-result-item"
      role="option"
      aria-selected="${index === 0 ? 'true' : 'false'}"
    >
      <div class="search-result-item__title">${highlightMatch(item.title, query)}</div>
      <div class="search-result-item__description">${item.description}</div>
      <div class="search-result-item__meta">
        <span class="search-result-item__category">${item.category}</span>
        ${item.tags.map(tag => `<span class="search-result-item__tag">${tag}</span>`).join('')}
      </div>
    </a>
  `).join('');
}

// マッチ部分のハイライト
function highlightMatch(text, query) {
  if (!query) return text;
  
  const regex = new RegExp(`(${escapeRegExp(query)})`, 'gi');
  return text.replace(regex, '<mark>$1</mark>');
}

function escapeRegExp(string) {
  return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}
```

```css
.search-result-item {
  display: block;
  padding: 1rem;
  border-radius: 8px;
  text-decoration: none;
  color: inherit;
  transition: background 0.15s ease;
}

.search-result-item:hover,
.search-result-item[aria-selected="true"] {
  background: var(--bg-alt, #f3f4f6);
}

.search-result-item__title {
  font-weight: 600;
  margin-bottom: 0.25rem;
}

.search-result-item__title mark {
  background: rgba(99, 102, 241, 0.2);
  color: inherit;
  padding: 0 2px;
  border-radius: 2px;
}

.search-result-item__description {
  font-size: 0.875rem;
  color: var(--text-muted);
  margin-bottom: 0.5rem;
}

.search-result-item__meta {
  display: flex;
  gap: 0.5rem;
  font-size: 0.75rem;
}

.search-result-item__category {
  background: var(--accent-color);
  color: #fff;
  padding: 0.125rem 0.5rem;
  border-radius: 9999px;
}

.search-result-item__tag {
  background: var(--bg-alt);
  padding: 0.125rem 0.5rem;
  border-radius: 9999px;
}

.search-no-results {
  padding: 2rem;
  text-align: center;
}
```

---

## 🔤 3. オートコンプリート

### 入力候補の表示

```html
<div class="search-autocomplete">
  <input 
    type="search" 
    id="search-input"
    aria-autocomplete="list"
    aria-controls="search-suggestions"
    aria-expanded="false"
  >
  <ul 
    id="search-suggestions" 
    class="search-suggestions" 
    role="listbox"
    hidden
  >
    <!-- 候補がここに表示される -->
  </ul>
</div>
```

```javascript
const suggestions = [
  'イラスト',
  'キャラクターデザイン',
  'VTuber',
  'お問い合わせ',
  'ポートフォリオ',
  '配信',
  // ...
];

const input = document.getElementById('search-input');
const suggestionsList = document.getElementById('search-suggestions');
let activeIndex = -1;

input.addEventListener('input', (e) => {
  const value = e.target.value.toLowerCase();
  
  if (!value) {
    hideSuggestions();
    return;
  }
  
  const matches = suggestions.filter(s => 
    s.toLowerCase().includes(value)
  ).slice(0, 8);
  
  if (matches.length > 0) {
    showSuggestions(matches);
  } else {
    hideSuggestions();
  }
});

function showSuggestions(matches) {
  suggestionsList.innerHTML = matches.map((match, i) => `
    <li 
      role="option" 
      id="suggestion-${i}"
      aria-selected="${i === activeIndex}"
      data-value="${match}"
    >
      ${highlightMatch(match, input.value)}
    </li>
  `).join('');
  
  suggestionsList.hidden = false;
  input.setAttribute('aria-expanded', 'true');
}

function hideSuggestions() {
  suggestionsList.hidden = true;
  input.setAttribute('aria-expanded', 'false');
  activeIndex = -1;
}

// キーボード操作
input.addEventListener('keydown', (e) => {
  const items = suggestionsList.querySelectorAll('li');
  
  switch(e.key) {
    case 'ArrowDown':
      e.preventDefault();
      activeIndex = Math.min(activeIndex + 1, items.length - 1);
      updateActiveItem(items);
      break;
      
    case 'ArrowUp':
      e.preventDefault();
      activeIndex = Math.max(activeIndex - 1, -1);
      updateActiveItem(items);
      break;
      
    case 'Enter':
      if (activeIndex >= 0 && items[activeIndex]) {
        e.preventDefault();
        selectSuggestion(items[activeIndex]);
      }
      break;
      
    case 'Escape':
      hideSuggestions();
      break;
  }
});

function updateActiveItem(items) {
  items.forEach((item, i) => {
    item.setAttribute('aria-selected', i === activeIndex);
  });
  
  if (activeIndex >= 0) {
    input.setAttribute('aria-activedescendant', `suggestion-${activeIndex}`);
    items[activeIndex].scrollIntoView({ block: 'nearest' });
  } else {
    input.removeAttribute('aria-activedescendant');
  }
}

function selectSuggestion(item) {
  input.value = item.dataset.value;
  hideSuggestions();
  // 検索実行
  performSearch(item.dataset.value);
}

// クリックで選択
suggestionsList.addEventListener('click', (e) => {
  const item = e.target.closest('li');
  if (item) {
    selectSuggestion(item);
  }
});
```

```css
.search-autocomplete {
  position: relative;
}

.search-suggestions {
  position: absolute;
  top: 100%;
  left: 0;
  right: 0;
  background: var(--bg-color, #fff);
  border: 1px solid var(--border-color, #e5e7eb);
  border-radius: 8px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
  margin-top: 4px;
  max-height: 300px;
  overflow-y: auto;
  z-index: 100;
  list-style: none;
  padding: 0.5rem;
  margin: 0;
}

.search-suggestions[hidden] {
  display: none;
}

.search-suggestions li {
  padding: 0.75rem 1rem;
  border-radius: 6px;
  cursor: pointer;
}

.search-suggestions li:hover,
.search-suggestions li[aria-selected="true"] {
  background: var(--bg-alt, #f3f4f6);
}

.search-suggestions mark {
  background: rgba(99, 102, 241, 0.2);
  color: inherit;
}
```

---

## 📦 4. 静的サイト検索（Pagefind）

ビルド時にインデックスを生成する軽量検索エンジン。

### インストールと設定

```bash
# インストール
npm install pagefind

# ビルド後にインデックス生成
npx pagefind --site dist --output-path dist/pagefind
```

### package.json

```json
{
  "scripts": {
    "build": "your-build-command",
    "postbuild": "pagefind --site dist"
  }
}
```

### HTMLへの組み込み

```html
<!-- Pagefind UIを読み込み -->
<link href="/pagefind/pagefind-ui.css" rel="stylesheet">
<script src="/pagefind/pagefind-ui.js"></script>

<div id="search"></div>

<script>
  window.addEventListener('DOMContentLoaded', () => {
    new PagefindUI({
      element: '#search',
      showImages: true,
      showSubResults: true,
      translations: {
        placeholder: 'サイト内を検索...',
        zero_results: '「[SEARCH_TERM]」に一致する結果がありません',
        many_results: '[COUNT]件の結果',
        one_result: '1件の結果',
        searching: '検索中...'
      }
    });
  });
</script>
```

### 検索対象の制御

```html
<!-- 検索対象に含める -->
<article data-pagefind-body>
  <h1 data-pagefind-meta="title">ページタイトル</h1>
  <p>このコンテンツは検索対象になります</p>
</article>

<!-- 検索対象から除外 -->
<nav data-pagefind-ignore>
  ナビゲーションは検索対象外
</nav>

<!-- メタ情報の追加 -->
<div data-pagefind-meta="category:works"></div>
```

---

## 🔗 5. 外部検索サービス

### Algolia

```bash
npm install algoliasearch instantsearch.js
```

```html
<div id="searchbox"></div>
<div id="hits"></div>

<script type="module">
import algoliasearch from 'algoliasearch/lite';
import instantsearch from 'instantsearch.js';
import { searchBox, hits } from 'instantsearch.js/es/widgets';

const searchClient = algoliasearch('APP_ID', 'SEARCH_API_KEY');

const search = instantsearch({
  indexName: 'your_index',
  searchClient,
});

search.addWidgets([
  searchBox({
    container: '#searchbox',
    placeholder: '検索...',
  }),
  hits({
    container: '#hits',
    templates: {
      item: (hit) => `
        <a href="${hit.url}" class="hit-item">
          <h3>${instantsearch.highlight({ attribute: 'title', hit })}</h3>
          <p>${instantsearch.snippet({ attribute: 'description', hit })}</p>
        </a>
      `,
    },
  }),
]);

search.start();
</script>
```

### Fuse.js（軽量ファジー検索）

```bash
npm install fuse.js
```

```javascript
import Fuse from 'fuse.js';

const data = [
  { title: '作品1', description: '説明1', tags: ['tag1', 'tag2'] },
  { title: '作品2', description: '説明2', tags: ['tag3'] },
  // ...
];

const fuse = new Fuse(data, {
  keys: [
    { name: 'title', weight: 0.7 },
    { name: 'description', weight: 0.2 },
    { name: 'tags', weight: 0.1 }
  ],
  threshold: 0.3, // 0 = 完全一致, 1 = 全てマッチ
  includeScore: true,
  includeMatches: true
});

const results = fuse.search('検索キーワード');
console.log(results);
```

---

## ⌨️ 6. キーボードショートカット

```javascript
// Cmd/Ctrl + K で検索モーダルを開く
document.addEventListener('keydown', (e) => {
  // Cmd+K (Mac) or Ctrl+K (Windows)
  if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
    e.preventDefault();
    toggleSearchModal();
  }
  
  // / で検索フォーカス（入力中でなければ）
  if (e.key === '/' && !isInputFocused()) {
    e.preventDefault();
    focusSearchInput();
  }
});

function isInputFocused() {
  const active = document.activeElement;
  return active.tagName === 'INPUT' || 
         active.tagName === 'TEXTAREA' || 
         active.isContentEditable;
}

function toggleSearchModal() {
  const modal = document.getElementById('search-modal');
  const isHidden = modal.hidden;
  
  if (isHidden) {
    modal.hidden = false;
    modal.querySelector('input').focus();
    document.body.style.overflow = 'hidden';
  } else {
    modal.hidden = true;
    document.body.style.overflow = '';
  }
}
```

---

## ♿ 7. アクセシビリティ

### ARIA属性

```html
<form role="search" aria-label="サイト内検索">
  <input 
    type="search"
    aria-label="検索キーワード"
    aria-autocomplete="list"
    aria-controls="search-results"
    aria-expanded="false"
    aria-activedescendant=""
  >
</form>

<div 
  id="search-results" 
  role="listbox" 
  aria-label="検索結果"
>
  <a role="option" aria-selected="true">結果1</a>
  <a role="option" aria-selected="false">結果2</a>
</div>

<!-- 検索結果の通知 -->
<div aria-live="polite" aria-atomic="true" class="visually-hidden">
  5件の結果が見つかりました
</div>
```

### フォーカス管理

```javascript
// モーダル内にフォーカスを閉じ込める
function trapFocus(modal) {
  const focusableElements = modal.querySelectorAll(
    'a, button, input, textarea, select, [tabindex]:not([tabindex="-1"])'
  );
  const firstElement = focusableElements[0];
  const lastElement = focusableElements[focusableElements.length - 1];
  
  modal.addEventListener('keydown', (e) => {
    if (e.key !== 'Tab') return;
    
    if (e.shiftKey && document.activeElement === firstElement) {
      e.preventDefault();
      lastElement.focus();
    } else if (!e.shiftKey && document.activeElement === lastElement) {
      e.preventDefault();
      firstElement.focus();
    }
  });
}
```

### 検索結果の読み上げ

```javascript
const liveRegion = document.getElementById('search-live-region');

function announceResults(count) {
  if (count === 0) {
    liveRegion.textContent = '検索結果が見つかりませんでした';
  } else if (count === 1) {
    liveRegion.textContent = '1件の結果が見つかりました';
  } else {
    liveRegion.textContent = `${count}件の結果が見つかりました`;
  }
}
```

---

## 🎨 8. 検索結果ページ

### URLパラメータでの検索

```javascript
// 検索結果ページ（search.html）
document.addEventListener('DOMContentLoaded', () => {
  const params = new URLSearchParams(window.location.search);
  const query = params.get('q');
  
  if (query) {
    document.getElementById('search-input').value = query;
    performSearch(query);
  }
});

// 検索実行時にURLを更新
function performSearch(query) {
  const url = new URL(window.location);
  url.searchParams.set('q', query);
  window.history.pushState({}, '', url);
  
  const results = search(query);
  renderResults(results);
}
```

### 検索結果のハイライト

```javascript
function highlightInContent(element, query) {
  const walker = document.createTreeWalker(
    element,
    NodeFilter.SHOW_TEXT,
    null
  );
  
  const nodesToReplace = [];
  let node;
  
  while (node = walker.nextNode()) {
    if (node.textContent.toLowerCase().includes(query.toLowerCase())) {
      nodesToReplace.push(node);
    }
  }
  
  nodesToReplace.forEach(textNode => {
    const span = document.createElement('span');
    span.innerHTML = highlightMatch(textNode.textContent, query);
    textNode.parentNode.replaceChild(span, textNode);
  });
}
```

---

## 📊 9. 検索分析

### 検索クエリの記録

```javascript
function trackSearch(query, resultsCount) {
  // Google Analytics 4
  if (window.gtag) {
    gtag('event', 'search', {
      search_term: query,
      results_count: resultsCount
    });
  }
  
  // カスタム分析
  fetch('/api/analytics/search', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      query,
      resultsCount,
      timestamp: new Date().toISOString()
    })
  });
}
```

---

## ✅ 検索機能チェックリスト

### UI/UX
- [ ] 検索フォームが見つけやすい場所にあるか
- [ ] プレースホルダーが適切か
- [ ] 検索ボタンまたはアイコンがあるか
- [ ] ローディング状態を表示しているか
- [ ] 検索結果がない場合のメッセージがあるか

### 機能
- [ ] リアルタイム検索またはオートコンプリートがあるか
- [ ] 検索結果が関連性順にソートされているか
- [ ] マッチした部分がハイライトされているか
- [ ] 検索クエリがURLに反映されるか

### パフォーマンス
- [ ] 入力にデバウンスを適用しているか
- [ ] 検索インデックスが最適化されているか
- [ ] 大量の結果がページネーションされているか

### アクセシビリティ
- [ ] role="search"が設定されているか
- [ ] aria属性が適切に設定されているか
- [ ] キーボードで操作できるか
- [ ] 結果の読み上げ通知があるか

---

## 📚 参考リンク

- [Pagefind](https://pagefind.app/)
- [Fuse.js](https://fusejs.io/)
- [Algolia](https://www.algolia.com/)
- [MDN - ARIA: search role](https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/Roles/search_role)
