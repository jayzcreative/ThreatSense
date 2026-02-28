const btn = document.getElementById('hamburger-btn');
const menu = document.getElementById('mobile-menu');
const hamburgerIcon = document.getElementById('hamburger-icon');
const closeIcon = document.getElementById('close-icon');

// Toggle menu on hamburger click
btn.addEventListener('click', () => {
  menu.classList.toggle('hidden');           // toggle mobile menu
  hamburgerIcon.classList.toggle('hidden');  // toggle hamburger icon
  closeIcon.classList.toggle('hidden');      // toggle X icon
});

// Reset menu when resizing to medium+ screens
window.addEventListener('resize', () => {
  if (window.innerWidth >= 768) { // md breakpoint in Tailwind is 768px
    menu.classList.add('hidden');           // hide mobile menu
    hamburgerIcon.classList.remove('hidden'); // show hamburger icon
    closeIcon.classList.add('hidden');       // hide X icon
  }
});