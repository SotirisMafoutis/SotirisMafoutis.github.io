const form = document.getElementById("order-form");
const status = document.getElementById("form-status");
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
if (form) {
    form.addEventListener("submit", async function(event) {
        event.preventDefault(); // Σταματάει το refresh της σελίδας
        
        const data = new FormData(event.target);
        
        try {
            const response = await fetch(event.target.action, {
                method: form.method,
                body: data,
                headers: {
                    'Accept': 'application/json'
                }
            });

            if (response.ok) {
                status.innerHTML = "Ευχαριστούμε! Η παραγγελία σας στάλθηκε επιτυχώς. Θα επικοινωνήσω μαζί σας σύντομα.";
                status.style.display = "block";
                status.style.color = "#00d2ff";
                form.reset(); // Καθαρίζει τη φόρμα
            } else {
                status.innerHTML = " Ώπα! Κάτι πήγε στραβά. Δοκίμασε ξανά.";
                status.style.display = "block";
                status.style.color = "#ff4d4d";
            }
        } catch (error) {
            status.innerHTML = " Σφάλμα σύνδεσης. Ελέγξτε το internet.";
            status.style.display = "block";
        }
    });
}