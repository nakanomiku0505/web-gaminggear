// Xử lý sự kiện đăng nhập
document.getElementById('login-form').addEventListener('submit', function (event) {
    event.preventDefault(); // Ngừng gửi form theo mặc định

    var email = document.getElementById('email').value;
    var password = document.getElementById('password').value;

    // Kiểm tra thông tin đăng nhập
    if (email === 'admin@admin.mikaa' && password === 'admin') {
        // Nếu tài khoản và mật khẩu đúng, chuyển hướng
        window.location.href = 'admin/admin.html'; // Trang dành cho admin
    } else {
        alert('Thông tin đăng nhập không đúng!');
    }
});