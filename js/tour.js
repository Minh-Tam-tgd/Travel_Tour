document.addEventListener("DOMContentLoaded", function () {
  "use strict";

  const tourList = document.getElementById("tourList");
  const noResult = document.getElementById("no-result");
  const searchName = document.getElementById("search-name");
  const durationSelect = document.getElementById("duration");
  const priceRadios = document.querySelectorAll('input[name="price"]');
  const btnReset = document.getElementById("btn-reset");

  let allTours = [];
  let displayedTours = [];

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

  function renderTours(list) {
    tourList.innerHTML = "";
    if (!list || list.length === 0) {
      noResult.classList.remove("d-none");
      return;
    }
    noResult.classList.add("d-none");

    list.forEach((tour) => {
      const col = document.createElement("div");
      col.className = "col-md-6 col-xl-6 d-flex"; // Chia 2 cột trên md/lg/xl

      col.innerHTML = `
        <div class="tour-card tour-page-card d-flex w-100">
          <div class="tour-image position-relative">
            <img src="${tour.hinh_anh}" alt="${tour.ten_tour}" onerror="this.src='https://thegioidohoa.com/wp-content/uploads/2018/12/thi%E1%BA%BFt-k%E1%BA%BF-banner-du-l%E1%BB%8Bch-5.jpg'">
            <span class="discount-badge">- ${tour.phan_tram || 0}%</span>
            <span class="heart-icon"><i class="fa-solid fa-heart"></i></span>
          </div>
          <div class="tour-info d-flex flex-column justify-content-between flex-grow-1">
            <div>
              <p class="tour-from">
                <i class="fa-solid fa-location-dot"></i> Khởi hành từ: ${tour.diem_di || "Đang cập nhật"}
              </p>
              <h5 class="fw-bold tour-title mb-2">
                <a href="chi-tiet-tour.html?id=${tour.id}" class="text-dark text-decoration-none">
                  ${tour.ten_tour}
                </a>
              </h5>
              <div class="tour-rating mb-2">
                <i class="fa-solid fa-star text-warning"></i>
                <i class="fa-solid fa-star text-warning"></i>
                <i class="fa-solid fa-star text-warning"></i>
                <i class="fa-solid fa-star text-warning"></i>
                <i class="fa-solid fa-star-half-stroke text-warning"></i>
              </div>
            </div>
            <div class="mt-auto">
              <p class="tour-price mb-1">
                <span class="new-price">${formatMoney(tour.gia_tien)}</span>
                <span class="old-price">${formatMoney(tour.gia_tien_cu)}</span>
              </p>
              <p class="tour-duration mb-3">
                <i class="fa-regular fa-clock"></i> Thời gian: ${tour.thoi_gian || "1N"}
              </p>
              <a href="chi-tiet-tour.html?id=${tour.id}" class="btn-detail w-100 d-block text-center text-decoration-none">
                <i class="fa-solid fa-eye me-1"></i> Xem chi tiết
              </a>
            </div>
          </div>
        </div>
      `;
      tourList.appendChild(col);
    });
  }

  function executeSearch() {
    const keyword = searchName.value.trim().toLowerCase();
    const duration = durationSelect.value;
    const priceVal = document.querySelector('input[name="price"]:checked').value;

    displayedTours = allTours.filter((tour) => {
      // Tìm theo tên
      const name = (tour.ten_tour || "").toLowerCase();
      const matchName = keyword ? name.includes(keyword) : true;

      // Tìm theo thời gian
      let matchDuration = true;
      if (duration !== "all") {
        if (duration === "khac") {
          matchDuration = !["1N", "2N1Đ", "3N2Đ", "4N3Đ"].includes(tour.thoi_gian);
        } else {
          matchDuration = tour.thoi_gian === duration;
        }
      }

      // Tìm theo giá
      let matchPrice = true;
      const p = tour.gia_tien || 0;
      if (priceVal === "under_3m") {
        matchPrice = p < 3000000;
      } else if (priceVal === "3m_to_5m") {
        matchPrice = p >= 3000000 && p <= 5000000;
      } else if (priceVal === "above_5m") {
        matchPrice = p > 5000000;
      }

      return matchName && matchDuration && matchPrice;
    });

    renderTours(displayedTours);
  }

  function loadData() {
    fetch("http://127.0.0.1:8000/api/client/tour")
      .then((res) => res.json())
      .then((res) => {
        allTours = res.data || demoTours;
        executeSearch();
      })
      .catch((err) => {
        console.error("Lỗi khi gọi API, dùng data demo:", err);
        allTours = demoTours;
        executeSearch();
      });
  }

  searchName.addEventListener("keyup", executeSearch);
  durationSelect.addEventListener("change", executeSearch);
  priceRadios.forEach(radio => radio.addEventListener("change", executeSearch));

  btnReset.addEventListener("click", () => {
    searchName.value = "";
    durationSelect.value = "all";
    document.getElementById("price1").checked = true;
    executeSearch();
  });

  loadData();
});
