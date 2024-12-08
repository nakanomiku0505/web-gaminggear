// Lấy dữ liệu sản phẩm sale
fetch('json/data.json')
    .then(response => response.json())
    .then(data => {
        const carouselInner = document.querySelector('.sale-sp');
        const productsPerPage = 3; // Số sản phẩm mỗi trang
        let carouselContent = '';

        // Lọc các sản phẩm có special là "Sale"
        const saleProducts = data.filter(product => product.special === "Sale");

        // Chia sản phẩm thành các nhóm 3 sản phẩm
        for (let i = 0; i < saleProducts.length; i += productsPerPage) {
            const group = saleProducts.slice(i, i + productsPerPage);
            let rowContent = `<div class="row justify-content-between">`;

            group.forEach(product => {
                rowContent += `
          <div class="col-md-4">
            <div class="product-card">
              <div class="discount">${product.discount}</div>
              <a href="detail.html?id=${product.id}"><img alt="${product.name}" height="200" src="${product.img}" width="300" /></a>
              <div class="card-body">
                <div class="d-flex justify-content-between align-items-center">
                  <p class="mb-0">Mã: ${product.sku}</p>
                  <p class="status text-success mb-0 me-4">${product.status}</p>
                </div>
                <div class="name-product"><a href="detail.html?id=${product.id}" class="text-decoration-none text-dark"><h5>${product.name}</h5></a></div><div class="line"></div>
                <p class="old-price text-decoration-line-through">${product.old_price}</p>
                <p class="price text-danger fw-bold">${product.price}</p>
                <div class="icon-container mt-auto">
                  <button class="btnl btn" id="cart-${product.id}" data-id="${product.id}" data-name="${product.name}" data-price="${product.price}" data-img="${product.img}" data-type="${product.type}">
                    <i class='bx bxs-cart'></i>
                  </button>
                </div>
              </div>
            </div>
          </div>`;
            });

            rowContent += `</div>`; // Kết thúc row

            // Nếu là trang đầu tiên, thêm lớp `active`
            carouselContent += `
        <div class="carousel-item ${i === 0 ? 'active' : ''}">
          ${rowContent}
        </div>`;
        }

        // Thêm nội dung vào carousel-inner
        carouselInner.innerHTML = carouselContent;
    })
    .catch(error => console.error('Error loading data:', error));
// Lấy dữ liệu mousepad
fetch('json/data.json')
    .then(response => response.json())
    .then(data => {
        const productList = document.getElementById('mousepad-list');

        // Lọc sản phẩm có type là "Mousepad"
        const mousepadProducts = data.filter(product => product.type === "Mousepad");

        // Tạo HTML cho mỗi sản phẩm và chèn vào DOM
        mousepadProducts.forEach(product => {
            const productCard = `
                <div class="col-lg-3 col-md-6">
                    <div class="card">
                        <div class="discount">${product.discount}</div>
                        <a href="detail.html?id=${product.id}"><img src="${product.img}" class="card-img-top img-fluid" alt="${product.name}" height="300"></a>
                        <div class="card-body">
                            <div class="d-flex justify-content-between align-items-center mb-1">
                                <p class="mb-0">Mã: ${product.sku}</p>
                                <p class="status text-success mb-0 me-4">${product.status}</p>
                            </div>
                            <div class="p-name"><a href="detail.html?id=${product.id}" class="text-decoration-none text-dark"><h5 class="card-title">${product.name}</h5"></a></div>
                            <p class="old-price text-decoration-line-through">${product.old_price}</p>
                            <p class="price text-danger fw-bold">${product.price}</p>
                            <div class="icon-container mt-auto">
                                <button class="btnl btn" id="cart-${product.id}" data-id="${product.id}" data-name="${product.name}" data-price="${product.price}" data-img="${product.img}" data-type="${product.type}">
                                    <i class='bx bxs-cart'></i>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            `;
            productList.innerHTML += productCard; // Chèn sản phẩm vào danh sách
        });
    })
    .catch(error => console.error('Error loading data:', error));
// Lấy dữ liệu gaming gear
fetch('json/data.json')
    .then(response => response.json())
    .then(data => {
        const container = document.getElementById('gear-list');

        // Kết hợp tất cả sản phẩm từ ba loại
        const allProducts = [...data.filter(product => product.type === "Keyboard"),
        ...data.filter(product => product.type === "Mouse"),
        ...data.filter(product => product.type === "Monitor")];

        // Hàm để chọn ngẫu nhiên 4 sản phẩm từ tất cả sản phẩm
        const getRandomProducts = (products) => {
            const shuffled = products.sort(() => 0.5 - Math.random());
            return shuffled.slice(0, 4); // Lấy 4 sản phẩm ngẫu nhiên
        };

        // Lấy 4 sản phẩm ngẫu nhiên từ tất cả các loại
        const randomProducts = getRandomProducts(allProducts);

        // Hàm để tạo HTML cho một sản phẩm
        const createProductCard = (product) => {
            return `
                <div class="col-lg-3 col-md-6">
                    <div class="card">
                        <div class="discount">${product.discount}</div>
                        <a href="detail.html?id=${product.id}"><img src="${product.img}" class="card-img-top" height="300" width="200" alt="${product.name}"></a>
                        <div class="card-body">
                            <div class="d-flex justify-content-between align-items-center mb-1">
                                <p class="mb-0">Mã: ${product.sku}</p>
                                <p class="status text-success mb-0 me-4">${product.status}</p>
                            </div>
                            <div class="p-name"><a href="detail.html?id=${product.id}" class="text-decoration-none text-dark"><h5 class="card-title">${product.name}</h5></a></div>
                            <p class="old-price text-decoration-line-through">${product.old_price}</p>
                            <p class="price text-danger fw-bold">${product.price}</p>
                            <div class="icon-container mt-auto">
                                <button class="btnl btn" id="cart-${product.id}" data-id="${product.id}" data-name="${product.name}" data-price="${product.price}" data-img="${product.img}" data-type="${product.type}">
                                    <i class='bx bxs-cart'></i>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>`;
        };

        // Thêm các sản phẩm ngẫu nhiên vào HTML
        randomProducts.forEach(product => {
            container.innerHTML += createProductCard(product);
        });
    })
    .catch(error => console.error('Error loading data:', error));
// Lấy dữ liệu accessory
fetch('json/data.json')
    .then(response => response.json())
    .then(data => {
        const container = document.getElementById('acc-computer-list');

        // Kết hợp tất cả sản phẩm từ 6 loại
        const allProducts = [...data.filter(product => product.type === "Accessory"),
        ...data.filter(product => product.type === "Headset"),
        ...data.filter(product => product.type === "Gaming Chair"),
        ...data.filter(product => product.type === "Speaker"),
        ...data.filter(product => product.type === "Keycap"),
        ...data.filter(product => product.type === "Microphone")];

        // Hàm để chọn ngẫu nhiên 4 sản phẩm từ tất cả sản phẩm
        const getRandomProducts = (products) => {
            const shuffled = products.sort(() => 0.5 - Math.random());
            return shuffled.slice(0, 4); // Lấy 4 sản phẩm ngẫu nhiên
        };

        // Lấy 4 sản phẩm ngẫu nhiên từ tất cả các loại
        const randomProducts = getRandomProducts(allProducts);

        // Hàm để tạo HTML cho một sản phẩm
        const createProductCard = (product) => {
            return `
                <div class="col-lg-3 col-md-6">
                    <div class="card">
                        <div class="discount">${product.discount}</div>
                        <a href="detail.html?id=${product.id}"><img src="${product.img}" class="card-img-top" height="300" width="200" alt="${product.name}"></a>
                        <div class="card-body">
                            <div class="d-flex justify-content-between align-items-center mb-1">
                                <p class="mb-0">Mã: ${product.sku}</p>
                                <p class="status text-success mb-0 me-4">${product.status}</p>
                            </div>
                            <div class="p-name"><a href="detail.html?id=${product.id}" class="text-decoration-none text-dark"><h5 class="card-title">${product.name}</h5></a></div>
                            <p class="old-price text-decoration-line-through">${product.old_price}</p>
                            <p class="price text-danger fw-bold">${product.price}</p>
                            <div class="icon-container mt-auto">
                                <button class="btnl btn" id="cart-${product.id}" data-id="${product.id}" data-name="${product.name}" data-price="${product.price}" data-img="${product.img}" data-type="${product.type}">
                                    <i class='bx bxs-cart'></i>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>`;
        };

        // Thêm các sản phẩm ngẫu nhiên vào HTML
        randomProducts.forEach(product => {
            container.innerHTML += createProductCard(product);
        });
    })
document.addEventListener("DOMContentLoaded", () => {
    // Cập nhật số lượng giỏ hàng hiển thị trên badge
    function updateCartCount() {
        let cart = JSON.parse(localStorage.getItem('cart')) || [];
        const cartCount = cart.reduce((total, product) => total + product.quantity, 0);
        const cartBadge = document.querySelector('.badge');
        if (cartBadge) {
            cartBadge.textContent = cartCount;
        }
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
                price: productPrice, // Chuyển giá trị thành số
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
        const button = event.target.closest('.btnl');
        if (button) {
            const productId = button.getAttribute('data-id');
            const productName = button.getAttribute('data-name');
            const productPrice = button.getAttribute('data-price');
            const productImg = button.getAttribute('data-img');
            const productType = button.getAttribute('data-type'); // Lấy loại sản phẩm

            // Gọi hàm thêm sản phẩm vào giỏ hàng
            addToCart(productId, productName, productPrice, productImg, productType);
        }
    });

    // Cập nhật số lượng giỏ hàng khi tải trang
    updateCartCount();
});
