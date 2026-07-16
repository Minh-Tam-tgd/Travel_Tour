document.addEventListener("DOMContentLoaded", () => {
    "use strict";
    
    const user = JSON.parse(localStorage.getItem('user'));
    if (!user) {
        alert("Bạn chưa đăng nhập!");
        window.location.href = "login.html";
        return;
    }

    const pendingBooking = JSON.parse(localStorage.getItem('pending_booking'));
    if (!pendingBooking) {
        alert("Không tìm thấy thông tin thanh toán!");
        window.location.href = "homepage.html";
        return;
    }

    function formatMoney(n) {
        return Number(n).toLocaleString('vi-VN') + "đ";
    }

    // Hiển thị thông tin
    document.getElementById("item-name").textContent = pendingBooking.item_name;
    document.getElementById("booking-date").textContent = new Date(pendingBooking.ngay_dat_di).toLocaleDateString('vi-VN');
    document.getElementById("guest-count").textContent = pendingBooking.so_luong_khach;
    document.getElementById("amount-to-pay").textContent = formatMoney(pendingBooking.amount_to_pay);

    // Xác nhận đã chuyển khoản -> Gọi API lưu vào DB
    document.getElementById("btn-confirm-paid").addEventListener("click", () => {
        const proofInput = document.getElementById("payment-proof");
        if (proofInput.files.length === 0) {
            alert("Vui lòng tải lên minh chứng thanh toán!");
            return;
        }

        const btn = document.getElementById("btn-confirm-paid");
        btn.disabled = true;
        btn.innerHTML = '<i class="fa-solid fa-spinner fa-spin me-2"></i> Đang xử lý...';

        const file = proofInput.files[0];
        const reader = new FileReader();
        
        reader.onload = function(e) {
            const base64Image = e.target.result;
            
            fetch('http://127.0.0.1:5000/api/client/booking', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    user_id: pendingBooking.user_id,
                    tour_id: pendingBooking.tour_id,
                    restaurant_id: pendingBooking.restaurant_id,
                    type: pendingBooking.type,
                    ngay_dat_di: pendingBooking.ngay_dat_di,
                    so_luong_khach: pendingBooking.so_luong_khach,
                    tong_tien: pendingBooking.tong_tien, // Backend cần tổng tiền gốc
                    so_tien_da_tra: pendingBooking.amount_to_pay, // Gửi số tiền thực tế đã cọc/thanh toán
                    minh_chung_thanh_toan: base64Image
                })
            })
            .then(res => res.json())
            .then(data => {
                if (data.status === 'success') {
                    localStorage.removeItem('pending_booking');
                    alert("Cảm ơn bạn! Đơn hàng đã được xác nhận và chờ Admin duyệt.");
                    window.location.href = "booked.html";
                } else {
                    alert(data.message || "Lỗi khi xử lý đặt chỗ");
                    btn.disabled = false;
                    btn.innerHTML = '<i class="fa-solid fa-check-circle me-2"></i> Tôi đã chuyển khoản';
                }
            })
            .catch(err => {
                console.error(err);
                alert("Lỗi kết nối server");
                btn.disabled = false;
                btn.innerHTML = '<i class="fa-solid fa-check-circle me-2"></i> Tôi đã chuyển khoản';
            });
        };
        
        reader.onerror = function() {
            alert("Lỗi khi đọc file ảnh!");
            btn.disabled = false;
            btn.innerHTML = '<i class="fa-solid fa-check-circle me-2"></i> Tôi đã chuyển khoản';
        };
        
        reader.readAsDataURL(file);
    });

    // Hủy giao dịch
    document.getElementById("btn-cancel").addEventListener("click", () => {
        if(confirm("Bạn có chắc chắn muốn hủy giao dịch này không?")) {
            localStorage.removeItem('pending_booking');
            window.history.back(); // Trở về trang trước đó
        }
    });
});
