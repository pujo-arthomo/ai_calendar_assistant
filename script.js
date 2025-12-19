// ================================
// CONFIG
// ================================
const CONFIG = {
  findAvailability: 'https://YOUR-N8N-URL/webhook/find-availability',
  bookSlot: 'https://YOUR-N8N-URL/webhook/book-slot'
};

let selectedSlot = null;

// ================================
// FETCH AVAILABILITY
// ================================
async function fetchAvailability() {
  const date = document.getElementById('startDate').value;
  if (!date) {
    alert('Please select a date');
    return;
  }

  const res = await fetch(CONFIG.findAvailability, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      startDate: date,
      endDate: date
    })
  });

  const data = await res.json();

  document.getElementById('aiSummary').innerText =
    data.aiSummary || '';

  const list = document.getElementById('slotList');
  list.innerHTML = '';
  document.getElementById('booking').classList.add('hidden');

  data.allSlots.forEach(slot => {
    const li = document.createElement('li');
    li.innerText = `${slot.time} (${slot.dayOfWeek})`;
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
    alert('Please select a slot');
    return;
  }

  const guestName = document.getElementById('guestName').value.trim();
  const guestEmail = document.getElementById('guestEmail').value.trim();
  const meetingDescription =
    document.getElementById('meetingDescription').value.trim();

  if (!guestName || !guestEmail) {
    alert('Please fill meeting name and email');
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
        `Meeting with ${guestName}`,
      timezone: 'Asia/Jakarta'
    })
  });

  const data = await res.json();
  const result = data.booking || data;

  if (!data.success && !result) {
    alert('Booking failed');
    return;
  }

  const bookingId =
    data.bookingId ||
    result.shortId ||
    result.eventId?.slice(0, 5).toUpperCase();

  const resultDiv = document.getElementById('result');
  resultDiv.classList.remove('hidden');
  resultDiv.innerHTML = `
    <h2>✅ Booking Confirmed</h2>
    <p><strong>Booking ID:</strong> ${bookingId}</p>
    <p><strong>Meeting With:</strong> ${guestName}</p>
    <p><strong>Description:</strong> ${meetingDescription}</p>
    <p>Please manage this meeting directly in Google Calendar.</p>
  `;
}
