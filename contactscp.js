

document.addEventListener('DOMContentLoaded', () => {
    
    // --- ΑΥΤΟ ΕΙΝΑΙ ΓΙΑ ΤΟ ΜΕΝΟΥ (Πρέπει να υπάρχει και εδώ) ---
    const mobileMenu = document.getElementById('mobile-menu');
    const navMenu = document.getElementById('nav-menu');

    if (mobileMenu && navMenu) {
        mobileMenu.addEventListener('click', () => {
            navMenu.classList.toggle('active');
            const icon = mobileMenu.querySelector('i');
            if (icon) {
                icon.classList.toggle('fa-bars');
                icon.classList.toggle('fa-times');
            }
        });
    }

const form = document.getElementById("my-form");
const status = document.getElementById("form-status");
const btn = document.getElementById("submit-btn");

async function handleSubmit(event) {
  event.preventDefault(); // Εμποδίζει το Formspree να ανοίξει τη δική του σελίδα
  
  const data = new FormData(event.target);
  
  // Αλλάζουμε το κείμενο στο κουμπί μέχρι να σταλεί
  btn.innerHTML = "Αποστολή...";
  btn.disabled = true;

  fetch(event.target.action, {
    method: form.method,
    body: data,
    headers: {
        'Accept': 'application/json'
    }
  }).then(response => {
    if (response.ok) {
      // Επιτυχία!
      status.style.display = "block";
      status.style.color = "#4ade80"; // Ένα ωραίο πράσινο
      status.innerHTML = "Ευχαριστώ! Το μήνυμα στάλθηκε με επιτυχία.";
      form.reset(); // Καθαρίζει τα πεδία
      btn.innerHTML = "Αποστολή";
      btn.disabled = false;
    } else {
      // Κάτι πήγε λάθος
      response.json().then(data => {
        status.style.display = "block";
        status.style.color = "#ef4444"; // Κόκκινο
        status.innerHTML = "Ώπα! Υπήρξε κάποιο πρόβλημα στην αποστολή.";
      });
    }
  }).catch(error => {
    status.innerHTML = "Σφάλμα δικτύου. Δοκιμάστε ξανά.";
  });
}

form.addEventListener("submit", handleSubmit);
});
function goHome() {
    window.location.href = 'index.html';
}