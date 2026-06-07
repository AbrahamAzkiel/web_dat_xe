function getQueryParams() {
    return Object.fromEntries(new URLSearchParams(window.location.search));
}

function formatPrice(value) {
    return value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".") + " đ";
}

function renderResult(trip) {
    return `
    <div class="result-card">
      <div class="d-flex justify-content-between align-items-start mb-3">
        <div>
          <h5>${trip.from} → ${trip.to}</h5>
          <p class="mb-1"><strong>Giờ đi:</strong> ${trip.departureTime}</p>
        </div>
        <span class="badge bg-warning text-dark">${trip.seatsAvailable} vé trống</span>
      </div>
      <div class="result-details">
        <div><strong>Giá vé:</strong> ${formatPrice(trip.price)}</div>
        <div><strong>Xe:</strong> ${trip.busName} (${trip.busType})</div>
        <div><strong>Tiện ích:</strong> ${trip.features}</div>
        <div><strong>Ngày:</strong> ${trip.date}</div>
      </div>
      <div class="text-end mt-3">
        <button class="btn btn-select">Chọn chuyến</button>
      </div>
    </div>`;
}

function showNoResults() {
    document.getElementById("results").innerHTML = `
      <div class="alert alert-warning" role="alert">
        Không tìm thấy chuyến phù hợp. Vui lòng thử lại với lựa chọn khác.
      </div>`;
}

function updateSummary(from, to, date) {
    var summary = document.getElementById("searchSummary");
    summary.textContent = `Tìm chuyến từ ${from} đến ${to} vào ngày ${date}.`;
}

window.addEventListener("DOMContentLoaded", function() {
    var params = getQueryParams();
    var from = params.from || "";
    var to = params.to || "";
    var date = params.date || "";

    if (!from || !to || !date) {
        document.getElementById("searchSummary").textContent = "Vui lòng quay lại và nhập thông tin chuyến đi.";
        showNoResults();
        return;
    }

    updateSummary(from, to, date);

    fetch("database/trips.json")
        .then(function(response) {
            if (!response.ok) {
                throw new Error("Không thể tải dữ liệu chuyến xe.");
            }
            return response.json();
        })
        .then(function(trips) {
            var filtered = trips.filter(function(trip) {
                return trip.from.toLowerCase() === from.toLowerCase()
                    && trip.to.toLowerCase() === to.toLowerCase()
                    && trip.date === date
                    && trip.seatsAvailable > 0;
            });

            if (!filtered.length) {
                showNoResults();
                return;
            }

            document.getElementById("results").innerHTML = filtered.map(renderResult).join("");
        })
        .catch(function(error) {
            document.getElementById("results").innerHTML = `
              <div class="alert alert-danger" role="alert">
                ${error.message}
              </div>`;
        });
});
