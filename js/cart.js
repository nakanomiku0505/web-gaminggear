const discountCodes = {
    "SALE10": 10,  // Giảm 10%
    "SALE20": 20,  // Giảm 20%
    "FREESHIP": 5  // Giảm 5%
};

// Function to load cart data
function loadCart() {
    const cart = JSON.parse(localStorage.getItem('cart')) || []; // Load cart items from localStorage
    const cartContainer = document.querySelector('#cart-items-container'); // Container for the cart items
    const totalPriceElem = document.querySelector('#cart-total-price'); // Total price element
    const cartQuantityElem = document.querySelector('#cart-total-quantity'); // Cart total quantity element
    const emptyCartMessage = document.querySelector('#empty-cart-message'); // Empty cart message element
    const finalTotalPriceElem = document.querySelector('#final-total-price'); // Total price element

    // Clear the existing cart items in the container
    cartContainer.innerHTML = '';
    let totalPrice = 0;
    let totalQuantity = 0;

    // Check if the cart is empty
    if (cart.length === 0) {
        // Hiển thị thông báo giỏ hàng trống và ẩn danh sách sản phẩm
        emptyCartMessage.style.display = 'block';
        cartContainer.style.display = 'none';

        // Đặt lại các giá trị liên quan
        totalPriceElem.textContent = '0đ'; // Tổng giá trị ban đầu
        cartQuantityElem.textContent = '0'; // Tổng số lượng sản phẩm
        finalTotalPriceElem.textContent = '0đ'; // Tổng giá trị cuối cùng sau giảm giá
    } else {
        // Hide the empty cart message and show the cart items
        emptyCartMessage.style.display = 'none';
        cartContainer.style.display = 'block';

        // Loop through each item in the cart and display it
        cart.forEach(item => {
            const itemPriceFormatted = parseInt(item.price.replace(/[^\d]/g, '')); // Chỉ giữ lại các ký tự số

            // Create HTML structure for each cart item
            const cartItem = `
            <div class="cart-item row mb-4 d-flex justify-content-between align-items-center">
                <div class="col-md-2 col-lg-2 col-xl-2">
                    <img src="${item.img}" class="img-fluid rounded-3" alt="${item.name}">
                </div>
                <div class="col-md-3 col-lg-3 col-xl-3">
                    <h6 class="text-muted">${item.type}</h6>
                    <h6 class="mb-0">${item.name}</h6>
                </div>
                <div class="col-md-3 col-lg-3 col-xl-2 d-flex">
                    <button class="btn btn-link px-2" onclick="updateQuantity('${item.id}', 'decrease')">
                        <i class="bx bx-minus text-dark"></i>
                    </button>
                    <input id="quantity-${item.id}" min="1" name="quantity" value="${item.quantity}" type="number" class="form-control form-control-sm" readonly />
                    <button class="btn btn-link px-2" onclick="updateQuantity('${item.id}', 'increase')">
                        <i class="bx bx-plus text-dark"></i>
                    </button>
                </div>
                <div class="col-md-3 col-lg-2 col-xl-2 offset-lg-1">
                    <h6 class="mb-0">${(itemPriceFormatted * item.quantity).toLocaleString()}đ</h6>
                </div>
                <div class="col-md-1 col-lg-1 col-xl-1 text-end">
                    <a href="#!" class="text-muted" onclick="removeItem('${item.id}')"><i class="bx bx-x"></i></a>
                </div>
            </div>  
            `;

            // Append the cart item to the container
            cartContainer.innerHTML += cartItem;

            // Update total price and quantity
            totalPrice += itemPriceFormatted * item.quantity;
            totalQuantity += item.quantity;
        });

        // Update the total price and item quantity on the page
        totalPriceElem.textContent = `${totalPrice.toLocaleString()}đ`; // Display total price in 'đ'
        cartQuantityElem.textContent = totalQuantity; // Update the total item count
        finalTotalPriceElem.textContent = `${totalPrice.toLocaleString()}đ`;
    }
}


// Call loadCart to display the items when the page loads
window.onload = loadCart;

// Update quantity of the item in the cart
function updateQuantity(itemId, action) {
    let cart = JSON.parse(localStorage.getItem('cart')) || [];
    const itemIndex = cart.findIndex(item => item.id === itemId);

    if (itemIndex !== -1) {
        if (action === 'increase') {
            cart[itemIndex].quantity += 1;
        } else if (action === 'decrease' && cart[itemIndex].quantity > 1) {
            cart[itemIndex].quantity -= 1;
        }

        // Save the updated cart to localStorage
        localStorage.setItem('cart', JSON.stringify(cart));

        // Reload the cart to reflect changes
        loadCart();
    }
}
function updateCartCount() {
    let cart = JSON.parse(localStorage.getItem('cart')) || [];
    const cartCount = cart.reduce((total, product) => total + product.quantity, 0);
    const cartBadge = document.querySelector('.badge');
    cartBadge.textContent = cartCount;
}
// Remove an item from the cart
function removeItem(itemId) {
    let cart = JSON.parse(localStorage.getItem('cart')) || [];
    cart = cart.filter(item => item.id !== itemId);

    // Save the updated cart to localStorage
    localStorage.setItem('cart', JSON.stringify(cart));

    // Reload the cart to reflect changes
    loadCart();

    // Cập nhật số lượng giỏ hàng
    updateCartCount();

}
function applyDiscount() {
    const discountInput = document.querySelector('#discount-code').value.trim(); // Lấy mã giảm giá
    const discountMessage = document.querySelector('#discount-message'); // Thông báo mã giảm giá
    const totalPriceElem = document.querySelector('#cart-total-price'); // Tổng giá trị ban đầu
    const finalTotalPriceElem = document.querySelector('#final-total-price'); // Tổng giá trị cuối cùng sau giảm giá

    // Lấy giá trị tổng ban đầu từ giao diện
    let totalPrice = parseInt(totalPriceElem.textContent.replace(/[^\d]/g, ''));

    if (discountInput === '') {
        // Nếu không có mã giảm giá (hoặc người dùng không nhập gì)
        discountMessage.textContent = 'Mã giảm giá không hợp lệ hoặc đã hết hạn.';
        discountMessage.style.color = 'red';
        finalTotalPriceElem.textContent = `${totalPrice.toLocaleString()}đ`; // Không thay đổi tổng giá trị

        // Xóa mã giảm giá khỏi localStorage khi không nhập mã giảm giá
        localStorage.setItem('discountCode', null);
        localStorage.setItem('discountPercent', null);
        return;
    }

    // Kiểm tra mã giảm giá
    if (discountCodes[discountInput]) {
        const discountPercent = discountCodes[discountInput]; // Tỷ lệ giảm giá
        const discountAmount = (totalPrice * discountPercent) / 100; // Tính số tiền giảm giá
        const finalPrice = totalPrice - discountAmount; // Tổng giá trị sau khi giảm giá

        // Cập nhật giao diện
        finalTotalPriceElem.textContent = `${finalPrice.toLocaleString()}đ`;
        discountMessage.textContent = `Áp dụng mã giảm giá thành công! Bạn được giảm ${discountPercent}%`;
        discountMessage.style.color = 'green';

        // Lưu mã giảm giá và phần trăm giảm giá vào localStorage
        localStorage.setItem('discountCode', discountInput);
        localStorage.setItem('discountPercent', discountPercent); // Lưu phần trăm giảm giá
    } else {
        // Mã giảm giá không hợp lệ
        discountMessage.textContent = 'Mã giảm giá không hợp lệ hoặc đã hết hạn.';
        discountMessage.style.color = 'red';
        finalTotalPriceElem.textContent = `${totalPrice.toLocaleString()}đ`; // Không thay đổi tổng giá trị

        // Thiết lập giá trị null cho discountCode và discountPercent nếu mã giảm giá không hợp lệ
        localStorage.setItem('discountCode', null);
        localStorage.setItem('discountPercent', null);
    }
}


// Đặt flag khi bấm thanh toán
let isProceedingToCheckout = false;

function proceedToCheckout() {
    isProceedingToCheckout = true; // Đặt cờ là true khi bấm thanh toán

    const cart = JSON.parse(localStorage.getItem('cart')) || []; // Lấy giỏ hàng hiện tại
    const finalTotalPriceElem = document.querySelector('#final-total-price'); // Phần tử hiển thị tổng số tiền

    if (cart.length === 0) {
        alert('Giỏ hàng của bạn đang trống. Vui lòng thêm sản phẩm trước khi thanh toán.');
        return;
    }

    // Lấy giá trị tổng tiền từ phần tử với định dạng tiền tệ
    let finalTotalPriceText = finalTotalPriceElem.textContent.trim(); // Giữ nguyên định dạng tiền tệ (điều này bao gồm dấu phẩy và chữ "đ")

    // Lưu giỏ hàng, tổng số tiền, mã giảm giá và phần trăm giảm giá vào localStorage
    localStorage.setItem('checkoutData', JSON.stringify(cart));
    localStorage.setItem('finalTotalPrice', finalTotalPriceText); // Lưu giá trị định dạng tiền tệ

    // Lấy mã giảm giá và phần trăm giảm giá nếu có và lưu vào checkout data
    const appliedDiscountCode = localStorage.getItem('discountCode') || null;
    const appliedDiscountPercent = localStorage.getItem('discountPercent') || null;

    // Nếu không có mã giảm giá, set giá trị là null
    if (!appliedDiscountCode || !appliedDiscountPercent) {
        localStorage.setItem('discountCode', null);
        localStorage.setItem('discountPercent', null);
    } else {
        if (appliedDiscountCode) {
            localStorage.setItem('appliedDiscountCode', appliedDiscountCode);
        }
        if (appliedDiscountPercent) {
            localStorage.setItem('appliedDiscountPercent', appliedDiscountPercent);
        }
    }

    // Chuyển sang trang thanh toán
    window.location.href = 'checkout.html'; // Đường dẫn tới trang thanh toán
}
window.addEventListener('beforeunload', function (event) {
    if (!isProceedingToCheckout) {
        // Nếu không phải là hành động thanh toán, xóa mã giảm giá
        localStorage.setItem('discountCode', null);
        localStorage.setItem('discountPercent', null);
        localStorage.setItem('appliedDiscountCode', null);
        localStorage.setItem('applieDiscountPercent', null);
    }
});

// Đặt lại flag khi quay lại trang giỏ hàng
window.addEventListener('load', function () {
    isProceedingToCheckout = false;
});
