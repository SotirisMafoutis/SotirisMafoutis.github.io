document.addEventListener('DOMContentLoaded', () => {
    
    // --- 1. Mobile Menu Logic ---
    const mobileMenu = document.getElementById('mobile-menu');
    const navMenu = document.getElementById('nav-menu');

    if (mobileMenu && navMenu) {
        mobileMenu.addEventListener('click', () => {
            console.log("Menu clicked!"); 
            navMenu.classList.toggle('active');
            
            const icon = mobileMenu.querySelector('i');
            if (icon) {
                icon.classList.toggle('fa-bars');
                icon.classList.toggle('fa-times');
            }
        });
    }

    // Κλείσιμο μενού όταν πατάς ένα link (για το κινητό)
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

    // --- 2. Smooth Scroll για τα Links ---
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const targetId = this.getAttribute('href');
            if (targetId === "#") return; // Αγνοεί τα σκέτα #
            
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                e.preventDefault();
                targetElement.scrollIntoView({
                    behavior: 'smooth'
                });
            }
        });
    });

    // --- 3. Scroll Reveal Effect (Cards) ---
    const observerOptions = { threshold: 0.1 };
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = "1";
                entry.target.style.transform = "translateY(0)";
            }
        });
    }, observerOptions);

    document.querySelectorAll('.pricing-card').forEach(card => {
        card.style.opacity = "0";
        card.style.transform = "translateY(30px)";
        card.style.transition = "all 0.6s ease-out";
        observer.observe(card);
    });
});

// Αυτή η συνάρτηση μένει έξω γιατί την καλείς από το HTML (onclick)
function goHome() {
    window.scrollTo({ top: 0, behavior: 'smooth' });
}
