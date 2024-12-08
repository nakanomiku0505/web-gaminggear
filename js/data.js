document.addEventListener("DOMContentLoaded", () => {
    // Lấy giỏ hàng từ localStorage và cập nhật số lượng hiển thị
    function updateCartCount() {
        let cart = JSON.parse(localStorage.getItem('cart')) || [];
        const cartCount = cart.reduce((total, product) => total + product.quantity, 0); // Tính tổng số lượng sản phẩm
        const cartBadge = document.querySelector('.badge'); // Lấy phần tử badge
        cartBadge.textContent = cartCount; // Cập nhật số lượng giỏ hàng
    }

    fetch('../json/data.json') // Đường dẫn tới tệp JSON
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(data => {
            const yachtList = document.getElementById("yacht-list");
            const pagination = document.getElementById("pagination");
            const itemsPerPage = 9; // Số sản phẩm mỗi trang
            let currentPage = 1; // Trang hiện tại

            // Hàm hiển thị sản phẩm
            function displayProducts(page) {
                yachtList.innerHTML = ""; // Xóa các sản phẩm hiện tại
                const startIndex = (page - 1) * itemsPerPage;
                const endIndex = Math.min(startIndex + itemsPerPage, data.length);

                for (let i = startIndex; i < endIndex; i++) {
                    const yacht = data[i];
                    yachtList.innerHTML += `
                        <div class="col-lg-4 col-md-3 mt-3">
                            <div class="card">
                                <div class="discount">${yacht.discount}</div>
                                <a href="detail.html?id=${yacht.id}"><img src="${yacht.img}" class="card-img-top"></a>
                                <div class="card-body">
                                    <div class="d-flex justify-content-between align-items-center mb-1">
                                        <p class="mb-0">Mã: ${yacht.sku}</p>
                                        <p class="status text-success mb-0 me-3">${yacht.status}</p>
                                    </div>
                                    <a href="detail.html?id=${yacht.id}" class="text-decoration-none text-dark"><h5 class="card-title">${yacht.name}</h5></a>
                                    <p class="old-price text-decoration-line-through">${yacht.old_price}</p>
                                    <p class="price text-danger fw-bold">${yacht.price}</p>
                                    <div class="icon-container mt-auto">
                                        <button class="btnl btn" id="cart-${yacht.id}" data-id="${yacht.id}" data-name="${yacht.name}" data-price="${yacht.price}" data-img="${yacht.img}" data-type="${yacht.type}">
                                            <i class='bx bxs-cart'></i>
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>`;
                }

                // Thêm sự kiện click cho các nút "Thêm vào giỏ hàng"
                document.querySelectorAll('.btnl').forEach(button => {
                    button.addEventListener('click', function () {
                        const productId = this.getAttribute('data-id');
                        const productName = this.getAttribute('data-name');
                        const productPrice = this.getAttribute('data-price');
                        const productImg = this.getAttribute('data-img');
                        const productType = this.getAttribute('data-type');
                        // Lấy giỏ hàng từ localStorage, nếu không có thì khởi tạo giỏ hàng là một mảng rỗng
                        let cart = JSON.parse(localStorage.getItem('cart')) || [];

                        // Kiểm tra xem sản phẩm đã có trong giỏ hàng chưa
                        const existingProductIndex = cart.findIndex(item => item.id === productId);

                        if (existingProductIndex !== -1) {
                            // Nếu có, tăng số lượng sản phẩm
                            cart[existingProductIndex].quantity++;
                        } else {
                            // Nếu chưa có, thêm sản phẩm mới vào giỏ
                            cart.push({
                                id: productId,
                                name: productName,
                                price: productPrice,
                                img: productImg,
                                type: productType, // Loại sản phẩm
                                quantity: 1
                            });
                        }

                        // Lưu lại giỏ hàng vào localStorage
                        localStorage.setItem('cart', JSON.stringify(cart));

                        // Cập nhật lại số lượng giỏ hàng
                        updateCartCount();
                    });
                });
            }

            // Hàm hiển thị phân trang với các nút Previous và Next
            function setupPagination() {
                pagination.innerHTML = ""; // Xóa nội dung phân trang cũ
                const totalPages = Math.ceil(data.length / itemsPerPage);

                // Nút "Previous"
                const prevButton = document.createElement("button");
                prevButton.innerHTML = "<i class='bx bx-chevrons-left' ></i>";
                prevButton.classList.add("btn", "btn-secondary", "mx-1");
                prevButton.disabled = currentPage === 1;
                prevButton.addEventListener("click", () => {
                    if (currentPage > 1) {
                        currentPage--;
                        displayProducts(currentPage);
                        setupPagination();
                        document.querySelector('.product-container').scrollIntoView({ behavior: 'smooth', block: 'start' }); // Cuộn đến phần tử với class
                    }
                });
                pagination.appendChild(prevButton);

                // Nút các trang (Thu gọn số trang)
                const pageRange = 1; // Số trang hiển thị gần với trang hiện tại (ví dụ: 2 trang trước và 2 trang sau)
                const startPage = Math.max(1, currentPage - pageRange);
                const endPage = Math.min(totalPages, currentPage + pageRange);

                // Hiển thị các nút trang, với dấu ba chấm nếu cần thiết
                if (startPage > 1) {
                    const firstPageButton = document.createElement("button");
                    firstPageButton.textContent = "1";
                    firstPageButton.classList.add("page-btn", "btn", "btn-secondary", "mx-1");
                    firstPageButton.addEventListener("click", () => {
                        currentPage = 1;
                        displayProducts(currentPage);
                        setupPagination();
                        document.querySelector('.product-container').scrollIntoView({ behavior: 'smooth', block: 'start' });
                    });
                    pagination.appendChild(firstPageButton);

                    if (startPage > 2) {
                        const ellipsisButton = document.createElement("button");
                        ellipsisButton.textContent = "...";
                        ellipsisButton.classList.add("page-btn", "btn", "btn-secondary", "mx-1", "ellipsis");
                        pagination.appendChild(ellipsisButton);
                    }
                }

                // Hiển thị các trang
                for (let i = startPage; i <= endPage; i++) {
                    const pageButton = document.createElement("button");
                    pageButton.textContent = i;
                    pageButton.classList.add("page-btn", "btn", "btn-secondary", "mx-1");
                    if (i === currentPage) {
                        pageButton.classList.add("active");
                    }
                    pageButton.addEventListener("click", () => {
                        currentPage = i;
                        displayProducts(currentPage);
                        setupPagination();
                        document.querySelector('.product-container').scrollIntoView({ behavior: 'smooth', block: 'start' });
                    });
                    pagination.appendChild(pageButton);
                }

                // Nếu trang cuối cùng không phải là trang cuối, hiển thị dấu ba chấm và nút trang cuối
                if (endPage < totalPages) {
                    if (endPage < totalPages - 1) {
                        const ellipsisButton = document.createElement("button");
                        ellipsisButton.textContent = "...";
                        ellipsisButton.classList.add("page-btn", "btn", "btn-secondary", "mx-1", "ellipsis");
                        pagination.appendChild(ellipsisButton);
                    }

                    const lastPageButton = document.createElement("button");
                    lastPageButton.textContent = totalPages;
                    lastPageButton.classList.add("page-btn", "btn", "btn-secondary", "mx-1");
                    lastPageButton.addEventListener("click", () => {
                        currentPage = totalPages;
                        displayProducts(currentPage);
                        setupPagination();
                        document.querySelector('.product-container').scrollIntoView({ behavior: 'smooth', block: 'start' });
                    });
                    pagination.appendChild(lastPageButton);
                }

                // Nút "Next"
                const nextButton = document.createElement("button");
                nextButton.innerHTML = "<i class='bx bx-chevrons-right' ></i>";
                nextButton.classList.add("btn", "btn-secondary", "mx-1");
                nextButton.disabled = currentPage === totalPages;
                nextButton.addEventListener("click", () => {
                    if (currentPage < totalPages) {
                        currentPage++;
                        displayProducts(currentPage);
                        setupPagination();
                        document.querySelector('.product-container').scrollIntoView({ behavior: 'smooth', block: 'start' });
                    }
                });
                pagination.appendChild(nextButton);
            }

            // Khởi tạo hiển thị trang đầu tiên và phân trang
            displayProducts(currentPage);
            setupPagination();

            // Cập nhật số lượng giỏ hàng khi tải trang
            updateCartCount();
        })
        .catch(error => console.error('Error loading data:', error));
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

    // Gắn sự kiện click cho tất cả các nút "Thêm vào giỏ hàng" (event delegation)
    document.addEventListener('click', function (event) {
        if (event.target.closest('.btnl')) {
            showToast('Sản phẩm đã được thêm vào giỏ hàng!');
        }
    });
});
