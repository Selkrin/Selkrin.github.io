// scripts.js - Simple JavaScript for your homepage

// Smooth scrolling for anchor links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        
        document.querySelector(this.getAttribute('href')).scrollIntoView({
            behavior: 'smooth'
        });
    });
});

// Mobile menu toggle
const menuToggle = document.querySelector('.menu-toggle');
const mobileMenu = document.querySelector('.nav-list');

if (menuToggle && mobileMenu) {
    menuToggle.addEventListener('click', function() {
        this.classList.toggle('active');
        mobileMenu.classList.toggle('active');
    });
}

// Close mobile menu when clicking on a link
mobileMenu.addEventListener('click', function(e) {
    if (e.target.tagName === 'A') {
        menuToggle.classList.remove('active');
        mobileMenu.classList.remove('active');
    }
});

// Dropdown toggle for submenu items
const dropdownLinks = document.querySelectorAll('.dropdown');

dropdownLinks.forEach(link => {
    link.addEventListener('mouseover', function() {
        this.querySelector('.dropdown-menu').classList.add('active');
    });
    
    link.addEventListener('mouseout', function() {
        this.querySelector('.dropdown-menu').classList.remove('active');
    });
});
