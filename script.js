// Particle animation system
class ParticleSystem {
    constructor() {
        this.container = document.getElementById('particles');
        this.particles = [];
        this.particleCount = 50;
        this.init();
    }

    init() {
        for (let i = 0; i < this.particleCount; i++) {
            this.createParticle();
        }
    }

    createParticle() {
        const particle = document.createElement('div');
        particle.className = 'particle';
        
        // Random starting position
        particle.style.left = Math.random() * 100 + '%';
        particle.style.top = '100%';
        
        // Random animation duration
        const duration = 15 + Math.random() * 20;
        particle.style.animationDuration = duration + 's';
        
        // Random animation delay
        const delay = Math.random() * duration;
        particle.style.animationDelay = delay + 's';
        
        // Random size
        const size = 2 + Math.random() * 4;
        particle.style.width = size + 'px';
        particle.style.height = size + 'px';
        
        // Random opacity
        particle.style.opacity = 0.1 + Math.random() * 0.5;
        
        this.container.appendChild(particle);
        this.particles.push(particle);
    }
}

// Email validation
function validateEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

// Show form message
function showMessage(message, type) {
    const messageElement = document.getElementById('form-message');
    messageElement.textContent = message;
    messageElement.className = `form-message show ${type}`;
    
    // Hide message after 5 seconds
    setTimeout(() => {
        messageElement.classList.remove('show');
    }, 5000);
}

// Handle form submission
async function handleFormSubmit(e) {
    e.preventDefault();
    
    const emailInput = document.getElementById('email-input');
    const submitBtn = document.querySelector('.submit-btn');
    const btnText = submitBtn.querySelector('.btn-text');
    const email = emailInput.value.trim();
    
    // Validate email
    if (!validateEmail(email)) {
        showMessage('Please enter a valid email address', 'error');
        emailInput.focus();
        return;
    }
    
    // Add loading state
    submitBtn.classList.add('loading');
    btnText.textContent = 'Submitting...';
    
    try {
        // Submit to Google Apps Script
        const response = await fetch(GOOGLE_SCRIPT_URL, {
            method: 'POST',
            mode: 'no-cors',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                email: email,
                timestamp: new Date().toISOString(),
                source: 'gatoms-coming-soon',
                userAgent: navigator.userAgent,
                referrer: document.referrer || 'direct'
            })
        });
        
        // Since mode is 'no-cors', we can't read the response
        // but if no error is thrown, we assume success
            showMessage('🎉 Thank you! We\'ll notify you when we launch.', 'success');
            emailInput.value = '';
            
            // Add celebration animation
            createCelebration();
        
        // Track submission in localStorage for analytics
        const submissions = JSON.parse(localStorage.getItem('gatoms_submissions') || '[]');
        submissions.push({
            email: email,
            timestamp: new Date().toISOString()
        });
        localStorage.setItem('gatoms_submissions', JSON.stringify(submissions));
        
    } catch (error) {
        // Error handling
        console.error('Submission error:', error);
        showMessage('Oops! Something went wrong. Please try again.', 'error');
        
        // Fallback: save to localStorage if Google Script fails
        const fallbackSubmissions = JSON.parse(localStorage.getItem('gatoms_fallback') || '[]');
        fallbackSubmissions.push({
            email: email,
            timestamp: new Date().toISOString(),
            status: 'fallback'
        });
        localStorage.setItem('gatoms_fallback', JSON.stringify(fallbackSubmissions));
    } finally {
        // Remove loading state
        submitBtn.classList.remove('loading');
        btnText.textContent = 'Notify Me';
    }
}

// Celebration animation
function createCelebration() {
    const colors = ['#667eea', '#764ba2', '#f093fb', '#f5576c', '#4facfe', '#00f2fe'];
    const container = document.querySelector('.container');
    
    for (let i = 0; i < 30; i++) {
        const confetti = document.createElement('div');
        confetti.style.cssText = `
            position: fixed;
            width: 10px;
            height: 10px;
            background: ${colors[Math.floor(Math.random() * colors.length)]};
            left: 50%;
            top: 50%;
            transform: translate(-50%, -50%);
            border-radius: 50%;
            pointer-events: none;
            z-index: 1000;
        `;
        
        container.appendChild(confetti);
        
        // Animate confetti
        const angle = (i / 30) * 360;
        const velocity = 5 + Math.random() * 5;
        const x = Math.cos(angle * Math.PI / 180) * velocity;
        const y = Math.sin(angle * Math.PI / 180) * velocity;
        
        confetti.animate([
            { 
                transform: 'translate(-50%, -50%) scale(0)',
                opacity: 1 
            },
            { 
                transform: `translate(calc(-50% + ${x * 20}px), calc(-50% + ${y * 20}px)) scale(1)`,
                opacity: 1 
            },
            { 
                transform: `translate(calc(-50% + ${x * 50}px), calc(-50% + ${y * 50}px + 100px)) scale(0.5)`,
                opacity: 0 
            }
        ], {
            duration: 1500,
            easing: 'cubic-bezier(0.25, 0.46, 0.45, 0.94)'
        });
        
        // Remove confetti after animation
        setTimeout(() => confetti.remove(), 1500);
    }
}

// Interactive hover effects for feature cards
function addFeatureCardEffects() {
    const featureCards = document.querySelectorAll('.feature-card');
    
    featureCards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            // Add ripple effect
            const ripple = document.createElement('div');
            ripple.style.cssText = `
                position: absolute;
                top: 50%;
                left: 50%;
                width: 0;
                height: 0;
                border-radius: 50%;
                background: rgba(255, 255, 255, 0.2);
                transform: translate(-50%, -50%);
                pointer-events: none;
            `;
            
            this.style.position = 'relative';
            this.appendChild(ripple);
            
            ripple.animate([
                { width: '0', height: '0', opacity: 1 },
                { width: '200px', height: '200px', opacity: 0 }
            ], {
                duration: 600,
                easing: 'ease-out'
            });
            
            setTimeout(() => ripple.remove(), 600);
        });
    });
}

// Add magnetic effect to submit button
function addMagneticEffect() {
    const submitBtn = document.querySelector('.submit-btn');
    let rect = submitBtn.getBoundingClientRect();
    
    // Update rect on window resize
    window.addEventListener('resize', () => {
        rect = submitBtn.getBoundingClientRect();
    });
    
    submitBtn.addEventListener('mousemove', (e) => {
        const x = e.clientX - rect.left - rect.width / 2;
        const y = e.clientY - rect.top - rect.height / 2;
        
        submitBtn.style.transform = `translate(${x * 0.1}px, ${y * 0.1}px)`;
    });
    
    submitBtn.addEventListener('mouseleave', () => {
        submitBtn.style.transform = 'translate(0, 0)';
    });
}


// Count Up Animation
class CountUpAnimation {
    constructor() {
        this.countElements = document.querySelectorAll('.count-up');
        this.init();
    }

    init() {
        // Start count up after a delay
        setTimeout(() => {
            this.countElements.forEach(el => this.animateCount(el));
        }, 1500);
    }

    animateCount(element) {
        const target = parseInt(element.getAttribute('data-target'));
        const duration = 2000;
        const start = 0;
        const increment = target / (duration / 16);
        let current = start;

        const timer = setInterval(() => {
            current += increment;
            element.textContent = Math.floor(current);

            if (current >= target) {
                clearInterval(timer);
                element.textContent = target;
            }
        }, 16);
    }
}

// Button Particle Effects
class ButtonParticles {
    constructor() {
        this.submitBtn = document.querySelector('.submit-btn');
        this.init();
    }

    init() {
        if (this.submitBtn) {
            this.submitBtn.addEventListener('mouseenter', () => this.createHoverParticles());
            this.submitBtn.addEventListener('click', () => this.createClickParticles());
        }
    }

    createHoverParticles() {
        const particleContainer = this.submitBtn.querySelector('.btn-particles');
        if (!particleContainer) return;

        // Clear existing particles
        particleContainer.innerHTML = '';

        // Create 8 particles
        for (let i = 0; i < 8; i++) {
            const particle = document.createElement('div');
            particle.style.cssText = `
            position: absolute;
                width: 3px;
                height: 3px;
                background: rgba(255, 255, 255, 0.8);
            border-radius: 50%;
            pointer-events: none;
        `;
        
            const angle = (i / 8) * 360;
            const radius = 20 + Math.random() * 10;
            const x = Math.cos(angle * Math.PI / 180) * radius;
            const y = Math.sin(angle * Math.PI / 180) * radius;

            particle.style.left = `calc(50% + ${x}px)`;
            particle.style.top = `calc(50% + ${y}px)`;

            particleContainer.appendChild(particle);

            particle.animate([
                { 
                    transform: 'scale(0)',
                    opacity: 0 
                },
                { 
                    transform: 'scale(1)',
                    opacity: 1 
                },
                { 
                    transform: 'scale(0)',
                    opacity: 0 
                }
            ], {
                duration: 1500,
                delay: i * 100,
                easing: 'ease-in-out',
                iterations: Infinity
            });
        }
    }

    createClickParticles() {
        const rect = this.submitBtn.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;

        for (let i = 0; i < 15; i++) {
            const particle = document.createElement('div');
            particle.style.cssText = `
                position: fixed;
                width: 4px;
                height: 4px;
                background: rgba(255, 255, 255, 0.9);
                left: ${centerX}px;
                top: ${centerY}px;
                border-radius: 50%;
                pointer-events: none;
                z-index: 1000;
            `;

            document.body.appendChild(particle);

            const angle = (i / 15) * 360;
            const velocity = 30 + Math.random() * 40;
            const x = Math.cos(angle * Math.PI / 180) * velocity;
            const y = Math.sin(angle * Math.PI / 180) * velocity;

            particle.animate([
                { 
                    transform: 'translate(0, 0) scale(1)',
                opacity: 1 
            },
            { 
                    transform: `translate(${x}px, ${y}px) scale(0.5)`,
                opacity: 0 
            }
        ], {
                duration: 800,
                easing: 'cubic-bezier(0.25, 0.46, 0.45, 0.94)'
            });

            setTimeout(() => particle.remove(), 800);
        }
    }
}

// Enhanced Parallax Effects
class ParallaxEffects {
    constructor() {
        this.shapes = document.querySelectorAll('.shape');
        this.particles = document.querySelector('.particles-container');
        this.grid = document.querySelector('.grid-background');
        this.init();
    }

    init() {
        window.addEventListener('scroll', () => this.updateParallax());
        window.addEventListener('mousemove', (e) => this.updateMouseParallax(e));
    }

    updateParallax() {
        const scrolled = window.pageYOffset;
        const rate = scrolled * -0.5;

        if (this.particles) {
            this.particles.style.transform = `translateY(${rate * 0.3}px)`;
        }

        if (this.grid) {
            this.grid.style.transform = `translate(${rate * 0.1}px, ${rate * 0.1}px)`;
        }

        this.shapes.forEach((shape, index) => {
            const speed = 0.1 + (index * 0.05);
            shape.style.transform = `translateY(${scrolled * speed}px)`;
        });
    }

    updateMouseParallax(e) {
        const x = (e.clientX / window.innerWidth) * 100;
        const y = (e.clientY / window.innerHeight) * 100;

        this.shapes.forEach((shape, index) => {
            const speed = 1 + (index * 0.5);
            const moveX = (x - 50) * speed * 0.01;
            const moveY = (y - 50) * speed * 0.01;
            
            shape.style.transform += ` translate(${moveX}px, ${moveY}px)`;
        });
    }
}

// Initialize everything when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    // Initialize systems
    new ParticleSystem();
    new ThemeManager();
    new AtomicLogo3D();
    new CountUpAnimation();
    new ButtonParticles();
    new ParallaxEffects();
    
    // Add form submission handler
    const form = document.getElementById('email-form');
    form.addEventListener('submit', handleFormSubmit);
    
    // Add interactive effects
    addFeatureCardEffects();
    addMagneticEffect();
    
    // Add keyboard navigation
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' && document.activeElement !== document.getElementById('email-input')) {
            document.getElementById('email-input').focus();
        }
        
        // Theme toggle with 'T' key
        if (e.key.toLowerCase() === 't' && !e.target.matches('input, textarea')) {
            document.getElementById('theme-toggle').click();
        }
    });
    
    // Add smooth theme transition
    document.documentElement.style.transition = 'all 0.3s ease';
    
    // Add loading animation complete
    setTimeout(() => {
        document.body.classList.add('loaded');
    }, 100);
});

// Theme Management
class ThemeManager {
    constructor() {
        this.theme = localStorage.getItem('theme') || 'dark';
        this.init();
    }

    init() {
        this.setTheme(this.theme);
        this.bindEvents();
    }

    setTheme(theme) {
        this.theme = theme;
        document.documentElement.setAttribute('data-theme', theme);
        localStorage.setItem('theme', theme);
        
        // Update toggle button animation
        const toggle = document.getElementById('theme-toggle');
        if (toggle) {
            toggle.style.transform = 'translateY(-50%) scale(0.9)';
            setTimeout(() => {
                toggle.style.transform = 'translateY(-50%) scale(1)';
            }, 100);
        }
    }

    toggleTheme() {
        const newTheme = this.theme === 'dark' ? 'light' : 'dark';
        this.setTheme(newTheme);
        
        // Add celebration animation for theme change
        this.createThemeChangeEffect();
    }

    bindEvents() {
        const toggle = document.getElementById('theme-toggle');
        if (toggle) {
            toggle.addEventListener('click', () => this.toggleTheme());
        }
    }

    createThemeChangeEffect() {
        const colors = this.theme === 'light' ? 
            ['#4f46e5', '#7c3aed', '#ec4899', '#ef4444'] : 
            ['#667eea', '#764ba2', '#f093fb', '#f5576c'];
        
        const toggle = document.getElementById('theme-toggle');
        const rect = toggle.getBoundingClientRect();
        
        for (let i = 0; i < 12; i++) {
            const particle = document.createElement('div');
            particle.style.cssText = `
                position: fixed;
                width: 6px;
                height: 6px;
                background: ${colors[Math.floor(Math.random() * colors.length)]};
                left: ${rect.left + rect.width / 2}px;
                top: ${rect.top + rect.height / 2}px;
                border-radius: 50%;
                pointer-events: none;
                z-index: 1000;
            `;
            
            document.body.appendChild(particle);
            
            const angle = (i / 12) * 360;
            const distance = 40 + Math.random() * 20;
            const x = Math.cos(angle * Math.PI / 180) * distance;
            const y = Math.sin(angle * Math.PI / 180) * distance;
            
            particle.animate([
                { 
                    transform: 'translate(0, 0) scale(0)',
                    opacity: 1 
                },
                { 
                    transform: `translate(${x}px, ${y}px) scale(1)`,
                    opacity: 1 
                },
                { 
                    transform: `translate(${x * 1.5}px, ${y * 1.5}px) scale(0)`,
                    opacity: 0 
                }
            ], {
                duration: 800,
                easing: 'cubic-bezier(0.25, 0.46, 0.45, 0.94)'
            });
            
            setTimeout(() => particle.remove(), 800);
        }
    }
}

// Enhanced 3D Atomic Logo Animation
class AtomicLogo3D {
    constructor() {
        this.logo = document.querySelector('.atomic-logo-3d');
        this.electrons = document.querySelectorAll('.electron');
        this.nucleus = document.querySelector('.nucleus-core');
        this.orbits = document.querySelectorAll('.electron-orbit');
        this.energyRings = document.querySelectorAll('.energy-ring');
        this.scene = document.querySelector('.logo-scene');
        this.isReacting = false;
        this.init();
    }

    init() {
        this.bindEvents();
        this.startRandomEffects();
        this.addMouseTracking();
    }

    bindEvents() {
        if (this.logo) {
            this.logo.addEventListener('click', () => this.triggerAtomicReaction());
            this.logo.addEventListener('mouseenter', () => this.speedUpElectrons());
            this.logo.addEventListener('mouseleave', () => this.normalizeElectrons());
        }
    }

    addMouseTracking() {
        if (!this.logo) return;
        
        this.logo.addEventListener('mousemove', (e) => {
            if (this.isReacting) return;
            
            const rect = this.logo.getBoundingClientRect();
            const centerX = rect.left + rect.width / 2;
            const centerY = rect.top + rect.height / 2;
            
            const mouseX = e.clientX - centerX;
            const mouseY = e.clientY - centerY;
            
            const rotateX = (mouseY / rect.height) * 30;
            const rotateY = (mouseX / rect.width) * 30;
            
            this.scene.style.transform = `rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
        });
        
        this.logo.addEventListener('mouseleave', () => {
            if (!this.isReacting) {
                this.scene.style.transform = 'rotateX(0deg) rotateY(0deg)';
            }
        });
    }

    speedUpElectrons() {
        this.orbits.forEach((orbit, index) => {
            const currentDurations = [8, 12, 10];
            orbit.style.animationDuration = `${currentDurations[index] * 0.3}s`;
        });
        
        this.nucleus.style.animationDuration = '1s';
        
        // Speed up energy rings
        this.energyRings.forEach(ring => {
            ring.style.animationDuration = '2s';
        });
        
        // Add glow to electrons
        this.electrons.forEach(electron => {
            electron.style.boxShadow = '0 0 30px currentColor';
        });
    }

    normalizeElectrons() {
        this.orbits.forEach((orbit, index) => {
            const currentDurations = [8, 12, 10];
            orbit.style.animationDuration = `${currentDurations[index]}s`;
        });
        
        this.nucleus.style.animationDuration = '4s';
        
        // Reset energy rings
        this.energyRings.forEach(ring => {
            ring.style.animationDuration = '4s';
        });
        
        // Reset electron glow
        this.electrons.forEach(electron => {
            electron.style.boxShadow = '0 0 15px currentColor';
        });
    }

    triggerAtomicReaction() {
        if (this.isReacting) return;
        this.isReacting = true;
        
        // Create massive energy burst
        const burst = document.createElement('div');
        burst.style.cssText = `
            position: absolute;
            top: 50%;
            left: 50%;
            width: 400px;
            height: 400px;
            border: 4px solid rgba(79, 172, 254, 1);
            border-radius: 50%;
            transform: translate(-50%, -50%) scale(0);
            pointer-events: none;
            z-index: 200;
            box-shadow: 0 0 100px rgba(79, 172, 254, 0.8);
        `;
        
        this.logo.appendChild(burst);
        
        // Animate massive burst with multiple waves
        this.createEnergyWaves(burst);
        
        // Extreme speed for all animations
        this.orbits.forEach(orbit => {
            orbit.style.animationDuration = '0.2s';
        });
        
        this.nucleus.style.animationDuration = '0.1s';
        
        // Intense effects
        this.logo.style.filter = 'brightness(2) saturate(2)';
        this.scene.style.transform = 'rotateX(0deg) rotateY(0deg) scale(1.2)';
        
        // Create 3D particle explosion
        this.create3DParticleExplosion();
        
        // Reset after reaction
        setTimeout(() => {
            this.normalizeElectrons();
            this.logo.style.filter = 'none';
            this.scene.style.transform = 'rotateX(0deg) rotateY(0deg) scale(1)';
            burst.remove();
            this.isReacting = false;
        }, 2000);
    }

    createEnergyWaves(burst) {
        // Multiple expanding energy waves
        for (let i = 0; i < 3; i++) {
            setTimeout(() => {
                burst.animate([
                    { 
                        transform: 'translate(-50%, -50%) scale(0)',
                        opacity: 1,
                        borderColor: 'rgba(79, 172, 254, 1)'
                    },
                    { 
                        transform: 'translate(-50%, -50%) scale(0.8)',
                        opacity: 0.8,
                        borderColor: 'rgba(240, 147, 251, 0.8)'
                    },
                    { 
                        transform: 'translate(-50%, -50%) scale(1.5)',
                        opacity: 0,
                        borderColor: 'rgba(0, 242, 254, 0.2)'
                    }
                ], {
                    duration: 800,
                    easing: 'cubic-bezier(0.25, 0.46, 0.45, 0.94)'
                });
            }, i * 200);
        }
    }

    create3DParticleExplosion() {
        const colors = ['#4facfe', '#f093fb', '#00f2fe', '#667eea', '#764ba2'];
        const logoRect = this.logo.getBoundingClientRect();
        const centerX = logoRect.left + logoRect.width / 2;
        const centerY = logoRect.top + logoRect.height / 2;
        
        // Create 50 particles in 3D space
        for (let i = 0; i < 50; i++) {
            const particle = document.createElement('div');
            const size = 3 + Math.random() * 8;
            
            particle.style.cssText = `
                position: fixed;
                width: ${size}px;
                height: ${size}px;
                background: ${colors[Math.floor(Math.random() * colors.length)]};
                left: ${centerX}px;
                top: ${centerY}px;
                border-radius: 50%;
                pointer-events: none;
                z-index: 1000;
                box-shadow: 0 0 20px currentColor;
            `;
            
            document.body.appendChild(particle);
            
            // 3D movement calculation
            const theta = Math.random() * 2 * Math.PI; // Horizontal angle
            const phi = Math.random() * Math.PI; // Vertical angle
            const velocity = 80 + Math.random() * 120;
            
            const x = Math.sin(phi) * Math.cos(theta) * velocity;
            const y = Math.sin(phi) * Math.sin(theta) * velocity;
            const z = Math.cos(phi) * velocity;
            
            // Simulate 3D with perspective
            const scale = 1 / (1 + z / 500);
            const finalX = x * scale;
            const finalY = y * scale;
            
            particle.animate([
                { 
                    transform: 'translate(0, 0) scale(1)',
                    opacity: 1 
                },
                { 
                    transform: `translate(${finalX * 0.5}px, ${finalY * 0.5}px) scale(${scale * 1.5})`,
                    opacity: 0.8 
                },
                { 
                    transform: `translate(${finalX}px, ${finalY}px) scale(${scale * 0.5})`,
                    opacity: 0 
                }
            ], {
                duration: 2000 + Math.random() * 1000,
                easing: 'cubic-bezier(0.25, 0.46, 0.45, 0.94)'
            });
            
            setTimeout(() => particle.remove(), 3000);
        }
    }

    startRandomEffects() {
        // Random energy pulses
        setInterval(() => {
            if (Math.random() < 0.15 && !this.isReacting) {
                this.createSubtleEnergyPulse();
            }
        }, 2000);
        
        // Random electron trails
        setInterval(() => {
            if (Math.random() < 0.1 && !this.isReacting) {
                this.createElectronTrail();
            }
        }, 3000);
    }

    createSubtleEnergyPulse() {
        const nucleus = document.querySelector('.nucleus-inner');
        if (nucleus) {
            nucleus.style.boxShadow = `
                0 0 60px rgba(102, 126, 234, 1),
                inset 0 0 30px rgba(255, 255, 255, 0.4),
                0 15px 40px rgba(0, 0, 0, 0.4)
            `;
            
            setTimeout(() => {
                nucleus.style.boxShadow = `
                    0 0 30px rgba(102, 126, 234, 0.8),
                    inset 0 0 20px rgba(255, 255, 255, 0.2),
                    0 10px 20px rgba(0, 0, 0, 0.3)
                `;
            }, 800);
        }
    }

    createElectronTrail() {
        this.electrons.forEach((electron, index) => {
            setTimeout(() => {
                electron.style.boxShadow = '0 0 40px currentColor';
                electron.style.transform = 'translateX(-50%) scale(1.5)';
                
                setTimeout(() => {
                    electron.style.boxShadow = '0 0 15px currentColor';
                    electron.style.transform = 'translateX(-50%) scale(1)';
                }, 600);
            }, index * 100);
        });
    }
}

// Google Apps Script URL - Replace with your actual URL
const GOOGLE_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbyQirtDAW_HuQlucwoBb1MghkvCFEIUMSr4eIbmaRK4FcwMs7E2Xmj9c8tAtKr4ejteBA/exec';

// Add some console art
console.log(`
%c
   ___      _                       
  / _ \\__ _| |_ ___  _ __ ___  ___ 
 / /_\\/ _\` | __/ _ \\| '_ \` _ \\/ __|
/ /_\\\\ (_| | || (_) | | | | | \\__ \\
\\____/\\__,_|\\__\\___/|_| |_| |_|___/
                                    
%cLayoff Insurance Protection

%c🚀 Coming Soon! Join our early access list.
`, 
'color: #667eea; font-weight: bold;', 
'color: #764ba2; font-size: 14px;',
'color: #4facfe; font-size: 12px;'
);

// Development helper to view stored submissions
if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
    window.viewSubmissions = function() {
        console.log('Submissions:', JSON.parse(localStorage.getItem('gatoms_submissions') || '[]'));
        console.log('Fallback:', JSON.parse(localStorage.getItem('gatoms_fallback') || '[]'));
    };
    console.log('💡 Development mode: Use viewSubmissions() to see stored emails');
}
