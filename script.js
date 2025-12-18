const CONFIG = {
  availability: 'https://pujo-arthomo-2.app.n8n.cloud/webhook/find-availability',
  bookSlot: 'https://pujo-arthomo-2.app.n8n.cloud/webhook/book-slot'
};

let selectedSlot = null;

// ---------------------------
// Availability
// ---------------------------
async function checkAvailability() {
  const date = document.getElementById('dateInput').value;
  const res = await fetch(CONFIG.availability, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      startDate: date,
      endDate: date
    })
  });

  const data = await res.json();
  const slotsDiv = document.getElementById('slots');
  slotsDiv.innerHTML = '';

  data[0].allSlots.forEach(slot => {
    const div = document.createElement('div');
    div.className = 'slot';
    div.innerText = `${slot.time} (${slot.dayOfWeek})`;
    div.onclick = () => selectSlot(slot, div);
    slotsDiv.appendChild(div);
  });
}

function selectSlot(slot, element) {
  document.querySelectorAll('.slot').forEach(s => s.classList.remove('selected'));
  element.classList.add('selected');
  selectedSlot = slot;
  document.getElementById('bookingSection').classList.remove('hidden');
}

// ---------------------------
// Booking
// ---------------------------
async function bookSlot() {
  if (!selectedSlot) return alert('Please select a slot');

  const senderName = document.getElementById('senderName').value;
  const guestName = document.getElementById('guestName').value;
  const guestEmail = document.getElementById('guestEmail').value;
  const meetingTopic = document.getElementById('meetingTopic').value;

  const res = await fetch(CONFIG.bookSlot, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      slotStart: selectedSlot.start,
      slotEnd: selectedSlot.end,
      senderName,
      guestName,
      guestEmail,
      meetingTopic,
      timezone: 'UTC'
    })
  });

  const data = await res.json();
  const result = data[0];

  if (!result.success) {
    alert('Booking failed');
    return;
  }

  document.getElementById('result').classList.remove('hidden');
  document.getElementById('result').innerHTML = `
    <h2>✅ Booking Confirmed</h2>
    <p><strong>Booking ID:</strong> ${result.bookingId}</p>
    <p><strong>Perihal:</strong> ${meetingTopic}</p>
    <p><strong>Pengirim:</strong> ${senderName}</p>
    <p><strong>Dengan:</strong> ${guestName}</p>
  `;
}
