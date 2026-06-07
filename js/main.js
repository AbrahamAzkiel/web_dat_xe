var searchForm = document.getElementById("searchForm");
if (searchForm) {
    searchForm.addEventListener("submit", function(e) {
        let from = document.getElementById("from").value.trim();
        let to = document.getElementById("to").value.trim();
        let date = document.getElementById("date").value.trim();

        if (!from || !to || !date) {
            alert("Vui lòng nhập đủ Điểm đi, Điểm đến và Ngày đi.");
            e.preventDefault();
            return;
        }

        if (from.toLowerCase() === to.toLowerCase()) {
            alert("Điểm đi và Điểm đến không được giống nhau.");
            e.preventDefault();
            return;
        }

        var datePattern = /^(?:([0-9]{1,2})[\/\-]([0-9]{1,2})[\/\-]([0-9]{4})|([0-9]{4})-([0-9]{2})-([0-9]{2}))$/;
        var match = date.match(datePattern);
        if (!match) {
            alert("Vui lòng nhập ngày theo định dạng Ngày/Tháng/Năm (ví dụ 10/06/2026). ");
            e.preventDefault();
            return;
        }

        if (match[4]) {
            // Định dạng ISO đã nhập trực tiếp
            date = match[4] + "-" + match[5] + "-" + match[6];
        } else {
            date = match[3] + "-" + match[2].padStart(2, "0") + "-" + match[1].padStart(2, "0");
        }

        var selectedDate = new Date(date);
        var today = new Date();
        today.setHours(0, 0, 0, 0);
        if (selectedDate < today) {
            alert("Vui lòng chọn ngày từ hôm nay trở đi.");
            e.preventDefault();
            return;
        }

        document.getElementById("date").value = date;
    });
}

// CONTACT FORM
document.getElementById("contactForm").addEventListener("submit", function(e) {
    let name = document.getElementById("cname").value;
    let email = document.getElementById("cemail").value;
    let msg = document.getElementById("cmsg").value;

    if (name.match(/\d/)) {
        alert("Tên không chứa số");
        e.preventDefault();
    }

    if (msg.length < 20) {
        alert("Nội dung >= 20 ký tự");
        e.preventDefault();
    }

    if (!email.includes("@")) {
        alert("Email không hợp lệ");
        e.preventDefault();
    }
});

// MODAL
document.getElementById("submitBtn").onclick = function() {
    alert("Đặt vé thành công!");
};

function setDatePickerMin() {
    var today = new Date();
    var year = today.getFullYear();
    var month = String(today.getMonth() + 1).padStart(2, '0');
    var day = String(today.getDate()).padStart(2, '0');
    var minDate = year + '-' + month + '-' + day;
    var datePicker = document.getElementById('datePicker');
    if (datePicker) {
        datePicker.min = minDate;
    }
}

function formatDateToDDMMYYYY(value) {
    var parts = value.split('-');
    if (parts.length !== 3) return value;
    return parts[2] + '/' + parts[1] + '/' + parts[0];
}

function formatDateToYYYYMMDD(value) {
    var parts = value.split(/[\/\-]/);
    if (parts.length !== 3) return value;
    if (parts[0].length === 4) {
        return value;
    }
    return parts[2] + '-' + parts[1].padStart(2, '0') + '-' + parts[0].padStart(2, '0');
}

document.getElementById('datePickerBtn').addEventListener('click', function() {
    var datePicker = document.getElementById('datePicker');
    if (datePicker) {
        setDatePickerMin();
        datePicker.click();
    }
});

document.getElementById('datePicker').addEventListener('change', function() {
    var value = this.value;
    if (value) {
        document.getElementById('date').value = formatDateToDDMMYYYY(value);
    }
});

document.querySelectorAll('.card-place').forEach(function(card) {
    card.addEventListener('click', function() {
        var from = card.dataset.from;
        var to = card.dataset.to;
        if (from && to) {
            window.location.href = `search-results.html?from=${encodeURIComponent(from)}&to=${encodeURIComponent(to)}`;
        }
    });
});

var serviceDescriptions = {
    'vé giường nằm': 'Chuyến xe giường nằm mang đến không gian rộng rãi, ghế êm ái, điều hòa và tiện ích cá nhân để bạn nghỉ ngơi thoải mái suốt hành trình.',
    'vé limousine': 'Xe limousine cao cấp với ghế da, wifi tốc độ cao, phục vụ nước uống miễn phí và không gian riêng tư cho chuyến đi sang trọng.',
    'xe hợp đồng': 'Xe hợp đồng linh hoạt cho nhóm hoặc gia đình, phục vụ lịch trình theo yêu cầu và đảm bảo chuyến đi an toàn, tiện lợi.'
};

document.querySelectorAll('.service-card').forEach(function(card) {
    card.addEventListener('click', function() {
        var serviceKey = card.dataset.service;
        var description = serviceDescriptions[serviceKey] || 'Thông tin dịch vụ đang được cập nhật.';
        document.getElementById('serviceTitle').textContent = serviceKey;
        document.getElementById('serviceDescription').textContent = description;
        var modalEl = document.getElementById('serviceModal');
        var serviceModal = new bootstrap.Modal(modalEl);
        serviceModal.show();
    });
});

document.getElementById("loginBtn").addEventListener('click', function() {
    var loginModal = new bootstrap.Modal(document.getElementById('loginModal'));
    loginModal.show();
});

document.getElementById('openRegisterLink').addEventListener('click', function() {
    var loginModal = bootstrap.Modal.getInstance(document.getElementById('loginModal'));
    if (loginModal) loginModal.hide();
    var registerModal = new bootstrap.Modal(document.getElementById('registerModal'));
    registerModal.show();
});

document.getElementById('openLoginLink').addEventListener('click', function() {
    var registerModal = bootstrap.Modal.getInstance(document.getElementById('registerModal'));
    if (registerModal) registerModal.hide();
    var loginModal = new bootstrap.Modal(document.getElementById('loginModal'));
    loginModal.show();
});

document.getElementById('forgotPasswordLink').addEventListener('click', function() {
    var loginModal = bootstrap.Modal.getInstance(document.getElementById('loginModal'));
    if (loginModal) loginModal.hide();
    var forgotModal = new bootstrap.Modal(document.getElementById('forgotModal'));
    forgotModal.show();
});

function getUsers() {
    return JSON.parse(localStorage.getItem('xn_users') || '[]');
}

function saveUsers(users) {
    localStorage.setItem('xn_users', JSON.stringify(users));
}

function showAlert(id, message) {
    var alert = document.getElementById(id);
    if (!alert) return;
    alert.textContent = message;
    alert.classList.remove('d-none');
}

function hideAlerts(ids) {
    ids.forEach(function(id) {
        var alert = document.getElementById(id);
        if (alert) {
            alert.classList.add('d-none');
        }
    });
}

document.getElementById('loginForm').addEventListener('submit', function(e) {
    e.preventDefault();
    hideAlerts(['loginError']);

    var username = document.getElementById('loginUsername').value.trim();
    var password = document.getElementById('loginPassword').value;

    if (!username || !password) {
        showAlert('loginError', 'Vui lòng nhập tài khoản và mật khẩu.');
        return;
    }

    var users = getUsers();
    var user = users.find(function(item) {
        return item.username === username;
    });

    if (!user || user.password !== password) {
        showAlert('loginError', 'Tài khoản hoặc mật khẩu không đúng.');
        return;
    }

    alert('Đăng nhập thành công!');
    var loginModal = bootstrap.Modal.getInstance(document.getElementById('loginModal'));
    if (loginModal) loginModal.hide();
});

document.getElementById('registerForm').addEventListener('submit', function(e) {
    e.preventDefault();
    hideAlerts(['registerError', 'registerSuccess']);

    var email = document.getElementById('registerEmail').value.trim();
    var username = document.getElementById('registerUsername').value.trim();
    var password = document.getElementById('registerPassword').value;
    var phone = document.getElementById('registerPhone').value.trim();
    var address = document.getElementById('registerAddress').value.trim();

    if (!email || !username || !password || !phone) {
        showAlert('registerError', 'Email, tài khoản, mật khẩu và số điện thoại là bắt buộc.');
        return;
    }

    if (!email.includes('@') || email.includes(' ')) {
        showAlert('registerError', 'Email không hợp lệ.');
        return;
    }

    if (!/^[A-Za-z0-9]+$/.test(username)) {
        showAlert('registerError', 'Tài khoản không được có ký tự đặc biệt hoặc dấu.');
        return;
    }

    var users = getUsers();
    if (users.some(function(item) { return item.username === username; })) {
        showAlert('registerError', 'Tài khoản đã tồn tại. Vui lòng chọn tài khoản khác.');
        return;
    }

    if (users.some(function(item) { return item.email === email; })) {
        showAlert('registerError', 'Email đã được sử dụng.');
        return;
    }

    if (!/^[0-9]{9,12}$/.test(phone)) {
        showAlert('registerError', 'Số điện thoại phải là số, từ 9 đến 12 chữ số.');
        return;
    }

    users.push({ email: email, username: username, password: password, phone: phone, address: address });
    saveUsers(users);

    showAlert('registerSuccess', 'Đăng ký thành công. Bạn có thể đăng nhập ngay.');
    document.getElementById('registerForm').reset();

    setTimeout(function() {
        var registerModal = bootstrap.Modal.getInstance(document.getElementById('registerModal'));
        if (registerModal) registerModal.hide();
        var loginModal = new bootstrap.Modal(document.getElementById('loginModal'));
        loginModal.show();
    }, 500);
});

document.getElementById('forgotForm').addEventListener('submit', function(e) {
    e.preventDefault();
    hideAlerts(['forgotError', 'forgotSuccess']);

    var email = document.getElementById('forgotEmail').value.trim();
    if (!email) {
        showAlert('forgotError', 'Vui lòng nhập email đã đăng ký.');
        return;
    }

    var users = getUsers();
    var user = users.find(function(item) {
        return item.email === email;
    });

    if (!user) {
        showAlert('forgotError', 'Email chưa được đăng ký.');
        return;
    }

    showAlert('forgotSuccess', 'Yêu cầu đã gửi. Vui lòng kiểm tra email để xác nhận.');
    document.getElementById('forgotForm').reset();
});

function getUsers() {
    return JSON.parse(localStorage.getItem('xn_users') || '[]');
}

function saveUsers(users) {
    localStorage.setItem('xn_users', JSON.stringify(users));
}

function initializeUserDatabase() {
    if (localStorage.getItem('xn_users') === null) {
        fetch('database/users.json')
            .then(function(response) {
                if (!response.ok) {
                    return [];
                }
                return response.json();
            })
            .then(function(data) {
                if (Array.isArray(data)) {
                    saveUsers(data);
                }
            })
            .catch(function() {
                saveUsers([]);
            });
    }
}

function showAlert(id, message) {
    var alert = document.getElementById(id);
    if (!alert) return;
    alert.textContent = message;
    alert.classList.remove('d-none');
}

function hideAlerts(ids) {
    ids.forEach(function(id) {
        var alert = document.getElementById(id);
        if (alert) {
            alert.classList.add('d-none');
        }
    });
}

initializeUserDatabase();

document.getElementById("swapBtn").onclick = function() {
    let from = document.getElementById("from");
    let to = document.getElementById("to");

    let temp = from.value;
    from.value = to.value;
    to.value = temp;
};