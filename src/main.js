const btn = document.getElementById('hamburger-btn');
const menu = document.getElementById('mobile-menu');
const hamburgerIcon = document.getElementById('hamburger-icon');
const closeIcon = document.getElementById('close-icon');

// Helper function to close the menu
const closeMenu = () => {
  menu.classList.add('hidden');
  hamburgerIcon.classList.remove('hidden');
  closeIcon.classList.add('hidden');
};

// Toggle menu on hamburger click
btn.addEventListener('click', () => {
  const isMenuHidden = menu.classList.toggle('hidden');
  hamburgerIcon.classList.toggle('hidden', !isMenuHidden);
  closeIcon.classList.toggle('hidden', isMenuHidden);
});

// NEW: Close menu when any link inside the mobile menu is clicked
const mobileLinks = menu.querySelectorAll('a');
mobileLinks.forEach(link => {
  link.addEventListener('click', closeMenu);
});

// Reset menu when resizing to large screens (lg = 1024px)
window.addEventListener('resize', () => {
  if (window.innerWidth >= 1024) { 
    closeMenu();
  }
});

/**
 * Tab Switching Logic
 */
function toggleScanner(mode) {
  const urlBtn = document.getElementById('url-btn');
  const emailBtn = document.getElementById('email-btn');
  const inputField = document.getElementById('scan-input');

  const activeClasses = ['bg-slate-900/60', 'border-t', 'border-x', 'border-slate-700', 'rounded-t-lg', 'text-white'];
  const inactiveClasses = ['text-slate-400'];

  if (mode === 'url') {
    urlBtn.classList.add(...activeClasses);
    urlBtn.classList.remove(...inactiveClasses);
    
    emailBtn.classList.remove(...activeClasses);
    emailBtn.classList.add(...inactiveClasses);
    
    inputField.placeholder = "Enter website URL";
  } else {
    emailBtn.classList.add(...activeClasses);
    emailBtn.classList.remove(...inactiveClasses);
    
    urlBtn.classList.remove(...activeClasses);
    urlBtn.classList.add(...inactiveClasses);
    
    inputField.placeholder = "Enter email address";
  }
}