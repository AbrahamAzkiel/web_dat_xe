var searchForm = document.getElementById("searchForm");
if (searchForm) {
    searchForm.addEventListener("submit", function(e) {
        let from = document.getElementById("from").value.trim();
        let to = document.getElementById("to").value.trim();
        let date = document.getElementById("date").value;

        if (!from || !to || !date) {
            alert("Vui lòng nhập đủ Điểm đi, Điểm đến và Ngày đi.");
            e.preventDefault();
            return;
        }

        if (from.toLowerCase() === to.toLowerCase()) {
            alert("Điểm đi và Điểm đến không được giống nhau.");
            e.preventDefault();
        }
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
document.getElementById("swapBtn").onclick = function() {
    let from = document.getElementById("from");
    let to = document.getElementById("to");

    let temp = from.value;
    from.value = to.value;
    to.value = temp;
};