document.addEventListener("DOMContentLoaded", () => {
    // Cập nhật số lượng giỏ hàng hiển thị trên badge
    function updateCartCount() {
        let cart = JSON.parse(localStorage.getItem('cart')) || [];
        const cartCount = cart.reduce((total, product) => total + product.quantity, 0);
        const cartBadge = document.querySelector('.badge');
        cartBadge.textContent = cartCount;
    }

    // Cập nhật số lượng giỏ hàng khi tải trang
    updateCartCount();
});