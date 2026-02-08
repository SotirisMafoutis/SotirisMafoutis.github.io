// Smooth scroll to top
function goHome() {
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

// Hero animation on load
window.addEventListener('load', () => {
  const heroText = document.querySelector('.hero-text');
  const heroImage = document.querySelector('.hero-image img');

  setTimeout(() => { heroText.classList.add('show'); }, 200);
  setTimeout(() => { heroImage.classList.add('show'); }, 400);
});
