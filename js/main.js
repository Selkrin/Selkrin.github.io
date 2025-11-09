// Mobile Menu Toggle
const menuToggle = document.querySelector('.menu-toggle');
const navList = document.querySelector('.nav-list');

if (menuToggle && navList) {
    menuToggle.addEventListener('click', (e) => {
        e.preventDefault();
        navList.classList.toggle('active');
        menuToggle.classList.toggle('open');
    });
    
    // Close menu when clicking on a link
    navList.addEventListener('click', () => {
        if (navList.classList.contains('active')) {
            navList.classList.remove('active');
            menuToggle.classList.remove('open');
        }
    });
    
    // Close menu on ESC key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && navList.classList.contains('active')) {
            navList.classList.remove('active');
            menuToggle.classList.remove('open');
        }
    });
}

// Smooth Scrolling for Anchors
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        e.preventDefault();
        
        const targetId = this.getAttribute('href').substring(1);
        const targetElement = document.getElementById(targetId);
        
        if (targetElement) {
            targetElement.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
            
            // Close mobile menu if open
            if (navList.classList.contains('active')) {
                navList.classList.remove('active');
                menuToggle.classList.remove('open');
            }
        }
    });
});

// Hotspot Interactivity
document.querySelectorAll('.hotspot').forEach(hotspot => {
    hotspot.addEventListener('click', (e) => {
        e.preventDefault();
        const target = hotspot.getAttribute('data-target');
        
        if (target) {
            // Scroll to section or highlight it
            const section = document.getElementById(target);
            if (section) {
                section.scrollIntoView({ behavior: 'smooth' });
            }
        }
    });
});

// Search Functionality
let currentSearchTimeout = null;

document.addEventListener('input', function(e) {
    if (e.target.id === 'search') {
        clearTimeout(currentSearchTimeout);
        
        currentSearchTimeout = setTimeout(function() {
            const query = e.target.value.toLowerCase().trim();
            searchContent(query);
        }, 300);
    }
});

function searchContent(query) {
    const resultsContainer = document.querySelector('.search-results');
    
    if (!query) {
        resultsContainer.innerHTML = '';
        return;
    }
    
    // Search in section titles and content
    const sections = document.querySelectorAll('h2, h3, p, a, li');
    
    // Show loading state
    resultsContainer.innerHTML = '<div class="loading">Searching...</div>';
    
    setTimeout(() => {
        // In a real scenario, you'd search the actual content
        // This is just a demonstration
        
        resultsContainer.innerHTML = `
            <div class="search-results">
                ${generateDummySearchResults(query)}
            </div>
        `;
    }, 200);
}

function generateDummySearchResults(query) {
    const results = [];
    
    // Create dummy results based on query
    const searchTerms = ['bathroom', 'remodel', 'accessibility', 'plumbing', 'layout'];
    
    if (searchTerms.some(term => query.includes(term))) {
        results.push({
            title: 'Bathroom Accessibility Guidelines',
            url: '#accessibility'
        });
        
        results.push({
            title: 'Complete Bathroom Remodeling Guide',
            url: '#remodel'
        });
        
        results.push({
            title: 'Universal Design for Bathrooms',
            url: '#universal-design'
        });
    }
    
    if (results.length > 0) {
        return `
            <h4>Results for: "${query}"</h4>
            ${results.map(result => `
                <div class="search-result">
                    <a href="${result.url}">${result.title}</a>
                </div>
            `).join('')}
        `;
    }
    
    return '<p>No results found.</p>';
}

// Filter Sections by Query
function filterSections(query) {
    const sectionCards = document.querySelectorAll('.section-card');
    
    if (!query) {
        sectionCards.forEach(card => card.style.display = 'block');
        return;
    }
    
    sectionCards.forEach(card => {
        const title = card.querySelector('h3').textContent.toLowerCase();
        const matches = title.includes(query);
        
        if (matches) {
            card.style.display = 'block';
            card.classList.add('matched');
        } else {
            card.style.display = 'none';
            card.classList.remove('matched');
        }
    });
}

// Sticky Header on Scroll
let lastScrollTop = 0;
const navbar = document.querySelector('.navbar');
const heroSection = document.querySelector('#hero');

function stickyHeader() {
    if (heroSection) {
        const heroHeight = heroSection.offsetHeight;
        
        if (window.pageYOffset > heroHeight) {
            navbar.classList.add('sticky');
        } else {
            navbar.classList.remove('sticky');
        }
    }
}

window.addEventListener('scroll', stickyHeader);

// Header Transparency on Scroll
function changeHeaderOpacity() {
    const scroll = window.scrollY;
    const header = document.querySelector('.navbar');
    
    if (header) {
        if (scroll > 100) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    }
}

window.addEventListener('scroll', changeHeaderOpacity);

// Form Validation
document.querySelectorAll('form').forEach(form => {
    form.addEventListener('submit', function(e) {
        e.preventDefault();
        validateForm(this);
    });
});

function validateForm(form) {
    let isValid = true;
    
    // Email validation
    const emailInputs = form.querySelectorAll('input[type="email"]');
    emailInputs.forEach(input => {
        const email = input.value.trim();
        
        if (!isValidEmail(email)) {
            isValid = false;
            showErrorMessage(input, 'Please enter a valid email address');
        } else {
            hideErrorMessage(input);
        }
    });
    
    // Required fields validation
    const requiredFields = form.querySelectorAll('[required]');
    requiredFields.forEach(field => {
        if (!field.value.trim()) {
            isValid = false;
            showErrorMessage(field, 'This field is required');
        } else {
            hideErrorMessage(field);
        }
    });
    
    if (isValid) {
        // Submit form or show success message
        alert('Form submitted successfully!');
        form.reset();
    }
}

function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

function showErrorMessage(input, message) {
    let errorElement = input.nextElementSibling;
    
    if (!errorElement || !errorElement.classList.contains('error-message')) {
        errorElement = document.createElement('div');
        errorElement.className = 'error-message';
        input.insertAdjacentElement('afterend', errorElement);
    }
    
    errorElement.textContent = message;
}

function hideErrorMessage(input) {
    const errorElement = input.nextElementSibling;
    if (errorElement && errorElement.classList.contains('error-message')) {
        errorElement.textContent = '';
    }
}
