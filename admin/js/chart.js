// Dữ liệu mẫu cho doanh thu theo từng tháng
const data = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'], // Tháng
    datasets: [{
        label: 'Doanh thu ($)',
        data: [12000, 15000, 18000, 22000, 25000, 30000, 28000, 35000, 33000, 38000, 40000, 45000], // Doanh thu của từng tháng
        borderColor: '#007bff', // Màu đường viền
        backgroundColor: 'rgba(0, 123, 255, 0.1)', // Màu nền biểu đồ (nửa trong suốt)
        fill: true, // Lấp đầy biểu đồ
        tension: 0.4, // Độ cong của đường vẽ
        borderWidth: 2
    }]
};

// Cấu hình biểu đồ
const config = {
    type: 'line', // Loại biểu đồ là line chart
    data: data,
    options: {
        responsive: true, // Đảm bảo biểu đồ có thể co giãn
        plugins: {
            legend: {
                position: 'top', // Vị trí legend
            },
            tooltip: {
                mode: 'index',
                intersect: false,
            },
        },
        interaction: {
            mode: 'nearest',
            axis: 'x',
            intersect: false
        },
        scales: {
            x: {
                title: {
                    display: true,
                    text: 'Tháng'
                }
            },
            y: {
                title: {
                    display: true,
                    text: 'Doanh thu ($)'
                },
                beginAtZero: true
            }
        }
    }
};

// Khởi tạo biểu đồ
window.onload = function () {
    const ctx = document.getElementById('revenueChart').getContext('2d');
    new Chart(ctx, config);
};