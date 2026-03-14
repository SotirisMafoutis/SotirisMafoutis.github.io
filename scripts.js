/**
 * scripts.js
 * Διαχείριση Layout (Header/Footer) και Effects
 */

// 1. Συνάρτηση για τη φόρτωση των Header/Footer σε όλες τις σελίδες
async function loadLayout() {
    try {
        // Φόρτωση Header
        const headerRes = await fetch('header.html');
        if (!headerRes.ok) throw new Error('Header not found');
        const headerData = await headerRes.text();
        document.getElementById('header-placeholder').innerHTML = headerData;

        // Φόρτωση Footer
        const footerRes = await fetch('footer.html');
        if (!footerRes.ok) throw new Error('Footer not found');
        const footerData = await footerRes.text();
        document.getElementById('footer-placeholder').innerHTML = footerData;

        // ΑΦΟΥ φορτωθούν τα στοιχεία στο DOM, ενεργοποιούμε τη λογική του μενού
        initNavigationLogic();
        
    } catch (error) {
        console.error('Σφάλμα κατά τη φόρτωση του layout:', error);
    }
}

// 2. Η λογική για το Menu (Mobile Toggle) και το Smooth Scroll
function initNavigationLogic() {
    const mobileMenu = document.getElementById('mobile-menu');
    const navMenu = document.getElementById('nav-menu');

    // Mobile Menu Toggle
    if (mobileMenu && navMenu) {
        mobileMenu.addEventListener('click', () => {
            navMenu.classList.toggle('active');
            
            const icon = mobileMenu.querySelector('i');
            if (icon) {
                icon.classList.toggle('fa-bars');
                icon.classList.toggle('fa-times');
            }
        });

        // Κλείσιμο μενού όταν πατάς ένα link (απαραίτητο για mobile)
        document.querySelectorAll('.nav-links a').forEach(link => {
            link.addEventListener('click', () => {
                navMenu.classList.remove('active');
                const icon = mobileMenu.querySelector('i');
                if (icon) {
                    icon.classList.add('fa-bars');
                    icon.classList.remove('fa-times');
                }
            });
        });
    }

    // Smooth Scroll για εσωτερικά links (που ξεκινούν με #)
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const targetId = this.getAttribute('href');
            if (targetId === "#") return;
            
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                e.preventDefault();
                targetElement.scrollIntoView({ behavior: 'smooth' });
            }
        });
    });
}

// 3. Scroll Reveal Effect (Εμφάνιση καρτών κατά το σκρολάρισμα)
function initScrollReveal() {
    const observerOptions = { threshold: 0.1 };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = "1";
                entry.target.style.transform = "translateY(0)";
            }
        });
    }, observerOptions);

    // Εφαρμόζεται σε Pricing Cards (index) και Project Cards (ViewWork)
    document.querySelectorAll('.pricing-card, .project-card').forEach(card => {
        card.style.opacity = "0";
        card.style.transform = "translateY(30px)";
        card.style.transition = "all 0.6s ease-out";
        observer.observe(card);
    });
}

// ΕΚΤΕΛΕΣΗ ΜΕ ΤΗ ΦΟΡΤΩΣΗ
document.addEventListener('DOMContentLoaded', () => {
    loadLayout();      
    initScrollReveal(); 
});

// Συνάρτηση goHome (για το Logo)
function goHome() {
    const isHome = window.location.pathname.endsWith("index.html") || 
                   window.location.pathname === "/" || 
                   window.location.pathname === "";

    if (isHome) {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
        window.location.href = "index.html";
    }
}