document.addEventListener("DOMContentLoaded", function () {
    const user = JSON.parse(localStorage.getItem('user'));
    
    if (!user) {
        alert("Vui lòng đăng nhập để xem lịch sử đặt chỗ.");
        window.location.href = "login.html";
        return;
    }

    const bookingList = document.getElementById("booking-list");

    function formatCurrency(number) {
        return Number(number).toLocaleString("vi-VN") + "đ";
    }

    function getStatusBadge(status) {
        switch(status) {
            case 'confirmed':
                return '<span class="badge bg-success">Đã duyệt</span>';
            case 'cancelled':
                return '<span class="badge bg-danger">Đã hủy</span>';
            case 'pending':
            default:
                return '<span class="badge bg-warning text-dark">Chờ duyệt</span>';
        }
    }

    fetch(`http://127.0.0.1:5000/api/client/booking/my-bookings/${user.id}`)
        .then(res => res.json())
        .then(res => {
            if (res.status === 'success') {
                const data = res.data;
                if (data.length === 0) {
                    bookingList.innerHTML = `<tr><td colspan="6" class="text-center text-muted py-4">Bạn chưa có đơn đặt chỗ nào.</td></tr>`;
                    return;
                }

                let html = '';
                data.forEach(item => {
                    const itemName = item.type === 'tour' ? item.ten_tour : item.ten_nha_hang;
                    const itemType = item.type === 'tour' ? 'Tour' : 'Nhà hàng';
                    
                    html += `
                        <tr>
                            <td><strong>#${item.id}</strong></td>
                            <td>
                                <div class="d-flex align-items-center">
                                    <div class="bg-light p-2 rounded-3 me-3 text-center" style="width:50px;">
                                        <i class="${item.type === 'tour' ? 'fa-solid fa-plane-departure text-primary' : 'fa-solid fa-utensils text-danger'} fs-4"></i>
                                    </div>
                                    <div>
                                        <p class="mb-0 fw-bold">${itemName || 'Dịch vụ'}</p>
                                        <small class="text-muted">${itemType}</small>
                                    </div>
                                </div>
                            </td>
                            <td>${new Date(item.ngay_dat_di).toLocaleDateString('vi-VN')}</td>
                            <td>${item.so_luong_khach}</td>
                            <td class="fw-bold text-danger">${formatCurrency(item.tong_tien)}</td>
                            <td>${getStatusBadge(item.trang_thai)}</td>
                        </tr>
                    `;
                });
                bookingList.innerHTML = html;
            } else {
                bookingList.innerHTML = `<tr><td colspan="6" class="text-center text-danger py-4">Lỗi: ${res.message}</td></tr>`;
            }
        })
        .catch(err => {
            bookingList.innerHTML = `<tr><td colspan="6" class="text-center text-danger py-4">Lỗi kết nối server</td></tr>`;
        });
});
