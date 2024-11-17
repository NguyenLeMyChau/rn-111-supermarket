/**
 * Định dạng ngày tháng theo định dạng 'dd/mm/yyyy' cho React Native
 * @param {Date|string} date - Đối tượng Date hoặc chuỗi ngày tháng cần định dạng
 * @returns {string} - Chuỗi ngày tháng đã định dạng
 */
export function formatDate(date) {
    const d = new Date(date);
    if (!(d instanceof Date) || isNaN(d)) {
        throw new TypeError('Invalid Date');
    }
    const day = String(d.getDate()).padStart(2, '0');
    const month = String(d.getMonth() + 1).padStart(2, '0'); // Tháng bắt đầu từ 0
    const year = d.getFullYear();
    const hours = d.getHours().toString().padStart(2, '0');
    const minutes = d.getMinutes().toString().padStart(2, '0');
    return `${day}/${month}/${year} ${hours}:${minutes}`;
}

/**
 * Định dạng tiền tệ theo định dạng 'vi-VN' cho React Native
 * @param {number|string} amount - Số tiền cần định dạng
 * @returns {string} - Chuỗi tiền tệ đã định dạng
 */
export function formatCurrency(amount) {
    const numberAmount = typeof amount === 'string' ? parseFloat(amount.replace(/,/g, '')) : amount;

    // Kiểm tra xem giá trị đã chuyển đổi có phải là số hợp lệ không
    if (isNaN(numberAmount)) {
        throw new TypeError('Invalid amount');
    }

    return new Intl.NumberFormat('vi-VN', {
        style: 'currency',
        currency: 'VND',
        minimumFractionDigits: 0, // Đảm bảo không có số thập phân nếu số nguyên
        maximumFractionDigits: 2 // Hiển thị tối đa 2 chữ số thập phân
    }).format(amount);
}
