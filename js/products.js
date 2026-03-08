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

    if (modal && modalImg && closeBtn) {
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

                // クリックされたカード内のimg要素を取得
                const img = this.querySelector('img');
                if (img) {
                    modal.style.display = 'flex';
                    // わずかな遅延を入れてフェードインアニメーションを適用
                    setTimeout(() => {
                        modal.classList.add('show');
                    }, 10);
                    modalImg.src = img.src;
                }
            });
        });

        // 閉じるボタンがクリックされた時の処理
        closeBtn.addEventListener('click', closeModal);

        // モーダルの背景領域（画像以外）がクリックされた時に閉じる
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                closeModal();
            }
        });

        // モーダルを閉じる関数
        function closeModal() {
            modal.classList.remove('show');
            setTimeout(() => {
                modal.style.display = 'none';
            }, 300); // cssのtransitionの秒数(0.3s)と合わせる
        }
    }
});
