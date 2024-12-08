const price = 21450;


const VND = new Intl.NumberFormat('vi-VN', {
  style: 'currency',
  currency: 'VND',
});

console.log('Việt Nam đồng: ' + VND.format(price)); // Việt Nam đồng: 21.450 ₫