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

    // ── 画像拡大用モーダルの処理 ──
    const modal = document.getElementById('image-modal');
    const modalImg = document.getElementById('image-modal-img');
    const closeBtn = document.getElementById('image-modal-close');
    const prevBtn = document.getElementById('image-modal-prev');
    const nextBtn = document.getElementById('image-modal-next');
    const dotsContainer = document.getElementById('image-modal-dots');

    if (modal && modalImg && closeBtn) {
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
                    currentImages = imagesAttr.split(',');
                } else {
                    const img = this.querySelector('img');
                    currentImages = img ? [img.getAttribute('src')] : [];
                }

                if (currentImages.length > 0) {
                    currentIndex = 0;
                    updateModalImage();
                    
                    modal.style.display = 'flex';
                    // わずかな遅延を入れてフェードインアニメーションを適用
                    setTimeout(() => {
                        modal.classList.add('show');
                    }, 10);
                }
            });
        });

        // モーダルの画像を更新する関数
        function updateModalImage() {
            modalImg.src = currentImages[currentIndex];

            // 複数画像がある場合のみコントロールを表示
            if (currentImages.length > 1) {
                if (prevBtn) prevBtn.style.display = 'flex';
                if (nextBtn) nextBtn.style.display = 'flex';
                
                // ドットの生成
                if (dotsContainer) {
                    dotsContainer.innerHTML = '';
                    dotsContainer.style.display = 'flex';
                    currentImages.forEach((_, idx) => {
                        const dot = document.createElement('span');
                        dot.className = 'image-modal__dot' + (idx === currentIndex ? ' image-modal__dot--active' : '');
                        dot.addEventListener('click', (e) => {
                            e.stopPropagation(); // モーダルが閉じるのを防ぐ
                            currentIndex = idx;
                            updateModalImage();
                        });
                        dotsContainer.appendChild(dot);
                    });
                }
            } else {
                if (prevBtn) prevBtn.style.display = 'none';
                if (nextBtn) nextBtn.style.display = 'none';
                if (dotsContainer) {
                    dotsContainer.innerHTML = '';
                    dotsContainer.style.display = 'none';
                }
            }
        }

        // 次の画像へ
        function nextImage(e) {
            if (e) e.stopPropagation();
            if (currentImages.length <= 1) return;
            currentIndex = (currentIndex + 1) % currentImages.length;
            updateModalImage();
        }

        // 前の画像へ
        function prevImage(e) {
            if (e) e.stopPropagation();
            if (currentImages.length <= 1) return;
            currentIndex = (currentIndex - 1 + currentImages.length) % currentImages.length;
            updateModalImage();
        }

        if (prevBtn) prevBtn.addEventListener('click', prevImage);
        if (nextBtn) nextBtn.addEventListener('click', nextImage);

        // キーボード操作（左右矢印で画像切り替え、Escで閉じる）
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

        // モーダルの背景領域（画像やボタン以外）がクリックされた時に閉じる
        modal.addEventListener('click', (e) => {
            const container = document.querySelector('.image-modal__container');
            if (e.target === modal || (container && e.target === container)) {
                closeModal();
            }
        });

        // モーダルを閉じる関数
        function closeModal() {
            modal.classList.remove('show');
            setTimeout(() => {
                modal.style.display = 'none';
            }, 300); // css of transition time(0.3s)
        }
    }
});
