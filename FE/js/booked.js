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

    let myBookings = [];

    function getStatusBadge(status) {
        switch (status) {
            case 'confirmed':
                return '<span class="badge bg-success">Đã duyệt</span>';
            case 'cancelled':
                return '<span class="badge bg-danger">Đã hủy</span>';
            case 'refund_requested':
                return '<span class="badge bg-info text-dark">Đang hoàn tiền</span>';
            case 'refunded':
                return '<span class="badge bg-warning text-dark">Đã hoàn tiền</span>';
            case 'rejected':
                return '<span class="badge bg-danger">Từ chối hoàn</span>';
            case 'pending':
            default:
                return '<span class="badge bg-warning text-dark">Chờ duyệt</span>';
        }
    }

    function getActionButtons(item) {
        if (item.trang_thai === 'pending') {
            return `<button class="btn btn-sm btn-outline-danger" onclick="cancelBooking(${item.id})">Hủy đơn</button>`;
        } else if (item.trang_thai === 'confirmed') {
            return `<button class="btn btn-sm btn-outline-primary" onclick="requestRefund(${item.id})">Hoàn tiền</button>`;
        } else if (item.trang_thai === 'refunded' || item.trang_thai === 'rejected') {
            return `<button class="btn btn-sm btn-info text-white" onclick="viewRefundDetails(${item.id})">Xem chi tiết</button>`;
        }
        return '';
    }

    window.cancelBooking = function (id) {
        if (!confirm("Bạn có chắc muốn hủy đơn hàng này không?")) return;
        fetch(`http://127.0.0.1:5000/api/client/booking/${id}/cancel`, { method: 'PUT' })
            .then(res => res.json())
            .then(res => {
                if (res.status === 'success') location.reload();
                else alert(res.message);
            });
    };

    window.requestRefund = function (id) {
        document.getElementById('refund-booking-id').value = id;
        document.getElementById('refundForm').reset();
        const refundModal = new bootstrap.Modal(document.getElementById('refundModal'));
        refundModal.show();
    };

    window.viewRefundDetails = function (id) {
        const item = myBookings.find(b => b.id === id);
        if(!item) return;

        let info = {};
        try {
            info = JSON.parse(item.hoan_tien_info || '{}');
        } catch(e) {}

        const contentDiv = document.getElementById('refund-detail-content');
        if (item.trang_thai === 'rejected') {
            contentDiv.innerHTML = `
                <div class="alert alert-danger">
                    <strong>Lý do từ chối:</strong><br/>
                    ${info.ly_do_tu_choi || 'Không có lý do'}
                </div>
            `;
        } else if (item.trang_thai === 'refunded') {
            contentDiv.innerHTML = `
                <div class="alert alert-success">
                    <strong>Ghi chú từ Admin:</strong><br/>
                    ${info.ghi_chu || 'Không có ghi chú'}
                </div>
                ${info.minh_chung_hoan_tien ? `
                    <div class="mt-3 text-center">
                        <p class="fw-bold mb-1">Minh chứng hoàn tiền:</p>
                        <img src="${info.minh_chung_hoan_tien}" alt="Minh chứng" class="img-fluid rounded" style="max-height: 300px;"/>
                    </div>
                ` : ''}
            `;
        }

        const detailModal = new bootstrap.Modal(document.getElementById('refundDetailModal'));
        detailModal.show();
    };

    document.getElementById('refundForm').addEventListener('submit', function (e) {
        e.preventDefault();
        const id = document.getElementById('refund-booking-id').value;
        const bank = document.getElementById('refund-bank').value;
        const stk = document.getElementById('refund-stk').value;
        const cccd = document.getElementById('refund-cccd').value;
        const password = document.getElementById('refund-password').value;

        fetch(`http://127.0.0.1:5000/api/client/booking/${id}/refund`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ ten_nh: bank, stk, cccd, password })
        })
            .then(res => res.json())
            .then(res => {
                if (res.status === 'success') {
                    alert("Yêu cầu hoàn tiền đã được gửi!");
                    location.reload();
                } else {
                    alert(res.message); // Hiển thị lỗi sai mật khẩu
                }
            });
    });

    fetch(`http://127.0.0.1:5000/api/client/booking/my-bookings/${user.id}`)
        .then(res => res.json())
        .then(res => {
            if (res.status === 'success') {
                myBookings = res.data;
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
                            <td class="fw-bold">${formatCurrency(item.tong_tien)}</td>
                            <td class="text-success fw-bold">${formatCurrency(item.so_tien_da_tra || 0)}</td>
                            <td class="text-danger fw-bold">${formatCurrency(item.tong_tien - (item.so_tien_da_tra || 0))}</td>
                            <td>${getStatusBadge(item.trang_thai)}</td>
                            <td>${getActionButtons(item)}</td>
                        </tr>
                    `;
                });
                bookingList.innerHTML = html;
            } else {
                bookingList.innerHTML = `<tr><td colspan="7" class="text-center text-danger py-4">Lỗi: ${res.message}</td></tr>`;
            }
        })
        .catch(err => {
            bookingList.innerHTML = `<tr><td colspan="7" class="text-center text-danger py-4">Lỗi kết nối server</td></tr>`;
        });
});
