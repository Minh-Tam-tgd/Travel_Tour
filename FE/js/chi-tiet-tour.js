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
  const departureSelect = document.getElementById("departure-location");
  const specificAddressGroup = document.getElementById("specific-address-group");
  const discountMessage = document.getElementById("discount-message");
  const paymentMethods = document.querySelectorAll('input[name="payment-method"]');

  let currentPrice = 0;
  let finalCalculatedPrice = 0;
  let destinationRegion = "";

  const regionData = {
    bac: ["hà nội", "hạ long", "quảng ninh", "sapa", "lào cai", "sơn la", "mộc châu", "bắc kạn", "hải phòng", "ninh bình", "vĩnh phúc", "phú thọ", "hà giang", "cao bằng", "lạng sơn", "tuyên quang", "thái nguyên", "bắc giang", "bắc ninh", "hải dương", "hưng yên", "hà nam", "nam định", "thái bình", "lai châu", "điện biên", "yên bái", "hòa bình"],
    trung: ["đà nẵng", "hội an", "quảng nam", "huế", "thừa thiên huế", "nha trang", "khánh hòa", "quy nhơn", "bình định", "quảng bình", "hà tĩnh", "nghệ an", "thanh hóa", "quảng trị", "quảng ngãi", "phú yên", "ninh thuận", "bình thuận", "đà lạt", "lâm đồng", "đắk lắk", "buôn ma thuột", "đắk nông", "gia lai", "kon tum"],
    nam: ["tp.hcm", "hồ chí minh", "phú quốc", "kiên giang", "bến tre", "cần thơ", "đồng tháp", "vĩnh long", "bình dương", "đồng nai", "bà rịa", "vũng tàu", "bình phước", "tây ninh", "long an", "tiền giang", "trà vinh", "hậu giang", "sóc trăng", "bạc liêu", "cà mau", "an giang"]
  };

  function getRegionFromLocation(locStr) {
    if (!locStr) return "";
    const loc = locStr.toLowerCase();
    for (const [region, provinces] of Object.entries(regionData)) {
      for (const p of provinces) {
        if (loc.includes(p)) return region;
      }
    }
    return "";
  }

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
    let baseTotal = currentPrice * count;
    
    // Calculate regional discount
    let originRegion = "";
    if (departureSelect && departureSelect.options[departureSelect.selectedIndex]) {
      originRegion = departureSelect.options[departureSelect.selectedIndex].getAttribute("data-region") || "";
    }

    let multiplier = 1;
    let msg = "";
    discountMessage.className = "small mt-1 fw-semibold"; // Reset class

    if (originRegion && destinationRegion) {
      if (originRegion === destinationRegion) {
        multiplier = 0.8; // -20%
        msg = `(Giảm 20% do khởi hành cùng Miền)`;
        discountMessage.classList.add("text-success");
      } else if ((originRegion === 'bac' && destinationRegion === 'nam') || (originRegion === 'nam' && destinationRegion === 'bac')) {
        multiplier = 1.05; // +5%
        msg = `(Phụ thu 5% tuyến Bắc - Nam)`;
        discountMessage.classList.add("text-danger");
      } else {
        multiplier = 1; // 0%
        msg = ``;
      }
    }

    finalCalculatedPrice = baseTotal * multiplier;
    discountMessage.textContent = msg;

    let payMethod = document.querySelector('input[name="payment-method"]:checked').value;
    let amountToPay = payMethod === 'deposit' ? finalCalculatedPrice * 0.1 : finalCalculatedPrice;

    summaryCount.textContent = count;
    summaryPrice.textContent = formatMoney(finalCalculatedPrice);
    totalPrice.textContent = formatMoney(amountToPay) + (payMethod === 'deposit' ? ' (Cọc 10%)' : '');
  }

  if (departureSelect) {
    departureSelect.addEventListener("change", (e) => {
      if (e.target.value) {
        specificAddressGroup.classList.remove("d-none");
      } else {
        specificAddressGroup.classList.add("d-none");
      }
      updatePrice();
    });
  }

  paymentMethods.forEach(radio => {
    radio.addEventListener("change", updatePrice);
  });

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
    destinationRegion = getRegionFromLocation(tour.diem_den);
    
    oldPriceEl.textContent = formatMoney(tour.gia_tien_cu);
    newPriceEl.textContent = formatMoney(tour.gia_tien);
    
    // Render mô tả
    const descEl = document.getElementById("tour-description");
    if (descEl) {
      descEl.textContent = tour.mo_ta || "Trải nghiệm hành trình tuyệt vời với những điểm đến hấp dẫn. Tận hưởng kỳ nghỉ dưỡng thoải mái, dịch vụ chuyên nghiệp và những kỷ niệm đáng nhớ.";
    }
    
    // Cập nhật ảnh chính (Giả sử fallback nếu ảnh lỗi sẽ được xử lý qua onerror bên HTML)
    mainImage.src = tour.hinh_anh;
    
    // Render Gallery
    const wrapper = document.getElementById("gallery-wrapper");
    const countEl = document.getElementById("gallery-count");
    if (wrapper) {
      wrapper.innerHTML = "";
      let gallery = [tour.hinh_anh];
      try {
        const extraImages = JSON.parse(tour.thu_vien_anh || '[]');
        gallery = gallery.concat(extraImages);
      } catch(e) {}
      
      gallery.forEach((imgSrc, index) => {
        const div = document.createElement("div");
        div.style.flex = "0 0 calc(25% - 7.5px)";
        div.innerHTML = `<img src="${imgSrc}" class="w-100 rounded-3 cursor-pointer small-img-thumbnail ${index===0?'active':''}" style="height: 80px; object-fit: cover;" onclick="changeMainImage(this.src, this)" onerror="this.src='https://thegioidohoa.com/wp-content/uploads/2018/12/thi%E1%BA%BFt-k%E1%BA%BF-banner-du-l%E1%BB%8Bch-5.jpg'"/>`;
        wrapper.appendChild(div);
      });
      
      if (countEl) countEl.innerHTML = `<small>${gallery.length} ảnh</small>`;
      
      const btnPrev = document.getElementById("btn-prev-img");
      const btnNext = document.getElementById("btn-next-img");
      if (gallery.length > 4) {
        if(btnPrev) btnPrev.style.display = "block";
        if(btnNext) btnNext.style.display = "block";
      } else {
        if(btnPrev) btnPrev.style.display = "none";
        if(btnNext) btnNext.style.display = "none";
      }
    }
    
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
    const total = finalCalculatedPrice || (currentPrice * count);
    const date = bookingDate?.value;
    const payMethod = document.querySelector('input[name="payment-method"]:checked').value;
    const amountToPay = payMethod === 'deposit' ? total * 0.1 : total;

    if (!date) {
        alert("Vui lòng chọn ngày khởi hành!");
        return;
    }
    
    if (!departureSelect.value) {
        alert("Vui lòng chọn nơi xuất phát!");
        return;
    }

    const pendingBooking = {
        user_id: user.id,
        tour_id: tourId || 1,
        restaurant_id: null,
        type: 'tour',
        ngay_dat_di: date,
        so_luong_khach: count,
        tong_tien: total, // Lưu tổng tiền thật vào DB
        amount_to_pay: amountToPay, // Số tiền hiển thị trên mã QR
        item_name: document.getElementById("tour-title").textContent
    };

    localStorage.setItem('pending_booking', JSON.stringify(pendingBooking));
    window.location.href = "payment.html";
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

window.scrollGallery = function(dir) {
  const wrapper = document.getElementById("gallery-wrapper");
  if (!wrapper) return;
  const scrollAmount = wrapper.clientWidth / 4 + 10;
  wrapper.scrollBy({ left: dir * scrollAmount, behavior: "smooth" });
}
