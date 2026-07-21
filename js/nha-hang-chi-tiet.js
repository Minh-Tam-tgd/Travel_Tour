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
    const totalPrice = document.getElementById("total-price");
    const bookingForm = document.getElementById("booking-form");
    const bookingDate = document.getElementById("booking-date");
  
    let currentPrice = 0;
  
    const today = new Date().toISOString().split('T')[0];
    if(bookingDate) bookingDate.setAttribute('min', today);
  
    function formatMoney(number) {
      return (number || 0).toLocaleString("vi-VN") + "đ";
    }
  
    function updatePrice() {
      const count = parseInt(guestCount.value) || 1;
      const total = currentPrice * count;
      totalPrice.textContent = formatMoney(total);
    }
  
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
      if (count < 20) {
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
  
      if (!date) {
          alert("Vui lòng chọn ngày đến!");
          return;
      }
  
      fetch('http://127.0.0.1:5000/api/client/booking', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
              user_id: user.id,
              tour_id: null,
              restaurant_id: resId || 1,
              type: 'restaurant',
              ngay_dat_di: date,
              so_luong_khach: count,
              tong_tien: total
          })
      })
      .then(res => res.json())
      .then(data => {
          if (data.status === 'success') {
              alert("Cảm ơn bạn! Yêu cầu đặt bàn đã được gửi thành công.");
              bookingForm.reset();
              updatePrice();
              window.location.href = "booked.html";
          } else {
              alert(data.message || "Lỗi khi đặt bàn");
          }
      })
      .catch(err => {
          console.error(err);
          alert("Lỗi kết nối server");
      });
    });
  
    loadResDetails();
  });
