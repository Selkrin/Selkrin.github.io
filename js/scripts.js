// Topic Scripts
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

    // Hotspot interaction
    const hotspots = document.querySelectorAll('.hotspot');
    
    hotspots.forEach(hotspot => {
        hotspot.addEventListener('click', function() {
            const target = this.getAttribute('data-target');
            if (target) {
                const element = document.querySelector(target);
                if (element) {
                    element.scrollIntoView({ behavior: 'smooth' });
                }
            }
        });
        
        // Show hotspot on hover/focus
        hotspot.addEventListener('mouseover', function() {
            this.style.opacity = '1';
        });
        
        hotspot.addEventListener('mouseleave', function() {
            this.style.opacity = '0';
        });
    });

    // Mobile menu toggle (assuming HTML has a menu button)
    const menuToggle = document.querySelector('.menu-toggle');
    const navList = document.querySelector('.nav-list');
    
    if (menuToggle && navList) {
        menuToggle.addEventListener('click', function() {
            navList.classList.toggle('mobile-active');
            this.dataset.active = navList.classList.contains('mobile-active');
        });
    }

    // Tablet and desktop view
    window.matchMedia('(min-width: 768px)').addEventListener('change', e => {
        if (!e.matches) {
            navList.classList.remove('mobile-active');
        }
    });

    // Prevent scrolling when modal is open (if used)
    function preventScroll() {
        document.body.style.overflow = 'hidden';
    }
    
    function allowScroll() {
        document.body.style.overflow = 'auto';
    }

    // Form validation
    const forms = document.querySelectorAll('form');
    
    forms.forEach(form => {
        form.addEventListener('submit', function(e) {
            e.preventDefault();
            // Add your form validation logic here
            alert('Form submitted! (Demo only - implement real validation)');
        });
    });
});

// Search functionality
class SearchManager {
    constructor() {
        this.searchInput = document.querySelector('#search');
        this.resultsContainer = document.querySelector('#search-results');
        this.sections = this.getSearchableSections();
        
        if (this.searchInput && this.resultsContainer && this.sections.length > 0) {
            this.init();
        }
    }
    
    getSearchableSections() {
        const sections = [];
        
        // Collect all heading text from section cards
        document.querySelectorAll('.section-card h3, .detail-section h2')?.forEach(element => {
            const link = element.closest('a');
            if (link) {
                sections.push({
                    title: element.textContent.trim(),
                    url: link.href
                });
            }
        });
        
        return sections;
    }
    
    init() {
        this.searchInput.addEventListener('input', (e) => {
            const term = e.target.value.toLowerCase().trim();
            this.results = this.filterSections(term);
            this.displayResults();
        });
        
        // Press Enter to follow link
        this.searchInput.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' && this.results.length > 0) {
                e.preventDefault();
                if (this.results[0].url) {
                    window.location.href = this.results[0].url;
                }
            }
        });
    }
    
    filterSections(term) {
        return this.sections.filter(item => 
            item.title.toLowerCase().includes(term)
        );
    }
    
    displayResults() {
        this.resultsContainer.innerHTML = '';
        
        if (this.searchInput.value.trim() === '') {
            this.resultsContainer.style.display = 'none';
            return;
        }
        
        this.resultsContainer.style.display = 'block';
        
        if (this.results.length > 0) {
            this.results.forEach(result => {
                const li = document.createElement('li');
                li.className = 'search-result';
                
                // Link
                const link = document.createElement('a');
                link.href = result.url;
                link.textContent = result.title;
                link.className = 'search-link';
                
                // Highlight matching text
                if (this.searchInput.value) {
                    const term = this.searchInput.value;
                    const titleText = result.title;
                    
                    if (titleText.includes(term)) {
                        const parts = titleText.split(new RegExp(`(${term})`, 'gi'));
                        link.innerHTML = '';
                        
                        parts.forEach(part => {
                            if (part.toLowerCase() === term.toLowerCase()) {
                                const span = document.createElement('span');
                                span.className = 'highlight';
                                span.textContent = part;
                                link.appendChild(span);
                            } else {
                                link.appendChild(document.createTextNode(part));
                            }
                        });
                    } else {
                        link.textContent = result.title;
                    }
                } else {
                    link.textContent = result.title;
                }
                
                li.appendChild(link);
                this.resultsContainer.appendChild(li);
            });
        } else {
            const p = document.createElement('p');
            p.textContent = 'No results found.';
            p.className = 'no-results';
            this.resultsContainer.appendChild(p);
        }
    }
}

// Initialize on load
document.addEventListener('DOMContentLoaded', () => {
    new SearchManager();
});
