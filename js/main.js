// Dropdown toggle
document.querySelectorAll('.dropdown').forEach(item => {
  item.addEventListener('click', (e) => {
    e.stopPropagation();
    item.classList.toggle('active');
  });
});

// Click outside to close dropdown
document.addEventListener('click', (e) => {
  if (!e.target.closest('.dropdown')) {
    document.querySelectorAll('.dropdown').forEach(item => {
      item.classList.remove('active');
    });
  }
});

// Smooth scroll
document.querySelectorAll('a smooth-scroll-link').forEach(link => {
  link.addEventListener('click', function(e) {
    e.preventDefault();
    const targetId = this.getAttribute('href');
    
    if (targetId.startsWith('#')) {
      document.querySelector(targetId).scrollIntoView({
        behavior: 'smooth',
        block: 'start'
      });
    }
  });
});
