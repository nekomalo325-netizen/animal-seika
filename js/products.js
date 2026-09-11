/* ============================================================
   あにまる製菓 - Products（グッズ一覧）ページ用 JavaScript
   カテゴリーフィルター・絵師フィルター機能
   ============================================================ */

// 現在のフィルター状態を管理
let currentCategory = 'keychain'; // 初期表示をプライムキーチェーンに変更

/* ── カテゴリーフィルター ── */
function filterProducts(category, btn) {
    currentCategory = category;

    // ボタンのアクティブ状態を切り替え
    const filterBtns = btn.parentElement.querySelectorAll('.filter-btn');
    filterBtns.forEach(b => b.classList.remove('filter-btn--active'));
    btn.classList.add('filter-btn--active');

    applyFilters();
}

/* ── フィルターを適用 ── */
function applyFilters() {
    const cards = document.querySelectorAll('#product-grid .product-card, #product-grid .product-category-top');

    cards.forEach(card => {
        const cardCategory = card.getAttribute('data-category');

        const matchCategory = (cardCategory === currentCategory);

        if (matchCategory) {
            card.style.display = '';
            // フェードインアニメーション
            card.style.opacity = '0';
            card.style.transform = 'translateY(10px)';
            setTimeout(() => {
                card.style.transition = 'opacity 0.4s ease, transform 0.4s ease';
                card.style.opacity = '1';
                card.style.transform = 'translateY(0)';
            }, 50);
        } else {
            card.style.display = 'none';
        }
    });
}

// ページ読み込み時に初期状態（またはURLパラメータから指定のカテゴリ）を適用
document.addEventListener('DOMContentLoaded', () => {
    const urlParams = new URLSearchParams(window.location.search);
    const categoryParam = urlParams.get('category');

    if (categoryParam) {
        currentCategory = categoryParam;

        // 該当するボタンにアクティブクラスを付与
        const filterBtns = document.querySelectorAll('.filter-btn');
        filterBtns.forEach(btn => {
            if (btn.getAttribute('data-filter') === currentCategory) {
                btn.classList.add('filter-btn--active');
            } else {
                btn.classList.remove('filter-btn--active');
            }
        });
    }

    applyFilters();

    // ── 商品カードの複数枚バッジ自動生成 ──
    initCardBadgeCount();

    // ── 画像スライダーモーダルの処理（カレンダー仕様の1枚ずつ横スライド） ──
    const modal = document.getElementById('image-modal');
    const closeBtn = document.getElementById('image-modal-close');
    const prevBtn = document.getElementById('image-modal-prev');
    const nextBtn = document.getElementById('image-modal-next');
    const dotsContainer = document.getElementById('image-modal-dots');
    const counterEl = document.getElementById('image-modal-counter');
    const sliderContainer = document.getElementById('image-modal-slider') || document.getElementById('image-modal-viewport');
    const track = document.getElementById('image-modal-track');
    const modalImg = document.getElementById('image-modal-img'); // 旧互換

    if (modal && closeBtn) {
        let currentImages = [];
        let currentIndex = 0;

        // 商品カードがクリックされた時の処理
        const productCards = document.querySelectorAll('.product-card');
        productCards.forEach(card => {
            card.addEventListener('click', function (e) {
                // aタグのhref="#"による画面遷移を防ぐ
                e.preventDefault();

                // .no-modal クラスが付いているカードは拡大表示しない
                if (this.classList.contains('no-modal')) {
                    return;
                }

                // data-images属性を取得、なければ現在の画像のsrcを使用
                const imagesAttr = this.getAttribute('data-images');
                if (imagesAttr) {
                    currentImages = imagesAttr.split(',').map(s => s.trim()).filter(s => s.length > 0);
                } else {
                    const img = this.querySelector('img');
                    currentImages = img ? [img.getAttribute('src')] : [];
                }

                if (currentImages.length > 0) {
                    openModalWithImages(currentImages);
                }
            });
        });

        // モーダルを開いてスライドを初期化（カレンダースライダー仕様）
        function openModalWithImages(images) {
            currentIndex = 0;
            const totalSlides = images.length;

            // スライドトラックに画像要素を生成
            if (track) {
                track.innerHTML = '';
                // 横一列のトラック（幅100%、子要素が100%ずつ横並び）
                track.style.display = 'flex';
                track.style.flexDirection = 'row';
                track.style.flexWrap = 'nowrap';
                track.style.width = '100%';
                track.style.height = '100%';
                track.style.transition = 'none';
                track.style.transform = 'translateX(0%)';

                images.forEach((src, idx) => {
                    const slide = document.createElement('div');
                    slide.className = 'image-modal__slide';
                    // 1枚につき親枠全体の100%幅を確保
                    slide.style.width = '100%';
                    slide.style.minWidth = '100%';
                    slide.style.maxWidth = '100%';
                    slide.style.flex = '0 0 100%';
                    slide.style.height = '100%';
                    slide.style.display = 'flex';
                    slide.style.alignItems = 'center';
                    slide.style.justifyContent = 'center';
                    slide.style.padding = '6px';
                    slide.style.boxSizing = 'border-box';
                    slide.style.overflow = 'hidden';

                    const img = document.createElement('img');
                    img.src = src;
                    img.alt = '商品画像 ' + (idx + 1);
                    img.className = 'image-modal__slide-img';
                    // 少しアップで写真が美しく浮かび上がる設定
                    img.style.maxWidth = '100%';
                    img.style.maxHeight = '100%';
                    img.style.width = 'auto';
                    img.style.height = 'auto';
                    img.style.objectFit = 'contain';
                    img.style.display = 'block';
                    img.style.margin = 'auto';
                    img.style.borderRadius = '12px';
                    img.style.boxShadow = '0 12px 35px rgba(0, 0, 0, 0.6)';
                    img.style.pointerEvents = 'none';

                    slide.appendChild(img);
                    track.appendChild(slide);
                });
            } else if (modalImg) {
                modalImg.src = images[0];
            }

            // ドットの生成
            if (dotsContainer) {
                dotsContainer.innerHTML = '';
                if (totalSlides > 1) {
                    dotsContainer.style.display = 'flex';
                    images.forEach((_, idx) => {
                        const dot = document.createElement('span');
                        dot.className = 'image-modal__dot' + (idx === 0 ? ' image-modal__dot--active' : '');
                        dot.setAttribute('aria-label', (idx + 1) + '枚目の写真へ');
                        dot.addEventListener('click', (e) => {
                            e.stopPropagation();
                            goToSlide(idx);
                        });
                        dotsContainer.appendChild(dot);
                    });
                } else {
                    dotsContainer.style.display = 'none';
                }
            }

            // 最初のスライドへ移動（アニメーションなし）
            goToSlide(0, false);

            // モーダル表示＆背面スクロール防止
            modal.style.display = 'flex';
            document.body.style.overflow = 'hidden';
            setTimeout(() => {
                modal.classList.add('show');
            }, 10);
        }

        // 指定インデックスのスライドへ横移動（1枚ずつ確実にスライド）
        function goToSlide(index, animate = true) {
            const totalSlides = currentImages.length;
            if (totalSlides === 0) return;
            currentIndex = index;

            if (track) {
                track.style.transition = animate ? 'transform 0.45s cubic-bezier(0.25, 1, 0.5, 1)' : 'none';
                // 1スライド（100%幅）ごとに横移動
                track.style.transform = 'translateX(-' + (currentIndex * 100) + '%)';
            } else if (modalImg) {
                modalImg.src = currentImages[currentIndex];
            }

            // カウンター表示の更新 (例: 1 / 5)
            if (counterEl) {
                if (totalSlides > 1) {
                    counterEl.textContent = (currentIndex + 1) + ' / ' + totalSlides;
                    counterEl.style.display = 'block';
                } else {
                    counterEl.style.display = 'none';
                }
            }

            // カレンダー同様の「くの字」ボタン表示制御（複数枚ある場合のみ表示）
            if (prevBtn) prevBtn.style.display = totalSlides > 1 ? 'flex' : 'none';
            if (nextBtn) nextBtn.style.display = totalSlides > 1 ? 'flex' : 'none';

            // ドットのアクティブ状態更新
            if (dotsContainer) {
                const dots = dotsContainer.querySelectorAll('.image-modal__dot');
                dots.forEach((dot, idx) => {
                    if (idx === currentIndex) {
                        dot.classList.add('image-modal__dot--active');
                    } else {
                        dot.classList.remove('image-modal__dot--active');
                    }
                });
            }
        }

        // 次の写真へ横スライド（カレンダー同様のループ動作）
        function nextImage(e) {
            if (e) e.stopPropagation();
            const totalSlides = currentImages.length;
            if (totalSlides <= 1) return;
            const nextIdx = (currentIndex >= totalSlides - 1) ? 0 : currentIndex + 1;
            goToSlide(nextIdx);
        }

        // 前の写真へ横スライド（カレンダー同様のループ動作）
        function prevImage(e) {
            if (e) e.stopPropagation();
            const totalSlides = currentImages.length;
            if (totalSlides <= 1) return;
            const prevIdx = (currentIndex <= 0) ? totalSlides - 1 : currentIndex - 1;
            goToSlide(prevIdx);
        }

        if (prevBtn) prevBtn.addEventListener('click', prevImage);
        if (nextBtn) nextBtn.addEventListener('click', nextImage);

        // スライダー枠をクリックした時も次の写真へ進む（複数枚ある場合）
        if (sliderContainer) {
            sliderContainer.addEventListener('click', (e) => {
                // ボタンやドットをクリックした場合は重複実行しない
                if (e.target === prevBtn || e.target === nextBtn || e.target.classList.contains('image-modal__dot')) {
                    return;
                }
                if (currentImages.length > 1) {
                    nextImage(e);
                }
            });

            // ── スマホ・タッチスワイプ操作の実装 ──
            let touchStartX = 0;
            let touchStartY = 0;
            let touchEndX = 0;
            let touchEndY = 0;

            sliderContainer.addEventListener('touchstart', (e) => {
                touchStartX = e.changedTouches[0].screenX;
                touchStartY = e.changedTouches[0].screenY;
            }, { passive: true });

            sliderContainer.addEventListener('touchend', (e) => {
                touchEndX = e.changedTouches[0].screenX;
                touchEndY = e.changedTouches[0].screenY;
                const diffX = touchEndX - touchStartX;
                const diffY = touchEndY - touchStartY;

                // 左右スワイプを検知（横の動きが縦の動きより大きい場合）
                if (Math.abs(diffX) > 35 && Math.abs(diffX) > Math.abs(diffY)) {
                    if (diffX < 0) {
                        nextImage(e); // 左スワイプ -> 次の写真
                    } else {
                        prevImage(e); // 右スワイプ -> 前の写真
                    }
                }
            }, { passive: true });
        }

        // キーボード操作（左右矢印でスライド、Escで閉じる）
        document.addEventListener('keydown', (e) => {
            if (!modal.classList.contains('show')) return;

            if (e.key === 'ArrowRight') {
                nextImage();
            } else if (e.key === 'ArrowLeft') {
                prevImage();
            } else if (e.key === 'Escape') {
                closeModal();
            }
        });

        // 閉じるボタンがクリックされた時の処理
        closeBtn.addEventListener('click', closeModal);

        // 背景クリックで閉じる（写真の外側をクリックした時）
        modal.addEventListener('click', (e) => {
            if (e.target === modal || e.target.classList.contains('image-modal__wrapper')) {
                closeModal();
            }
        });

        // モーダルを閉じる関数
        function closeModal() {
            modal.classList.remove('show');
            document.body.style.overflow = '';
            setTimeout(() => {
                modal.style.display = 'none';
            }, 300);
        }
    }

    // ── カード上に「複数画像」を示すバッジを自動付与 ──
    function initCardBadgeCount() {
        const cards = document.querySelectorAll('.product-card');
        cards.forEach(card => {
            const imagesAttr = card.getAttribute('data-images');
            if (imagesAttr) {
                const count = imagesAttr.split(',').filter(s => s.trim().length > 0).length;
                if (count > 1) {
                    const wrap = card.querySelector('.product-card__image-wrap');
                    if (wrap && !wrap.querySelector('.product-card__badge-count')) {
                        const badge = document.createElement('span');
                        badge.className = 'product-card__badge-count';
                        badge.setAttribute('title', count + '枚の写真');
                        badge.innerHTML = '<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="14" height="14" rx="2"/><path d="M7 21h14a2 2 0 0 0 2-2V7"/></svg> 1/' + count;
                        wrap.appendChild(badge);
                    }
                }
            }
        });
    }
});
