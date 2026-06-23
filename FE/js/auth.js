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

    showMessage(`Đăng nhập thành công với email: ${email}`);
    loginForm.reset();
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

    showMessage(`Đăng ký thành công cho: ${name}`);
    registerForm.reset();
  });
}
