const form = document.getElementById("order-form");
const status = document.getElementById("form-status");

if (form) {
    form.addEventListener("submit", async function(event) {
        event.preventDefault();
        const data = new FormData(event.target);
        try {
            const response = await fetch(event.target.action, {
                method: form.method,
                body: data,
                headers: { 'Accept': 'application/json' }
            });
            if (response.ok) {
                status.innerHTML = "Ευχαριστούμε! Η παραγγελία σας στάλθηκε επιτυχώς.";
                status.style.display = "block";
                status.style.color = "#00d2ff";
                form.reset();
            } else {
                status.innerHTML = "Ώπα! Κάτι πήγε στραβά.";
                status.style.display = "block";
                status.style.color = "#ff4d4d";
            }
        } catch (error) {
            status.innerHTML = "Σφάλμα σύνδεσης.";
            status.style.display = "block";
        }
    });
}