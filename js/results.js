function getQueryParams() {
    return Object.fromEntries(new URLSearchParams(window.location.search));
}

function formatPrice(value) {
    return value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".") + " đ";
}

function normalizeString(value) {
    return value ? value.toString().trim().toLowerCase().normalize("NFC") : "";
}

function loadSeatBookings() {
    return JSON.parse(localStorage.getItem('xn_seat_bookings') || '{}');
}

function saveSeatBookings(bookings) {
    localStorage.setItem('xn_seat_bookings', JSON.stringify(bookings));
}

function getSeatsForTrip(tripId) {
    var seatDatabase = window.seatDatabase || [];
    var tripSeats = seatDatabase.find(function(item) {
        return item.tripId === tripId;
    });
    if (!tripSeats) {
        return [];
    }
    var bookings = loadSeatBookings();
    var bookedForTrip = bookings[tripId] || [];
    return tripSeats.seats.map(function(seat) {
        return {
            label: seat.label,
            status: bookedForTrip.includes(seat.label) ? 'booked' : seat.status
        };
    });
}

function getAvailableSeatsCount(tripId, trip) {
    var seats = getSeatsForTrip(tripId);
    if (seats.length) {
        return seats.filter(function(seat) {
            return seat.status === 'available';
        }).length;
    }
    return trip.seatsAvailable || 0;
}

function renderResult(trip) {
    return `
    <div class="result-card">
      <div class="d-flex justify-content-between align-items-start mb-3">
        <div>
          <h5>${trip.from} → ${trip.to}</h5>
          <p class="mb-1"><strong>Giờ đi:</strong> ${trip.departureTime}</p>
        </div>
        <span class="badge bg-warning text-dark">${trip.availableSeats} vé trống</span>
      </div>
      <div class="result-details">
        <div><strong>Giá vé:</strong> ${formatPrice(trip.price)}</div>
        <div><strong>Xe:</strong> ${trip.busName} (${trip.busType})</div>
        <div><strong>Tiện ích:</strong> ${trip.features}</div>
        <div><strong>Ngày:</strong> ${trip.date}</div>
      </div>
      <div class="text-end mt-3">
        <button class="btn btn-select" data-trip-id="${trip.id}">Chọn chỗ</button>
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
    summary.textContent = `Tìm chuyến từ ${from} đến ${to}${date ? ' vào ngày ' + date : ''}.`;
}

function updateSeatModalText(trip, availableCount) {
    var seatModalSubtitle = document.getElementById('seatModalSubtitle');
    if (availableCount === 0) {
        seatModalSubtitle.textContent = 'Chuyến này đã hết chỗ trống. Vui lòng chọn chuyến khác.';
    } else {
        seatModalSubtitle.textContent = `Chọn một ghế trống trong chuyến ${trip.from} → ${trip.to}. ${availableCount} ghế trống còn lại.`;
    }
}

function renderSeatGrid(tripId) {
    var seatGrid = document.getElementById('seatGrid');
    seatGrid.innerHTML = '';
    var seats = getSeatsForTrip(tripId);
    seats.forEach(function(seat) {
        var button = document.createElement('button');
        button.type = 'button';
        button.className = 'seat-item';
        button.textContent = seat.label;
        button.dataset.seatLabel = seat.label;
        if (seat.status === 'booked') {
            button.classList.add('booked');
            button.disabled = true;
        } else {
            button.addEventListener('click', function() {
                document.querySelectorAll('.seat-item').forEach(function(item) {
                    item.classList.remove('selected');
                });
                button.classList.add('selected');
                var confirm = document.getElementById('confirmSeatBtn');
                confirm.disabled = false;
                confirm.dataset.selectedSeat = seat.label;
            });
        }
        seatGrid.appendChild(button);
    });
}

function openSeatModal(trip) {
    var seatModalTitle = document.getElementById('seatModalTitle');
    var confirmSeatBtn = document.getElementById('confirmSeatBtn');

    seatModalTitle.textContent = `Chọn ghế cho chuyến ${trip.from} → ${trip.to}`;
    confirmSeatBtn.disabled = true;
    confirmSeatBtn.dataset.tripId = trip.id;
    confirmSeatBtn.dataset.selectedSeat = '';

    var availableCount = getAvailableSeatsCount(trip.id, trip);
    updateSeatModalText(trip, availableCount);
    renderSeatGrid(trip.id);

    var seatModal = new bootstrap.Modal(document.getElementById('seatModal'));
    seatModal.show();
}

function bookSeat(tripId, seatLabel) {
    var bookings = loadSeatBookings();
    bookings[tripId] = bookings[tripId] || [];
    if (!bookings[tripId].includes(seatLabel)) {
        bookings[tripId].push(seatLabel);
    }
    saveSeatBookings(bookings);
}

function updateResultsAfterBooking(trips) {
    trips.forEach(function(trip) {
        trip.availableSeats = getAvailableSeatsCount(trip.id, trip);
    });
    var availableTrips = trips.filter(function(trip) {
        return trip.availableSeats > 0;
    });
    if (!availableTrips.length) {
        showNoResults();
        return;
    }
    document.getElementById('results').innerHTML = availableTrips.map(renderResult).join('');
    bindSeatButtons();
}

function bindSeatButtons() {
    document.querySelectorAll('.btn-select').forEach(function(button) {
        button.addEventListener('click', function() {
            var tripId = Number(button.dataset.tripId);
            var trip = window.currentTrips.find(function(item) {
                return item.id === tripId;
            });
            if (trip) {
                openSeatModal(trip);
            }
        });
    });
}

window.addEventListener('DOMContentLoaded', function() {
    var params = getQueryParams();
    var from = (params.from || '').trim();
    var to = (params.to || '').trim();
    var date = (params.date || '').trim();

    if (!from || !to) {
        document.getElementById('searchSummary').textContent = 'Vui lòng quay lại và nhập thông tin chuyến đi.';
        showNoResults();
        return;
    }

    updateSummary(from, to, date);

    var normalizedFrom = normalizeString(from);
    var normalizedTo = normalizeString(to);

    Promise.all([
        fetch('database/trips.json').then(function(response) {
            if (!response.ok) {
                throw new Error('Không thể tải dữ liệu chuyến xe.');
            }
            return response.json();
        }),
        fetch('database/seats.json').then(function(response) {
            if (!response.ok) {
                throw new Error('Không thể tải dữ liệu ghế.');
            }
            return response.json();
        })
    ])
    .then(function(results) {
        var trips = results[0];
        window.seatDatabase = results[1];

        var filtered = trips.filter(function(trip) {
            return normalizeString(trip.from) === normalizedFrom
                && normalizeString(trip.to) === normalizedTo
                && (!date || trip.date === date);
        }).map(function(trip) {
            return Object.assign({}, trip, {
                availableSeats: getAvailableSeatsCount(trip.id, trip)
            });
        }).filter(function(trip) {
            return trip.availableSeats > 0;
        });

        window.currentTrips = filtered;

        if (!filtered.length) {
            showNoResults();
            return;
        }

        document.getElementById('results').innerHTML = filtered.map(renderResult).join('');
        bindSeatButtons();
    })
    .catch(function(error) {
        document.getElementById('results').innerHTML = `
          <div class="alert alert-danger" role="alert">
            ${error.message}
          </div>`;
    });

    document.getElementById('confirmSeatBtn').addEventListener('click', function() {
        var tripId = Number(this.dataset.tripId);
        var seatLabel = this.dataset.selectedSeat;
        if (!seatLabel) {
            return;
        }
        bookSeat(tripId, seatLabel);
        var trip = window.currentTrips.find(function(item) {
            return item.id === tripId;
        });
        if (trip) {
            trip.availableSeats = getAvailableSeatsCount(trip.id, trip);
        }
        alert(`Đặt ghế ${seatLabel} thành công!`);
        updateResultsAfterBooking(window.currentTrips);
        var modalElement = document.getElementById('seatModal');
        var modalInstance = bootstrap.Modal.getInstance(modalElement);
        if (modalInstance) {
            modalInstance.hide();
        }
    });
});
