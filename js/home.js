/* ============================================================
   ホームページ専用JavaScript
   ============================================================ */

document.addEventListener('DOMContentLoaded', function () {

    // ── ヒーロースライダー ──
    const slides = document.querySelectorAll('.home-hero__slide');
    let currentSlide = 0;
    const slideInterval = 5000; // 5秒ごとにスライド切替

    if (slides.length > 1) {
        setInterval(function () {
            // 現在のスライドを非アクティブにする
            slides[currentSlide].classList.remove('home-hero__slide--active');

            // 次のスライドに進む
            currentSlide = (currentSlide + 1) % slides.length;

            // 次のスライドをアクティブにする
            slides[currentSlide].classList.add('home-hero__slide--active');
        }, slideInterval);
    }

    // ── PICK UPセクション 横スクロール（ドラッグ対応） ──
    const trackWrap = document.querySelector('.home-pickup__track-wrap');
    if (trackWrap) {
        let isDown = false;
        let startX;
        let scrollLeft;

        trackWrap.addEventListener('mousedown', function (e) {
            isDown = true;
            trackWrap.style.cursor = 'grabbing';
            startX = e.pageX - trackWrap.offsetLeft;
            scrollLeft = trackWrap.scrollLeft;
        });

        trackWrap.addEventListener('mouseleave', function () {
            isDown = false;
            trackWrap.style.cursor = 'grab';
        });

        trackWrap.addEventListener('mouseup', function () {
            isDown = false;
            trackWrap.style.cursor = 'grab';
        });

        trackWrap.addEventListener('mousemove', function (e) {
            if (!isDown) return;
            e.preventDefault();
            const x = e.pageX - trackWrap.offsetLeft;
            const walk = (x - startX) * 2; // スクロール速度の倍率
            trackWrap.scrollLeft = scrollLeft - walk;
        });

        // 初期カーソルスタイル
        trackWrap.style.cursor = 'grab';
    }

    // ── ヘッダーの透過制御（ホームページ専用） ──
    const header = document.getElementById('header');
    if (header && header.classList.contains('header--transparent')) {
        function handleHeaderTransparency() {
            if (window.scrollY > 100) {
                header.classList.add('header--scrolled');
            } else {
                header.classList.remove('header--scrolled');
            }
        }

        window.addEventListener('scroll', handleHeaderTransparency, { passive: true });
        handleHeaderTransparency(); // 初期状態チェック
    }

});
