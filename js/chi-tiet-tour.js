document.addEventListener("DOMContentLoaded", function () {
  "use strict";

  // Lấy ID tour từ URL
  const params = new URLSearchParams(window.location.search);
  const tourId = params.get("id");

  // DOM Elements
  const mainImage = document.getElementById("main-image");
  const tourTitle = document.getElementById("tour-title");
  const tourDuration = document.getElementById("tour-duration");
  const oldPriceEl = document.getElementById("old-price");
  const newPriceEl = document.getElementById("new-price");
  const btnMinus = document.getElementById("btn-minus");
  const btnPlus = document.getElementById("btn-plus");
  const guestCount = document.getElementById("guest-count");
  const summaryCount = document.getElementById("summary-count");
  const summaryPrice = document.getElementById("summary-price");
  const totalPrice = document.getElementById("total-price");
  const bookingForm = document.getElementById("booking-form");
  const bookingDate = document.getElementById("booking-date");

  let currentPrice = 0;

  // Set minimum date cho input date
  const today = new Date().toISOString().split('T')[0];
  if(bookingDate) bookingDate.setAttribute('min', today);

  const demoTours = [
    {
      id: 1,
      ten_tour: "Tour Minh Tâm - Hạ Long 3 ngày",
      hinh_anh: "../../assets/images/anh1.jpg",
      phan_tram: 20,
      ngay_khoi_hanh: "2026-07-01",
      gia_tien: 4990000,
      gia_tien_cu: 6200000,
      thoi_gian: "3N2Đ",
      diem_di: "Hà Nội",
      diem_den: "Hạ Long",
    },
    {
      id: 2,
      ten_tour: "Tour Đà Nẵng - Hội An - Cù Lao Chàm",
      hinh_anh: "../../assets/images/anh1.jpg",
      phan_tram: 15,
      ngay_khoi_hanh: "2026-07-05",
      gia_tien: 6250000,
      gia_tien_cu: 7200000,
      thoi_gian: "4N3Đ",
      diem_di: "Đà Nẵng",
      diem_den: "Hội An",
    },
    {
      id: 3,
      ten_tour: "Khám Phá Nha Trang - Biển Đảo",
      hinh_anh: "../../assets/images/anh1.jpg",
      phan_tram: 10,
      ngay_khoi_hanh: "2026-07-10",
      gia_tien: 5190000,
      gia_tien_cu: 5900000,
      thoi_gian: "3N2Đ",
      diem_di: "TP.HCM",
      diem_den: "Nha Trang",
    },
    {
      id: 4,
      ten_tour: "Du Lịch Sapa - Bản Cát Cát - Fansipan",
      hinh_anh: "../../assets/images/anh1.jpg",
      phan_tram: 25,
      ngay_khoi_hanh: "2026-07-12",
      gia_tien: 2690000,
      gia_tien_cu: 3900000,
      thoi_gian: "2N1Đ",
      diem_di: "Hà Nội",
      diem_den: "Sapa",
    },
    {
      id: 5,
      ten_tour: "Phú Quốc - VinWonders - Safari",
      hinh_anh: "../../assets/images/anh1.jpg",
      phan_tram: 10,
      ngay_khoi_hanh: "2026-08-10",
      gia_tien: 7100000,
      gia_tien_cu: 8500000,
      thoi_gian: "4N3Đ",
      diem_di: "TP.HCM",
      diem_den: "Phú Quốc",
    },
    {
      id: 6,
      ten_tour: "Tour Miền Tây 1 Ngày: Mỹ Tho - Bến Tre",
      hinh_anh: "../../assets/images/anh1.jpg",
      phan_tram: 5,
      ngay_khoi_hanh: "Hàng ngày",
      gia_tien: 850000,
      gia_tien_cu: 900000,
      thoi_gian: "1N",
      diem_di: "TP.HCM",
      diem_den: "Bến Tre",
    }
  ];

  function formatMoney(number) {
    return (number || 0).toLocaleString("vi-VN") + "đ";
  }

  function updatePrice() {
    const count = parseInt(guestCount.value) || 1;
    const total = currentPrice * count;
    summaryCount.textContent = count;
    summaryPrice.textContent = formatMoney(total);
    totalPrice.textContent = formatMoney(total);
  }

  function loadTourDetails() {
    // Thử fetch từ API, nếu lỗi thì dùng demo
    fetch(`http://127.0.0.1:5000/api/client/tour/${tourId}`)
      .then((res) => {
        if (!res.ok) throw new Error("API chưa hỗ trợ lấy tour chi tiết");
        return res.json();
      })
      .then((res) => {
        const tour = res.data;
        if(tour) renderTour(tour);
        else throw new Error("Không tìm thấy tour");
      })
      .catch((err) => {
        console.warn(err.message + ". Đang dùng dữ liệu demo.");
        // Fallback demo data
        const id = parseInt(tourId) || 1; // Mặc định là 1 nếu không có ID
        const tour = demoTours.find(t => t.id === id) || demoTours[0];
        renderTour(tour);
      });
  }

  function renderTour(tour) {
    document.title = tour.ten_tour + " - ND Travel";
    tourTitle.textContent = tour.ten_tour;
    document.getElementById("tour-location").textContent = tour.diem_di + " ➝ " + tour.diem_den;
    tourDuration.textContent = tour.thoi_gian;
    
    currentPrice = tour.gia_tien;
    oldPriceEl.textContent = formatMoney(tour.gia_tien_cu);
    newPriceEl.textContent = formatMoney(tour.gia_tien);
    
    // Cập nhật ảnh chính (Giả sử fallback nếu ảnh lỗi sẽ được xử lý qua onerror bên HTML)
    mainImage.src = tour.hinh_anh;
    
    updatePrice();
  }

  // Event Listeners cho số lượng khách
  btnMinus.addEventListener("click", () => {
    let count = parseInt(guestCount.value);
    if (count > 1) {
      guestCount.value = count - 1;
      updatePrice();
    }
  });

  btnPlus.addEventListener("click", () => {
    let count = parseInt(guestCount.value);
    if (count < 20) {
      guestCount.value = count + 1;
      updatePrice();
    }
  });

  // Submit Booking
  bookingForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const user = JSON.parse(localStorage.getItem('user'));
    if (!user) {
        alert("Vui lòng đăng nhập để đặt tour!");
        window.location.href = "login.html";
        return;
    }

    const count = parseInt(guestCount.value) || 1;
    const total = currentPrice * count;
    const date = bookingDate?.value;

    if (!date) {
        alert("Vui lòng chọn ngày khởi hành!");
        return;
    }

    fetch('http://127.0.0.1:5000/api/client/booking', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            user_id: user.id,
            tour_id: tourId || 1, // Fallback nếu không có ID
            ngay_dat_di: date,
            so_luong_khach: count,
            tong_tien: total
        })
    })
    .then(res => res.json())
    .then(data => {
        if (data.status === 'success') {
            alert("Cảm ơn bạn! Yêu cầu đặt tour của bạn đã được gửi thành công.");
            bookingForm.reset();
            updatePrice();
            window.location.href = "booked.html";
        } else {
            alert(data.message || "Lỗi khi đặt tour");
        }
    })
    .catch(err => {
        console.error(err);
        alert("Lỗi kết nối server");
    });
  });

  loadTourDetails();
});

// Hàm thay đổi ảnh chính khi click vào ảnh nhỏ
window.changeMainImage = function(src, el) {
  document.getElementById("main-image").src = src;
  
  // Update class active
  document.querySelectorAll(".small-img-thumbnail").forEach(img => {
    img.classList.remove("active");
  });
  el.classList.add("active");
}
