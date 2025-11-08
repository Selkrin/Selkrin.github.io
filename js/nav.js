// nav.js - Mobile Navigation
document.addEventListener('DOMContentLoaded', function() {
    const menuToggle = document.querySelector('.menu-toggle');
    const navList = document.querySelector('.nav-list');
    
    if (menuToggle && navList) {
        menuToggle.addEventListener('click', function() {
            navList.classList.toggle('active');
            menuToggle.classList.toggle('open');
            
            // Accessibility: Announce menu state
            if (navList.classList.contains('active')) {
                this.setAttribute('aria-expanded', 'true');
            } else {
                this.setAttribute('aria-expanded', 'false');
            }
        });
        
        // Close menu when clicking on links
        navList.addEventListener('click', function() {
            if (window.innerWidth < 768) {
                navList.classList.remove('active');
                menuToggle.classList.remove('open');
                menuToggle.setAttribute('aria-expanded', 'false');
            }
        });
    }
    
    // Close menu on window resize
    window.addEventListener('resize', function() {
        if (window.innerWidth > 768 && navList.classList.contains('active')) {
            navList.classList.remove('active');
            menuToggle.classList.remove('open');
            menuToggle.setAttribute('aria-expanded', 'false');
        }
    });
});

// sections.js - Smooth Scrolling and Anchor Links
document.addEventListener('DOMContentLoaded', function() {
    // Smooth scrolling for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            const targetElement = document.querySelector(targetId);
            
            if (targetElement) {
                targetElement.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
    
    // Active state for scroll position
    window.addEventListener('scroll', function() {
        document.querySelectorAll('a[href^="#"]').forEach(link => {
            const targetId = link.getAttribute('href');
            if (targetId) {
                const targetElement = document.querySelector(targetId);
                
                if (targetElement) {
                    const rect = targetElement.getBoundingClientRect();
                    const isVisible = rect.top >= 0 && rect.bottom <= window.innerHeight;
                    
                    link.classList.toggle('active', isVisible);
                }
            }
        });
    });
});

// search.js - Search Functionality
document.addEventListener('DOMContentLoaded', function() {
    // Simple site search
    const searchInput = document.querySelector('#search');
    
    if (searchInput) {
        searchInput.addEventListener('input', function() {
            const searchTerm = this.value.toLowerCase();
            const sections = document.querySelectorAll('.section-card, .building-section');
            
            sections.forEach(section => {
                const title = section.querySelector('h3, h2').textContent.toLowerCase();
                
                if (title.includes(searchTerm)) {
                    section.classList.remove('hidden');
                } else {
                    section.classList.add('hidden');
                }
            });
        });
    }
});

// filters.js - Filter by Topic/Section Type
document.addEventListener('DOMContentLoaded', function() {
    // Filter functionality for sections
    const filterButtons = document.querySelectorAll('.filter-btn');
    
    if (filterButtons.length > 0) {
        filterButtons.forEach(button => {
            button.addEventListener('click', function() {
                const filterType = this.dataset.filter;
                
                document.querySelectorAll('.section-card').forEach(section => {
                    const sectionType = section.dataset.type;
                    
                    if (filterType === 'all' || filterType === sectionType) {
                        section.classList.remove('filtered-out');
                    } else {
                        section.classList.add('filtered-out');
                    }
                });
                
                // Update active button
                document.querySelectorAll('.filter-btn').forEach(btn => {
                    btn.classList.remove('active');
                });
                this.classList.add('active');
            });
        });
    }
});
