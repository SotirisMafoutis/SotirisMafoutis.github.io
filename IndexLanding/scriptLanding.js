async function loadLayout() {
    try {
        const headerRes = await fetch('headerLanding.html');
        const headerData = await headerRes.text();
        document.getElementById('header-placeholder').innerHTML = headerData;
        const footerRes = await fetch('footerLanding.html');
        const footerData = await footerRes.text();
        document.getElementById('footer-placeholder').innerHTML = footerData;
        // Αφού φορτωθεί το header, ενεργοποιούμε το smooth scroll
        setupSmoothScroll();
    } catch (e) { console.error(e); }
}

function setupSmoothScroll() {
    document.querySelectorAll('.nav-links a, .hero-actions a').forEach(link => {
        link.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            if (href.startsWith('#')) {
                e.preventDefault();
                const target = document.querySelector(href);
                if (target) {
                    window.scrollTo({
                        top: target.offsetTop - 80, // Offset για το header
                        behavior: 'smooth'
                    });
                }
            }
        });
    });
}

function goHome() {
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

document.addEventListener('DOMContentLoaded', loadLayout);