---
name: seo-llmo
description: SEO（検索エンジン最適化）とLLMO（AI検索最適化）を実装するためのガイドライン。Google検索とAIアシスタント（ChatGPT、Perplexity等）の両方に対応します。
---

# SEO・LLMO最適化スキル

このスキルは、Webサイトを従来の検索エンジン（Google、Bing等）とAI検索（ChatGPT、Perplexity、Gemini等）の両方に最適化するためのガイドラインです。

---

## 📊 SEOとLLMOの違い

| 項目 | SEO（検索エンジン最適化） | LLMO（AI検索最適化） |
|------|---------------------------|----------------------|
| 対象 | Google、Bing等 | ChatGPT、Perplexity、Gemini等 |
| 目的 | 検索順位向上 | AIの回答に引用される |
| 重視点 | キーワード、リンク | 構造化データ、明確な情報 |
| 結果 | 検索結果ページに表示 | AIの回答内で引用・参照 |

---

## 🏗️ 基本的なHTMLメタ構造

### 必須のhead要素

```html
<!DOCTYPE html>
<html lang="ja">
<head>
  <!-- 文字コード -->
  <meta charset="UTF-8">
  
  <!-- ビューポート設定 -->
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  
  <!-- ページタイトル（30-60文字推奨） -->
  <title>NEKOmalo | VTuber・イラストレーター ポートフォリオ</title>
  
  <!-- メタディスクリプション（120-160文字推奨） -->
  <meta name="description" content="NEKOmalo（ねこまろ）は、VTuberとイラストレーターとして活動するクリエイターです。キャラクターデザイン、イラスト制作、配信活動などの情報をご覧いただけます。">
  
  <!-- キーワード（現在はSEO効果は低いが設定推奨） -->
  <meta name="keywords" content="NEKOmalo,ねこまろ,VTuber,イラストレーター,キャラクターデザイン,ポートフォリオ">
  
  <!-- 著者情報 -->
  <meta name="author" content="NEKOmalo">
  
  <!-- ロボット設定 -->
  <meta name="robots" content="index, follow">
  
  <!-- 正規URL（重複コンテンツ対策） -->
  <link rel="canonical" href="https://example.com/">
  
  <!-- ファビコン -->
  <link rel="icon" href="/favicon.ico" sizes="any">
  <link rel="icon" href="/favicon.svg" type="image/svg+xml">
  <link rel="apple-touch-icon" href="/apple-touch-icon.png">
  
  <!-- OGP（Open Graph Protocol） -->
  <meta property="og:type" content="website">
  <meta property="og:title" content="NEKOmalo | VTuber・イラストレーター ポートフォリオ">
  <meta property="og:description" content="NEKOmalo（ねこまろ）のポートフォリオサイト。イラスト作品やVTuber活動をご覧いただけます。">
  <meta property="og:url" content="https://example.com/">
  <meta property="og:image" content="https://example.com/ogp.jpg">
  <meta property="og:image:width" content="1200">
  <meta property="og:image:height" content="630">
  <meta property="og:site_name" content="NEKOmalo Portfolio">
  <meta property="og:locale" content="ja_JP">
  
  <!-- Twitter Card -->
  <meta name="twitter:card" content="summary_large_image">
  <meta name="twitter:site" content="@username">
  <meta name="twitter:creator" content="@username">
  <meta name="twitter:title" content="NEKOmalo | VTuber・イラストレーター ポートフォリオ">
  <meta name="twitter:description" content="NEKOmalo（ねこまろ）のポートフォリオサイト">
  <meta name="twitter:image" content="https://example.com/twitter-card.jpg">
</head>
```

---

## 🤖 LLMO対策：構造化データ（JSON-LD）

AIは構造化データを優先的に読み取ります。以下のスキーマを実装してください。

### Person（個人・クリエイター）

```html
<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "Person",
  "name": "NEKOmalo",
  "alternateName": ["ねこまろ", "YUKImalo"],
  "description": "VTuberとイラストレーターとして活動するクリエイター。キャラクターデザインやイラスト制作を行っています。",
  "url": "https://example.com",
  "image": "https://example.com/profile.jpg",
  "sameAs": [
    "https://twitter.com/username",
    "https://www.youtube.com/@channel",
    "https://www.pixiv.net/users/12345678",
    "https://www.instagram.com/username"
  ],
  "jobTitle": ["VTuber", "イラストレーター", "キャラクターデザイナー"],
  "knowsAbout": ["イラスト制作", "キャラクターデザイン", "VTuber活動", "ゲーム配信"],
  "alumniOf": {
    "@type": "Organization",
    "name": "所属事務所名"
  }
}
</script>
```

### WebSite（サイト全体）

```html
<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "WebSite",
  "name": "NEKOmalo Portfolio",
  "alternateName": "ねこまろ ポートフォリオ",
  "url": "https://example.com",
  "description": "NEKOmaloのポートフォリオサイト。イラスト作品やVTuber活動をご覧いただけます。",
  "inLanguage": "ja",
  "author": {
    "@type": "Person",
    "name": "NEKOmalo"
  },
  "potentialAction": {
    "@type": "SearchAction",
    "target": "https://example.com/search?q={search_term_string}",
    "query-input": "required name=search_term_string"
  }
}
</script>
```

### CreativeWork（作品・ポートフォリオ）

```html
<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "CreativeWork",
  "name": "キャラクターデザイン作品集",
  "description": "オリジナルキャラクターのデザイン作品集です。",
  "creator": {
    "@type": "Person",
    "name": "NEKOmalo"
  },
  "dateCreated": "2024-01-01",
  "genre": ["イラスト", "キャラクターデザイン"],
  "image": "https://example.com/works/character-design.jpg",
  "url": "https://example.com/works/character-design"
}
</script>
```

### ImageGallery（ギャラリー）

```html
<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "ImageGallery",
  "name": "NEKOmalo イラストギャラリー",
  "description": "NEKOmaloが制作したイラスト作品のギャラリー",
  "url": "https://example.com/gallery",
  "author": {
    "@type": "Person",
    "name": "NEKOmalo"
  },
  "image": [
    {
      "@type": "ImageObject",
      "contentUrl": "https://example.com/gallery/image1.jpg",
      "name": "作品タイトル1",
      "description": "作品の説明"
    },
    {
      "@type": "ImageObject",
      "contentUrl": "https://example.com/gallery/image2.jpg",
      "name": "作品タイトル2",
      "description": "作品の説明"
    }
  ]
}
</script>
```

### FAQPage（よくある質問）

```html
<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "mainEntity": [
    {
      "@type": "Question",
      "name": "イラストの依頼は受け付けていますか？",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "はい、現在イラストのご依頼を受け付けております。詳細はお問い合わせページをご確認ください。"
      }
    },
    {
      "@type": "Question",
      "name": "配信スケジュールはどこで確認できますか？",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "配信スケジュールはTwitter（X）およびYouTubeのコミュニティタブでお知らせしています。"
      }
    }
  ]
}
</script>
```

### BreadcrumbList（パンくずリスト）

```html
<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  "itemListElement": [
    {
      "@type": "ListItem",
      "position": 1,
      "name": "ホーム",
      "item": "https://example.com/"
    },
    {
      "@type": "ListItem",
      "position": 2,
      "name": "作品一覧",
      "item": "https://example.com/works/"
    },
    {
      "@type": "ListItem",
      "position": 3,
      "name": "イラスト作品",
      "item": "https://example.com/works/illustration/"
    }
  ]
}
</script>
```

---

## 📝 セマンティックHTML

AIと検索エンジンの両方が理解しやすい構造を使用してください。

### 正しいHTML構造

```html
<body>
  <!-- ヘッダー -->
  <header role="banner">
    <nav aria-label="メインナビゲーション">
      <ul>
        <li><a href="/">ホーム</a></li>
        <li><a href="/about">私について</a></li>
        <li><a href="/works">作品</a></li>
        <li><a href="/contact">お問い合わせ</a></li>
      </ul>
    </nav>
  </header>

  <!-- メインコンテンツ -->
  <main role="main">
    <!-- ヒーローセクション -->
    <section aria-labelledby="hero-title">
      <h1 id="hero-title">NEKOmalo - VTuber & イラストレーター</h1>
      <p>キャラクターに命を吹き込むクリエイター</p>
    </section>

    <!-- 自己紹介 -->
    <section aria-labelledby="about-title">
      <h2 id="about-title">私について</h2>
      <article>
        <p>NEKOmalo（ねこまろ）は、VTuberとイラストレーターとして活動しています...</p>
      </article>
    </section>

    <!-- 作品一覧 -->
    <section aria-labelledby="works-title">
      <h2 id="works-title">作品一覧</h2>
      <ul role="list">
        <li>
          <article>
            <figure>
              <img src="work1.jpg" alt="キャラクターデザイン作品「作品名」" loading="lazy">
              <figcaption>作品名 - 2024年制作</figcaption>
            </figure>
          </article>
        </li>
      </ul>
    </section>
  </main>

  <!-- フッター -->
  <footer role="contentinfo">
    <p>&copy; 2024 NEKOmalo. All rights reserved.</p>
    <nav aria-label="フッターリンク">
      <a href="/privacy">プライバシーポリシー</a>
    </nav>
  </footer>
</body>
```

### 見出しの階層ルール

```
h1 - ページタイトル（1ページに1つだけ）
  └── h2 - セクションタイトル
        └── h3 - サブセクション
              └── h4 - 詳細項目
                    └── h5/h6 - 必要に応じて
```

---

## 🖼️ 画像最適化

### alt属性の書き方

```html
<!-- ❌ 悪い例 -->
<img src="image.jpg" alt="画像">
<img src="image.jpg" alt="">
<img src="image.jpg" alt="IMG_20240101_001.jpg">

<!-- ✅ 良い例 -->
<img src="character.jpg" alt="NEKOmaloがデザインしたオリジナルキャラクター「キャラ名」のイラスト">
<img src="thumbnail.jpg" alt="YouTube配信「配信タイトル」のサムネイル画像">
```

### 画像の構造化データ

```html
<figure itemscope itemtype="https://schema.org/ImageObject">
  <img 
    src="illustration.jpg" 
    alt="キャラクターイラスト作品"
    itemprop="contentUrl"
    loading="lazy"
    width="800"
    height="600"
  >
  <figcaption itemprop="caption">
    <span itemprop="name">作品タイトル</span> - 
    <time itemprop="dateCreated" datetime="2024-01-01">2024年1月制作</time>
  </figcaption>
  <meta itemprop="creator" content="NEKOmalo">
</figure>
```

---

## 🔗 内部リンク戦略

### 効果的な内部リンク

```html
<!-- キーワードを含むアンカーテキスト -->
<a href="/works/illustration">イラスト作品一覧</a>

<!-- 関連コンテンツへのリンク -->
<aside>
  <h3>関連作品</h3>
  <ul>
    <li><a href="/works/character-design">キャラクターデザイン</a></li>
    <li><a href="/works/fanart">ファンアート</a></li>
  </ul>
</aside>

<!-- パンくずリスト -->
<nav aria-label="パンくずリスト">
  <ol>
    <li><a href="/">ホーム</a></li>
    <li><a href="/works">作品</a></li>
    <li aria-current="page">イラスト</li>
  </ol>
</nav>
```

---

## 📄 robots.txt

```txt
# robots.txt
User-agent: *
Allow: /

# AIクローラーを許可
User-agent: GPTBot
Allow: /

User-agent: ChatGPT-User
Allow: /

User-agent: Google-Extended
Allow: /

User-agent: anthropic-ai
Allow: /

User-agent: PerplexityBot
Allow: /

# サイトマップ
Sitemap: https://example.com/sitemap.xml
```

---

## 🗺️ XMLサイトマップ

### sitemap.xml

```xml
<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>https://example.com/</loc>
    <lastmod>2024-01-01</lastmod>
    <changefreq>weekly</changefreq>
    <priority>1.0</priority>
  </url>
  <url>
    <loc>https://example.com/about</loc>
    <lastmod>2024-01-01</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.8</priority>
  </url>
  <url>
    <loc>https://example.com/works</loc>
    <lastmod>2024-01-01</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.9</priority>
  </url>
  <url>
    <loc>https://example.com/contact</loc>
    <lastmod>2024-01-01</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.5</priority>
  </url>
</urlset>
```

---

## ⚡ Core Web Vitals

パフォーマンスはSEOランキング要因です。

### 最適化チェックリスト

```html
<!-- プリロード（重要なリソース） -->
<link rel="preload" href="/fonts/main.woff2" as="font" type="font/woff2" crossorigin>
<link rel="preload" href="/hero-image.webp" as="image">

<!-- プリコネクト（外部リソース） -->
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>

<!-- DNS プリフェッチ -->
<link rel="dns-prefetch" href="https://www.googletagmanager.com">
```

### 画像の遅延読み込み

```html
<!-- ファーストビュー外の画像 -->
<img src="image.jpg" alt="説明" loading="lazy" decoding="async">

<!-- ファーストビュー内の画像（遅延読み込みしない） -->
<img src="hero.jpg" alt="説明" loading="eager" fetchpriority="high">
```

---

## 🌐 多言語対応（hreflang）

```html
<link rel="alternate" hreflang="ja" href="https://example.com/">
<link rel="alternate" hreflang="en" href="https://example.com/en/">
<link rel="alternate" hreflang="x-default" href="https://example.com/">
```

---

## ✅ SEO/LLMOチェックリスト

### 基本設定
- [ ] title タグが適切（30-60文字）
- [ ] meta description が設定されている（120-160文字）
- [ ] canonical URL が設定されている
- [ ] ファビコンが設定されている
- [ ] OGP / Twitter Card が設定されている

### 構造化データ（LLMO重要）
- [ ] Person または Organization スキーマ
- [ ] WebSite スキーマ
- [ ] BreadcrumbList スキーマ
- [ ] 作品ページに CreativeWork / ImageObject
- [ ] FAQPage（よくある質問がある場合）

### コンテンツ
- [ ] h1 が1ページに1つだけ
- [ ] 見出しの階層が正しい（h1→h2→h3）
- [ ] 画像に適切な alt 属性
- [ ] セマンティックなHTML要素を使用
- [ ] 内部リンクが適切に設定

### 技術的SEO
- [ ] robots.txt が正しく設定
- [ ] sitemap.xml が生成されている
- [ ] ページ速度が最適化されている
- [ ] モバイルフレンドリー
- [ ] HTTPS で配信

### LLMO特化
- [ ] AIクローラーを robots.txt で許可
- [ ] 明確で簡潔な情報を提供
- [ ] 質問形式のコンテンツ（FAQ）を含む
- [ ] 事実ベースの情報を記載
- [ ] 最新の更新日を明記

---

## 🔧 テストツール

| ツール | 用途 | URL |
|-------|------|-----|
| Google Search Console | 検索パフォーマンス | https://search.google.com/search-console |
| PageSpeed Insights | ページ速度 | https://pagespeed.web.dev/ |
| Rich Results Test | 構造化データ | https://search.google.com/test/rich-results |
| Schema Markup Validator | スキーマ検証 | https://validator.schema.org/ |
| OGP Checker | OGP確認 | https://ogp.me/ |
| Lighthouse | 総合診断 | Chrome DevTools |

---

## 📚 参考リンク

- [Google SEO スターターガイド](https://developers.google.com/search/docs/fundamentals/seo-starter-guide)
- [Schema.org](https://schema.org/)
- [Google 構造化データ](https://developers.google.com/search/docs/appearance/structured-data/intro-structured-data)
- [OpenAI GPTBot](https://platform.openai.com/docs/gptbot)
