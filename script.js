const API_URL = 'https://amber-safe-backend.onrender.com/contacts';
const contactForm = document.getElementById('contactForm');
const contactList = document.getElementById('contactList');
const alertButton = document.getElementById('alertButton');
const status = document.getElementById('status');

let contactUpdateTimeout;
function debounceLoadContacts() {
  clearTimeout(contactUpdateTimeout);
  contactUpdateTimeout = setTimeout(loadContacts, 200);
}

// Initialize contacts on page load
document.addEventListener('DOMContentLoaded', loadContacts);

// Handle form submit
contactForm.addEventListener('submit', async (e) => {
  e.preventDefault();
  const name = document.getElementById('name').value.trim();
  const phone = document.getElementById('phone').value.trim();

  if (!name || !phone || !/^\+?[1-9]\d{7,14}$/.test(phone)) {
    showStatus('Please enter a valid name and phone number (e.g., +1234567890)', true);
    return;
  }

  setLoading(true);
  try {
    const response = await fetch(API_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, phone }),
    });

    if (!response.ok) throw new Error('Failed to add contact');
    contactForm.reset();
    await loadContacts();
    showStatus('Contact added successfully!', false);
  } catch (error) {
    showStatus(`Error adding contact: ${error.message}`, true);
  } finally {
    setLoading(false);
  }
});

// Load all contacts
async function loadContacts() {
  setLoading(true);
  try {
    const response = await fetch(API_URL);
    if (!response.ok) throw new Error('Failed to fetch contacts');
    const contacts = await response.json();
    displayContacts(contacts);
  } catch (error) {
    showStatus(`Error loading contacts: ${error.message}`, true);
  } finally {
    setLoading(false);
  }
}

// Display contacts with delete buttons
function displayContacts(contacts) {
  contactList.innerHTML = '';
  if (contacts.length === 0) {
    contactList.innerHTML = '<li class="no-contacts">No contacts added yet.</li>';
    return;
  }

  contacts.forEach((contact) => {
    const li = document.createElement('li');
    li.innerHTML = `
      <span>${contact.name} - ${contact.phone}</span>
      <button aria-label="Delete contact ${contact.name}">
        <i class="fas fa-trash"></i>
      </button>
    `;
    li.querySelector('button').addEventListener('click', () =>
      confirmDelete(contact.id, contact.name)
    );
    contactList.appendChild(li);
  });
}

// Confirm and delete contact
async function confirmDelete(id, name) {
  if (!confirm(`Are you sure you want to delete ${name}?`)) return;

  setLoading(true);
  try {
    const response = await fetch(`${API_URL}/${id}`, { method: 'DELETE' });
    if (!response.ok) throw new Error('Failed to delete contact');
    await loadContacts();
    showStatus('Contact deleted successfully!', false);
  } catch (error) {
    showStatus(`Error deleting contact: ${error.message}`, true);
  } finally {
    setLoading(false);
  }
}

// Handle alert button click
alertButton.addEventListener('click', async () => {
  setLoading(true);
  try {
    const response = await fetch(API_URL);
    if (!response.ok) throw new Error('Failed to fetch contacts');
    const contacts = await response.json();

    if (contacts.length === 0) {
      showStatus('Please add at least one contact first.', true);
      setLoading(false);
      return;
    }

    showStatus('Getting location...');

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        const locationURL = `https://www.google.com/maps?q=${latitude},${longitude}`;

        showStatus(`
          🚨 Alert sent to:<br>
          ${contacts.map((c) => `${c.name} (${c.phone})`).join('<br>')}
          <br><br>
          🌍 Location: <a href="${locationURL}" target="_blank">View on Map</a>
        `);
        setLoading(false);
      },
      (error) => {
        showStatus(`
          🚨 Alert sent (without location):<br>
          ${contacts.map((c) => `${c.name} (${c.phone})`).join('<br>')}
          <br><br>
          ⚠️ Location unavailable: ${error.message}
        `, true);
        setLoading(false);
      },
      { timeout: 10000, maximumAge: 60000 }
    );
  } catch (error) {
    showStatus(`Error sending alert: ${error.message}`, true);
    setLoading(false);
  }
});

// Utility functions
function showStatus(message, isError = false) {
  status.innerHTML = message;
  status.style.color = isError ? '#d32f2f' : '#388e3c';
  status.setAttribute('aria-live', 'assertive');
  if (!message.includes('Alert sent')) {
    setTimeout(() => {
      status.innerHTML = '';
    }, 5000);
  }
}

function setLoading(isLoading) {
  contactForm.classList.toggle('loading', isLoading);
  alertButton.disabled = isLoading;
  contactList.classList.toggle('loading', isLoading);
}