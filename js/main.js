// Building sections data with categories
const sections = [
    {
        name: 'Foundation',
        icon: 'images/icon-foundation.png',
        description: 'Essential foundation planning, excavation, and concrete work for a solid base',
        category: 'structural',
        link: 'sections/foundation/index.html'
    },
    {
        name: 'Floors',
        icon: 'images/icon-floors.png',
        description: 'Flooring installation, subflooring, and finishing techniques',
        category: 'structural',
        link: 'sections/floors/index.html'
    },
    {
        name: 'Walls',
        icon: 'images/icon-walls.png',
        description: 'Framing, insulation, drywall, and wall finishing methods',
        category: 'structural',
        link: 'sections/walls/index.html'
    },
    {
        name: 'Roof',
        icon: 'images/icon-roof.png',
        description: 'Roofing materials, installation, and weatherproofing strategies',
        category: 'exterior',
        link: 'sections/roof/index.html'
    },
    {
        name: 'Windows',
        icon: 'images/icon-windows.png',
        description: 'Window selection, installation, and energy efficiency considerations',
        category: 'exterior',
        link: 'sections/windows/index.html'
    },
    {
        name: 'Doors',
        icon: 'images/icon-doors.png',
        description: 'Interior and exterior door installation and hardware',
        category: 'exterior',
        link: 'sections/doors/index.html'
    },
    {
        name: 'Kitchen',
        icon: 'images/icon-kitchen.png',
        description: 'Kitchen layout, cabinetry, appliances, and plumbing fixtures',
        category: 'interior',
        link: 'sections/kitchen/index.html'
    },
    {
        name: 'Bathroom',
        icon: 'images/icon-bathroom.png',
        description: 'Bathroom design, plumbing, fixtures, and tile work',
        category: 'interior',
        link: 'sections/bathroom/index.html'
    },
    {
        name: 'Bedroom',
        icon: 'images/icon-bedroom.png',
        description: 'Bedroom planning, closets, and finishing touches',
        category: 'interior',
        link: 'sections/bedroom/index.html'
    },
    {
        name: 'Living Room',
        icon: 'images/icon-living-room.png',
        description: 'Living space design, lighting, and electrical planning',
        category: 'interior',
        link: 'sections/living-room/index.html'
    },
    {
        name: 'Garage',
        icon: 'images/icon-garage.png',
        description: 'Garage construction, doors, and storage solutions',
        category: 'exterior',
        link: 'sections/garage/index.html'
    },
    {
        name: 'Ceilings',
        icon: 'images/icon-ceilings.png',
        description: 'Ceiling installation, types, and finishing options',
        category: 'structural',
        link: 'sections/ceilings/index.html'
    }
];

let currentFilter = 'all';

// Initialize the page
document.addEventListener('DOMContentLoaded', function() {
    renderSections();
    initScrollEffects();
    initStatsCounter();
    setupEventListeners();
});

// Render section cards
function renderSections(filter = 'all') {
    const grid = document.getElementById('sectionsGrid');
    const filteredSections = filter === 'all' 
        ? sections 
        : sections.filter(s => s.category === filter);
    
    grid.style.opacity = '0';
    
    setTimeout(() => {
        grid.innerHTML = filteredSections.map((section, index) => `
            <div class="section-card" 
                 onclick="navigateToSection('${section.link}')" 
                 style="animation-delay: ${index * 0.1}s"
                 data-category="${section.category}">
                <div class="section-icon">
                    <img src="${section.icon}" alt="${section.name}">
                </div>
                <div class="section-content">
                    <h3>${section.name}</h3>
                    <p>${section.description}</p>
                </div>
            </div>
        `).join('');
        
        grid.style.opacity = '1';
    }, 300);
}

// Navigate to section page
function navigateToSection(link) {
    // For demo purposes, open modal. In production, use: window.location.href = link;
    const sectionName = link.split('/')[1];
    const section = sections.find(s => s.name.toLowerCase().replace(' ', '-') === sectionName);
    if (section) {
        openModal(section.name);
    }
}

// Filter sections
function filterSections(category) {
    currentFilter = category;
    
    // Update active tab
    document.querySelectorAll('.filter-tab').forEach(tab => {
        tab.classList.remove('active');
    });
    event.target.classList.add('active');
    
    renderSections(category);
}

// Search functionality
function performSearch() {
    const query = document.getElementById('searchInput').value.toLowerCase().trim();
    if (!query) return;
    
    const results = sections.filter(s => 
        s.name.toLowerCase().includes(query) || 
        s.description.toLowerCase().includes(query) ||
        s.category.toLowerCase().includes(query)
    );
    
    if (results.length > 0) {
        openModal(results[0].name);
    } else {
        showNotification('No results found. Try: Foundation, Kitchen, Bathroom, etc.', 'error');
    }
}

// Live search suggestions
function handleSearchInput(event) {
    const query = event.target.value.toLowerCase().trim();
    const suggestions = document.getElementById('searchSuggestions');
    
    if (event.key === 'Enter') {
        performSearch();
        return;
    }
    
    if (query.length < 2) {
        suggestions.classList.remove('active');
        return;
    }
    
    const results = sections.filter(s => 
        s.name.toLowerCase().includes(query) || 
        s.description.toLowerCase().includes(query)
    ).slice(0, 5);
    
    if (results.length > 0) {
        suggestions.innerHTML = results.map(s => `
            <div class="suggestion-item" onclick="selectSuggestion('${s.name}')">
                <img src="${s.icon}" alt="${s.name}" style="width: 24px; height: 24px; object-fit: contain; vertical-align: middle; margin-right: 10px;">
                ${s.name} - ${s.description}
            </div>
        `).join('');
        suggestions.classList.add('active');
    } else {
        suggestions.classList.remove('active');
    }
}

function selectSuggestion(sectionName) {
    document.getElementById('searchInput').value = sectionName;
    document.getElementById('searchSuggestions').classList.remove('active');
    openModal(sectionName);
}

// Modal functions
function openModal(sectionName) {
    const section = sections.find(s => s.name === sectionName);
    if (!section) return;
    
    const modal = document.getElementById('modal');
    const title = document.getElementById('modalTitle');
    const body = document.getElementById('modalBody');
    
    title.textContent = section.name;
    body.innerHTML = `
        <div style="text-align: center; margin-bottom: 10px;">
            <img src="${section.icon}" alt="${section.name}" style="width: 240px; height: 240px; object-fit: contain;">
        </div>
        <h3>Overview</h3>
        <p>${section.description}</p>
        
        <h3 style="margin-top: 30px;">Key Considerations</h3>
        <ul style="margin-left: 20px; margin-top: 10px; line-height: 1.8;">
            <li>Planning and design requirements</li>
            <li>Material selection and quality standards</li>
            <li>Building codes and local regulations</li>
            <li>Cost estimation and budget planning</li>
            <li>Timeline and project scheduling</li>
            <li>Safety requirements and best practices</li>
        </ul>
        
        <h3 style="margin-top: 30px;">Getting Started</h3>
        <p>This section provides comprehensive guidance on all aspects of ${section.name.toLowerCase()} construction and installation. From initial planning to final finishing touches, you'll find expert advice and practical tips to ensure your project is completed successfully.</p>
        
        <div style="margin-top: 30px; padding: 20px; background: linear-gradient(135deg, #06b6d4 0%, #3b82f6 100%); border-radius: 12px; color: white;">
            <strong style="font-size: 1.2rem;">💡 Pro Tip:</strong>
            <p style="margin-top: 10px;">Always consult with licensed professionals and ensure all work meets local building codes and regulations. Proper planning and preparation are key to a successful build.</p>
        </div>
        
        <div style="margin-top: 20px; text-align: center;">
            <button onclick="window.location.href='${section.link}'" style="background: var(--primary); color: white; border: none; padding: 15px 30px; border-radius: 25px; font-weight: 600; cursor: pointer; font-size: 1rem;">
                View Detailed Guide →
            </button>
        </div>
    `;
    
    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
}

function closeModal() {
    document.getElementById('modal').classList.remove('active');
    document.body.style.overflow = 'auto';
}

// Scroll effects
function initScrollEffects() {
    const nav = document.getElementById('mainNav');
    const scrollBtn = document.getElementById('scrollToTop');
    
    window.addEventListener('scroll', () => {
        // Nav shadow on scroll
        if (window.scrollY > 50) {
            nav.classList.add('scrolled');
        } else {
            nav.classList.remove('scrolled');
        }
        
        // Show/hide scroll to top button
        if (window.scrollY > 500) {
            scrollBtn.classList.add('visible');
        } else {
            scrollBtn.classList.remove('visible');
        }
    });
}

function scrollToTop() {
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
}

function scrollToSections() {
    document.getElementById('sections').scrollIntoView({
        behavior: 'smooth',
        block: 'start'
    });
}

// Animated stats counter
function initStatsCounter() {
    const statNumbers = document.querySelectorAll('.stat-number');
    let counted = false;
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting && !counted) {
                counted = true;
                statNumbers.forEach(stat => {
                    animateCounter(stat);
                });
            }
        });
    }, { threshold: 0.5 });
    
    const statsSection = document.querySelector('.stats-section');
    if (statsSection) {
        observer.observe(statsSection);
    }
}

function animateCounter(element) {
    const target = parseInt(element.getAttribute('data-target'));
    const duration = 2000; // 2 seconds
    const increment = target / (duration / 16); // 60 FPS
    let current = 0;
    
    const timer = setInterval(() => {
        current += increment;
        if (current >= target) {
            element.textContent = target + (target >= 1000 ? '+' : '');
            clearInterval(timer);
        } else {
            element.textContent = Math.floor(current);
        }
    }, 16);
}

// Mobile menu toggle
function toggleMobileMenu() {
    const navLinks = document.getElementById('navLinks');
    navLinks.classList.toggle('active');
}

// Notification system
function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.style.cssText = `
        position: fixed;
        top: 100px;
        right: 20px;
        background: ${type === 'error' ? 'var(--danger)' : 'var(--success)'};
        color: white;
        padding: 15px 25px;
        border-radius: 8px;
        box-shadow: 0 4px 15px rgba(0,0,0,0.2);
        z-index: 1001;
        animation: slideIn 0.3s ease-out;
    `;
    notification.textContent = message;
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.style.animation = 'fadeOut 0.3s ease-out';
        setTimeout(() => notification.remove(), 300);
    }, 3000);
}

// Event listeners setup
function setupEventListeners() {
    // Close modal on outside click
    window.addEventListener('click', (e) => {
        const modal = document.getElementById('modal');
        if (e.target === modal) {
            closeModal();
        }
    });
    
    // Close modal on ESC key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            closeModal();
            document.getElementById('searchSuggestions').classList.remove('active');
        }
    });
    
    // Close suggestions on outside click
    document.addEventListener('click', (e) => {
        if (!e.target.closest('.search-section')) {
            document.getElementById('searchSuggestions').classList.remove('active');
        }
    });
}

// Smooth scroll for anchor links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// Add CSS for fadeOut animation
const style = document.createElement('style');
style.textContent = `
    @keyframes fadeOut {
        from {
            opacity: 1;
            transform: translateX(0);
        }
        to {
            opacity: 0;
            transform: translateX(100px);
        }
    }
`;
document.head.appendChild(style);
