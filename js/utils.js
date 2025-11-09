// utils.js - Utility functions
document.addEventListener('DOMContentLoaded', function() {
    // Smooth scrolling for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href').substring(1);
            const targetElement = document.getElementById(targetId) || document.querySelector(targetId);
            
            if (targetElement) {
                targetElement.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });

    // Form validation utility
    function validateForm(form) {
        let isValid = true;
        
        // Email validation
        if (form.email) {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(form.email.value)) {
                alert('Please enter a valid email address');
                isValid = false;
            }
        }

        return isValid;
    }

    // Expose utility functions
    window.validateForm = validateForm;
});

// nav.js - Navigation functionality
class MobileMenu {
    constructor() {
        this.menuToggle = document.querySelector('.menu-toggle');
        this.navList = document.querySelector('.nav-list');
        this.overlay = document.createElement('div');
        this.overlay.className = 'menu-overlay';
        
        // Add overlay to body
        document.body.appendChild(this.overlay);
    }

    toggleMenu() {
        this.navList.classList.toggle('active');
        this.menuToggle.classList.toggle('open');
        
        // Add/remove overlay classes
        this.overlay.classList.toggle('active');
        
        // Prevent background scrolling when menu is open
        if (this.navList.classList.contains('active')) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'auto';
        }
    }

    closeMenuOnOverlayClick(e) {
        if (e.target === this.overlay) {
            this.toggleMenu();
        }
    }

    closeMenuOnLinkClick() {
        this.navList.classList.remove('active');
        this.menuToggle.classList.remove('open');
        this.overlay.classList.remove('active');
        document.body.style.overflow = 'auto';
    }

    init() {
        if (this.menuToggle && this.navList) {
            this.toggleMenu.bind(this);
            this.closeMenuOnLinkClick.bind(this);
            
            // Event listeners
            this.menuToggle.addEventListener('click', this.toggleMenu);
            this.overlay.addEventListener('click', this.closeMenuOverlyClick.bind(this));
            
            // Close menu when link clicked (debounce to prevent immediate closing)
            let clickTimeout;
            this.navList.addEventListener('click', function() {
                clearTimeout(clickTimeout);
                clickTimeout = setTimeout(() => {
                    this.closeMenuOnLinkClick();
                }, 300);
            }.bind(this));
        }
    }
}

// Initialize mobile menu
new MobileMenu().init();

// Hotspot interaction
document.querySelectorAll('.hotspot').forEach(hotspot => {
    hotspot.addEventListener('click', function() {
        const target = this.getAttribute('data-target');
        
        if (target) {
            // Scroll to section or highlight it
            const section = document.getElementById(target);
            if (section) {
                section.scrollIntoView({ behavior: 'smooth' });
            }
        }
    });
});

// Search functionality
class SiteSearch {
    constructor() {
        this.searchInput = document.querySelector('.search-input');
        this.resultsContainer = document.querySelector('.search-results');
    }

    performSearch(query) {
        if (!query && !this.searchInput) return;
        
        // Filter sections, pages, and content
        const searchTerm = query.toLowerCase();
        const links = document.querySelectorAll('a[href]');
        
        // Highlight matching text
        this.highlightMatches(searchTerm, links);
        
        // Show/hide results
        if (searchTerm) {
            this.resultsContainer.style.display = 'block';
            this.showResults(links, searchTerm);
        } else {
            this.resultsContainer.style.display = 'none';
            this.removeHighlights();
        }
    }

    highlightMatches(term, elements) {
        if (!term) return;
        
        elements.forEach(link => {
            const text = link.textContent.toLowerCase();
            if (text.includes(term)) {
                // Save original content
                if (!link.dataset.original) {
                    link.dataset.original = link.innerHTML;
                }
                
                // Create regex with word boundaries
                const escapedTerm = term.replace(/[.*+?^${}()|[$\$/g, '\\$&');
                const pattern = new RegExp(escapedTerm, 'gi');
                
                link.innerHTML = link.dataset.original.replace(
                    pattern,
                    '<span class="highlight">$&</span>'
                );
            } else {
                // Restore original when no match
                link.innerHTML = link.dataset.original || link.textContent;
            }
        });
    }

    removeHighlights() {
        document.querySelectorAll('.highlight').forEach(el => {
            el.parentElement.dataset.original = el.parentElement.innerHTML;
            el.parentElement.innerHTML = el.parentElement.textContent;
        };
        
        if (this.searchInput) {
            this.searchInput.value = '';
        }
    }

    showResults(links, term) {
        const matches = [];
        
        links.forEach(link => {
            const text = link.textContent.toLowerCase();
            if (text.includes(term)) {
                matches.push(link);
            }
        });
        
        // Display results
        this.displaySearchResults(matches, term);
    }

    displaySearchResults(results, query) {
        this.resultsContainer.innerHTML = `
            <h3>Search Results</h3>
            ${this.createResultList(results, query)}
        `;
    }

    createResultList(items, query) {
        if (items.length === 0) {
            return '<p>No results found.</p>';
        }
        
        return items.map(item => {
            const text = item.textContent;
            const href = item.getAttribute('href');
            
            // Highlight matching segments
            const highlightRegex = new RegExp(query, 'gi');
            let highlightedText = text.replace(highlightRegex, '<span class="highlight">$&</span>');
            
            return `
                <div class="search-result">
                    <a href="${href}" class="result-link">${highlightedText}</a>
                </div>
            `;
        }).join('');
    }
}

// Initialize search
new SiteSearch();

// Main.js - Core functionality
document.addEventListener('DOMContentLoaded', function() {
    // Form submission handler
    document.querySelectorAll('form').forEach(form => {
        form.addEventListener('submit', function(e) {
            e.preventDefault();
            
            if (validateForm(this)) {
                // Handle form submission
                this.submit();
            }
        });
    });

    // Table of contents for long sections
    const headings = document.querySelectorAll('h2, h3, h4');
    
    if (headings.length > 0) {
        createTableOfContents(headings);
        
        // Scroll to heading smoothly
        headings.forEach(heading => {
            heading.addEventListener('click', function() {
                event.preventDefault();
                smoothScrollTo(this);
            });
        });
    }

    // FAQ accordion
    const faqQuestions = document.querySelectorAll('.faq-question');
    
    faqQuestions.forEach(question => {
        question.addEventListener('click', function() {
            const answer = this.nextElementSibling;
            const isOpen = answer.classList.contains('open');
            
            // Close all other FAQs
            document.querySelectorAll('.faq-answer.open').forEach(otherAnswer => {
                if (otherAnswer !== answer) {
                    otherAnswer.classList.remove('open');
                }
            });
            
            // Toggle current FAQ
            answer.classList.toggle('open', !isOpen);
        });
    });

    // Initialize tooltips on load
    initializeTooltips();
});

function smoothScrollTo(element) {
    const headerOffset = document.querySelector('.navbar') ? 
        document.querySelector('.navbar').offsetHeight : 0;
    
    window.scrollTo({
        top: element.offsetTop - headerOffset - 20,
        behavior: 'smooth'
    });
}

function createTableOfContents(headings) {
    const tocContainer = document.createElement('nav');
    tocContainer.className = 'table-of-contents';
    
    const tocList = document.createElement('ul');
    tocList.className = 'toc-list';
    
    headings.forEach(heading => {
        const link = document.createElement('a');
        link.href = `#${heading.id}`;
        link.textContent = heading.textContent;
        link.className = 'toc-link';
        
        // Smooth scroll when clicked
        link.addEventListener('click', function(e) {
            e.preventDefault();
            smoothScrollTo(heading);
        });
    });

    tocContainer.appendChild(tocList);
    document.body.appendChild(tocContainer);
}

function initializeTooltips() {
    const tooltips = document.querySelectorAll('[data-tooltip]');
    
    tooltips.forEach(tooltip => {
        const tooltipText = tooltip.dataset.tooltip;
        
        // Create tooltip element
        let tooltipEl = tooltip.querySelector('.tooltip-content');
        
        if (!tooltipEl) {
            tooltipEl = document.createElement('div');
            tooltipEl.className = 'tooltip-content';
            tooltipEl.textContent = tooltipText;
            tooltip.appendChild(tooltipEl);
        }
        
        // Show on hover/focus
        tooltip.addEventListener('mouseenter', () => {
            tooltipEl.style.opacity = '1';
            tooltipEl.style.visibility = 'visible';
        });
        
        // Hide on exit
        tooltip.addEventListener('mouseleave', () => {
            tooltipEl.style.opacity = '0';
            tooltipEl.style.visibility = 'hidden';
        });
        
        // Show on focus for accessibility
        tooltip.addEventListener('focus', () => {
            tooltipEl.style.opacity = '1';
            tooltipEl.style.visibility = 'visible';
        });
    }
}

function validateForm(form) {
    // Validation logic
    return true;
}
