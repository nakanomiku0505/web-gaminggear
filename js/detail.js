document.addEventListener("DOMContentLoaded", () => {
    const productId = new URLSearchParams(window.location.search).get("id");
    if (!productId) {
        displayError("Không tìm thấy thông tin du thuyền.");
        return;
    }
    loadProductDetails(productId);
});

function loadProductDetails(productId, callback) {
    fetch('json/data.json')
        .then(response => response.json())
        .then(data => {
            const product = data.find(y => y.id == productId);
            if (product) {
                displayProductDetails(product);
                if (callback) callback(data, product); // Gọi callback sau khi xử lý xong sản phẩm hiện tại
            } else {
                displayError("Không tìm thấy thông tin.");
            }
        })
        .catch(error => console.error('Error loading data:', error));
}


function displayProductDetails(product) {
    const productName = document.getElementById("productName");
    productName.innerHTML = `${product.name}`;
    const productDetails = document.getElementById("product-details");
    productDetails.innerHTML = `
        <div class="row bg-white">
            <div class="col-md-4 pd-box-left">
                <div class="big-img-holder mb-3">
                    <img id="mainProductImage" src="${product.img}" alt="Ảnh sản phẩm" class="img-fluid rounded">
                </div>

                <!-- Carousel images -->
                <div id="smallImageCarousel" class="carousel">
                    <div class="d-flex justify-content-between">
                        <img src="${product.img}" alt="Ảnh nhỏ 1" class="img-thumbnail small-img active" onclick="changeMainImage(this)">
                        <img src="${product.anh2}" alt="Ảnh nhỏ 2" class="img-thumbnail small-img" onclick="changeMainImage(this)">
                        <img src="${product.anh3}" alt="Ảnh nhỏ 3" class="img-thumbnail small-img" onclick="changeMainImage(this)">
                        <img src="${product.anh4}" alt="Ảnh nhỏ 4" class="img-thumbnail small-img" onclick="changeMainImage(this)">
                        <img src="${product.anh5}" alt="Ảnh nhỏ 5" class="img-thumbnail small-img" onclick="changeMainImage(this)">
                    </div>
                </div>

                <!-- Navigation buttons -->
                <div class="button-change-img">
                    <button class="btn btn-outline-secondary" id="prevBtn" onclick="moveCarousel(-1)" aria-label="Đi tới ảnh trước" title="Đi tới ảnh trước">
                        <i class="bi bi-chevron-left"></i>
                    </button>

                    <button class="btn btn-outline-secondary" id="nextBtn" onclick="moveCarousel(1)" aria-label="Đi tới ảnh tiếp theo" title="Đi tới ảnh tiếp theo">
                        <i class="bi bi-chevron-right"></i>
                    </button>
                </div>
            </div>

            <div class="col-md-5 pd-box-center">
                <h1 class="product-title">${product.name}</h1>
                <div class="product-brand-group d-flex">
                    <p class="product-sku me-auto text-success fw-bold">Mã sản phẩm: ${product.sku}</p>
                    <p class="product-brand text-danger fw-bold">Thương hiệu: ${product.brand}</p>
                </div>
                <div class="line"></div>
                <div class="product-description mt-2">
                    <h5 class="fw-bold">Mô tả sản phẩm:</h5>
                    <div class="p-detail mx-4">
                        <ul>
                            ${product.features.map(feature => `<li><i class="bx bx-party me-1"></i> ${feature}</li>`).join('')}
                        </ul>
                    </div>
                </div>
                <div class="line"></div>
                <div class="price-product mt-2">
                    <table>
                        <tbody>
                            <tr>
                                <td>Giá gốc:</td>
                                <td><del class="pd-old-price ms-3 text-warning">${product.old_price}</del></td>
                            </tr>
                            <tr>
                                <td>Giá khuyến mại:</td>
                                <td><span class="pd-new-price ms-3">${product.price}</span>
                                <span class="pd-discount">(Tiết kiệm: ${product.discount})</span>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
                
                <div class="btn-group container mt-3 my-4 d-flex">
                    <div class="btn-card">
                        <button class="btn btn-primary me-2" id="cart-${product.id}" data-id="${product.id}" data-name="${product.name}" data-price="${product.price}" data-img="${product.img}" data-type="${product.type}"><i class='bx bx-cart-add me-1'></i>Thêm vào giỏ hàng</button>
                    </div>
                    
                </div>
            </div>
            <!-- Phần bên phải: Thông tin liên hệ và chính sách -->
            <div class="col-md-3 pd-box-right">
                <div class="container">
                    <div class="custom-card">
                        <div class="custom-card-header">
                            CHÍNH SÁCH MUA HÀNG
                        </div>
                        <div class="custom-card-body">
                            <ul class="list-group">
                                <li class="list-group-item">
                                    <i class='bx bx-credit-card'></i> Thanh toán thuận tiện
                                </li>
                                <li class="list-group-item">
                                    <i class="bx bx-shield-alt"></i> Sản phẩm 100% chính hãng
                                </li>
                                <li class="list-group-item">
                                    <i class='bx bxs-package' ></i> Bảo hành nhanh chóng
                                </li>
                                <li class="list-group-item">
                                    <i class='bx bxs-truck' ></i> Giao hàng toàn quốc
                                </li>
                            </ul>
                        </div>
                    </div>
                    <div class="custom-card">
                        <div class="custom-card-header">
                            HOTLINE HỖ TRỢ
                        </div>
                        <div class="custom-card-body">
                            <ul class="list-group">
                                <li class="list-group-item">
                                    <i class='bx bx-phone-call' ></i> Hotline CSKH: 0896.721.244
                                </li>
                                <li class="list-group-item">
                                    <i class='bx bx-phone-call' ></i> Tư vấn mua hàng: 0896.721.244
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        
        `;

    // Initialize carousel after product details are displayed
    initCarousel();
}

function changeMainImage(smallImg) {
    const mainImage = document.getElementById('mainProductImage');
    const newSrc = smallImg.src;

    // Check if the mainImage exists
    if (mainImage) {
        mainImage.classList.remove('visible');
        setTimeout(() => {
            mainImage.src = newSrc;
            mainImage.classList.add('visible');
        }, 500);
        updateActiveState(smallImg);
    }
}

function updateActiveState(activeImg) {
    const smallImages = document.querySelectorAll('.small-img');
    smallImages.forEach(img => {
        img.classList.remove('active');
    });
    activeImg.classList.add('active');
}

let currentIndex = 0;
let smallImages = [];

function moveCarousel(direction) {
    if (smallImages.length > 0) {
        currentIndex += direction;

        if (currentIndex < 0) currentIndex = smallImages.length - 1;
        if (currentIndex >= smallImages.length) currentIndex = 0;

        changeMainImage(smallImages[currentIndex]);

        // Disable/enable buttons based on the index
        document.getElementById('prevBtn').disabled = currentIndex === 0;
        document.getElementById('nextBtn').disabled = currentIndex === smallImages.length - 1;
    }
}

function initCarousel() {
    smallImages = document.querySelectorAll('.small-img'); // Re-fetch the small images after the DOM is loaded
    if (smallImages.length > 0) {
        changeMainImage(smallImages[currentIndex]);
        document.getElementById('prevBtn').disabled = true;
        document.getElementById('nextBtn').disabled = smallImages.length <= 1;
    }
}

window.onload = initCarousel;

document.addEventListener("DOMContentLoaded", () => {
    const productId = new URLSearchParams(window.location.search).get("id");
    if (!productId) {
        displayError("Không tìm thấy thông tin sản phẩm.");
        return;
    }
    loadProductDetails(productId, (data, currentProduct) => {
        // Lọc và hiển thị sản phẩm liên quan
        loadRelatedProducts(data, currentProduct);
    });
});

function loadRelatedProducts(data, currentProduct) {
    const relatedProductsContainer = document.getElementById("product-related-list");

    // Lọc các sản phẩm cùng loại nhưng khác ID sản phẩm hiện tại
    const relatedProducts = data.filter(product => product.type === currentProduct.type && product.id !== currentProduct.id);

    // Nếu không có sản phẩm liên quan, hiển thị thông báo
    if (relatedProducts.length === 0) {
        relatedProductsContainer.innerHTML = `<h3 class="text-center mt-5">Không có sản phẩm liên quan nào.</h3>`;
        return;
    }

    // Lấy ngẫu nhiên tối đa 5 sản phẩm
    const randomProducts = getRandomItems(relatedProducts, 4);

    // Tạo HTML cho sản phẩm liên quan
    const productCards = randomProducts.map(product => `
        <div class="col-lg-3 col-md-6">
            <div class="p-related-card card">
                <div class="discount">${product.discount}</div>
                <a href="detail.html?id=${product.id}">
                    <img src="${product.img}" class="card-img-top" height="300" width="200" alt="${product.name}">
                </a>
                <div class="card-body">
                    <div class="d-flex justify-content-between align-items-center mb-1">
                        <p class="mb-0">Mã: ${product.sku}</p>
                        <p class="status text-success mb-0 me-4">${product.status}</p>
                    </div>
                    <div class="p-name">
                        <a href="detail.html?id=${product.id}" class="text-decoration-none text-dark">
                            <h5 class="card-title">${product.name}</h5>
                        </a>
                    </div>
                    <p class="old-price text-decoration-line-through">${product.old_price}</p>
                    <p class="price text-danger fw-bold">${product.price}</p>
                </div>
            </div>
        </div>
    `).join('');

    // Chèn sản phẩm vào container
    relatedProductsContainer.innerHTML = productCards;
}

// Hàm để lấy ngẫu nhiên N phần tử từ mảng
function getRandomItems(arr, numItems) {
    const shuffled = [...arr].sort(() => Math.random() - 0.5); // Trộn ngẫu nhiên mảng
    return shuffled.slice(0, numItems); // Lấy N phần tử đầu tiên
}

document.addEventListener("DOMContentLoaded", () => {
    // Cập nhật số lượng giỏ hàng hiển thị trên badge
    function updateCartCount() {
        let cart = JSON.parse(localStorage.getItem('cart')) || [];
        const cartCount = cart.reduce((total, product) => total + product.quantity, 0);
        const cartBadge = document.querySelector('.badge');
        cartBadge.textContent = cartCount;
    }

    // Thêm sản phẩm vào giỏ hàng
    function addToCart(productId, productName, productPrice, productImg, productType) {
        // Lấy giỏ hàng từ localStorage hoặc khởi tạo mảng rỗng
        let cart = JSON.parse(localStorage.getItem('cart')) || [];

        // Tìm sản phẩm trong giỏ hàng
        const existingProductIndex = cart.findIndex(item => item.id === productId);

        if (existingProductIndex !== -1) {
            // Nếu đã có, tăng số lượng
            cart[existingProductIndex].quantity++;
        } else {
            // Nếu chưa có, thêm sản phẩm mới
            cart.push({
                id: productId,
                name: productName,
                price: productPrice,
                img: productImg,
                type: productType, // Loại sản phẩm
                quantity: 1
            });
        }

        // Cập nhật giỏ hàng vào localStorage
        localStorage.setItem('cart', JSON.stringify(cart));

        // Cập nhật số lượng giỏ hàng hiển thị
        updateCartCount();

        // Hiển thị thông báo thêm vào giỏ hàng
        showToast('Sản phẩm đã được thêm vào giỏ hàng!');
    }

    // Hiển thị thông báo dạng Toast
    function showToast(message) {
        const toastContainer = document.getElementById('toast-container');
        const toast = document.createElement('div');
        toast.classList.add('toast', 'show');
        toast.innerHTML = `
            <div class="toast-body">
                ${message}
            </div>
        `;
        toastContainer.appendChild(toast);

        // Tự động ẩn toast sau 3 giây
        setTimeout(() => {
            toast.classList.remove('show');
            toast.classList.add('hide');
            setTimeout(() => toastContainer.removeChild(toast), 300); // Xóa toast sau khi ẩn
        }, 3000);
    }

    // Gắn sự kiện cho nút "Thêm vào giỏ hàng" (event delegation)
    document.addEventListener('click', function (event) {
        const button = event.target.closest('.btn-card .btn');
        if (button) {
            const productId = button.getAttribute('data-id');
            const productName = button.getAttribute('data-name');
            const productPrice = button.getAttribute('data-price');
            const productImg = button.getAttribute('data-img');
            const productType = button.getAttribute('data-type');
            // Gọi hàm thêm sản phẩm vào giỏ hàng
            addToCart(productId, productName, productPrice, productImg, productType);
        }
    });

    // Cập nhật số lượng giỏ hàng khi tải trang
    updateCartCount();
});