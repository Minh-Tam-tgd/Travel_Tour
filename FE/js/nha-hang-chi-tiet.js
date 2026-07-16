document.addEventListener("DOMContentLoaded", function () {
    "use strict";
  
    const params = new URLSearchParams(window.location.search);
    const resId = params.get("id");
  
    const mainImage = document.getElementById("main-image");
    const resTitle = document.getElementById("res-title");
    const resAddress = document.getElementById("res-address");
    const resDesc = document.getElementById("res-description");
    const priceEl = document.getElementById("price");
    
    const btnMinus = document.getElementById("btn-minus");
    const btnPlus = document.getElementById("btn-plus");
    const guestCount = document.getElementById("guest-count");
    
    const summaryCount = document.getElementById("summary-count");
    const summaryPrice = document.getElementById("summary-price");
    const totalPrice = document.getElementById("total-price");
    
    const bookingForm = document.getElementById("booking-form");
    const bookingDate = document.getElementById("booking-date");
    const paymentMethods = document.querySelectorAll('input[name="payment-method"]');
  
    let currentPrice = 0;
  
    const today = new Date().toISOString().split('T')[0];
    if(bookingDate) bookingDate.setAttribute('min', today);
  
    function formatMoney(number) {
      return (number || 0).toLocaleString("vi-VN") + "đ";
    }
  
    function updatePrice() {
      const count = parseInt(guestCount.value) || 1;
      let total = currentPrice * count;
      
      let payMethod = document.querySelector('input[name="payment-method"]:checked').value;
      let amountToPay = payMethod === 'deposit' ? total * 0.1 : total;
  
      summaryCount.textContent = count;
      summaryPrice.textContent = formatMoney(total);
      
      totalPrice.textContent = formatMoney(amountToPay) + (payMethod === 'deposit' ? ' (Cọc 10%)' : '');
    }

    paymentMethods.forEach(radio => {
      radio.addEventListener("change", updatePrice);
    });
  
    function loadResDetails() {
      fetch(`http://127.0.0.1:5000/api/client/nha-hang`)
        .then((res) => res.json())
        .then((res) => {
          const list = res.data || [];
          const restaurant = list.find(r => r.id == resId) || list[0];
          if(restaurant) renderRes(restaurant);
        })
        .catch((err) => {
          console.error("Lỗi:", err);
        });
    }
  
    function renderRes(restaurant) {
      document.title = restaurant.ten_nha_hang + " - ND Travel";
      resTitle.textContent = restaurant.ten_nha_hang;
      resAddress.textContent = restaurant.dia_chi;
      resDesc.textContent = restaurant.mo_ta || "Chưa có mô tả.";
      
      currentPrice = restaurant.gia_tien;

      priceEl.textContent = formatMoney(restaurant.gia_tien);
      
      mainImage.src = restaurant.hinh_anh;
      
      // Render Gallery
      const wrapper = document.getElementById("gallery-wrapper");
      const countEl = document.getElementById("gallery-count");
      if (wrapper) {
        wrapper.innerHTML = "";
        let gallery = [restaurant.hinh_anh];
        try {
          const extraImages = JSON.parse(restaurant.thu_vien_anh || '[]');
          gallery = gallery.concat(extraImages);
        } catch(e) {}
        
        gallery.forEach((imgSrc, index) => {
          const div = document.createElement("div");
          div.style.flex = "0 0 calc(25% - 7.5px)";
          div.innerHTML = `<img src="${imgSrc}" class="w-100 rounded-3 cursor-pointer small-img-thumbnail ${index===0?'active':''}" style="height: 80px; object-fit: cover;" onclick="changeMainImage(this.src, this)" onerror="this.src='../../assets/images/buffet.jpg'"/>`;
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
  
    btnMinus.addEventListener("click", () => {
      let count = parseInt(guestCount.value);
      if (count > 1) {
        guestCount.value = count - 1;
        updatePrice();
      }
    });
  
    btnPlus.addEventListener("click", () => {
      let count = parseInt(guestCount.value);
      if (count < 10) {
        guestCount.value = count + 1;
        updatePrice();
      }
    });
  
    bookingForm.addEventListener("submit", (e) => {
      e.preventDefault();
      
      const user = JSON.parse(localStorage.getItem('user'));
      if (!user) {
          alert("Vui lòng đăng nhập để đặt bàn!");
          window.location.href = "login.html";
          return;
      }
  
      const count = parseInt(guestCount.value) || 1;
      const total = currentPrice * count;
      const date = bookingDate.value;
      
      const payMethod = document.querySelector('input[name="payment-method"]:checked').value;
      const amountToPay = payMethod === 'deposit' ? total * 0.1 : total;
  
      if (!date) {
          alert("Vui lòng chọn ngày đến!");
          return;
      }
  
      const pendingBooking = {
          user_id: user.id,
          tour_id: null,
          restaurant_id: resId || 1,
          type: 'restaurant',
          ngay_dat_di: date,
          so_luong_khach: count,
          tong_tien: total,
          amount_to_pay: amountToPay,
          item_name: document.getElementById("res-title").textContent
      };

      localStorage.setItem('pending_booking', JSON.stringify(pendingBooking));
      window.location.href = "payment.html";
    });
  
    loadResDetails();
});

// Hàm dùng để thay đổi ảnh chính khi bấm vào ảnh nhỏ (được gọi từ HTML)
window.changeMainImage = function(src, element) {
    document.getElementById("main-image").src = src;
    document.querySelectorAll(".small-img-thumbnail").forEach((img) => img.classList.remove("active"));
    element.classList.add("active");
};

window.scrollGallery = function(dir) {
  const wrapper = document.getElementById("gallery-wrapper");
  if (!wrapper) return;
  const scrollAmount = wrapper.clientWidth / 4 + 10;
  wrapper.scrollBy({ left: dir * scrollAmount, behavior: "smooth" });
}
