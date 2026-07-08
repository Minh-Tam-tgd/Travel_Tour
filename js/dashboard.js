document.addEventListener("DOMContentLoaded", function () {
    "use strict";

    // --- CHECK ROLE ---
    const user = JSON.parse(localStorage.getItem('user'));
    if (!user || user.role !== 'admin') {
        alert("Bạn không có quyền truy cập trang này!");
        window.location.href = "../Client/login.html";
        return;
    }

    const API_BASE = "http://127.0.0.1:5000/api/admin";

    // --- LOGOUT ---
    document.getElementById('btn-logout').addEventListener('click', (e) => {
        e.preventDefault();
        localStorage.removeItem('user');
        window.location.href = "../Client/login.html";
    });

    // --- TABS SWITCHING ---
    window.switchTab = function(tabId, el) {
        document.querySelectorAll('.sidebar a').forEach(a => a.classList.remove('active'));
        el.classList.add('active');
        
        document.querySelectorAll('.content-section').forEach(sec => sec.classList.add('d-none'));
        document.getElementById(tabId).classList.remove('d-none');
        
        document.getElementById('page-title').textContent = el.textContent.trim();
        
        // Reload data corresponding to tab
        if(tabId === 'booking-tab') loadBookings();
        if(tabId === 'tour-tab') loadTours();
        if(tabId === 'restaurant-tab') loadRestaurants();
    };

    function formatMoney(n) {
        return Number(n).toLocaleString('vi-VN') + "đ";
    }

    function getBadge(status) {
        if(status === 'confirmed') return `<span class="badge bg-success">Đã duyệt</span>`;
        if(status === 'cancelled') return `<span class="badge bg-danger">Đã hủy</span>`;
        return `<span class="badge bg-warning text-dark">Chờ duyệt</span>`;
    }

    // ================= BOOKINGS =================
    window.loadBookings = function() {
        fetch(`${API_BASE}/booking`)
            .then(res => res.json())
            .then(res => {
                let html = '';
                (res.data || []).forEach(b => {
                    const itemName = b.type === 'tour' ? b.ten_tour : b.ten_nha_hang;
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
                            <td class="text-danger fw-bold">${formatMoney(b.tong_tien)}</td>
                            <td>${getBadge(b.trang_thai)}</td>
                            <td>
                                ${b.trang_thai === 'pending' ? `
                                    <button class="btn btn-sm btn-success" onclick="updateBooking(${b.id}, 'confirmed')"><i class="fa-solid fa-check"></i></button>
                                    <button class="btn btn-sm btn-danger" onclick="updateBooking(${b.id}, 'cancelled')"><i class="fa-solid fa-xmark"></i></button>
                                ` : ''}
                            </td>
                        </tr>
                    `;
                });
                document.getElementById('admin-booking-list').innerHTML = html || '<tr><td colspan="8" class="text-center">Chưa có đơn đặt nào</td></tr>';
            });
    }

    window.updateBooking = function(id, status) {
        if(!confirm(`Bạn chắc chắn muốn ${status === 'confirmed' ? 'Duyệt' : 'Hủy'} đơn #${id}?`)) return;
        fetch(`${API_BASE}/booking/${id}/status`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ status })
        })
        .then(res => res.json())
        .then(res => {
            if(res.status === 'success') loadBookings();
            else alert(res.message);
        });
    }

    // ================= TOURS =================
    window.loadTours = function() {
        fetch(`${API_BASE}/tour`)
            .then(res => res.json())
            .then(res => {
                let html = '';
                (res.data || []).forEach(t => {
                    html += `
                        <tr>
                            <td>#${t.id}</td>
                            <td>${t.ten_tour}</td>
                            <td>${formatMoney(t.gia_tien)}</td>
                            <td>${t.thoi_gian}</td>
                            <td>
                                <div class="form-check form-switch">
                                    <input class="form-check-input" type="checkbox" onchange="toggleTour(${t.id}, this.checked)" ${t.is_active ? 'checked' : ''}>
                                </div>
                            </td>
                            <td>
                                <button class="btn btn-sm btn-outline-primary"><i class="fa-solid fa-pen"></i></button>
                                <button class="btn btn-sm btn-outline-danger" onclick="deleteTour(${t.id})"><i class="fa-solid fa-trash"></i></button>
                            </td>
                        </tr>
                    `;
                });
                document.getElementById('admin-tour-list').innerHTML = html;
            });
    }

    window.toggleTour = function(id, is_active) {
        fetch(`${API_BASE}/tour/${id}/active`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ is_active })
        }).then(() => loadTours());
    }

    window.deleteTour = function(id) {
        if(!confirm('Bạn chắc chắn xóa tour này?')) return;
        fetch(`${API_BASE}/tour/${id}`, { method: 'DELETE' }).then(() => loadTours());
    }

    // ================= RESTAURANTS =================
    window.loadRestaurants = function() {
        fetch(`${API_BASE}/restaurant`)
            .then(res => res.json())
            .then(res => {
                let html = '';
                (res.data || []).forEach(r => {
                    html += `
                        <tr>
                            <td>#${r.id}</td>
                            <td>${r.ten_nha_hang}</td>
                            <td>${r.dia_chi}</td>
                            <td>${formatMoney(r.gia_tien)}</td>
                            <td>
                                <div class="form-check form-switch">
                                    <input class="form-check-input" type="checkbox" onchange="toggleRes(${r.id}, this.checked)" ${r.is_active ? 'checked' : ''}>
                                </div>
                            </td>
                            <td>
                                <button class="btn btn-sm btn-outline-primary"><i class="fa-solid fa-pen"></i></button>
                                <button class="btn btn-sm btn-outline-danger" onclick="deleteRes(${r.id})"><i class="fa-solid fa-trash"></i></button>
                            </td>
                        </tr>
                    `;
                });
                document.getElementById('admin-restaurant-list').innerHTML = html;
            });
    }

    window.toggleRes = function(id, is_active) {
        fetch(`${API_BASE}/restaurant/${id}/active`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ is_active })
        }).then(() => loadRestaurants());
    }

    window.deleteRes = function(id) {
        if(!confirm('Bạn chắc chắn xóa nhà hàng này?')) return;
        fetch(`${API_BASE}/restaurant/${id}`, { method: 'DELETE' }).then(() => loadRestaurants());
    }

    // INIT
    loadBookings();
});
