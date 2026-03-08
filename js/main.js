/* ============================================================
   あにまる製菓 - ANIMAL CONFECTIONERY
   メイン JavaScript
   ============================================================ */

document.addEventListener('DOMContentLoaded', () => {
  // ── ヘッダーのスクロール検知 ──
  initHeaderScroll();

  // ── ハンバーガーメニュー ──
  initHamburger();

  // ── スクロールトップボタン ──
  initScrollTop();

  // ── フェードインアニメーション ──
  initFadeIn();

});

/* ── ヘッダーのスクロール時シャドウ追加 ── */
function initHeaderScroll() {
  const header = document.querySelector('.header');
  if (!header) return;

  const onScroll = () => {
    if (window.scrollY > 10) {
      header.classList.add('header--scrolled');
    } else {
      header.classList.remove('header--scrolled');
    }
  };

  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll(); // 初期状態のチェック
}

/* ── ハンバーガーメニューの開閉 ── */
function initHamburger() {
  const hamburger = document.querySelector('.hamburger');
  const mobileNav = document.querySelector('.mobile-nav');
  if (!hamburger || !mobileNav) return;

  hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('hamburger--active');
    mobileNav.classList.toggle('mobile-nav--active');

    // メニューが開いている間はスクロールを無効化
    if (mobileNav.classList.contains('mobile-nav--active')) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
  });

  // メニュー内のリンクをクリックしたらメニューを閉じる
  const mobileLinks = mobileNav.querySelectorAll('.mobile-nav__link');
  mobileLinks.forEach(link => {
    link.addEventListener('click', () => {
      hamburger.classList.remove('hamburger--active');
      mobileNav.classList.remove('mobile-nav--active');
      document.body.style.overflow = '';
    });
  });
}

/* ── スクロールトップボタン ── */
function initScrollTop() {
  const scrollTopBtn = document.querySelector('.scroll-top');
  if (!scrollTopBtn) return;

  window.addEventListener('scroll', () => {
    if (window.scrollY > 400) {
      scrollTopBtn.classList.add('scroll-top--visible');
    } else {
      scrollTopBtn.classList.remove('scroll-top--visible');
    }
  }, { passive: true });

  scrollTopBtn.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
}

/* ── フェードインアニメーション（IntersectionObserver） ── */
function initFadeIn() {
  const elements = document.querySelectorAll('.fade-in');
  if (elements.length === 0) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        observer.unobserve(entry.target); // 一度表示したら監視解除
      }
    });
  }, {
    threshold: 0.15,
    rootMargin: '0px 0px -40px 0px'
  });

  elements.forEach(el => observer.observe(el));
}


