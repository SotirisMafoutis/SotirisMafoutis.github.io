// Όταν πατάς το logo πάει στην κορυφή
function goHome() {
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

// Animation on page load
window.addEventListener('load', () => {
  const heroText = document.querySelector('.hero-text');
  const heroImage = document.querySelector('.hero-image img');

  // Προσθέτει την κλάση show με μικρή καθυστέρηση
  setTimeout(() => {
    heroText.classList.add('show');
  }, 200);

  setTimeout(() => {
    heroImage.classList.add('show');
  }, 400);
});
