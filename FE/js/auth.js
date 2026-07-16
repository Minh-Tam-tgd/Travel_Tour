const loginForm = document.getElementById('loginForm');
const registerForm = document.getElementById('registerForm');

function showMessage(message) {
  window.alert(message);
}

if (loginForm) {
  loginForm.addEventListener('submit', function (event) {
    event.preventDefault();
    const email = loginForm.email.value.trim();
    const password = loginForm.password.value.trim();

    if (!email || !password) {
      showMessage('Vui lòng nhập đầy đủ email và mật khẩu.');
      return;
    }

    fetch('http://127.0.0.1:5000/api/client/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    })
      .then(res => res.json())
      .then(data => {
        if (data.status === 'success') {
          const user = data.data; // Lấy toàn bộ thông tin user trả về từ Backend

          showMessage(`Đăng nhập thành công với email: ${email}`);
          // KIỂM TRA ROLE ĐỂ PHÂN LUỒNG CHUYỂN HƯỚNG
          if (user.role === 'admin') {
            localStorage.setItem('admin_user', JSON.stringify(user));
            // Lưu ý: Cập nhật lại đường dẫn này cho khớp với thư mục chứa file dashboard của bạn
            window.location.href = '../Admin/dashboard.html';
          } else {
            localStorage.setItem('user', JSON.stringify(user));
            // Chuyển về trang chủ nếu là khách hàng bình thường
            window.location.href = './homepage.html';
          }

        } else {
          showMessage(data.message || 'Đăng nhập thất bại');
        }
      })
      .catch(err => showMessage('Lỗi kết nối server'));
  });
}

if (registerForm) {
  registerForm.addEventListener('submit', function (event) {
    event.preventDefault();
    const name = registerForm.name.value.trim();
    const email = registerForm.email.value.trim();
    const password = registerForm.password.value.trim();
    const confirmPassword = registerForm.confirmPassword.value.trim();

    if (!name || !email || !password || !confirmPassword) {
      showMessage('Vui lòng điền đầy đủ thông tin đăng ký.');
      return;
    }

    if (password.length < 6) {
      showMessage('Mật khẩu phải có ít nhất 6 ký tự.');
      return;
    }

    if (password !== confirmPassword) {
      showMessage('Mật khẩu xác nhận không khớp.');
      return;
    }

    fetch('http://127.0.0.1:5000/api/client/auth/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, email, password })
    })
      .then(res => res.json())
      .then(data => {
        if (data.status === 'success') {
          showMessage(`Đăng ký thành công cho: ${name}`);
          registerForm.reset();
          window.location.href = './homepage.html';
        } else {
          showMessage(data.message || 'Đăng ký thất bại');
        }
      })
      .catch(err => showMessage('Lỗi kết nối server'));
  });
}
