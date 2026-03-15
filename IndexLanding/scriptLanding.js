async function loadLayout() {
    try {
        const headerRes = await fetch('headerLanding.html');
        const headerData = await headerRes.text();
        document.getElementById('header-placeholder').innerHTML = headerData;

        const footerRes = await fetch('footerLanding.html');
        const footerData = await footerRes.text();
        document.getElementById('footer-placeholder').innerHTML = footerData;

        setupMobileMenu();
        setupSmoothScroll();
    } catch (e) { console.error(e); }
}

function setupMobileMenu() {
    const mobileMenu = document.getElementById('mobile-menu');
    const navMenu = document.getElementById('nav-menu');
    if (mobileMenu && navMenu) {
        mobileMenu.addEventListener('click', () => {
            navMenu.classList.toggle('is-open');
            const icon = mobileMenu.querySelector('i');
            if (icon) {
                icon.classList.toggle('fa-bars');
                icon.classList.toggle('fa-times');
            }
        });
    }
}

function setupSmoothScroll() {
    document.querySelectorAll('.nav-links a, .hero-actions a').forEach(link => {
        link.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            if (href.startsWith('#')) {
                e.preventDefault();
                const target = document.querySelector(href);
                if (target) {
                    window.scrollTo({ top: target.offsetTop - 90, behavior: 'smooth' });
                }
                const menu = document.getElementById('nav-menu');
                const icon = document.getElementById('menu-icon');
                if (menu) {
                    menu.classList.remove('is-open');
                    if (icon) icon.className = 'fas fa-bars';
                }
            }
        });
    });
}

function setupForm() {
    const form = document.getElementById('my-form2');
    const status = document.getElementById('form-status');
    const btn = document.getElementById('submit-btn');
    if (!form) return;

    form.addEventListener('submit', async function(event) {
        event.preventDefault();
        const data = new FormData(event.target);
        btn.innerHTML = 'Αποστολή...';
        btn.disabled = true;

        try {
            const response = await fetch(event.target.action, {
                method: form.method,
                body: data,
                headers: { 'Accept': 'application/json' }
            });

            if (response.ok) {
                status.style.display = 'block';
                status.style.color = '#4ade80';
                status.innerHTML = 'Ευχαριστώ! Το μήνυμα στάλθηκε με επιτυχία.';
                form.reset();
            } else {
                status.style.display = 'block';
                status.style.color = '#ef4444';
                status.innerHTML = 'Ώπα! Υπήρξε κάποιο πρόβλημα στην αποστολή.';
            }
        } catch (error) {
            status.style.display = 'block';
            status.style.color = '#ef4444';
            status.innerHTML = 'Σφάλμα δικτύου. Δοκιμάστε ξανά.';
        } finally {
            btn.innerHTML = 'Αποστολή Μηνύματος';
            btn.disabled = false;
        }
    });
}

function goHome() {
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

document.addEventListener('DOMContentLoaded', () => {
    loadLayout();
    setupForm();
});