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
    return `${day}/${month}/${year}`;
}

/**
 * Định dạng tiền tệ theo định dạng 'vi-VN' cho React Native
 * @param {number} amount - Số tiền cần định dạng
 * @returns {string} - Chuỗi tiền tệ đã định dạng
 */
export function formatCurrency(amount) {
    if (typeof amount !== 'number') {
        throw new TypeError('Invalid amount');
    }
    return new Intl.NumberFormat('vi-VN', {
        style: 'currency',
        currency: 'VND',
        minimumFractionDigits: 0, // Đảm bảo không có số thập phân nếu số nguyên
        maximumFractionDigits: 2 // Hiển thị tối đa 2 chữ số thập phân
    }).format(amount);
}
