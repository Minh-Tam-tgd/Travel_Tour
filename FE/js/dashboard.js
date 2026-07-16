document.addEventListener("DOMContentLoaded", function () {
    "use strict";

    // --- CHECK ROLE ---
    const user = JSON.parse(localStorage.getItem('admin_user'));
    if (!user || user.role !== 'admin') {
        alert("Bạn không có quyền truy cập trang này!");
        window.location.href = "../Client/login.html";
        return;
    }

    const API_BASE = "http://127.0.0.1:5000/api/admin";

    // --- LOGOUT ---
    document.getElementById('btn-logout').addEventListener('click', (e) => {
        e.preventDefault();
        localStorage.removeItem('admin_user');
        window.location.href = "../Client/login.html";
    });

    // --- TABS SWITCHING ---
    window.switchTab = function (tabId, el) {
        document.querySelectorAll('.sidebar a').forEach(a => a.classList.remove('active'));
        el.classList.add('active');

        document.querySelectorAll('.content-section').forEach(sec => sec.classList.add('d-none'));
        document.getElementById(tabId).classList.remove('d-none');

        document.getElementById('page-title').textContent = el.textContent.trim();

        // Reload data
        if (tabId === 'booking-tab') loadBookings();
        if (tabId === 'tour-tab') loadTours();
        if (tabId === 'restaurant-tab') loadRestaurants();
    };

    function formatMoney(n) {
        return Number(n).toLocaleString('vi-VN') + "đ";
    }

    // ================= BOOKINGS =================
    function getBookingBadge(status) {
        if (status === 'confirmed') return `<span class="badge bg-success">Đã duyệt</span>`;
        if (status === 'cancelled') return `<span class="badge bg-danger">Đã hủy</span>`;
        if (status === 'refund_requested') return `<span class="badge bg-info text-dark">Y/C Hoàn tiền</span>`;
        if (status === 'refunded') return `<span class="badge bg-warning text-dark">Đã hoàn tiền</span>`;
        if (status === 'rejected') return `<span class="badge bg-danger">Đã từ chối hoàn tiền</span>`;
        return `<span class="badge bg-warning text-dark">Chờ duyệt</span>`;
    }

    let allBookings = [];
    window.loadBookings = function () {
        fetch(`${API_BASE}/booking`)
            .then(res => res.json())
            .then(res => {
                allBookings = res.data || [];
                // Sort to bring pending and refund_requested to the top
                allBookings.sort((a, b) => {
                    const getPriority = (s) => (s === 'pending' || s === 'refund_requested') ? 1 : 0;
                    const pA = getPriority(a.trang_thai);
                    const pB = getPriority(b.trang_thai);
                    if (pA !== pB) return pB - pA;
                    return b.id - a.id;
                });

                let html = '';
                allBookings.forEach(b => {
                    const itemName = b.type === 'tour' ? b.ten_tour : b.ten_nha_hang;
                    let actions = '';
                    if (b.trang_thai === 'pending') {
                        actions = `
                            <button class="btn btn-sm btn-success me-1" onclick="updateBooking(${b.id}, 'confirmed')" title="Duyệt"><i class="fa-solid fa-check"></i></button>
                            <button class="btn btn-sm btn-danger" onclick="updateBooking(${b.id}, 'cancelled')" title="Hủy"><i class="fa-solid fa-xmark"></i></button>
                        `;
                    } else if (b.trang_thai === 'refund_requested') {
                        actions = `
                            <button class="btn btn-sm btn-primary" onclick="showAdminRefundModal(${b.id})">Chi tiết hoàn tiền</button>
                        `;
                    } else if (b.trang_thai === 'refunded' || b.trang_thai === 'rejected') {
                        actions = `
                            <button class="btn btn-sm btn-info text-white" onclick="viewAdminRefundDetails(${b.id})">Xem chi tiết</button>
                        `;
                    }
                    html += `
                        <tr>
                            <td>#${b.id}</td>
                            <td>
                                <strong>${b.user_name}</strong><br>
                                <small class="text-muted">${b.user_email}</small>
                            </td>
                            <td>${itemName} <span class="badge bg-secondary">${b.type}</span></td>
                            <td>${new Date(b.ngay_dat_di).toLocaleDateString('vi-VN')}</td>
                            <td>${b.so_luong_khach}</td>
                            <td class="text-dark fw-bold">${formatMoney(b.tong_tien)}</td>
                            <td class="text-success fw-bold">${formatMoney(b.so_tien_da_tra || 0)}</td>
                            <td class="text-danger fw-bold">${formatMoney(b.tong_tien - (b.so_tien_da_tra || 0))}</td>
                            <td>${getBookingBadge(b.trang_thai)}</td>
                            <td>${actions}</td>
                        </tr>
                    `;
                });
                document.getElementById('admin-booking-list').innerHTML = html || '<tr><td colspan="10" class="text-center">Chưa có đơn đặt nào</td></tr>';
            });
    }

    window.showAdminRefundModal = function (id) {
        const booking = allBookings.find(b => b.id === id);
        if (!booking) return;

        let info = {};
        try { info = JSON.parse(booking.hoan_tien_info || '{}'); } catch (e) { }

        document.getElementById('admin-refund-bank').textContent = info.ten_nh || 'N/A';
        document.getElementById('admin-refund-stk').textContent = info.stk || 'N/A';
        document.getElementById('admin-refund-cccd').textContent = info.cccd || 'N/A';
        document.getElementById('admin-refund-amount').textContent = formatMoney(booking.so_tien_da_tra || 0);

        const proofContainer = document.getElementById('admin-refund-payment-proof-container');
        const proofImg = document.getElementById('admin-refund-payment-proof');
        if (booking.minh_chung_thanh_toan) {
            proofImg.src = booking.minh_chung_thanh_toan;
            proofContainer.classList.remove('d-none');
        } else {
            proofContainer.classList.add('d-none');
            proofImg.src = '';
        }

        document.getElementById('admin-refund-proof-file').value = "";
        document.getElementById('admin-refund-note').value = "";
        document.getElementById('admin-reject-reason').value = "";

        const btnConfirm = document.getElementById('btn-confirm-refund');
        btnConfirm.onclick = function () {
            const fileInput = document.getElementById('admin-refund-proof-file');
            if (fileInput.files.length === 0) {
                alert("Vui lòng tải lên minh chứng đã hoàn tiền!");
                return;
            }

            const reader = new FileReader();
            reader.onload = function(e) {
                info.minh_chung_hoan_tien = e.target.result;
                info.ghi_chu = document.getElementById('admin-refund-note').value;
                updateBooking(id, 'refunded', info);
                const modal = bootstrap.Modal.getInstance(document.getElementById('adminRefundModal'));
                if (modal) modal.hide();
            };
            reader.readAsDataURL(fileInput.files[0]);
        };

        const btnReject = document.getElementById('btn-reject-refund');
        btnReject.onclick = function () {
            const reason = document.getElementById('admin-reject-reason').value.trim();
            if (!reason) {
                alert("Vui lòng nhập lý do từ chối!");
                return;
            }
            info.ly_do_tu_choi = reason;
            updateBooking(id, 'rejected', info);
            const modal = bootstrap.Modal.getInstance(document.getElementById('adminRefundModal'));
            if (modal) modal.hide();
        };

        new bootstrap.Modal(document.getElementById('adminRefundModal')).show();
    }

    window.viewAdminRefundDetails = function (id) {
        const item = allBookings.find(b => b.id === id);
        if(!item) return;

        let info = {};
        try {
            info = JSON.parse(item.hoan_tien_info || '{}');
        } catch(e) {}

        const contentDiv = document.getElementById('admin-refund-detail-content');
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

        new bootstrap.Modal(document.getElementById('adminRefundDetailModal')).show();
    };

    window.updateBooking = function (id, status, hoan_tien_info = null) {
        if (!confirm(`Xác nhận chuyển trạng thái đơn #${id}?`)) return;
        
        const payload = { status };
        if (hoan_tien_info) payload.hoan_tien_info = hoan_tien_info;

        fetch(`${API_BASE}/booking/${id}/status`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        })
            .then(res => res.json())
            .then(res => {
                if (res.status === 'success') loadBookings();
                else alert(res.message);
            });
    }

    // ================= TOURS =================
    let currentTours = [];
    window.loadTours = function () {
        fetch(`${API_BASE}/tour`)
            .then(res => res.json())
            .then(res => {
                currentTours = res.data || [];
                let html = '';
                currentTours.forEach(t => {
                    html += `
                        <tr>
                            <td>#${t.id}</td>
                            <td><img src="${t.hinh_anh}" width="60" height="40" alt="img"></td>
                            <td class="fw-bold">${t.ten_tour}</td>
                            <td><small>${t.diem_di} ➝ ${t.diem_den}</small></td>
                            <td><small>${t.thoi_gian}<br>${t.ngay_khoi_hanh}</small></td>
                            <td><small><del class="text-muted">${formatMoney(t.gia_tien_cu)}</del><br><span class="text-danger fw-bold">${formatMoney(t.gia_tien)}</span></small></td>
                            <td>
                                <div class="form-check form-switch">
                                    <input class="form-check-input" type="checkbox" onchange="toggleTour(${t.id}, this.checked)" ${t.is_active ? 'checked' : ''}>
                                </div>
                            </td>
                            <td>
                                <button class="btn btn-sm btn-outline-primary" onclick="openTourModal(${t.id})"><i class="fa-solid fa-pen"></i></button>
                                <button class="btn btn-sm btn-outline-danger" onclick="deleteTour(${t.id})"><i class="fa-solid fa-trash"></i></button>
                            </td>
                        </tr>
                    `;
                });
                document.getElementById('admin-tour-list').innerHTML = html;
            });
    }

    window.toggleTour = function (id, is_active) {
        fetch(`${API_BASE}/tour/${id}/active`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ is_active })
        });
    }

    window.deleteTour = function (id) {
        if (!confirm('Bạn chắc chắn xóa tour này? Tất cả đơn đặt thuộc tour cũng có thể bị ảnh hưởng.')) return;
        fetch(`${API_BASE}/tour/${id}`, { method: 'DELETE' }).then(() => loadTours());
    }

    // Modal logic cho Tour
    const tourModal = new bootstrap.Modal(document.getElementById('tourModal'));

    function calculateTourPrice() {
        const oldPrice = parseFloat(document.getElementById('tour-oldprice').value) || 0;
        const discount = parseFloat(document.getElementById('tour-discount').value) || 0;
        const newPrice = oldPrice - (oldPrice * discount / 100);
        document.getElementById('tour-newprice').value = Math.max(0, newPrice);
    }
    document.getElementById('tour-oldprice').addEventListener('input', calculateTourPrice);
    document.getElementById('tour-discount').addEventListener('input', calculateTourPrice);

    window.addTourGalleryInput = function(val = '') {
        const container = document.getElementById('tour-gallery-container');
        const div = document.createElement('div');
        div.className = 'd-flex mb-2';
        div.innerHTML = `
            <input type="text" class="form-control form-control-sm me-2 tour-gallery-input" placeholder="Link ảnh phụ" value="${val}" required>
            <button type="button" class="btn btn-sm btn-outline-danger" onclick="this.parentElement.remove()"><i class="fa-solid fa-trash"></i></button>
        `;
        container.appendChild(div);
    };

    window.openTourModal = function (id = null) {
        const form = document.getElementById('tourForm');
        form.reset();
        document.getElementById('tour-id').value = '';
        document.getElementById('tourModalTitle').textContent = 'Thêm Tour Mới';
        document.getElementById('tour-gallery-container').innerHTML = '';

        if (id) {
            const t = currentTours.find(x => x.id === id);
            if (t) {
                document.getElementById('tourModalTitle').textContent = 'Sửa Tour #' + id;
                document.getElementById('tour-id').value = id;
                document.getElementById('tour-name').value = t.ten_tour;
                document.getElementById('tour-image').value = t.hinh_anh;
                document.getElementById('tour-diemdi').value = t.diem_di;
                document.getElementById('tour-diemden').value = t.diem_den;
                document.getElementById('tour-date').value = t.ngay_khoi_hanh;
                document.getElementById('tour-duration').value = t.thoi_gian;
                document.getElementById('tour-oldprice').value = t.gia_tien_cu;
                document.getElementById('tour-newprice').value = t.gia_tien;
                document.getElementById('tour-discount').value = t.phan_tram;
                document.getElementById('tour-desc').value = t.mo_ta || '';
                
                try {
                    const gallery = JSON.parse(t.thu_vien_anh || '[]');
                    gallery.forEach(link => addTourGalleryInput(link));
                } catch(e) {}
            }
        }
        tourModal.show();
    }

    document.getElementById('tourForm').addEventListener('submit', function (e) {
        e.preventDefault();
        const id = document.getElementById('tour-id').value;
        const galleryInputs = document.querySelectorAll('.tour-gallery-input');
        const gallery = Array.from(galleryInputs).map(inp => inp.value).filter(val => val.trim() !== '');

        const payload = {
            ten_tour: document.getElementById('tour-name').value,
            hinh_anh: document.getElementById('tour-image').value,
            diem_di: document.getElementById('tour-diemdi').value,
            diem_den: document.getElementById('tour-diemden').value,
            ngay_khoi_hanh: document.getElementById('tour-date').value,
            thoi_gian: document.getElementById('tour-duration').value,
            gia_tien_cu: document.getElementById('tour-oldprice').value,
            gia_tien: document.getElementById('tour-newprice').value,
            phan_tram: document.getElementById('tour-discount').value,
            mo_ta: document.getElementById('tour-desc').value,
            thu_vien_anh: gallery
        };

        const method = id ? 'PUT' : 'POST';
        const url = id ? `${API_BASE}/tour/${id}` : `${API_BASE}/tour`;

        fetch(url, {
            method: method,
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        }).then(res => res.json()).then(res => {
            if (res.status === 'success') {
                tourModal.hide();
                loadTours();
            } else {
                alert(res.message);
            }
        });
    });

    // ================= RESTAURANTS =================
    let currentRes = [];
    window.loadRestaurants = function () {
        fetch(`${API_BASE}/restaurant`)
            .then(res => res.json())
            .then(res => {
                currentRes = res.data || [];
                let html = '';
                currentRes.forEach(r => {
                    html += `
                        <tr>
                            <td>#${r.id}</td>
                            <td><img src="${r.hinh_anh}" width="60" height="40" alt="img"></td>
                            <td class="fw-bold">${r.ten_nha_hang}</td>
                            <td><small>${r.dia_chi}</small></td>
                            <td class="text-danger fw-bold">${formatMoney(r.gia_tien)}</td>
                            <td>
                                <div class="form-check form-switch">
                                    <input class="form-check-input" type="checkbox" onchange="toggleRes(${r.id}, this.checked)" ${r.is_active ? 'checked' : ''}>
                                </div>
                            </td>
                            <td>
                                <button class="btn btn-sm btn-outline-primary" onclick="openResModal(${r.id})"><i class="fa-solid fa-pen"></i></button>
                                <button class="btn btn-sm btn-outline-danger" onclick="deleteRes(${r.id})"><i class="fa-solid fa-trash"></i></button>
                            </td>
                        </tr>
                    `;
                });
                document.getElementById('admin-restaurant-list').innerHTML = html;
            });
    }

    window.toggleRes = function (id, is_active) {
        fetch(`${API_BASE}/restaurant/${id}/active`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ is_active })
        });
    }

    window.deleteRes = function (id) {
        if (!confirm('Bạn chắc chắn xóa nhà hàng này?')) return;
        fetch(`${API_BASE}/restaurant/${id}`, { method: 'DELETE' }).then(() => loadRestaurants());
    }

    // Modal logic cho Restaurant
    const resModal = new bootstrap.Modal(document.getElementById('resModal'));

    window.addResGalleryInput = function(val = '') {
        const container = document.getElementById('res-gallery-container');
        const div = document.createElement('div');
        div.className = 'd-flex mb-2';
        div.innerHTML = `
            <input type="text" class="form-control form-control-sm me-2 res-gallery-input" placeholder="Link ảnh phụ" value="${val}" required>
            <button type="button" class="btn btn-sm btn-outline-danger" onclick="this.parentElement.remove()"><i class="fa-solid fa-trash"></i></button>
        `;
        container.appendChild(div);
    };

    window.openResModal = function (id = null) {
        const form = document.getElementById('resForm');
        form.reset();
        document.getElementById('res-id').value = '';
        document.getElementById('resModalTitle').textContent = 'Thêm Nhà hàng Mới';
        document.getElementById('res-gallery-container').innerHTML = '';

        if (id) {
            const r = currentRes.find(x => x.id === id);
            if (r) {
                document.getElementById('resModalTitle').textContent = 'Sửa Nhà hàng #' + id;
                document.getElementById('res-id').value = id;
                document.getElementById('res-name').value = r.ten_nha_hang;
                document.getElementById('res-image').value = r.hinh_anh;
                document.getElementById('res-address').value = r.dia_chi;
                document.getElementById('res-price').value = r.gia_tien;
                document.getElementById('res-desc').value = r.mo_ta || '';
                
                try {
                    const gallery = JSON.parse(r.thu_vien_anh || '[]');
                    gallery.forEach(link => addResGalleryInput(link));
                } catch(e) {}
            }
        }
        resModal.show();
    }

    document.getElementById('resForm').addEventListener('submit', function (e) {
        e.preventDefault();
        const id = document.getElementById('res-id').value;
        const galleryInputs = document.querySelectorAll('.res-gallery-input');
        const gallery = Array.from(galleryInputs).map(inp => inp.value).filter(val => val.trim() !== '');

        const payload = {
            ten_nha_hang: document.getElementById('res-name').value,
            hinh_anh: document.getElementById('res-image').value,
            dia_chi: document.getElementById('res-address').value,
            gia_tien: document.getElementById('res-price').value,
            mo_ta: document.getElementById('res-desc').value,
            thu_vien_anh: gallery
        };

        const method = id ? 'PUT' : 'POST';
        const url = id ? `${API_BASE}/restaurant/${id}` : `${API_BASE}/restaurant`;

        fetch(url, {
            method: method,
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        }).then(res => res.json()).then(res => {
            if (res.status === 'success') {
                resModal.hide();
                loadRestaurants();
            } else {
                alert(res.message);
            }
        });
    });

    // INIT
    loadBookings();
});
