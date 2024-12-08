document.addEventListener("DOMContentLoaded", function () {
    const checkoutData = JSON.parse(localStorage.getItem("checkoutData"));
    const appliedDiscountCode = localStorage.getItem("appliedDiscountCode");
    const appliedDiscountPercent = parseFloat(localStorage.getItem("appliedDiscountPercent"));

    if (checkoutData && checkoutData.length > 0) {
        const cartItemsContainer = document.querySelector("#cart-items-list");
        const discountCodeItem = document.querySelector("#discount-code-item");
        const discountCodeElement = document.querySelector("#discount-code");
        const discountAmountElement = document.querySelector("#discount-amount");
        const totalPriceElement = document.querySelector("#total-price");
        const cartItemCount = document.querySelector("#cart-item-count"); // Lấy thẻ số lượng sản phẩm
        const noDiscountMessage = document.querySelector("#no-discount-message"); // Thẻ hiển thị thông báo "Không có mã giảm giá"

        let totalPrice = 0;
        let totalQuantity = 0; // Biến lưu tổng số lượng sản phẩm

        checkoutData.forEach(product => {
            const price = parseInt(product.price.replace(/[^\d]/g, ""));
            const itemTotalPrice = price * product.quantity;
            totalPrice += itemTotalPrice;
            totalQuantity += product.quantity; // Cộng dồn số lượng sản phẩm
            const productCard = document.createElement('li');
            productCard.classList.add('list-group-item', 'd-flex', 'justify-content-between', 'lh-condensed');
            productCard.innerHTML = `
          <div>
            <h6 class="my-0">${product.name}</h6>
            <small class="text-muted">${product.type}</small>
          </div>
          <span class="text-muted">${formatCurrency(price)} x ${product.quantity}</span>
        `;
            cartItemsContainer.appendChild(productCard);
        });

        // Cập nhật số lượng sản phẩm trong giỏ hàng
        cartItemCount.textContent = totalQuantity;

        // Kiểm tra và hiển thị mã giảm giá nếu có
        if (appliedDiscountCode && appliedDiscountPercent) {
            // Nếu có mã giảm giá, hiển thị phần mã giảm giá và tính toán giá trị giảm
            discountCodeItem.style.display = 'block';
            discountCodeElement.textContent = appliedDiscountCode;
            const discountAmount = (totalPrice * appliedDiscountPercent) / 100;
            discountAmountElement.textContent = `-${formatCurrency(discountAmount)}`;
            const finalTotalPrice = totalPrice - discountAmount;
            totalPriceElement.textContent = formatCurrency(finalTotalPrice);

            // Ẩn thông báo "Không có mã giảm giá"
            noDiscountMessage.style.display = 'none';
        } else {
            // Nếu không có mã giảm giá, ẩn phần mã giảm giá và chỉ tính tổng giá ban đầu
            discountCodeItem.style.display = 'none'; // Ẩn phần mã giảm giá
            totalPriceElement.textContent = formatCurrency(totalPrice);

            // Hiển thị thông báo "Không có mã giảm giá"
            noDiscountMessage.style.display = 'block'; // Hiển thị thông báo
        }
    }
});

function formatCurrency(amount) {
    return amount.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' });
}
// Lắng nghe sự thay đổi của radio buttons
const radioButtons = document.querySelectorAll('input[name="paymentOption"]');

radioButtons.forEach(button => {
    button.addEventListener('change', function () {
        // Ẩn tất cả các phương thức thanh toán
        document.querySelector('#bankCardInfo').style.display = 'none';
        document.querySelector('#bankTransferQR').style.display = 'none';
        document.querySelector('#cashOnDeliveryInfo').style.display = 'none';

        // Hiển thị thông tin dựa trên lựa chọn
        if (document.getElementById('flexRadioDefault1').checked) {
            // Hiển thị thông tin thẻ ngân hàng
            document.querySelector('#bankCardInfo').style.display = 'block';
        } else if (document.getElementById('flexRadioDefault2').checked) {
            // Hiển thị QR chuyển khoản ngân hàng
            document.querySelector('#bankTransferQR').style.display = 'block';
        } else if (document.getElementById('flexRadioDefault3').checked) {
            // Không hiển thị gì cho thanh toán khi nhận hàng
            document.querySelector('#cashOnDeliveryInfo').style.display = 'none';
        }
    });
});
(function () {
    'use strict'

    // Lấy tất cả các trường đầu vào trong form
    const form = document.getElementById('payment-form');
    const inputs = form.querySelectorAll('input');

    // Lặp qua tất cả các trường đầu vào và thêm sự kiện 'input'
    inputs.forEach(function (input) {
        input.addEventListener('input', function () {
            // Kiểm tra tính hợp lệ của trường nhập
            if (input.checkValidity()) {
                input.classList.remove('is-invalid');  // Xóa lỗi nếu hợp lệ
                input.classList.add('is-valid');       // Thêm class hợp lệ
            } else {
                input.classList.remove('is-valid');   // Xóa hợp lệ nếu không hợp lệ
                input.classList.add('is-invalid');    // Thêm class lỗi
            }
        });
    });
})();
// JavaScript for form validation
document.getElementById('continue-button').addEventListener('click', function () {
    const form = document.getElementById('payment-form');
    const cardInfoSection = document.getElementById('bankCardInfo');
    const inputs = form.querySelectorAll('input');
    let isValid = true;

    // Kiểm tra tính hợp lệ của các trường trong form
    inputs.forEach(function (input) {
        if (!input.checkValidity()) {
            input.classList.add('is-invalid');
            isValid = false;
        } else {
            input.classList.remove('is-invalid');
            input.classList.add('is-valid');
        }
    });

    // Kiểm tra riêng thẻ ngân hàng nếu nó đang được hiển thị
    if (cardInfoSection.style.display !== 'none') {
        const cardInputs = cardInfoSection.querySelectorAll('input');
        cardInputs.forEach(function (input) {
            if (!input.checkValidity()) {
                input.classList.add('is-invalid');
                isValid = false;
            } else {
                input.classList.remove('is-invalid');
                input.classList.add('is-valid');
            }
        });
    }

    // Nếu tất cả các trường hợp lệ, tiến hành thanh toán
    if (isValid) {
        // Xóa dữ liệu trong localStorage
        localStorage.clear();

        // Hiển thị thông báo thanh toán thành công
        alert('Thanh toán thành công!');

        // Chuyển hướng về trang homepage.html
        window.location.href = 'homepage.html';
    } else {
        // Nếu có trường không hợp lệ
        alert('Vui lòng kiểm tra lại thông tin của bạn.');
    }
});
