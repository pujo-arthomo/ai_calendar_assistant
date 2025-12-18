// ================================
// CONFIGURATION
// ================================
const CONFIG = {
  findAvailability: 'https://pujo-arthomo-2.app.n8n.cloud/webhook/find-availability',
  bookSlot: 'https://pujo-arthomo-2.app.n8n.cloud/webhook/book-slot',
  cancelBooking: 'https://pujo-arthomo-2.app.n8n.cloud/webhook/cancel-booking'
};

let selectedSlot = null;

// ================================
// UTIL: SHORT BOOKING ID (4–5 char)
// ================================
function shortBookingId(eventId) {
  if (!eventId) return '-';
  return eventId.slice(0, 5).toUpperCase();
}

// ================================
// FIND AVAILABILITY
// ================================
async function fetchAvailability() {
  const startDate = document.getElementById('startDate').value;
  const endDate = document.getElementById('endDate').value;

  if (!startDate || !endDate) {
    alert('Please select start and end date');
    return;
  }

  const res = await fetch(CONFIG.findAvailability, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      startDate,
      endDate,
      useAI: true
    })
  });

  const data = await res.json();

  document.getElementById('results').classList.remove('hidden');
  document.getElementById('booking').classList.add('hidden');

  document.getElementById('aiSummary').innerText = data.aiSummary || '';

  const list = document.getElementById('slotList');
  list.innerHTML = '';

  data.allSlots.forEach(slot => {
    const li = document.createElement('li');
    li.innerText = `${slot.date} • ${slot.time} (${slot.dayOfWeek})`;
    li.onclick = () => selectSlot(li, slot);
    list.appendChild(li);
  });
}

// ================================
// SELECT SLOT
// ================================
function selectSlot(element, slot) {
  document.querySelectorAll('#slotList li')
    .forEach(li => li.classList.remove('selected'));

  element.classList.add('selected');
  selectedSlot = slot;

  document.getElementById('booking').classList.remove('hidden');
}

// ================================
// BOOK SLOT
// ================================
async function bookSlot() {
  if (!selectedSlot) {
    alert('Please select a slot first');
    return;
  }

  const guestName = document.getElementById('guestName').value.trim();
  const guestEmail = document.getElementById('guestEmail').value.trim();
  const meetingDescription =
    document.getElementById('meetingDescription')?.value.trim();

  if (!guestName || !guestEmail) {
    alert('Please enter name and email');
    return;
  }

  const res = await fetch(CONFIG.bookSlot, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      slotStart: selectedSlot.start,
      slotEnd: selectedSlot.end,

      guestName,
      guestEmail,

      meetingTitle: `Meeting with ${guestName}`,
      meetingDescription:
        meetingDescription ||
        `Meeting with ${guestName} – Scheduled via AI Calendar Assistant`,

      timezone: 'Asia/Jakarta'
    })
  });

  const data = await res.json();

  if (!data.success) {
    alert(data.message || 'Booking failed');
    return;
  }

  const eventId = data.booking?.eventId || data.eventId;
  const shortId = shortBookingId(eventId);

  alert(
    `Booking successful 🎉\n\n` +
    `Booking ID: ${shortId}\n` +
    `Guest: ${guestName}\n` +
    `Time: ${selectedSlot.date} ${selectedSlot.time}`
  );
}

// ================================
// CANCEL BOOKING
// ================================
async function cancelBooking() {
  const eventId = document.getElementById('cancelEventId').value.trim();

  if (!eventId) {
    alert('Please enter Booking / Event ID');
    return;
  }

  const res = await fetch(CONFIG.cancelBooking, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      eventId
    })
  });

  const data = await res.json();
  alert(data.message || 'Booking cancelled');
}
