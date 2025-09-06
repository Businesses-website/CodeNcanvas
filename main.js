// Main JavaScript File for Portfolio Website

document.addEventListener('DOMContentLoaded', function() {
    initializeNavigation();
    initializeScrollAnimations();
    initializeSkillBars();
    initializePortfolioFilters();
    initializeTestimonialSlider();
    initializeContactForm();
    initializeSmoothScrolling();
    initializeScrollEffects();
    initializeLazyLoading();
});

// Navigation Functionality
function initializeNavigation() {
    const hamburger = document.getElementById('hamburger');
    const navMenu = document.getElementById('nav-menu');
    const navLinks = document.querySelectorAll('.nav-link');
    const navbar = document.getElementById('navbar');

    if (hamburger && navMenu) {
        hamburger.addEventListener('click', function() {
            hamburger.classList.toggle('active');
            navMenu.classList.toggle('active');
        });

        navLinks.forEach(link => {
            link.addEventListener('click', function() {
                hamburger.classList.remove('active');
                navMenu.classList.remove('active');
            });
        });
    }

    if (navbar) {
        window.addEventListener('scroll', function() {
            if (window.scrollY > 100) {
                navbar.style.background = 'rgba(255, 255, 255, 0.98)';
                navbar.style.boxShadow = '0 2px 20px rgba(0, 0, 0, 0.1)';
            } else {
                navbar.style.background = 'rgba(255, 255, 255, 0.95)';
                navbar.style.boxShadow = 'none';
            }
        });
    }

    const sections = document.querySelectorAll('section[id]');

    function highlightActiveLink() {
        const scrollY = window.pageYOffset;
        sections.forEach(section => {
            const sectionHeight = section.offsetHeight;
            const sectionTop = section.offsetTop - 100;
            const sectionId = section.getAttribute('id');

            if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
                navLinks.forEach(link => {
                    link.classList.remove('active');
                    if (link.getAttribute('href') === `#${sectionId}`) {
                        link.classList.add('active');
                    }
                });
            }
        });
    }

    window.addEventListener('scroll', highlightActiveLink);
}

// Smooth Scrolling
function initializeSmoothScrolling() {
    const scrollLinks = document.querySelectorAll('a[href^="#"]');
    scrollLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            const targetSection = document.querySelector(targetId);
            if (targetSection) {
                const headerOffset = 80;
                const elementPosition = targetSection.getBoundingClientRect().top;
                const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
                window.scrollTo({ top: offsetPosition, behavior: 'smooth' });
            }
        });
    });
}

// Scroll Animations
function initializeScrollAnimations() {
    const observerOptions = { threshold: 0.1, rootMargin: '0px 0px -50px 0px' };
    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                if (entry.target.classList.contains('stagger-animation')) {
                    Array.from(entry.target.children).forEach((child, index) => {
                        setTimeout(() => {
                            child.style.opacity = '1';
                            child.style.transform = 'translateY(0)';
                        }, index * 100);
                    });
                }
            }
        });
    }, observerOptions);
    document.querySelectorAll('.animate-slide-up, .animate-slide-left, .animate-slide-right, .animate-fade-in, .fade-in-on-scroll, .slide-left-on-scroll, .slide-right-on-scroll, .scale-in-on-scroll, .stagger-animation').forEach(el => observer.observe(el));
}

// Skill Bars Animation
function initializeSkillBars() {
    const skillBars = document.querySelectorAll('.skill-progress');
    if (skillBars.length === 0) return;

    const skillObserver = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const skillBar = entry.target;
                const width = skillBar.getAttribute('data-width');
                setTimeout(() => { skillBar.style.width = width + '%'; }, 500);
                skillObserver.unobserve(skillBar);
            }
        });
    }, { threshold: 0.5 });

    skillBars.forEach(bar => skillObserver.observe(bar));
}

// Portfolio Filters
function initializePortfolioFilters() {
    const filterButtons = document.querySelectorAll('.filter-btn');
    const portfolioItems = document.querySelectorAll('.portfolio-item');
    if (filterButtons.length === 0 || portfolioItems.length === 0) return;

    filterButtons.forEach(button => {
        button.addEventListener('click', function() {
            const filter = this.getAttribute('data-filter');
            filterButtons.forEach(btn => btn.classList.remove('active'));
            this.classList.add('active');

            portfolioItems.forEach(item => {
                const category = item.getAttribute('data-category');
                if (filter === 'all' || category === filter) {
                    item.style.display = 'block';
                    item.classList.remove('hidden');
                    setTimeout(() => { item.style.opacity = '1'; item.style.transform = 'scale(1)'; }, 100);
                } else {
                    item.style.opacity = '0';
                    item.style.transform = 'scale(0.8)';
                    setTimeout(() => {
                        item.style.display = 'none';
                        item.classList.add('hidden');
                    }, 300);
                }
            });
        });
    });
}

// Testimonial Slider
function initializeTestimonialSlider() {
    const testimonialSlider = document.querySelector('.testimonials-slider');
    const testimonialCards = document.querySelectorAll('.testimonial-card');
    const prevBtn = document.getElementById('prev-testimonial');
    const nextBtn = document.getElementById('next-testimonial');
    if (!testimonialSlider || testimonialCards.length === 0) return;

    let currentIndex = 0;
    let autoPlayInterval;
    let autoPlayActive = true;

    function updateSliderLayout() {
        if (window.innerWidth <= 768) {
            testimonialSlider.style.display = 'flex';
            testimonialSlider.style.overflowX = 'auto';
            testimonialSlider.style.scrollSnapType = 'x mandatory';
            testimonialCards.forEach(card => {
                card.style.minWidth = '300px';
                card.style.scrollSnapAlign = 'start';
            });
        } else {
            testimonialSlider.style.display = 'grid';
            testimonialSlider.style.overflowX = 'visible';
            testimonialCards.forEach(card => { card.style.minWidth = 'auto'; });
        }
    }

    function startAutoPlay() {
        clearInterval(autoPlayInterval);
        if (window.innerWidth <= 768 && autoPlayActive) {
            autoPlayInterval = setInterval(() => {
                currentIndex = (currentIndex + 1) % testimonialCards.length;
                scrollToTestimonial(currentIndex);
            }, 4000);
        }
    }

    function scrollToTestimonial(index) {
        if (window.innerWidth <= 768) {
            const cardWidth = testimonialCards[0].offsetWidth + 32;
            testimonialSlider.scrollTo({ left: index * cardWidth, behavior: 'smooth' });
        }
    }

    if (nextBtn) nextBtn.addEventListener('click', () => {
        currentIndex = (currentIndex + 1) % testimonialCards.length;
        scrollToTestimonial(currentIndex);
        autoPlayActive = false;
        clearInterval(autoPlayInterval);
    });

    if (prevBtn) prevBtn.addEventListener('click', () => {
        currentIndex = (currentIndex - 1 + testimonialCards.length) % testimonialCards.length;
        scrollToTestimonial(currentIndex);
        autoPlayActive = false;
        clearInterval(autoPlayInterval);
    });

    testimonialSlider.addEventListener('mouseenter', () => clearInterval(autoPlayInterval));
    testimonialSlider.addEventListener('mouseleave', startAutoPlay);

    updateSliderLayout();
    startAutoPlay();
    window.addEventListener('resize', () => { updateSliderLayout(); startAutoPlay(); });
}

// Contact Form
function initializeContactForm() {
    const contactForm = document.getElementById('contact-form');
    if (!contactForm) return;

    contactForm.addEventListener('submit', function(e) {
        e.preventDefault();
        const formData = new FormData(this);
        const data = Object.fromEntries(formData);
        if (!validateForm(data)) return;
        submitForm(data);
    });
}

function validateForm(data) {
    const requiredFields = ['firstName', 'lastName', 'email', 'service', 'budget', 'message'];
    const errors = [];

    requiredFields.forEach(field => {
        if (!data[field] || data[field].trim() === '') errors.push(`${field} is required`);
    });

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (data.email && !emailRegex.test(data.email)) errors.push('Invalid email address');

    if (errors.length > 0) {
        showNotification(errors.join('\n'), 'error');
        return false;
    }
    return true;
}

function submitForm(data) {
    const submitBtn = document.querySelector('#contact-form button[type="submit"]');
    if (!submitBtn) return;

    const originalText = submitBtn.innerHTML;
    submitBtn.innerHTML = `<span>Sending...</span><div class="loading-spinner" style="margin-left: 10px;"></div>`;
    submitBtn.disabled = true;

    setTimeout(() => {
        submitBtn.innerHTML = originalText;
        submitBtn.disabled = false;
        showNotification("Thank you! I'll reply within 24 hours.", 'success');
        document.getElementById('contact-form').reset();
        console.log('Form submitted:', data);
    }, 2000);
}

function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;

    const messageSpan = document.createElement('span');
    messageSpan.textContent = message;

    const closeBtn = document.createElement('button');
    closeBtn.className = 'notification-close';
    closeBtn.innerHTML = '&times;';

    const contentDiv = document.createElement('div');
    contentDiv.className = 'notification-content';
    contentDiv.appendChild(messageSpan);
    contentDiv.appendChild(closeBtn);

    notification.appendChild(contentDiv);

    notification.style.cssText = `
        position: fixed; top: 20px; right: 20px;
        background: ${type === 'success' ? '#4CAF50' : type === 'error' ? '#f44336' : '#2196F3'};
        color: white; padding: 16px 20px; border-radius: 8px;
        box-shadow: 0 4px 20px rgba(0, 0, 0, 0.2);
        z-index: 10000; max-width: 400px;
        transform: translateX(100%);
        transition: transform 0.3s ease;
    `;

    document.body.appendChild(notification);
    setTimeout(() => { notification.style.transform = 'translateX(0)'; }, 100);

    closeBtn.addEventListener('click', () => removeNotification(notification));
    setTimeout(() => removeNotification(notification), 5000);
}

function removeNotification(notification) {
    notification.style.transform = 'translateX(100%)';
    setTimeout(() => { if (notification.parentNode) notification.remove(); }, 300);
}

// Scroll Effects
function initializeScrollEffects() {
    let ticking = false;
    function updateScrollEffects() {
        const scrolled = window.pageYOffset;
        const shapes = document.querySelectorAll('.floating-shape');
        shapes.forEach((shape, index) => {
            const speed = (index + 1) * 0.2;
            shape.style.transform = `translateY(${scrolled * speed}px)`;
        });
        ticking = false;
    }
    function requestTick() {
        if (!ticking) {
            requestAnimationFrame(updateScrollEffects);
            ticking = true;
        }
    }
    window.addEventListener('scroll', requestTick);
}

// Lazy Loading
function initializeLazyLoading() {
    if ('IntersectionObserver' in window) {
        const imageObserver = new IntersectionObserver(entries => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    img.src = img.dataset.src;
                    img.classList.remove('lazy');
                    imageObserver.unobserve(img);
                }
            });
        });
        document.querySelectorAll('img[data-src]').forEach(img => imageObserver.observe(img));
    }
}

// Error handling
window.addEventListener('error', function(e) {
    console.error('JavaScript error:', e.error);
});

// Service Worker Registration
if ('serviceWorker' in navigator) {
    window.addEventListener('load', function() {
        navigator.serviceWorker.register('/sw.js')
            .then(() => console.log('ServiceWorker registration successful'))
            .catch(err => console.log('ServiceWorker registration failed', err));
    });
}
