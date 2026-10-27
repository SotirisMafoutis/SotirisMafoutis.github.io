document.addEventListener('DOMContentLoaded', () => {
    
    // --- Mobile Menu Toggle ---
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

    // --- Form Elements & Safety Setup ---
    const form = document.getElementById("my-form");
    const status = document.getElementById("form-status");
    const btn = document.getElementById("submit-btn");

    if (!form) return;

    // Χρόνος φόρτωσης της σελίδας (Time-based bot protection)
    const pageLoadTime = Date.now();

    // 1. Sanitization Function (XSS Protection)
    function sanitizeInput(str) {
        if (typeof str !== 'string') return '';
        return str
            .replace(/&/g, "&amp;")
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;")
            .replace(/"/g, "&quot;")
            .replace(/'/g, "&#039;")
            .trim();
    }

    // 2. Email Validation Regex
    function isValidEmail(email) {
        const re = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
        return re.test(String(email).toLowerCase());
    }

    // 3. Εμφάνιση Μηνυμάτων Status
    function showStatus(message, isError = false) {
        if (!status) return;
        status.style.display = "block";
        status.style.color = isError ? "#ef4444" : "#4ade80"; // Κόκκινο για σφάλμα, πράσινο για επιτυχία
        status.innerHTML = sanitizeInput(message);
    }

    // --- Submit Handler ---
    async function handleSubmit(event) {
        event.preventDefault(); // Εμποδίζει το Formspree να ανοίξει τη δική του σελίδα

        // A. Honeypot Check (Bot Protection)
        const honeypot = form.querySelector('input[name="_gotcha"]');
        if (honeypot && honeypot.value !== "") {
            console.warn("Bot detected via honeypot field.");
            showStatus("Ευχαριστώ! Το μήνυμα στάλθηκε με επιτυχία."); // Ψεύτικο success για να μπερδέψει το bot
            form.reset();
            return;
        }

        // B. Time-Based Bot Check (Αν συμπληρώθηκε σε < 1.5 δευτερόλεπτο)
        const timeTaken = (Date.now() - pageLoadTime) / 1000;
        if (timeTaken < 1.5) {
            console.warn("Bot detected: Submitted too fast.");
            showStatus("Παρακαλώ συμπληρώστε τη φόρμα κανονικά.", true);
            return;
        }

        // C. Rate Limiting Check (60 δευτερόλεπτα cooldown ανά αποστολή)
        const lastSubmit = localStorage.getItem("last_form_submit");
        const now = Date.now();
        const cooldown = 60 * 1000; // 60 seconds

        if (lastSubmit && (now - parseInt(lastSubmit)) < cooldown) {
            const remaining = Math.ceil((cooldown - (now - parseInt(lastSubmit))) / 1000);
            showStatus(`Παρακαλώ περιμένετε ${remaining} δευτερόλεπτα πριν στείλετε νέο μήνυμα.`, true);
            return;
        }

        // D. Λήψη & Sanitization πεδίων
        const nameInput = form.querySelector('input[name="name"]');
        const emailInput = form.querySelector('input[name="email"]');
        const messageInput = form.querySelector('textarea[name="message"]');

        const cleanName = sanitizeInput(nameInput ? nameInput.value : '');
        const cleanEmail = sanitizeInput(emailInput ? emailInput.value : '');
        const cleanMessage = sanitizeInput(messageInput ? messageInput.value : '');

        // E. Validation
        if (!cleanName || cleanName.length < 2) {
            showStatus("Παρακαλώ εισάγετε ένα έγκυρο ονοματεπώνυμο.", true);
            return;
        }

        if (!isValidEmail(cleanEmail)) {
            showStatus("Παρακαλώ εισάγετε μια έγκυρη διεύθυνση Email.", true);
            return;
        }

        if (!cleanMessage || cleanMessage.length < 10) {
            showStatus("Το μήνυμα πρέπει να περιέχει τουλάχιστον 10 χαρακτήρες.", true);
            return;
        }

        // F. Αλλαγή κουμπιού κατά την αποστολή
        const originalBtnText = btn ? btn.innerHTML : "Αποστολή";
        if (btn) {
            btn.innerHTML = "Αποστολή...";
            btn.disabled = true;
        }

        // G. Αποστολή στο Formspree via Fetch
        try {
            const response = await fetch(form.action, {
                method: form.method || "POST",
                body: JSON.stringify({
                    name: cleanName,
                    email: cleanEmail,
                    message: cleanMessage
                }),
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                }
            });

            if (response.ok) {
                // Αποθήκευση timestamp για Rate Limiting
                localStorage.setItem("last_form_submit", Date.now().toString());

                showStatus("Ευχαριστώ! Το μήνυμα στάλθηκε με επιτυχία.");
                form.reset();
            } else {
                const data = await response.json();
                if (data && data.errors) {
                    showStatus(data.errors.map(err => err.message).join(", "), true);
                } else {
                    showStatus("Ώπα! Υπήρξε κάποιο πρόβλημα στην αποστολή.", true);
                }
            }
        } catch (error) {
            showStatus("Σφάλμα δικτύου. Δοκιμάστε ξανά.", true);
        } finally {
            if (btn) {
                btn.innerHTML = originalBtnText;
                btn.disabled = false;
            }
        }
    }

    form.addEventListener("submit", handleSubmit);
});

// Global navigation helper
function goHome() {
    window.location.href = 'index.html';
}