const tourList = document.getElementById("tourList");
const noResultMessage = document.getElementById("noResultMessage");

const searchForm = document.getElementById("searchForm");
const keywordInput = document.getElementById("keywordInput");
const startInput = document.getElementById("startInput");
const destinationInput = document.getElementById("destinationInput");
const dateInput = document.getElementById("dateInput");

let tours = [];

/* Dữ liệu tạm nếu API chưa chạy */
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
    ten_tour: "Tour Đà Nẵng - Hội An",
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
    ten_tour: "Tour Nha Trang biển đảo",
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
    ten_tour: "Tour Sapa săn mây",
    hinh_anh: "../../assets/images/anh1.jpg",
    phan_tram: 25,
    ngay_khoi_hanh: "2026-07-12",
    gia_tien: 3690000,
    gia_tien_cu: 4900000,
    thoi_gian: "2N1Đ",
    diem_di: "Hà Nội",
    diem_den: "Sapa",
  },
];

function formatMoney(number) {
  return (number || 0).toLocaleString("vi-VN") + "đ";
}

function renderTours(list) {
  tourList.innerHTML = "";

  if (!list || list.length === 0) {
    noResultMessage.classList.remove("d-none");
    return;
  }

  noResultMessage.classList.add("d-none");

  list.forEach((tour) => {
    const col = document.createElement("div");
    col.className = "col-md-6 d-flex";

    col.innerHTML = `
      <div class="tour-card d-flex">

        <div class="tour-image position-relative">
          <img src="${tour.hinh_anh}" alt="${tour.ten_tour}">
          <span class="discount-badge">- ${tour.phan_tram || 0}%</span>
          <span class="heart-icon"><i class="fa-solid fa-heart"></i></span>
        </div>

        <div class="tour-info ps-3 d-flex flex-column justify-content-between">

          <div>
            <p class="tour-from">
              <i class="fa-solid fa-location-dot"></i>
              Khởi hành từ: ${tour.diem_di || tour.ngay_khoi_hanh || "Đang cập nhật"}
            </p>

            <h5 class="fw-bold tour-title">
              <a href="chi-tiet-tour.html?id=${tour.id}" class="text-dark text-decoration-none">
                ${tour.ten_tour}
              </a>
            </h5>

            <div class="tour-rating mb-1">
              <i class="fa-regular fa-star"></i>
              <i class="fa-regular fa-star"></i>
              <i class="fa-regular fa-star"></i>
              <i class="fa-regular fa-star"></i>
              <i class="fa-regular fa-star"></i>
            </div>
          </div>

          <div>
            <p class="tour-price">
              <span class="new-price">${formatMoney(tour.gia_tien)}</span>
              <span class="old-price">${formatMoney(tour.gia_tien_cu)}</span>
            </p>

            <p class="tour-duration">
              <i class="fa-regular fa-clock"></i>
              Thời gian: ${tour.thoi_gian || "1N"}
            </p>
          </div>

        </div>

      </div>
    `;

    tourList.appendChild(col);
  });
}

function filterTours() {
  document.getElementById("tourList").scrollIntoView({
    behavior: "smooth",
    block: "start",
  });
  const keyword = keywordInput.value.trim().toLowerCase();
  const start = startInput.value.trim().toLowerCase();
  const destination = destinationInput.value.trim().toLowerCase();
  const date = dateInput.value;

  return tours.filter((tour) => {
    const name = (tour.ten_tour || "").toLowerCase();
    const startPlace = (tour.diem_di || "").toLowerCase();
    const destinationPlace = (tour.diem_den || "").toLowerCase();
    const departureDate = tour.ngay_khoi_hanh || "";

    const matchKeyword = keyword
      ? name.includes(keyword) || destinationPlace.includes(keyword)
      : true;

    const matchStart = start ? startPlace.includes(start) : true;

    const matchDestination = destination
      ? destinationPlace.includes(destination) || name.includes(destination)
      : true;

    const matchDate = date ? departureDate >= date : true;

    return matchKeyword && matchStart && matchDestination && matchDate;
  });
}

function loadTours() {
  fetch("http://127.0.0.1:5000/api/client/tour")
    .then((res) => res.json())
    .then((res) => {
      tours = res.data || demoTours;
      renderTours(tours);
    })
    .catch((err) => {
      console.log("API chưa chạy, dùng dữ liệu demo:", err);
      tours = demoTours;
      renderTours(tours);
    });
}

searchForm.addEventListener("submit", function (event) {
  event.preventDefault();
  renderTours(filterTours());
});

const experiences = [
  { icon: "fa-solid fa-umbrella-beach", label: "Nghỉ dưỡng" },
  { icon: "fa-solid fa-mountain-sun", label: "Cáp treo" },
  { icon: "fa-solid fa-ship", label: "Du thuyền" },
  { icon: "fa-solid fa-mountain", label: "Mạo hiểm" },
  { icon: "fa-solid fa-compass", label: "Khám phá" },
  { icon: "fa-solid fa-person-swimming", label: "Dưới nước" },
  { icon: "fa-solid fa-utensils", label: "Ẩm thực" },
  { icon: "fa-solid fa-campground", label: "Cắm trại" },
];

const experienceList = document.getElementById("experienceList");

experiences.forEach((item) => {
  experienceList.innerHTML += `
    <div class="col-6 col-md-3">
      <div class="exp-card">
        <i class="${item.icon} exp-icon"></i>
      </div>
      <p class="exp-label">${item.label}</p>
    </div>
  `;
});

loadTours();
