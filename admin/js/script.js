$(document).ready(function () {
  // Sự kiện cho nút toggle sidebar
  $(".toggle-btn").on("click", function () {
    $("#sidebar").toggleClass("expand");
  });

  let filteredData = []; // Lưu trữ dữ liệu đã xử lý

  // Đọc dữ liệu từ file JSON
  $.getJSON('../json/data.json', function (data) {
    // Lọc dữ liệu loại bỏ các trường ảnh
    filteredData = data.map(item => {
      const { img, anh2, anh3, anh4, anh5, ...rest } = item;
      return rest;
    });

    // Hiển thị dữ liệu trong DataTable
    renderTable(filteredData);
  }).fail(function () {
    console.error("Lỗi khi tải dữ liệu JSON.");
  });

  function renderTable(data) {
    const storedData = data.map(item => [
      item.name || "Chưa có tên",
      item.brand || "Không rõ",
      item.features || "Không có mô tả", // Hiển thị cột mô tả sản phẩm
      item.status || "Chưa xác định",
      item.type || "Không rõ",
      item.old_price || 0,
      item.price || 0,
      item.discount || 0,
      `
        <div class="action-buttons">
          <button class="btn btn-primary btn-sm add-btn" title="Thêm mới">
            <i class="lni lni-plus"></i>
          </button>
          <button class="btn btn-warning btn-sm edit-btn" data-id="${item.id}" title="Sửa">
            <i class="lni lni-pencil"></i>
          </button>
          <button class="btn btn-danger btn-sm delete-btn" data-id="${item.id}" title="Xóa">
            <i class="lni lni-trash-can"></i>
          </button>
        </div>
      `
    ]);

    if ($.fn.DataTable.isDataTable("#example")) {
      $("#example").DataTable().clear().destroy();
    }

    $("#example").DataTable({
      data: storedData,
      columns: [
        { title: "Tên" },
        { title: "Thương hiệu" },
        { title: "Mô tả" }, // Cột mô tả sản phẩm
        { title: "Trạng thái" },
        { title: "Loại" },
        { title: "Giá cũ" },
        { title: "Giá mới" },
        { title: "Giảm giá" },
        { title: "Hành động" }
      ],
      responsive: true,
      language: {
        search: "Tìm kiếm:",
        lengthMenu: "Hiển thị _MENU_ dòng",
        info: "Hiển thị _START_ đến _END_ của _TOTAL_ dòng",
        paginate: {
          first: "Đầu",
          last: "Cuối",
          next: "Tiếp",
          previous: "Trước"
        }
      }
    });
  }


  // Hàm tự động tạo ID mới
  function generateNewId() {
    const maxId = Math.max(...filteredData.map(item => item.id || 0));
    return maxId + 1;
  }

  // Sự kiện cho nút Thêm
  $(document).on('click', '.add-btn', function () {
    $('#productForm')[0].reset();
    $('#productModalLabel').text('Thêm sản phẩm');
    $('#productModal').modal('show');

    $('#productModal .btn-primary').off('click').on('click', function () {
      // Lấy giá trị từ form
      const name = $('#productName').val().trim();
      const brand = $('#productBrand').val().trim();
      const price = $('#productPrice').val().trim();
      const type = $('#productType').val().trim();
      const status = $('#productStatus').val().trim();
      const features = $('#productFeatures').val().trim();

      // Kiểm tra nếu có trường bị bỏ trống
      if (!name || !brand || !price || !type || !status || !features) {
        alert('Vui lòng điền đầy đủ thông tin sản phẩm!');
        return;
      }

      const newProduct = {
        id: generateNewId(),
        name,
        brand,
        price,
        old_price: $('#productOldPrice').val().trim(),
        discount: $('#productDiscount').val().trim(),
        type,
        status,
        features
      };

      filteredData.push(newProduct);
      renderTable(filteredData);
      $('#productModal').modal('hide');
    });
  });

  // Sự kiện cho nút Sửa
  $(document).on('click', '.edit-btn', function () {
    const productId = $(this).data('id');
    const product = filteredData.find(item => item.id === productId);

    if (product) {
      $('#productName').val(product.name);
      $('#productBrand').val(product.brand);
      $('#productPrice').val(product.price);
      $('#productOldPrice').val(product.old_price);
      $('#productDiscount').val(product.discount);
      $('#productType').val(product.type);
      $('#productStatus').val(product.status);
      $('#productFeatures').val(product.features);

      $('#productModalLabel').text('Sửa sản phẩm');
      $('#productModal').modal('show');

      $('#productModal .btn-primary').off('click').on('click', function () {
        // Lấy giá trị từ form
        const name = $('#productName').val().trim();
        const brand = $('#productBrand').val().trim();
        const price = $('#productPrice').val().trim();
        const type = $('#productType').val().trim();
        const status = $('#productStatus').val().trim();
        const features = $('#productFeatures').val().trim();

        // Kiểm tra nếu có trường bị bỏ trống
        if (!name || !brand || !price || !type || !status || !features) {
          alert('Vui lòng điền đầy đủ thông tin sản phẩm!');
          return;
        }

        product.name = name;
        product.brand = brand;
        product.price = price;
        product.old_price = $('#productOldPrice').val().trim();
        product.discount = $('#productDiscount').val().trim();
        product.type = type;
        product.status = status;
        product.features = features;

        renderTable(filteredData);
        $('#productModal').modal('hide');
      });
    }
  });

  // Sự kiện cho nút Xóa
  $(document).on('click', '.delete-btn', function () {
    const productId = $(this).data('id');
    $('#deleteModal').modal('show');

    $('#confirmDelete').off('click').on('click', function () {
      filteredData = filteredData.filter(item => item.id !== productId);
      renderTable(filteredData);
      $('#deleteModal').modal('hide');
    });
  });
});
