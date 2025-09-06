// Main TypeScript File for Portfolio Website

document.addEventListener('DOMContentLoaded', () => {
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
  
  // -----------------------------
  // Navigation Functionality
  // -----------------------------
  function initializeNavigation(): void {
    const hamburger = document.getElementById('hamburger') as HTMLElement | null;
    const navMenu = document.getElementById('nav-menu') as HTMLElement | null;
    const navLinks = document.querySelectorAll('.nav-link') as NodeListOf<HTMLAnchorElement>;
    const navbar = document.getElementById('navbar') as HTMLElement | null;
  
    if (hamburger && navMenu) {
      hamburger.addEventListener('click', () => {
        hamburger.classList.toggle('active');
        navMenu.classList.toggle('active');
      });
  
      navLinks.forEach((link) => {
        link.addEventListener('click', () => {
          hamburger.classList.remove('active');
          navMenu.classList.remove('active');
        });
      });
    }
  
    if (navbar) {
      window.addEventListener('scroll', () => {
        if (window.scrollY > 100) {
          navbar.style.background = 'rgba(255, 255, 255, 0.98)';
          navbar.style.boxShadow = '0 2px 20px rgba(0, 0, 0, 0.1)';
        } else {
          navbar.style.background = 'rgba(255, 255, 255, 0.95)';
          navbar.style.boxShadow = 'none';
        }
      });
    }
  
    const sections = document.querySelectorAll('section[id]') as NodeListOf<HTMLElement>;
  
    function highlightActiveLink(): void {
      const scrollY = window.pageYOffset;
      sections.forEach((section) => {
        const sectionHeight = section.offsetHeight;
        const sectionTop = section.offsetTop - 100;
        const sectionId = section.getAttribute('id');
  
        if (sectionId && scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
          navLinks.forEach((link) => {
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
  
  // -----------------------------
  // Smooth Scrolling
  // -----------------------------
  function initializeSmoothScrolling(): void {
    const scrollLinks = document.querySelectorAll('a[href^="#"]') as NodeListOf<HTMLAnchorElement>;
    scrollLinks.forEach((link) => {
      link.addEventListener('click', function (e) {
        e.preventDefault();
        const targetId = (this as HTMLAnchorElement).getAttribute('href');
        if (!targetId) return;
        const targetSection = document.querySelector(targetId) as HTMLElement | null;
        if (targetSection) {
          const headerOffset = 80;
          const elementPosition = targetSection.getBoundingClientRect().top;
          const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
          window.scrollTo({ top: offsetPosition, behavior: 'smooth' });
        }
      });
    });
  }
  
  // -----------------------------
  // Scroll Animations
  // -----------------------------
  function initializeScrollAnimations(): void {
    const observerOptions: IntersectionObserverInit = { threshold: 0.1, rootMargin: '0px 0px -50px 0px' };
  
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          (entry.target as HTMLElement).classList.add('visible');
  
          if ((entry.target as HTMLElement).classList.contains('stagger-animation')) {
            Array.from((entry.target as HTMLElement).children).forEach((child, index) => {
              const el = child as HTMLElement;
              setTimeout(() => {
                el.style.opacity = '1';
                el.style.transform = 'translateY(0)';
              }, index * 100);
            });
          }
        }
      });
    }, observerOptions);
  
    document
      .querySelectorAll(
        '.animate-slide-up, .animate-slide-left, .animate-slide-right, .animate-fade-in, .fade-in-on-scroll, .slide-left-on-scroll, .slide-right-on-scroll, .scale-in-on-scroll, .stagger-animation'
      )
      .forEach((el) => observer.observe(el));
  }
  
  // -----------------------------
  // Skill Bars Animation
  // -----------------------------
  function initializeSkillBars(): void {
    const skillBars = document.querySelectorAll('.skill-progress') as NodeListOf<HTMLElement>;
    if (skillBars.length === 0) return;
  
    const skillObserver = new IntersectionObserver((entries, obs) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const skillBar = entry.target as HTMLElement;
          const widthAttr = skillBar.getAttribute('data-width');
          const width = widthAttr ? parseInt(widthAttr, 10) : 0;
          setTimeout(() => {
            skillBar.style.width = `${width}%`;
          }, 500);
          obs.unobserve(skillBar);
        }
      });
    }, { threshold: 0.5 });
  
    skillBars.forEach((bar) => skillObserver.observe(bar));
  }
  
  // -----------------------------
  // Portfolio Filters
  // -----------------------------
  function initializePortfolioFilters(): void {
    const filterButtons = document.querySelectorAll('.filter-btn') as NodeListOf<HTMLButtonElement>;
    const portfolioItems = document.querySelectorAll('.portfolio-item') as NodeListOf<HTMLElement>;
    if (filterButtons.length === 0 || portfolioItems.length === 0) return;
  
    filterButtons.forEach((button) => {
      button.addEventListener('click', function () {
        const filter = (this as HTMLButtonElement).getAttribute('data-filter');
        filterButtons.forEach((btn) => btn.classList.remove('active'));
        this.classList.add('active');
  
        portfolioItems.forEach((item) => {
          const category = item.getAttribute('data-category');
          if (filter === 'all' || category === filter) {
            item.style.display = 'block';
            item.classList.remove('hidden');
            setTimeout(() => {
              item.style.opacity = '1';
              item.style.transform = 'scale(1)';
            }, 100);
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
  
  // -----------------------------
  // Testimonial Slider
  // -----------------------------
  function initializeTestimonialSlider(): void {
    const testimonialSlider = document.querySelector('.testimonials-slider') as HTMLElement | null;
    const testimonialCards = document.querySelectorAll('.testimonial-card') as NodeListOf<HTMLElement>;
    const prevBtn = document.getElementById('prev-testimonial') as HTMLButtonElement | null;
    const nextBtn = document.getElementById('next-testimonial') as HTMLButtonElement | null;
    if (!testimonialSlider || testimonialCards.length === 0) return;
  
    let currentIndex = 0;
    let autoPlayInterval: number | undefined;
    let autoPlayActive = true;
  
    function updateSliderLayout(): void {
      if (window.innerWidth <= 768) {
        testimonialSlider.style.display = 'flex';
        testimonialSlider.style.overflowX = 'auto';
        (testimonialSlider.style as any).scrollSnapType = 'x mandatory';
        testimonialCards.forEach((card) => {
          card.style.minWidth = '300px';
          (card.style as any).scrollSnapAlign = 'start';
        });
      } else {
        testimonialSlider.style.display = 'grid';
        testimonialSlider.style.overflowX = 'visible';
        testimonialCards.forEach((card) => {
          card.style.minWidth = 'auto';
        });
      }
    }
  
    function startAutoPlay(): void {
      if (autoPlayInterval) window.clearInterval(autoPlayInterval);
      if (window.innerWidth <= 768 && autoPlayActive) {
        autoPlayInterval = window.setInterval(() => {
          currentIndex = (currentIndex + 1) % testimonialCards.length;
          scrollToTestimonial(currentIndex);
        }, 4000);
      }
    }
  
    function scrollToTestimonial(index: number): void {
      if (window.innerWidth <= 768) {
        const first = testimonialCards[0];
        const cardWidth = first ? first.offsetWidth + 32 : 0; // 32 ≈ gap
        testimonialSlider.scrollTo({ left: index * cardWidth, behavior: 'smooth' });
      }
    }
  
    if (nextBtn)
      nextBtn.addEventListener('click', () => {
        currentIndex = (currentIndex + 1) % testimonialCards.length;
        scrollToTestimonial(currentIndex);
        autoPlayActive = false;
        if (autoPlayInterval) window.clearInterval(autoPlayInterval);
      });
  
    if (prevBtn)
      prevBtn.addEventListener('click', () => {
        currentIndex = (currentIndex - 1 + testimonialCards.length) % testimonialCards.length;
        scrollToTestimonial(currentIndex);
        autoPlayActive = false;
        if (autoPlayInterval) window.clearInterval(autoPlayInterval);
      });
  
    testimonialSlider.addEventListener('mouseenter', () => {
      if (autoPlayInterval) window.clearInterval(autoPlayInterval);
    });
    testimonialSlider.addEventListener('mouseleave', startAutoPlay);
  
    updateSliderLayout();
    startAutoPlay();
    window.addEventListener('resize', () => {
      updateSliderLayout();
      startAutoPlay();
    });
  }
  
  // -----------------------------
  // Contact Form
  // -----------------------------
  function initializeContactForm(): void {
    const contactForm = document.getElementById('contact-form') as HTMLFormElement | null;
    if (!contactForm) return;
  
    contactForm.addEventListener('submit', function (e) {
      e.preventDefault();
  
      const formData = new FormData(contactForm);
      // Convert to Record<string, string>
      const data = Object.fromEntries(formData.entries()) as unknown as Record<string, string>;
  
      if (!validateForm(data)) return;
      submitForm(data);
    });
  }
  
  function validateForm(data: Record<string, string>): boolean {
    const requiredFields = ['firstName', 'lastName', 'email', 'service', 'budget', 'message'];
    const errors: string[] = [];
  
    requiredFields.forEach((field) => {
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
  
  function submitForm(data: Record<string, string>): void {
    const submitBtn = document.querySelector('#contact-form button[type="submit"]') as HTMLButtonElement | null;
    if (!submitBtn) return;
  
    const originalText = submitBtn.innerHTML;
    submitBtn.innerHTML = `<span>Sending...</span><div class="loading-spinner" style="margin-left: 10px;"></div>`;
    submitBtn.disabled = true;
  
    setTimeout(() => {
      submitBtn.innerHTML = originalText;
      submitBtn.disabled = false;
      showNotification("Thank you! I'll reply within 24 hours.", 'success');
      const form = document.getElementById('contact-form') as HTMLFormElement | null;
      form?.reset();
      console.log('Form submitted:', data);
    }, 2000);
  }
  
  // -----------------------------
  // Notifications
  // -----------------------------
  function showNotification(message: string, type: 'info' | 'success' | 'error' = 'info'): void {
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
    setTimeout(() => {
      notification.style.transform = 'translateX(0)';
    }, 100);
  
    closeBtn.addEventListener('click', () => removeNotification(notification));
    setTimeout(() => removeNotification(notification), 5000);
  }
  
  function removeNotification(notification: HTMLElement): void {
    notification.style.transform = 'translateX(100%)';
    setTimeout(() => {
      if (notification.parentNode) notification.remove();
    }, 300);
  }
  
  // -----------------------------
  // Scroll Effects
  // -----------------------------
  function initializeScrollEffects(): void {
    let ticking = false;
    function updateScrollEffects(): void {
      const scrolled = window.pageYOffset;
      const shapes = document.querySelectorAll('.floating-shape') as NodeListOf<HTMLElement>;
      shapes.forEach((shape, index) => {
        const speed = (index + 1) * 0.2;
        shape.style.transform = `translateY(${scrolled * speed}px)`;
      });
      ticking = false;
    }
    function requestTick(): void {
      if (!ticking) {
        requestAnimationFrame(updateScrollEffects);
        ticking = true;
      }
    }
    window.addEventListener('scroll', requestTick);
  }
  
  // -----------------------------
  // Lazy Loading
  // -----------------------------
  function initializeLazyLoading(): void {
    if ('IntersectionObserver' in window) {
      const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const img = entry.target as HTMLImageElement;
            if (img.dataset.src) img.src = img.dataset.src;
            img.classList.remove('lazy');
            observer.unobserve(img);
          }
        });
      });
      document.querySelectorAll('img[data-src]').forEach((img) => imageObserver.observe(img));
    }
  }
  
  // -----------------------------
  // Error handling
  // -----------------------------
  window.addEventListener('error', (e) => 
    console.error('JavaScript error:', (e as ErrorEvent).error || e.message);
  });
  
  // -----------------------------
  // Service Worker Registration
  // -----------------------------
  if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
      navigator.serviceWorker
        .register('/sw.js')
        .then(() => console.log('ServiceWorker registration successful'))
        .catch((err) => console.log('ServiceWorker registration failed', err));
    });
  }
  