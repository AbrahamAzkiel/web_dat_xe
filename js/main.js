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