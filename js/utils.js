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


 # Redesigned Homebuilding Handbook Website

I'll update your index, styles, and add JavaScript for a modern homebuilding information portal. I'll create a clean, organized structure with proper navigation and section organization.

## Updated HTML Structure

```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Your Homebuilding Handbook</title>
    <link rel="stylesheet" href="css/styles.css">
    <link rel="stylesheet" href="css/responsive.css">
    <link rel="icon" href="images/logo.png" type="image/x-icon">
    
    <!-- SEO Metadata -->
    <meta name="description" content="Your complete homebuilding guide with expert tutorials on all construction topics">
    <meta name="keywords" content="home building, construction tutorials, DIY homebuilding, house renovation, bathroom construction">
</head>
<body class="animate__animated animate__fadeIn">
    <!-- Header/Navigation -->
    <header class="navbar">
        <nav class="nav-container">
            <!-- Logo -->
            <a href="index.html" class="logo">
                <img src="images/YHBH Logo2.png" alt="Your Homebuilding Handbook Logo" loading="eager">
            </a>
            
            <!-- Search Functionality -->
            <div class="search-container">
                <input type="text" placeholder="Search guides..." class="search-input">
                <button aria-label="Search"><svg viewBox="0 0 24 24"><path d="M15.5 14h-.79l-2.5-5L10 5.511v14l7-3.5z"/></svg></button>
                <div class="search-results" aria-live="polite"></div>
            </div>
            
            <!-- Mobile Menu Toggle -->
            <button class="menu-toggle" aria-label="Toggle navigation">
                <span class="hamburger"></span>
            </button>
            
            <!-- Navigation List -->
            <ul class="nav-list">
                <li><a href="index.html">Home</a></li>
                <li class="dropdown">
                    <a href="#">Construction Guides</a>
                    <ul class="dropdown-menu">
                        <li><a href="sections/new-build/">New House Construction</a></li>
                        <li><a href="sections/remodel/">Home Remodeling</a></li>
                        <li><a href="sections/bathroom/">Bathroom Construction</a></li>
                    </ul>
                </li>
                <li><a href="about.html">About Us</a></li>
                <li><a href="contact.html">Contact</a></li>
            </ul>
        </nav>
    </header>

    <!-- Main Content -->
    <main class="container">
        <section id="hero">
            <h1>Your Homebuilding Handbook</h1>
            <p>Your trusted resource for home construction, renovation, and DIY projects.</p>
            <a href="#sections" class="btn">Browse Construction Guides →</a>
        </section>

        <!-- Sections Grid -->
        <section id="sections" class="building-sections">
            <h2>Construction Topics</h2>
            <div class="sections-grid">
                <!-- Bathroom Section -->
                <article class="section-card">
                    <h3>Bathroom Construction</h3>
                    <p>Comprehensive guide to bathroom design, plumbing, and renovation.</p>
                    <a href="sections/bathroom/">View Topics →</a>
                    <ul class="topics-list">
                        <li>Accessibility Standards</li>
                        <li>Budgeting Tips</li>
                        <li>DIY vs Professional Work</li>
                        <li>New Build Bathrooms</li>
                        <li>Remodeling Projects</li>
                    </ul>
                </article>

                <!-- New House Construction -->
                <article class="section-card">
                    <h3>New Home Builds</h3>
                    <p>Everything you need to know about constructing a new house from scratch.</p>
                    <a href="sections/new-build/">Learn More →</a>
                    <ul class="topics-list">
                        <li>Foundation Techniques</li>
                        <li>Building Codes</li>
                        <li>Material Selection</li>
                        <li>Permit Requirements</li>
                        <li>Timeline Estimations</li>
                    </ul>
                </article>

                <!-- Home Remodeling -->
                <article class="section-card">
                    <h3>Home Renovation</h3>
                    <p>Strategies for successfully remodeling and updating your existing home.</p>
                    <a href="sections/remodel/">Get Started →</a>
                    <ul class="topics-list">
                        <li>Cost Estimation</li>
                        <li>Moving Planning</li>
                        <li>Demolition Techniques</li>
                        <li>Minimizing Disruptions</li>
                        <li>Value Enhancement</li>
                    </ul>
                </article>

                <!-- Kitchen Construction -->
                <article class="section-card">
                    <h3>Kitchen Renovation</h3>
                    <p>Create your dream kitchen with expert design and construction advice.</p>
                    <a href="sections/kitchen/">Design Your Kitchen →</a>
                    <ul class="topics-list">
                        <li>Layout Optimization</li>
                        <li>Cabinet Solutions</li>
                        <li>Countertop Choices</li>
                        <li>Appliance Selection</li>
                        <li>Workflow Improvement</li>
                    </ul>
                </article>

                <!-- Foundation & Structure -->
                <article class="section-card">
                    <h3>Structural Basics</h3>
                    <p>Learn about the foundational elements of any successful home build.</p>
                    <a href="sections/foundation/">Review Foundations →</a>
                    <ul class="topics-list">
                        <li>Foundation Types</li>
                        <li>Wall Construction</li>
                        <li>Rafter Systems</li>
                        <li>Framing Techniques</li>
                        <li>Load Calculations</li>
                    </ul>
                </article>

                <!-- Roofing Section -->
                <article class="section-card">
                    <h3>Roofing Solutions</h3>
                    <p>Expert guidance on selecting and installing the perfect roof.</p>
                    <a href="sections/roof/">Explore Roof Options →</a>
                    <ul class="topics-list">
                        <li>Roof Types</li>
                        <li>Material Selection</li>
                        <li>Weather Resistance</li>
                        <li>Energy Efficiency</li>
                        <li>Maintenance Tips</li>
                    </ul>
                </article>
            </div>
        </section>

        <!-- Interactive Features -->
        <section class="interactive-sections">
            <section class="interactive-floorplan">
                <h2>House Blueprint Tour</h2>
                <div class="floorplan-container">
                    <img src="images/floor-plan.png" alt="Home floor plan" width="600" height="400" loading="lazy">
                    
                    <!-- Hotspots on Floor Plan -->
                    <div class="hotspot-overlay">
                        <div class="hotspot doors-hotspot" data-target="doors">
                            <span>Doors Area</span>
                        </div>
                        <div class="hotspot kitchen-hotspot" data-target="kitchen">
                            <span>Kitchen Zone</span>
                        </div>
                        <div class="hotspot bathroom-hotspot" data-target="bathroom">
                            <span>Bathroom Location</span>
                        </div>
                    </div>
                </div>
            </section>

            <section class="faq-section">
                <h2>Common Questions</h2>
                <div class="faq-accordion">
                    <button class="faq-question">What permits do I need?</button>
                    <div class="faq-answer">
                        <p>Permit requirements vary by location but typically include building, electrical, and plumbing permits for major renovations.</p>
                    </div>

                    <button class="faq-question">Should I hire professionals or DIY?</button>
                    <div class="faq-answer">
                        <p>Complex work like electrical and structural changes should be done by licensed professionals. Simple tasks like painting can often be DIY'd.</p>
                    </div>

                    <button class="faq-question">How long does a remodel take?</button>
                    <div class="faq-answer">
                        <p>Minor projects: 1-2 weeks. Major renovations: 3-12 weeks depending on the scope and whether you're occupied during construction.</p>
                    </div>
                </div>
            </section>
        </section>
    </main>

    <!-- Footer -->
    <footer class="site-footer">
        <div class="footer-container">
            <div class="footer-column">
                <h3>Your Homebuilding Handbook</h3>
                <p>Your trusted resource for home construction, renovation, and DIY projects.</p>
            </div>
            
            <div class="footer-column">
                <h4>Quick Links</h4>
                <ul>
                    <li><a href="index.html">Home</a></li>
                    <li><a href="sections/">Building Guides</a></li>
                    <li><a href="about.html">About Us</a></li>
                    <li><a href="contact.html">Contact</a></li>
                </ul>
            </div>
            
            <div class="footer-column">
                <h4>Sections</h4>
                <ul>
                    <li><a href="sections/bathroom/index.html">Bathroom Construction</a></li>
                    <li><a href="sections/kitchen/index.html">Kitchen Renovation</a></li>
                    <li><a href="sections/roof/index.html">Roofing Techniques</a></li>
                    <li><a href="sections/foundation/index.html">Foundation Basics</a></li>
                </ul>
            </div>
        </div>
        
        <p class="copyright">&copy; <?php echo date("Y"); ?> Your Homebuilding Handbook. All rights reserved.</p>
    </footer>

    <!-- JavaScript Files -->
    <script src="js/utils.js" defer></script>
    <script src="js/nav.js" defer></script>
    <script src="js/main.js" defer></script>
</body>
</html>
