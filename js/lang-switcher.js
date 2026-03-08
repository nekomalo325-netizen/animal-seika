/* ============================================================
   あにまる製菓 - 言語切り替え機能
   対応言語: 日本語(ja), 英語(en), 中国語簡体字(zh)
   ============================================================ */

(function () {
  'use strict';

  // サポートする言語一覧
  const SUPPORTED_LANGS = ['ja', 'en', 'zh'];

  // 言語表示ラベル
  const LANG_LABELS = {
    ja: 'JA',
    en: 'EN',
    zh: 'ZH'
  };

  // 言語のフルネーム（ツールチップ用）
  const LANG_NAMES = {
    ja: '日本語',
    en: 'English',
    zh: '中文'
  };

  /* ── 現在の言語を取得する ── */
  function getCurrentLang() {
    const saved = localStorage.getItem('animal-seika-lang');
    if (saved && SUPPORTED_LANGS.includes(saved)) {
      return saved;
    }
    // ブラウザの言語設定から自動判定
    const browserLang = navigator.language.substring(0, 2);
    if (SUPPORTED_LANGS.includes(browserLang)) {
      return browserLang;
    }
    return 'ja'; // デフォルトは日本語
  }

  /* ── 言語を設定して全テキストを切り替える ── */
  function setLang(lang) {
    if (!SUPPORTED_LANGS.includes(lang)) return;

    localStorage.setItem('animal-seika-lang', lang);

    // html要素のlang属性を更新
    document.documentElement.lang = lang;

    // すべての data-i18n 要素のテキストを更新
    document.querySelectorAll('[data-i18n]').forEach(function (el) {
      const key = el.getAttribute('data-i18n');
      if (I18N_DATA[key] && I18N_DATA[key][lang]) {
        el.innerHTML = I18N_DATA[key][lang];
      }
    });

    // 切り替えボタンのアクティブ状態を更新
    document.querySelectorAll('.lang-switcher__btn').forEach(function (btn) {
      if (btn.getAttribute('data-lang') === lang) {
        btn.classList.add('lang-switcher__btn--active');
      } else {
        btn.classList.remove('lang-switcher__btn--active');
      }
    });
  }

  /* ── 言語切り替えUIを生成してヘッダーに挿入する ── */
  function createLangSwitcher() {
    const currentLang = getCurrentLang();

    // --- デスクトップ・モバイル共通（ハンバーガーボタンの左に配置） ---
    const switcher = document.createElement('div');
    switcher.className = 'lang-switcher';
    switcher.setAttribute('aria-label', '言語切り替え');

    // 地球アイコン（モバイルではタップでメニューを開閉する）
    const iconBtn = document.createElement('button');
    iconBtn.className = 'lang-switcher__icon';
    iconBtn.setAttribute('aria-label', '言語を選択');
    // 少し大きめのアイコン
    iconBtn.innerHTML = '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/></svg>';
    switcher.appendChild(iconBtn);

    // 言語ボタンが入るコンテナ
    const options = document.createElement('div');
    options.className = 'lang-switcher__options';

    // 言語ボタン（JA / EN / ZH）
    SUPPORTED_LANGS.forEach(function (lang) {
      const btn = document.createElement('button');
      btn.className = 'lang-switcher__btn';
      if (lang === currentLang) {
        btn.classList.add('lang-switcher__btn--active');
      }
      btn.setAttribute('data-lang', lang);
      btn.setAttribute('title', LANG_NAMES[lang]);
      btn.textContent = LANG_LABELS[lang];
      btn.addEventListener('click', function () {
        setLang(lang);
        // スマホで言語を選んだらドロップダウンを閉じる
        switcher.classList.remove('lang-switcher--open');
      });
      options.appendChild(btn);
    });

    switcher.appendChild(options);

    // アイコンタップで開閉（スマホ用）
    iconBtn.addEventListener('click', function (e) {
      e.stopPropagation();
      switcher.classList.toggle('lang-switcher--open');
    });

    // 画面外をタップしたら閉じる
    document.addEventListener('click', function (e) {
      if (!switcher.contains(e.target)) {
        switcher.classList.remove('lang-switcher--open');
      }
    });

    // ヘッダーの.header__inner内に挿入
    const headerInner = document.querySelector('.header__inner');
    if (headerInner) {
      const hamburger = headerInner.querySelector('.hamburger');
      if (hamburger) {
        // ハンバーガーの直前に配置
        headerInner.insertBefore(switcher, hamburger);
      } else {
        headerInner.appendChild(switcher);
      }
    }
  }

  /* ── 初期化 ── */
  document.addEventListener('DOMContentLoaded', function () {
    createLangSwitcher();
    // 保存されている言語で初期表示を適用
    const currentLang = getCurrentLang();
    if (currentLang !== 'ja') {
      // 日本語以外が保存されていた場合のみ切り替え
      setLang(currentLang);
    }
  });
})();
