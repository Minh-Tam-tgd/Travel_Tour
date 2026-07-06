document.addEventListener("DOMContentLoaded", function () {
  "use strict";

  // ================= BIẾN TOÀN CỤC =================
  const API_URL = "http://127.0.0.1:8000/api/client/nha-hang";
  let all_nha_hang = [];
  let nha_hang = [];
  let limit = 8;
  let uniqueAddress = [];

  const demoNhaHang = [
    {
      id: 1,
      ten_nha_hang: "Nhà Hàng Buffet Sen Tây Hồ",
      hinh_anh: "../../assets/images/buffet.jpg",
      dia_chi: "Hà Nội",
      mo_ta: "Buffet cao cấp với hàng trăm món ngon 3 miền.",
      gia_tien: 450000
    },
    {
      id: 2,
      ten_nha_hang: "Lẩu Phan",
      hinh_anh: "../../assets/images/lau.jpg",
      dia_chi: "Hà Nội",
      mo_ta: "Lẩu bò úc thả ga, không lo về giá.",
      gia_tien: 169000
    },
    {
      id: 3,
      ten_nha_hang: "King BBQ",
      hinh_anh: "../../assets/images/nuong.jpg",
      dia_chi: "TP.HCM",
      mo_ta: "Vua nướng Hàn Quốc, thịt nướng thơm ngon.",
      gia_tien: 300000
    },
    {
      id: 4,
      ten_nha_hang: "Nhà Hàng Hải Sản Biển Đông",
      hinh_anh: "../../assets/images/haisan.jpg",
      dia_chi: "Đà Nẵng",
      mo_ta: "Hải sản tươi sống, chế biến tại chỗ.",
      gia_tien: 500000
    },
    {
      id: 5,
      ten_nha_hang: "Gogi House",
      hinh_anh: "../../assets/images/han.jpg",
      dia_chi: "Hà Nội",
      mo_ta: "Thịt nướng không khói chuẩn vị Hàn.",
      gia_tien: 250000
    },
    {
      id: 6,
      ten_nha_hang: "Quán Nhậu Tự Do",
      hinh_anh: "../../assets/images/quannhau.jpg",
      dia_chi: "Hà Nội",
      mo_ta: "Không gian thoáng mát, đồ nhậu đa dạng.",
      gia_tien: 200000
    },
    {
      id: 7,
      ten_nha_hang: "Sushi Kei",
      hinh_anh: "../../assets/images/nhat.jpg",
      dia_chi: "TP.HCM",
      mo_ta: "Sushi và sashimi tươi ngon chuẩn Nhật.",
      gia_tien: 400000
    },
    {
      id: 8,
      ten_nha_hang: "Cơm Niêu Việt",
      hinh_anh: "../../assets/images/viet.jpg",
      dia_chi: "Đà Nẵng",
      mo_ta: "Món ngon đậm đà hương vị truyền thống Việt Nam.",
      gia_tien: 150000
    },
    {
      id: 9,
      ten_nha_hang: "Kichi Kichi",
      hinh_anh: "../../assets/images/lau.jpg",
      dia_chi: "TP.HCM",
      mo_ta: "Lẩu băng chuyền độc đáo.",
      gia_tien: 250000
    }
  ];

  // ================= DOM ELEMENTS =================
  const searchAddress = document.getElementById("search-address");
  const searchName = document.getElementById("search-name");
  const restaurantList = document.getElementById("restaurant-list");
  const noResult = document.getElementById("no-result");
  const toggleLimitContainer = document.getElementById(
    "toggle-limit-container",
  );
  const toggleLimitBtn = document.getElementById("toggle-limit-btn");
  const sliderContainer = document.getElementById("restaurant-slider");
  const btnScrollLeft = document.getElementById("btn-scroll-left");
  const btnScrollRight = document.getElementById("btn-scroll-right");

  // ================= HELPER FUNCTION =================
  // Chuyển tiếng Việt có dấu → không dấu
  function removeVietnamese(str) {
    return str
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/đ/g, "d")
      .replace(/Đ/g, "D")
      .toLowerCase();
  }

  // Định dạng tiền tệ
  function formatCurrency(number) {
    return Number(number).toLocaleString("vi-VN");
  }

  // ================= FETCH DATA =================
  function loadData() {
    fetch(API_URL)
      .then((res) => res.json())
      .then((res) => {
        all_nha_hang = res.data || demoNhaHang;
        nha_hang = [...all_nha_hang];

        // Lọc lấy danh sách địa chỉ duy nhất
        uniqueAddress = [...new Set(all_nha_hang.map((nh) => nh.dia_chi))];

        renderAddressDropdown();
        renderList();
        renderSlider();
      })
      .catch((err) => {
        console.error("Lỗi khi lấy dữ liệu, sử dụng dữ liệu demo:", err);
        all_nha_hang = demoNhaHang;
        nha_hang = [...all_nha_hang];

        // Lọc lấy danh sách địa chỉ duy nhất
        uniqueAddress = [...new Set(all_nha_hang.map((nh) => nh.dia_chi))];

        renderAddressDropdown();
        renderList();
        renderSlider();
      });
  }

  // ================= RENDER GIAO DIỆN =================
  function renderAddressDropdown() {
    let optionsHtml = '<option value="">Tất cả nhà hàng</option>';
    uniqueAddress.forEach((address) => {
      optionsHtml += `<option value="${address}">${address}</option>`;
    });
    searchAddress.innerHTML = optionsHtml;
  }

  function renderList() {
    // Kiểm tra mảng rỗng
    if (nha_hang.length === 0) {
      restaurantList.innerHTML = "";
      noResult.classList.remove("d-none");
      toggleLimitContainer.classList.add("d-none");
      return;
    }

    // Có kết quả
    noResult.classList.add("d-none");
    let html = "";

    // Cắt mảng theo limit
    const displayList = nha_hang.slice(0, limit);

    displayList.forEach((item) => {
      html += `
            <div class="col-lg-3 mb-4">
                <div class="card border-0 shadow-sm rounded-4 overflow-hidden h-100">
                    <img src="${item.hinh_anh}" class="card-img-top" style="height: 200px; object-fit: cover" />
                    <div class="card-body d-flex flex-column">
                        <div class="d-flex justify-content-between mb-2">
                            <p class="fw-semibold mb-0 text-truncate" title="${item.ten_nha_hang}">${item.ten_nha_hang}</p>
                            <span class="fw-semibold text-warning ms-2 flex-shrink-0">4.9 ⭐</span>
                        </div>
                        <p class="text-muted small mb-2">
                            <i class="fa-solid fa-location-dot text-danger"></i> ${item.dia_chi}
                        </p>
                        <p class="text-muted small flex-grow-1">${item.mo_ta || ""}</p>
                        <div class="d-flex justify-content-between align-items-center mt-3">
                            <p class="fw-bold text-secondary mb-0">${formatCurrency(item.gia_tien)} đ</p>
                            <a href="nha-hang-chi-tiet.html?id=${item.id}" class="btn btn-primary btn-sm rounded-pill px-3">
                                Chi Tiết
                            </a>
                        </div>
                    </div>
                </div>
            </div>`;
    });

    restaurantList.innerHTML = html;

    // Xử lý nút Xem thêm / Thu gọn
    if (nha_hang.length > 8) {
      toggleLimitContainer.classList.remove("d-none");
      toggleLimitBtn.textContent =
        limit < nha_hang.length ? "Xem thêm" : "Thu gọn";
    } else {
      toggleLimitContainer.classList.add("d-none");
    }
  }

  function renderSlider() {
    let html = "";
    all_nha_hang.forEach((item) => {
      html += `
            <div class="col-8 col-sm-6 col-md-4 col-lg-3 p-0" style="min-width: 250px;">
                <div class="card border-0 shadow-sm rounded-4 h-100 mx-2">
                    <img src="${item.hinh_anh}" class="rounded-top-4" style="height: 150px; object-fit: cover" />
                    <div class="card-body">
                        <p class="fw-bold text-truncate" title="${item.ten_nha_hang}">${item.ten_nha_hang}</p>
                        <p class="text-muted small text-truncate">
                            <i class="fa-solid fa-location-dot text-danger"></i> ${item.dia_chi}
                        </p>
                        <div class="d-flex justify-content-between align-items-center mt-3">
                            <p class="text-secondary fw-bold mb-0">${formatCurrency(item.gia_tien)} đ</p>
                            <a href="nha-hang-chi-tiet.html?id=${item.id}" class="btn btn-primary btn-sm rounded-pill px-3">
                                Chi Tiết
                            </a>
                        </div>
                    </div>
                </div>
            </div>`;
    });
    sliderContainer.innerHTML = html;
  }

  // ================= XỬ LÝ SỰ KIỆN LỌC =================
  function executeSearch() {
    const ten = removeVietnamese(searchName.value.trim());
    const diaChi = removeVietnamese(searchAddress.value.trim());

    nha_hang = all_nha_hang.filter((item) => {
      const itemTen = removeVietnamese(item.ten_nha_hang);
      const itemDiaChi = removeVietnamese(item.dia_chi);

      const matchTen = itemTen.includes(ten);
      const matchDiaChi = diaChi ? itemDiaChi.includes(diaChi) : true;

      return matchTen && matchDiaChi;
    });

    limit = 8; // Reset lại limit mỗi khi tìm kiếm
    renderList();
  }

  // ================= GÁN EVENTS =================
  searchName.addEventListener("keyup", executeSearch);
  searchAddress.addEventListener("change", executeSearch);

  toggleLimitBtn.addEventListener("click", () => {
    if (limit < nha_hang.length) {
      limit += 8;
    } else {
      limit = 8;
    }
    renderList();
  });

  btnScrollLeft.addEventListener("click", () => {
    sliderContainer.scrollLeft -= 300;
  });

  btnScrollRight.addEventListener("click", () => {
    sliderContainer.scrollLeft += 300;
  });

  // ================= CHẠY KHỞI TẠO =================
  loadData();
});
