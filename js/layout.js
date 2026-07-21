/**
 * layout.js — Quản lý logic UI cho Header & Footer (Menu, Scroll, Auth)
 * Tự động load CSS, FontAwesome và layout.html dựa trên relative path của chính file JS
 */

(function () {
  "use strict";

  /* ──────────────────────────────────────────────
      DETECT SCRIPT DIR (Lấy đường dẫn thư mục chứa file JS)
  ────────────────────────────────────────────── */
  const scriptEl = document.currentScript;
  const scriptSrc = scriptEl ? scriptEl.src : "";
  const scriptDir = scriptSrc
    ? scriptSrc.substring(0, scriptSrc.lastIndexOf("/") + 1)
    : "";

  /* ──────────────────────────────────────────────
      INJECT CSS VÀ FONT AWESOME
  ────────────────────────────────────────────── */
  function injectCSS() {
    if (document.getElementById("layout-css")) return;
    const link = document.createElement("link");
    link.id = "layout-css";
    link.rel = "stylesheet";
    // Dùng logic gốc của mày: lùi 1 cấp từ thư mục js -> FE/ -> vào assets/css
    link.href = scriptDir + "../assets/css/layout.css";
    document.head.insertBefore(link, document.head.firstChild);
  }

  function injectFontAwesome() {
    if (document.querySelector('link[href*="font-awesome"]')) return;
    const link = document.createElement("link");
    link.rel = "stylesheet";
    link.href =
      "https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css";
    document.head.appendChild(link);
  }

  /* ──────────────────────────────────────────────
      SET ACTIVE MENU (Highlight link trang hiện tại)
  ────────────────────────────────────────────── */
  function setActiveMenu() {
    const currentFile =
      window.location.pathname.split("/").pop() || "homepage.html";

    const desktopLinks = document.querySelectorAll("#nav-desktop-links a");
    const mobileLinks = document.querySelectorAll(
      "#nav-mobile-menu a:not(.nav-btn-outline):not(.nav-btn-solid)",
    );

    desktopLinks.forEach((link) => {
      if (link.getAttribute("href") === currentFile) {
        link.classList.add("active");
      }
    });

    mobileLinks.forEach((link) => {
      if (link.getAttribute("href") === currentFile) {
        link.classList.add("active");
      }
    });
  }

  /* ──────────────────────────────────────────────
      SET CURRENT YEAR CHO FOOTER
  ────────────────────────────────────────────── */
  function setCurrentYear() {
    const yearSpan = document.getElementById("current-year");
    if (yearSpan) {
      yearSpan.textContent = new Date().getFullYear();
    }
  }

  /* ──────────────────────────────────────────────
      SCROLL EFFECT — Header shadow & ẩn/hiện
  ────────────────────────────────────────────── */
  function initScrollEffect() {
    const header = document.getElementById("site-header");
    if (!header) return;

    let lastScrollY = window.scrollY;

    const onScroll = () => {
      const currentScrollY = window.scrollY;

      header.classList.toggle("scrolled", currentScrollY > 20);

      if (currentScrollY > lastScrollY && currentScrollY > 120) {
        header.classList.add("header-hidden");
      } else {
        header.classList.remove("header-hidden");
      }

      lastScrollY = currentScrollY;
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
  }

  /* ──────────────────────────────────────────────
      HAMBURGER TOGGLE (Mobile Menu)
  ────────────────────────────────────────────── */
  function initHamburger() {
    const btn = document.getElementById("nav-hamburger");
    const menu = document.getElementById("nav-mobile-menu");
    if (!btn || !menu) return;

    btn.addEventListener("click", () => {
      const isOpen = menu.classList.toggle("open");
      btn.classList.toggle("open", isOpen);
      btn.setAttribute("aria-expanded", isOpen);
    });

    menu.querySelectorAll("a").forEach((link) => {
      link.addEventListener("click", () => {
        menu.classList.remove("open");
        btn.classList.remove("open");
      });
    });

    document.addEventListener("click", (e) => {
      if (!btn.contains(e.target) && !menu.contains(e.target)) {
        menu.classList.remove("open");
        btn.classList.remove("open");
      }
    });
  }

  /* ──────────────────────────────────────────────
      AUTH STATE — Ẩn/hiện nút login/register dựa trên User
  ────────────────────────────────────────────── */
  function updateAuthState() {
    const user = (() => {
      try {
        return JSON.parse(localStorage.getItem("user"));
      } catch {
        return null;
      }
    })();

    const actionsDesktop = document.getElementById("nav-actions");

    if (actionsDesktop && user) {
      actionsDesktop.innerHTML = `
        <span style="font-size:14px;font-weight:600;color:var(--text-secondary)">
          Xin chào, <strong style="color:var(--primary)">${user.name || "bạn"}</strong>
        </span>
        <a href="booked.html" class="nav-avatar" title="Lịch sử đặt chỗ" style="text-decoration:none; display:inline-flex; align-items:center; justify-content:center;">
          <i class="fa-solid fa-clock-rotate-left"></i>
        </a>
        <a href="#" id="btnLogoutDesktop" class="nav-btn-outline" style="padding: 6px 12px; margin-left: 10px; font-size: 14px;">
          Đăng xuất
        </a>
      `;
      document.getElementById('btnLogoutDesktop').addEventListener('click', (e) => {
          e.preventDefault();
          localStorage.removeItem('user');
          window.location.reload();
      });
    }

    const actionsMobile = document.querySelector(".nav-mobile-actions");
    if (actionsMobile && user) {
      actionsMobile.innerHTML = `
        <a href="booked.html" class="nav-btn-outline" style="flex:1;justify-content:center; margin-bottom: 8px;">
          <i class="fa-solid fa-clock-rotate-left"></i> Đã đặt
        </a>
        <a href="#" id="btnLogoutMobile" class="nav-btn-solid" style="flex:1;justify-content:center;">
          <i class="fa-solid fa-right-from-bracket"></i> Đăng xuất
        </a>
      `;
      document.getElementById('btnLogoutMobile').addEventListener('click', (e) => {
          e.preventDefault();
          localStorage.removeItem('user');
          window.location.reload();
      });
    }
  }

  /* ──────────────────────────────────────────────
      MAIN INIT - TỰ ĐỘNG LOAD CSS, HTML, LOGIC
  ────────────────────────────────────────────── */
  function init() {
    // 1. Chèn CSS & FontAwesome
    injectCSS();
    injectFontAwesome();

    // 2. Fetch layout.html (Cũng dùng logic scriptDir cho chắc kèo)
    // lùi 1 cấp từ thư mục js -> FE/ -> vào components/
    const layoutPath = scriptDir + "../components/layout.html";

    fetch(layoutPath)
      .then((response) => {
        if (!response.ok) throw new Error("Không thể tải file layout.html");
        return response.text();
      })
      .then((html) => {
        const parser = new DOMParser();
        const doc = parser.parseFromString(html, "text/html");

        const header = doc.querySelector("#site-header");
        const mobileMenu = doc.querySelector("#nav-mobile-menu");
        const footer = doc.querySelector("#site-footer");

        if (header) document.body.insertAdjacentElement("afterbegin", header);
        if (mobileMenu && header)
          header.insertAdjacentElement("afterend", mobileMenu);
        if (footer) document.body.insertAdjacentElement("beforeend", footer);

        // 3. Khởi tạo logic UI sau khi HTML đã nằm trong DOM
        setActiveMenu();
        setCurrentYear();
        initScrollEffect();
        initHamburger();
        updateAuthState();
      })
      .catch((error) => {
        console.error("Lỗi khi load layout:", error);
      });
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
