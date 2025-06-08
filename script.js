// Theme Management
class ThemeManager {
    constructor() {
        this.theme = localStorage.getItem('theme') || 'dark';
        this.init();
    }

    init() {
        document.documentElement.setAttribute('data-theme', this.theme);
        this.updateThemeIcon();
    }

    toggle() {
        this.theme = this.theme === 'light' ? 'dark' : 'light';
        document.documentElement.setAttribute('data-theme', this.theme);
        localStorage.setItem('theme', this.theme);
        this.updateThemeIcon();
        
        // Dispatch a custom event when theme changes
        const event = new CustomEvent('themeChanged', { detail: { theme: this.theme } });
        document.dispatchEvent(event);
    }

    updateThemeIcon() {
        const icon = document.querySelector('#themeToggle i');
        if (icon) {
            icon.className = this.theme === 'light' ? 'fas fa-moon' : 'fas fa-sun';
        }
    }
}

// Navigation Management
class NavigationManager {
    constructor() {
        this.navbar = document.querySelector('.navbar');
        this.hamburger = document.querySelector('.hamburger');
        this.navMenu = document.querySelector('.nav-menu');
        this.init();
    }

    init() {
        this.setupScrollEffect();
        this.setupMobileMenu();
        this.setupSmoothScrolling();
    }

    setupScrollEffect() {
        let lastScrollY = window.scrollY;
        
        const updateNavbarStyle = () => {
            const isLightTheme = document.documentElement.getAttribute('data-theme') === 'light';
            
            // Set solid background based on theme
            this.navbar.style.background = isLightTheme 
                ? 'rgb(255, 255, 255)' 
                : 'rgb(15, 15, 15)';
                
            // Box shadow only for light theme when scrolled
            this.navbar.style.boxShadow = (isLightTheme && window.scrollY > 100)
                ? '0 2px 10px rgba(0, 0, 0, 0.1)'
                : 'none';
                
            // Apply blur effect based on scroll position
            this.navbar.style.backdropFilter = `blur(${window.scrollY > 100 ? 10 : 5}px)`;
        }
    
        // Initial style application
        updateNavbarStyle();
    
        // Update on scroll
        window.addEventListener('scroll', () => {
            const currentScrollY = window.scrollY;
            updateNavbarStyle();
    
            // Hide/show navbar on scroll
            if (currentScrollY > lastScrollY && currentScrollY > 100) {
                this.navbar.style.transform = 'translateY(-100%)';
            } else {
                this.navbar.style.transform = 'translateY(0)';
            }
            
            lastScrollY = currentScrollY;
        });
    
        // Listen for theme changes with the correct event name
        document.addEventListener('themeChanged', updateNavbarStyle);
    }

    setupMobileMenu() {
        const hamburger = document.querySelector('.hamburger');
        const navMenu = document.querySelector('.nav-menu');
        
        if (hamburger && navMenu) {
            hamburger.addEventListener('click', () => {
                // Toggle active class on both hamburger and nav menu
                hamburger.classList.toggle('active');
                navMenu.classList.toggle('active');
                
                // Add aria-expanded for accessibility
                const isExpanded = hamburger.classList.contains('active');
                hamburger.setAttribute('aria-expanded', isExpanded);
            });
    
            // Close menu when clicking a link
            document.querySelectorAll('.nav-menu a').forEach(link => {
                link.addEventListener('click', () => {
                    hamburger.classList.remove('active');
                    navMenu.classList.remove('active');
                });
            });
        }
    }

    setupSmoothScrolling() {
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', (e) => {
                e.preventDefault();
                const target = document.querySelector(anchor.getAttribute('href'));
                if (target) {
                    const offsetTop = target.offsetTop - 80; // Account for fixed navbar
                    window.scrollTo({
                        top: offsetTop,
                        behavior: 'smooth'
                    });
                }
            });
        });
    }
}

// Animation Manager
class AnimationManager {
    constructor() {
        this.init();
    }

    init() {
        this.setupScrollAnimations();
        this.setupTypewriterEffect();
        this.setupParallaxEffect();
    }

    setupScrollAnimations() {
        const observerOptions = {
            threshold: 0.15,  // Increased threshold for smoother trigger
            rootMargin: '0px 0px -10% 0px'  // Adjusted root margin
        };
    
        const observer = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (!entry.target.classList.contains('fade-in')) {  // Check if animation hasn't run yet
                    if (entry.isIntersecting) {
                        // Add small delay based on element index to create stagger effect
                        const delay = Array.from(entry.target.parentElement.children).indexOf(entry.target) * 100;
                        setTimeout(() => {
                            entry.target.classList.add('fade-in');
                        }, delay);
                        
                        // Optional: Unobserve after animation
                        observer.unobserve(entry.target);
                    }
                }
            });
        }, observerOptions);
    
        // Observe elements for animation
        document.querySelectorAll('.project-card, .experience-card, .streaming-card, .skill-category').forEach(el => {
            observer.observe(el);
        });
    }

    setupTypewriterEffect() {
        const subtitle = document.querySelector('.hero-subtitle');
        if (subtitle) {
            const text = subtitle.textContent;
            subtitle.textContent = '';
            let i = 0;
            
            const typeWriter = () => {
                if (i < text.length) {
                    subtitle.textContent += text.charAt(i);
                    i++;
                    setTimeout(typeWriter, 50);
                }
            };
            
            setTimeout(typeWriter, 1000);
        }
    }

    setupParallaxEffect() {
        window.addEventListener('scroll', () => {
            const scrolled = window.pageYOffset;
            const parallaxElements = document.querySelectorAll('.video-player-mockup');
            
            parallaxElements.forEach(element => {
                const speed = 0.5;
                element.style.transform = `translateY(${scrolled * speed}px)`;
            });
        });
    }
}

class TiltEffect {
    constructor() {
        this.element = document.querySelector('.glitch');
        this.initTiltEffect();
    }

    initTiltEffect() {
        if (!this.element) return;

        this.element.addEventListener('mousemove', (e) => {
            const rect = this.element.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;
            
            const rotateX = (y - centerY) / 20;
            const rotateY = (centerX - x) / 20;
            
            this.element.style.transform = 
                `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
        });

        this.element.addEventListener('mouseleave', () => {
            this.element.style.transform = 'perspective(1000px) rotateX(0) rotateY(0)';
        });
    }
}

class PlayerManager {
    constructor() {
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => this.initialize());
        } else {
            this.initialize();
        }
    }

    initialize() {
        // Get DOM elements
        this.playButton = document.querySelector('#play-button');
        this.codeAnimation = document.querySelector('.code-animation');
        this.galleryContainer = document.querySelector('.gallery-container');
        
        // Debug log for element selection
        console.log('Play button:', this.playButton);
        console.log('Code animation:', this.codeAnimation);
        console.log('Gallery container:', this.galleryContainer);
        
        if (!this.playButton || !this.codeAnimation || !this.galleryContainer) {
            console.error('Required elements not found for PlayerManager');
            return;
        }

        this.currentSlide = 0;
        this.totalSlides = document.querySelectorAll('.gallery-slide').length;
        this.isGalleryActive = false;

        // Add click event listener
        this.playButton.addEventListener('click', () => {
            console.log('Play button clicked');
            this.switchToGallery();
        });
    }

    switchToGallery() {
        if (this.isGalleryActive) return;
        
        console.log('Switching to gallery');
        this.codeAnimation.classList.remove('active');
        this.galleryContainer.classList.add('active');
        
        // Add the expanded class to change height
        document.querySelector('.player-content').classList.add('expanded');
        
        this.isGalleryActive = true;
        this.startSlideshow();
    }

    startSlideshow() {
        setInterval(() => {
            this.currentSlide = (this.currentSlide + 1) % this.totalSlides;
            this.galleryContainer.style.transform = `translateX(-${this.currentSlide * 100}%)`;
        }, 3000);
    }
}

// Project Interaction Manager
class ProjectManager {
    constructor() {
        this.init();
    }

    init() {
        this.setupProjectHover();
        this.setupProjectModal();
    }

    setupProjectHover() {
        document.querySelectorAll('.project-card').forEach(card => {
            card.addEventListener('mouseenter', () => {
                const playButton = card.querySelector('.play-overlay');
                if (playButton) {
                    playButton.style.transform = 'scale(1.2)';
                }
            });

            card.addEventListener('mouseleave', () => {
                const playButton = card.querySelector('.play-overlay');
                if (playButton) {
                    playButton.style.transform = 'scale(1)';
                }
            });
        });
    }

    setupProjectModal() {
        // This would open a modal with project details
        document.querySelectorAll('.project-card').forEach(card => {
            card.addEventListener('click', () => {
                const projectTitle = card.querySelector('h3').textContent;
                console.log(`Opening project: ${projectTitle}`);
                // Modal implementation would go here
            });
        });
    }
}

// Form Manager
class FormManager {
    constructor() {
        this.form = document.querySelector('#contactForm');
        this.init();
    }

    init() {
        if (this.form) {
            this.setupFormValidation();
            this.setupFormSubmission();
            this.setupFloatingLabels();
        }
    }

    setupFormValidation() {
        const inputs = this.form.querySelectorAll('input, textarea');
        
        inputs.forEach(input => {
            input.addEventListener('blur', () => this.validateField(input));
            input.addEventListener('input', () => this.clearFieldError(input));
        });
    }

    validateField(field) {
        const value = field.value.trim();
        let isValid = true;
        let errorMessage = '';

        // Remove existing error
        this.clearFieldError(field);

        // Required field validation
        if (!value) {
            isValid = false;
            errorMessage = 'This field is required';
        }

        // Email validation
        if (field.type === 'email' && value) {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(value)) {
                isValid = false;
                errorMessage = 'Please enter a valid email address';
            }
        }

        if (!isValid) {
            this.showFieldError(field, errorMessage);
        }

        return isValid;
    }

    showFieldError(field, message) {
        field.classList.add('error');
        const errorDiv = document.createElement('div');
        errorDiv.className = 'field-error';
        errorDiv.textContent = message;
        field.parentNode.appendChild(errorDiv);
    }

    clearFieldError(field) {
        field.classList.remove('error');
        const existingError = field.parentNode.querySelector('.field-error');
        if (existingError) {
            existingError.remove();
        }
    }

    setupFormSubmission() {
        this.form.addEventListener('submit', (e) => {
            e.preventDefault();
            
            const inputs = this.form.querySelectorAll('input, textarea');
            let isFormValid = true;

            inputs.forEach(input => {
                if (!this.validateField(input)) {
                    isFormValid = false;
                }
            });

            if (isFormValid) {
                this.submitForm();
            }
        });
    }

    async submitForm() {
        const submitBtn = this.form.querySelector('button[type="submit"]');
        const originalText = submitBtn.innerHTML;
        
        // Show loading state
        submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';
        submitBtn.disabled = true;
    
        try {
            // Initialize EmailJS with your public key
            emailjs.init("H6_V8a7KYIVqvqpfb");
    
            // Get form data
            const formData = {
                from_name: this.form.querySelector('input[name="name"]').value,
                from_email: this.form.querySelector('input[name="email"]').value,
                message: this.form.querySelector('textarea[name="message"]').value,
                to_email: 'duon9438@stthomas.edu'
            };
    
            // Send email using EmailJS
            await emailjs.send(
                'service_nt7h0ek', // Email JS service ID
                'template_z33gphm', // Email JS template ID
                formData
            );
            
            // Show success message
            this.showSuccessMessage();
            this.form.reset();
        } catch (error) {
            console.error('Error sending email:', error);
            this.showErrorMessage();
        } finally {
            // Reset button
            submitBtn.innerHTML = originalText;
            submitBtn.disabled = false;
        }
    }

    showSuccessMessage() {
        const submitBtn = this.form.querySelector('button[type="submit"]');
        const message = document.createElement('div');
        message.className = 'form-message success';
        message.innerHTML = '<i class="fas fa-check-circle"></i> Message sent successfully!';
        
        // Hide the submit button
        submitBtn.style.display = 'none';
        
        // Insert message in place of submit button
        submitBtn.parentNode.insertBefore(message, submitBtn);
        
        // Remove message and show button after 5 seconds
        setTimeout(() => {
            message.remove();
            submitBtn.style.display = 'block';
        }, 5000);
    }

    showErrorMessage() {
        const submitBtn = this.form.querySelector('button[type="submit"]');
        const message = document.createElement('div');
        message.className = 'form-message error';
        message.innerHTML = '<i class="fas fa-exclamation-circle"></i> Failed to send message. Please try again.';
        
        // Hide the submit button
        submitBtn.style.display = 'none';
        
        // Insert message in place of submit button
        submitBtn.parentNode.insertBefore(message, submitBtn);
        
        // Remove message and show button after 5 seconds
        setTimeout(() => {
            message.remove();
            submitBtn.style.display = 'block';
        }, 5000);
    }

    setupFloatingLabels() {
        const formGroups = this.form.querySelectorAll('.form-group');
        
        formGroups.forEach(group => {
            const input = group.querySelector('input, textarea');
            const label = group.querySelector('label');
            
            if (input && label) {
                // Check if field has value on page load
                if (input.value) {
                    label.classList.add('active');
                }
                
                input.addEventListener('focus', () => {
                    label.classList.add('active');
                });
                
                input.addEventListener('blur', () => {
                    if (!input.value) {
                        label.classList.remove('active');
                    }
                });
            }
        });
    }
}

// Statistics Counter
class StatsCounter {
    constructor() {
        this.init();
    }

    init() {
        this.setupCounterAnimation();
    }

    setupCounterAnimation() {
        const stats = document.querySelectorAll('.stat-number');
        
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    this.animateCounter(entry.target);
                    observer.unobserve(entry.target);
                }
            });
        });

        stats.forEach(stat => observer.observe(stat));
    }

    animateCounter(element) {
        const target = parseFloat(element.textContent);
        const increment = target / 50;
        let current = 0;
        
        const timer = setInterval(() => {
            current += increment;
            if (current >= target) {
                element.textContent = target.toString();
                clearInterval(timer);
            } else {
                element.textContent = Math.floor(current).toString();
            }
        }, 50);
    }
}

// Cursor Effect (optional enhancement)
class CursorEffect {
    constructor() {
        this.cursor = null;
        this.init();
    }

    init() {
        this.createCursor();
        this.setupCursorMovement();
        this.setupHoverEffects();
    }

    createCursor() {
        this.cursor = document.createElement('div');
        this.cursor.className = 'custom-cursor';
        this.cursor.style.cssText = `
            position: fixed;
            width: 20px;
            height: 20px;
            background: var(--primary-color);
            border-radius: 50%;
            pointer-events: none;
            z-index: 9999;
            transition: transform 0.1s ease;
            opacity: 0;
        `;
        document.body.appendChild(this.cursor);
    }

    setupCursorMovement() {
        document.addEventListener('mousemove', (e) => {
            this.cursor.style.left = e.clientX - 10 + 'px';
            this.cursor.style.top = e.clientY - 10 + 'px';
            this.cursor.style.opacity = '0.8';
        });

        document.addEventListener('mouseleave', () => {
            this.cursor.style.opacity = '0';
        });
    }

    setupHoverEffects() {
        const hoverElements = document.querySelectorAll('a, button, .project-card, .skill-tag');
        
        hoverElements.forEach(element => {
            element.addEventListener('mouseenter', () => {
                this.cursor.style.transform = 'scale(1.5)';
                this.cursor.style.background = 'var(--secondary-color)';
            });

            element.addEventListener('mouseleave', () => {
                this.cursor.style.transform = 'scale(1)';
                this.cursor.style.background = 'var(--primary-color)';
            });
        });
    }
}

// Initialize everything when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    // Initialize theme first
    const themeManager = new ThemeManager();
    
    // Setup theme toggle
    const themeToggle = document.querySelector('#themeToggle');
    if (themeToggle) {
        themeToggle.addEventListener('click', () => {
            themeManager.toggle();
        });
    }

    // Initialize other managers
    new NavigationManager();
    new AnimationManager();
    new TiltEffect();
    new ProjectManager();
    new FormManager();
    new StatsCounter();
    const playerManager = new PlayerManager();
    
    // Optional cursor effect (uncomment if desired)
    // new CursorEffect();

    // Add loading animation
    window.addEventListener('load', () => {
        document.body.classList.add('loaded');
    });
});

// Utility functions
const utils = {
    // Debounce function for performance
    debounce: (func, wait) => {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    },

    // Throttle function for scroll events
    throttle: (func, limit) => {
        let inThrottle;
        return function() {
            const args = arguments;
            const context = this;
            if (!inThrottle) {
                func.apply(context, args);
                inThrottle = true;
                setTimeout(() => inThrottle = false, limit);
            }
        };
    },

    // Check if element is in viewport
    isInViewport: (element) => {
        const rect = element.getBoundingClientRect();
        return (
            rect.top >= 0 &&
            rect.left >= 0 &&
            rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
            rect.right <= (window.innerWidth || document.documentElement.clientWidth)
        );
    }
};

// Performance optimizations
window.addEventListener('scroll', utils.throttle(() => {
    // Throttled scroll events
}, 16));

window.addEventListener('resize', utils.debounce(() => {
    // Debounced resize events
}, 250));