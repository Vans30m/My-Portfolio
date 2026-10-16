/**
 * Vansh Thakur Portfolio - JavaScript Core Router & Event Controller
 * Highly optimized, merged UI/UX scripts.
 */
document.addEventListener('DOMContentLoaded', () => {
    // Keep URL bar clean without #hash fragments while retaining scroll restoration
    if (history.scrollRestoration) {
        history.scrollRestoration = 'manual';
    }
    window.scrollTo(0, 0);
    if (window.location.hash) {
        history.replaceState(null, '', window.location.pathname + window.location.search);
    }

    // Initialize Custom Scroll Animations (IntersectionObserver)
    const initScrollAnimations = () => {
        const aosElements = document.querySelectorAll('[data-aos]');

        const observerOptions = {
            root: null,
            rootMargin: '0px 0px -40px 0px', // Matches original offset: 40
            threshold: 0.05 // Trigger when 5% of the element is visible
        };

        const observer = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const el = entry.target;

                    // Retrieve custom delay, duration, easing if specified in HTML
                    const delay = el.getAttribute('data-aos-delay');
                    const duration = el.getAttribute('data-aos-duration');
                    const easing = el.getAttribute('data-aos-easing');

                    if (delay) el.style.transitionDelay = `${delay}ms`;
                    if (duration) el.style.transitionDuration = `${duration}ms`;
                    if (easing) el.style.transitionTimingFunction = easing;

                    el.classList.add('aos-animate');

                    // Once animated, stop observing (once: true behavior)
                    observer.unobserve(el);
                }
            });
        }, observerOptions);

        aosElements.forEach(el => {
            observer.observe(el);
        });
    };

    initScrollAnimations();

    // Timeline Scroll Progress Animation
    /* ==========================================================================
       Engineering Journey Metro Line & Station Router Controller
       Scroll-driven line progress + click accordion to reveal deep description
       ========================================================================== */
    const initMetroJourneyRouter = () => {
        const journeySection = document.getElementById('journey');
        const trackLine = document.querySelector('.metro-track-line');
        const trackProgress = document.querySelector('.metro-track-progress');
        const stations = document.querySelectorAll('.metro-station-node');
        if (!journeySection || !trackProgress || !stations.length) return;

        let isManualOverride = false;
        let manualTimeout = null;

        // Dynamic scroll tracking: calculates scroll position relative to the metro track line
        const handleScrollProgress = () => {
            if (isManualOverride) return;
            const lineRect = trackLine ? trackLine.getBoundingClientRect() : journeySection.getBoundingClientRect();
            const viewportMiddle = window.innerHeight * 0.55;

            // Distance from top of the line to the viewport trigger point
            const travelDistance = viewportMiddle - lineRect.top;
            const totalLineHeight = lineRect.height;

            let progressPct = (travelDistance / totalLineHeight) * 100;
            progressPct = Math.max(0, Math.min(100, progressPct));
            trackProgress.style.height = `${progressPct}%`;

            // Highlight the latest station passed by the scroll line
            stations.forEach((st) => {
                const badge = st.querySelector('.metro-station-badge');
                if (!badge) return;
                const bRect = badge.getBoundingClientRect();
                if (bRect.top <= viewportMiddle + 10) {
                    badge.classList.add('station-passed');
                } else {
                    badge.classList.remove('station-passed');
                }
            });
        };

        window.addEventListener('scroll', handleScrollProgress, { passive: true });
        window.addEventListener('resize', handleScrollProgress, { passive: true });
        // Initial run
        handleScrollProgress();

        const toggleStation = (targetStation) => {
            const isAlreadyActive = targetStation.classList.contains('active');

            // Close all stations
            stations.forEach(station => {
                station.classList.remove('active');
            });

            // If it wasn't active, activate it
            if (!isAlreadyActive) {
                targetStation.classList.add('active');
                
                // Temporarily smoothly advance track line to station node
                isManualOverride = true;
                clearTimeout(manualTimeout);
                const badge = targetStation.querySelector('.metro-station-badge');
                if (badge && trackLine) {
                    const lineRect = trackLine.getBoundingClientRect();
                    const bRect = badge.getBoundingClientRect();
                    const targetHeight = Math.max(0, bRect.top - lineRect.top + (bRect.height / 2));
                    const percentage = Math.min(100, Math.max(0, (targetHeight / lineRect.height) * 100));
                    trackProgress.style.height = `${percentage}%`;
                }
                manualTimeout = setTimeout(() => {
                    isManualOverride = false;
                    handleScrollProgress();
                }, 900);
            } else {
                handleScrollProgress();
            }
        };

        stations.forEach((station) => {
            const card = station.querySelector('.metro-station-card');
            const badge = station.querySelector('.metro-station-badge');

            if (card) {
                card.addEventListener('click', (e) => {
                    // Do not close accordion if clicking interactive link/button inside expanded content
                    if (e.target.closest('a') || e.target.closest('button:not(.metro-station-badge)')) return;
                    toggleStation(station);
                });
            }

            if (badge) {
                badge.addEventListener('click', (e) => {
                    e.stopPropagation();
                    toggleStation(station);
                });
            }
        });

        // Open Station 1 by default for clear orientation
        if (stations[0]) {
            stations[0].classList.add('active');
        }
    };

    initMetroJourneyRouter();

    /* ==========================================================================
       Animated Counters (IntersectionObserver triggered)
       ========================================================================== */
    const initAnimatedCounters = () => {
        const counterEls = document.querySelectorAll('[data-count]');
        if (!counterEls.length) return;

        const easeOutQuart = t => 1 - Math.pow(1 - t, 4);

        const animateCounter = (el) => {
            const target = parseInt(el.getAttribute('data-count'), 10);
            const suffix = el.getAttribute('data-suffix') || '';
            const duration = Math.max(800, Math.min(2000, target * 18)); // Scale duration to number size
            const start = performance.now();

            const tick = (now) => {
                const elapsed = now - start;
                const progress = Math.min(elapsed / duration, 1);
                const current = Math.floor(easeOutQuart(progress) * target);
                el.textContent = current + suffix;

                if (progress < 1) {
                    requestAnimationFrame(tick);
                } else {
                    el.textContent = target + suffix;
                    el.classList.add('counter-done');
                    // Remove class after animation so it can re-trigger cleanly
                    setTimeout(() => el.classList.remove('counter-done'), 400);
                }
            };

            requestAnimationFrame(tick);
        };

        const counterObserver = new IntersectionObserver((entries, obs) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    animateCounter(entry.target);
                    obs.unobserve(entry.target);
                }
            });
        }, { threshold: 0.4 });

        counterEls.forEach(el => counterObserver.observe(el));
    };

    initAnimatedCounters();

    /* ==========================================================================


    /* ==========================================================================
       Animated Gradient Borders (auto-applied to cards)
       ========================================================================== */
    const initGradientBorders = () => {
        // Gradient borders removed
    };

    initGradientBorders();

    /* ==========================================================================
       Card 3D Tilt with Cursor Tracking
       ========================================================================== */
    const initCardTilt = () => {
        // Card hover tilt and tracking removed
    };

    initCardTilt();

    /* ==========================================================================
       Button Ripple Micro-Interaction
       ========================================================================== */
    const initButtonRipples = () => {
        // Selectors for all buttons that should get ripple effect
        const rippleTargetSelectors = [
            '.filter-tab',
            '.connect-btn',
            '#email-btn',
            '#form-submit',
            '#footer-totop',
            '#email-btn-cta'
        ];

        const allBtns = document.querySelectorAll(rippleTargetSelectors.join(', '));

        allBtns.forEach(btn => {
            // Add btn-ripple class for CSS positioning context
            btn.classList.add('btn-ripple');

            btn.addEventListener('click', (e) => {
                const rect = btn.getBoundingClientRect();
                const size = Math.max(rect.width, rect.height);
                const x = e.clientX - rect.left - size / 2;
                const y = e.clientY - rect.top - size / 2;

                const ripple = document.createElement('span');
                ripple.className = 'ripple';
                ripple.style.cssText = `
                    width: ${size}px;
                    height: ${size}px;
                    left: ${x}px;
                    top: ${y}px;
                `;

                btn.appendChild(ripple);
                // Remove the ripple element after animation
                ripple.addEventListener('animationend', () => ripple.remove());
            });
        });
    };

    initButtonRipples();

    // Initialize EmailJS
    try {
        emailjs.init("srFwZDukLxplPt3Vr");
    } catch (e) {
        console.warn("EmailJS context offline.");
    }

    // DOM Elements
    const navbar = document.getElementById('navbar');
    const menuToggle = document.getElementById('menu-toggle');
    const mobileMenu = document.getElementById('mobile-menu');
    const menuIcon = document.getElementById('menu-icon');
    const backToTop = document.getElementById('back-to-top');
    const navLinks = document.querySelectorAll('.nav-link');
    const mobileNavLinks = document.querySelectorAll('.mobile-nav-link');
    const contactForm = document.getElementById('contact-form');
    const formStatus = document.getElementById('form-status');
    const formSubmit = document.getElementById('form-submit');
    const emailBtn = document.getElementById('email-btn');
    const emailText = document.getElementById('email-text');
    const themeToggleBtn = document.getElementById('theme-toggle-btn');
    const themeToggleMobile = document.getElementById('theme-toggle-mobile');
    const themeToggleIcon = document.getElementById('theme-toggle-icon');
    const themeToggleMobileIcon = document.getElementById('theme-toggle-mobile-icon');

    /* ==========================================================================
       Dark Mode Theme Controller (Light Studio Default + Dark Mode Switcher)
       ========================================================================== */
    const getStoredTheme = () => {
        return localStorage.getItem('portfolio-theme') || 'light';
    };

    const updateThemeIcons = (theme) => {
        const isDark = theme === 'dark';
        const iconClass = isDark ? 'fa-sun' : 'fa-moon';
        const removeClass = isDark ? 'fa-moon' : 'fa-sun';
        
        if (themeToggleIcon) {
            themeToggleIcon.classList.remove(removeClass);
            themeToggleIcon.classList.add(iconClass);
        }
        if (themeToggleMobileIcon) {
            themeToggleMobileIcon.classList.remove(removeClass);
            themeToggleMobileIcon.classList.add(iconClass);
        }
    };

    const applyTheme = (theme, persist = true) => {
        const root = document.documentElement;
        if (theme === 'dark') {
            root.setAttribute('data-theme', 'dark');
            root.classList.add('dark');
        } else {
            root.removeAttribute('data-theme');
            root.classList.remove('dark');
        }
        updateThemeIcons(theme);
        if (persist) {
            localStorage.setItem('portfolio-theme', theme);
        }
    };

    const toggleTheme = () => {
        const currentTheme = document.documentElement.getAttribute('data-theme') === 'dark' ? 'dark' : 'light';
        const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
        applyTheme(newTheme, true);
    };

    const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;

    const animatedToggle = (e) => {
        if (!document.startViewTransition || reduce) return toggleTheme();
        const x = e?.clientX ?? innerWidth / 2;
        const y = e?.clientY ?? innerHeight / 2;
        const r = Math.hypot(Math.max(x, innerWidth - x), Math.max(y, innerHeight - y));
        
        const transition = document.startViewTransition(() => toggleTheme());
        transition.ready.then(() => {
            document.documentElement.animate(
                { 
                    clipPath: [
                        `circle(0px at ${x}px ${y}px)`, 
                        `circle(${r}px at ${x}px ${y}px)`
                    ] 
                },
                { 
                    duration: 650, 
                    easing: 'cubic-bezier(0.22, 1, 0.36, 1)', 
                    fill: 'forwards',
                    pseudoElement: '::view-transition-new(root)' 
                }
            );
        });
    };

    // Expose globally for command palette and external scripts
    window.togglePortfolioTheme = (e) => animatedToggle(e);
    window.setPortfolioTheme = applyTheme;

    // Initialize theme on page load
    applyTheme(getStoredTheme(), false);

    if (themeToggleBtn) {
        themeToggleBtn.addEventListener('click', animatedToggle);
    }
    if (themeToggleMobile) {
        themeToggleMobile.addEventListener('click', animatedToggle);
    }

    /* ==========================================================================
       1. Single-page Scroll Active Anchor Highlight
       ========================================================================== */
    let isScrollingFromClick = false;
    let clickScrollTimeout = null;

    const sections = document.querySelectorAll('section[id]');
    const handleActiveLinkOnScroll = () => {
        if (isScrollingFromClick) return;

        let currentSectionId = 'home';
        const scrollPosition = window.scrollY + 200; // Offset from top

        // If close to bottom of the page, default to contact
        if ((window.innerHeight + window.scrollY) >= document.documentElement.scrollHeight - 100) {
            currentSectionId = 'contact';
        } else {
            sections.forEach(section => {
                const sectionTop = section.offsetTop;
                if (window.scrollY >= sectionTop - 150) {
                    currentSectionId = section.getAttribute('id');
                }
            });
        }

        let activeNavId = currentSectionId;
        if (activeNavId === 'other-systems-preview') {
            activeNavId = 'projects';
        }

        navLinks.forEach(link => {
            link.classList.remove('clicked');
            if (link.getAttribute('href') === `#${activeNavId}`) {
                link.classList.add('active');
            } else {
                link.classList.remove('active');
            }
        });
        mobileNavLinks.forEach(link => {
            link.classList.remove('clicked');
            if (link.getAttribute('href') === `#${activeNavId}`) {
                link.classList.add('active');
            } else {
                link.classList.remove('active');
            }
        });
    };

    // Click handler to add active status immediately to clicked links and keep URL bar clean
    const handleLinkClick = (e, clickedLink) => {
        const targetHref = clickedLink.getAttribute('href');
        if (targetHref && targetHref.startsWith('#')) {
            e.preventDefault();
            const targetEl = document.querySelector(targetHref);
            if (targetEl) {
                targetEl.scrollIntoView({ behavior: 'smooth' });
            }
        }

        isScrollingFromClick = true;

        navLinks.forEach(link => link.classList.remove('active'));
        mobileNavLinks.forEach(link => link.classList.remove('active'));

        navLinks.forEach(link => {
            if (link.getAttribute('href') === targetHref) link.classList.add('active');
        });
        mobileNavLinks.forEach(link => {
            if (link.getAttribute('href') === targetHref) link.classList.add('active');
        });

        // Set timeout to match browser smooth scroll duration
        if (clickScrollTimeout) clearTimeout(clickScrollTimeout);
        clickScrollTimeout = setTimeout(() => {
            isScrollingFromClick = false;
        }, 1000);
    };

    // Attach click listeners to all links pointing to hash sections across the document
    document.querySelectorAll('a[href^="#"]').forEach(link => {
        link.addEventListener('click', (e) => handleLinkClick(e, link));
    });

    // Initialize Home link as active on start
    const initialHomeLink = Array.from(navLinks).find(link => link.getAttribute('href') === '#home');
    if (initialHomeLink) initialHomeLink.classList.add('active');


    /* ==========================================================================
       2. Scroll & Back to Top visibility
       ========================================================================== */
    const handleScrollEffects = () => {
        handleActiveLinkOnScroll();
        if (backToTop) {
            if (window.scrollY > 300) {
                backToTop.style.opacity = '1';
                backToTop.style.pointerEvents = 'auto';
            } else {
                backToTop.style.opacity = '0';
                backToTop.style.pointerEvents = 'none';
            }
        }
    };
    window.addEventListener('scroll', handleScrollEffects, { passive: true });
    handleScrollEffects(); // Trigger once on load

    /* ==========================================================================
       3. Mobile Navigation Drawer Controls
       ========================================================================== */
    const toggleMobileDrawer = () => {
        const isActive = mobileMenu.classList.contains('active');
        if (!isActive) {
            mobileMenu.classList.add('active');
            if (menuToggle) menuToggle.classList.add('active');
        } else {
            mobileMenu.classList.remove('active');
            if (menuToggle) menuToggle.classList.remove('active');
        }
    };

    if (menuToggle) {
        menuToggle.addEventListener('click', toggleMobileDrawer);
    }

    mobileNavLinks.forEach(link => {
        link.addEventListener('click', () => {
            if (mobileMenu.classList.contains('active')) {
                toggleMobileDrawer();
            }
        });
    });

    // Close mobile dropdown when clicking outside
    document.addEventListener('click', (e) => {
        if (mobileMenu && mobileMenu.classList.contains('active')) {
            const isClickInsideMenu = mobileMenu.contains(e.target);
            const isClickToggle = menuToggle && menuToggle.contains(e.target);
            if (!isClickInsideMenu && !isClickToggle) {
                toggleMobileDrawer();
            }
        }
    });

    // Close mobile dropdown on scroll
    window.addEventListener('scroll', () => {
        if (mobileMenu && mobileMenu.classList.contains('active')) {
            toggleMobileDrawer();
        }
    }, { passive: true });

    /* ==========================================================================
       4. Premium Hover Mouse Coordinate Tracking
       ========================================================================== */
    const updateMouseCoordinates = (e, card) => { };

    const attachCardMouseTracking = () => { };
    attachCardMouseTracking();

    /* ==========================================================================
       5. Clipboard Copy Utility
       ========================================================================== */
    const setupEmailCopy = (btn, textEl) => {
        if (!btn) return;
        btn.addEventListener('click', () => {
            const rawEmail = "vthakur.290905@gmail.com";
            const targetText = textEl || btn;
            const originalText = targetText.innerText;

            const notifySuccess = () => {
                const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
                const isCtaBtn = btn.id === 'email-btn-cta';
                
                targetText.innerText = isCtaBtn ? "Copied!" : "COPIED TO CLIPBOARD!";
                
                if (isCtaBtn) {
                    btn.style.setProperty('background', isDark ? '#27272A' : '#111111', 'important');
                    btn.style.setProperty('color', '#FFFFFF', 'important');
                    btn.style.setProperty('border-color', isDark ? '#52525B' : '#111111', 'important');
                } else {
                    targetText.style.setProperty('color', isDark ? '#FFFFFF' : '#111111', 'important');
                    if (btn !== targetText) {
                        btn.style.setProperty('color', isDark ? '#FFFFFF' : '#111111', 'important');
                    }
                }

                setTimeout(() => {
                    targetText.innerText = originalText;
                    if (isCtaBtn) {
                        btn.style.removeProperty('background');
                        btn.style.removeProperty('color');
                        btn.style.removeProperty('border-color');
                    } else {
                        targetText.style.removeProperty('color');
                        if (btn !== targetText) {
                            btn.style.removeProperty('color');
                        }
                    }
                }, 2200);
            };

            if (navigator.clipboard && window.isSecureContext) {
                navigator.clipboard.writeText(rawEmail).then(notifySuccess).catch(() => {
                    fallbackCopyText(rawEmail, notifySuccess);
                });
            } else {
                fallbackCopyText(rawEmail, notifySuccess);
            }
        });
    };

    const fallbackCopyText = (text, callback) => {
        try {
            const textArea = document.createElement("textarea");
            textArea.value = text;
            textArea.style.position = "fixed";
            textArea.style.top = "-9999px";
            textArea.style.left = "-9999px";
            document.body.appendChild(textArea);
            textArea.focus();
            textArea.select();
            document.execCommand('copy');
            document.body.removeChild(textArea);
            if (callback) callback();
        } catch (e) {
            console.error("Fallback clipboard copy failed:", e);
        }
    };

    setupEmailCopy(emailBtn, emailText);
    setupEmailCopy(document.getElementById('email-btn-cta'), null);

    /* ==========================================================================
       6. Asynchronous EmailJS Form Handler
       ========================================================================== */
    if (contactForm) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();

            const nameEl = document.getElementById('form-name');
            const emailEl = document.getElementById('form-email');
            const messageEl = document.getElementById('form-message');

            const name = nameEl ? nameEl.value.trim() : '';
            const email = emailEl ? emailEl.value.trim() : '';
            const message = messageEl ? messageEl.value.trim() : '';

            formSubmit.disabled = true;
            formSubmit.innerText = "TRANSMITTING SIGNAL DATA...";
            formStatus.classList.remove('hidden', 'bg-red-500/10', 'text-red-400', 'bg-emerald-500/10', 'text-emerald-400');

            const params = {
                from_name: name,
                reply_to: email,
                message: message
            };

            const triggerMailtoFallback = () => {
                const mailtoUrl = `mailto:vthakur.290905@gmail.com?subject=${encodeURIComponent("Portfolio Contact from " + name)}&body=${encodeURIComponent(message + "\n\nReply To: " + email)}`;
                window.location.href = mailtoUrl;
                formStatus.innerText = "SUCCESS: Correspondence packet prepared and opened in your email app!";
                formStatus.classList.add('bg-emerald-500/10', 'text-emerald-400');
                formStatus.classList.remove('hidden');
                contactForm.reset();
            };

            if (window.emailjs && typeof emailjs.send === 'function') {
                // Send primary notification email to Vansh
                emailjs.send('service_t3hkbsw', 'template_1894rk8', params)
                    .then(() => {
                        // Send optional auto-reply to visitor
                        emailjs.send('service_t3hkbsw', 'template_qx3u0d8', params).catch(() => {});

                        formStatus.innerText = "SUCCESS: Correspondence packet parsed and dispatched.";
                        formStatus.classList.add('bg-emerald-500/10', 'text-emerald-400');
                        formStatus.classList.remove('hidden');
                        contactForm.reset();
                    })
                    .catch((err) => {
                        console.warn("EmailJS API key placeholder or offline. Opening mail client fallback...", err);
                        triggerMailtoFallback();
                    })
                    .finally(() => {
                        formSubmit.disabled = false;
                        formSubmit.innerText = "TRANSMIT SIGNAL PACKAGE";
                    });
            } else {
                triggerMailtoFallback();
                formSubmit.disabled = false;
                formSubmit.innerText = "TRANSMIT SIGNAL PACKAGE";
            }
        });
    }

    /* ==========================================================================
       7. Scroll Reset to Top Level
       ========================================================================== */
    if (backToTop) {
        backToTop.addEventListener('click', (e) => {
            e.preventDefault();
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
    }

    const footerToTop = document.getElementById('footer-totop');
    if (footerToTop) {
        footerToTop.addEventListener('click', (e) => {
            e.preventDefault();
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
    }

    /* ==========================================================================
       8. Filterable Carousel Interactions
       ========================================================================== */
    const filterTabs = document.querySelectorAll('.filter-tab');
    const carouselContainer = document.getElementById('project-carousel');

    if (filterTabs.length && carouselContainer) {
        let speedPxPerMs = 0.12; // Smooth, continuous infinite flow (~120px/sec)
        let animationFrameId = null;
        let scrollAnimFrameId = null;
        let isInteracting = false;
        let isSmoothScrolling = false;
        let interactionTimeout = null;
        let currentWidth = 0;
        let lastTime = performance.now();

        const setInteracting = (value) => {
            isInteracting = value;
            if (value) {
                if (interactionTimeout) {
                    clearTimeout(interactionTimeout);
                }
            }
        };

        const resumeAfterDelay = () => {
            if (interactionTimeout) clearTimeout(interactionTimeout);
            interactionTimeout = setTimeout(() => {
                setInteracting(false);
                lastTime = performance.now(); // reset reference timestamp
            }, 1500); // Resume autoscroll after 1.5 seconds of inactivity
        };

        // Scroll listener to handle seamless loop wrapping in BOTH directions
        carouselContainer.addEventListener('scroll', () => {
            if (isSmoothScrolling) return; // Do not interrupt smooth scrolling animations

            // If user is actively scrolling or container is decelerating, push back resume time
            if (isInteracting) {
                resumeAfterDelay();
            }

            if (currentWidth > 0) {
                // If we scroll past the second set of cards, shift back by one set width
                if (carouselContainer.scrollLeft >= currentWidth * 2) {
                    carouselContainer.scrollLeft -= currentWidth;
                }
                // If we scroll to the left past the start of the second set, shift forward by one set width
                else if (carouselContainer.scrollLeft < currentWidth) {
                    carouselContainer.scrollLeft += currentWidth;
                }
            }
        });

        // Custom smooth scroll animation to prevent browser native smooth scroll engines from fighting layout updates
        const animateScroll = (targetOffset, duration = 300) => {
            if (scrollAnimFrameId) {
                cancelAnimationFrame(scrollAnimFrameId);
            }

            const startScroll = carouselContainer.scrollLeft;
            const startTime = performance.now();
            isSmoothScrolling = true;

            const step = (timestamp) => {
                const elapsed = timestamp - startTime;
                const progress = Math.min(elapsed / duration, 1);

                // Ease out quad
                const ease = progress * (2 - progress);
                carouselContainer.scrollLeft = startScroll + targetOffset * ease;

                if (progress < 1) {
                    scrollAnimFrameId = requestAnimationFrame(step);
                } else {
                    isSmoothScrolling = false;
                    scrollAnimFrameId = null;

                    // Wrap immediately and seamlessly
                    if (currentWidth > 0) {
                        if (carouselContainer.scrollLeft >= currentWidth * 2) {
                            const originalSnap = carouselContainer.style.scrollSnapType;
                            const originalBehavior = carouselContainer.style.scrollBehavior;
                            carouselContainer.style.scrollSnapType = 'none';
                            carouselContainer.style.scrollBehavior = 'auto';
                            carouselContainer.scrollLeft -= currentWidth;
                            const _ = carouselContainer.offsetHeight; // force reflow
                            carouselContainer.style.scrollSnapType = originalSnap;
                            carouselContainer.style.scrollBehavior = originalBehavior;
                        } else if (carouselContainer.scrollLeft < currentWidth) {
                            const originalSnap = carouselContainer.style.scrollSnapType;
                            const originalBehavior = carouselContainer.style.scrollBehavior;
                            carouselContainer.style.scrollSnapType = 'none';
                            carouselContainer.style.scrollBehavior = 'auto';
                            carouselContainer.scrollLeft += currentWidth;
                            const _ = carouselContainer.offsetHeight; // force reflow
                            carouselContainer.style.scrollSnapType = originalSnap;
                            carouselContainer.style.scrollBehavior = originalBehavior;
                        }
                    }
                    resumeAfterDelay();
                }
            };

            scrollAnimFrameId = requestAnimationFrame(step);
        };

        const setupInfiniteScroll = (filterValue = 'all') => {
            if (animationFrameId) {
                cancelAnimationFrame(animationFrameId);
            }

            // Clean up old cloned items
            const clonedCards = carouselContainer.querySelectorAll('.carousel-card.cloned');
            clonedCards.forEach(c => c.remove());

            const originalCards = Array.from(carouselContainer.querySelectorAll('.carousel-card:not(.cloned)'))
                .filter(c => c.dataset.visible === 'true');

            if (originalCards.length === 0) return;

            currentWidth = 0;
            originalCards.forEach(c => {
                c.style.display = 'flex';
                currentWidth += c.offsetWidth + 24; // Width + 24px gap
            });

            // Clone one full set and prepend before originals (Set 1)
            if (currentWidth > 0) {
                const firstOriginal = originalCards[0];
                originalCards.forEach(card => {
                    const clone = card.cloneNode(true);
                    clone.classList.add('cloned');
                    clone.addEventListener('mousemove', (e) => updateMouseCoordinates(e, clone));
                    carouselContainer.insertBefore(clone, firstOriginal);
                });

                // Clone another full set and append after originals (Set 3)
                originalCards.forEach(card => {
                    const clone = card.cloneNode(true);
                    clone.classList.add('cloned');
                    clone.addEventListener('mousemove', (e) => updateMouseCoordinates(e, clone));
                    carouselContainer.appendChild(clone);
                });
            }

            // Attach mouse, touch, and focus events to pause autoscroll and prevent focus scroll jumps
            const allCards = carouselContainer.querySelectorAll('.carousel-card');
            allCards.forEach(card => {
                card.addEventListener('mouseenter', () => setInteracting(true));
                card.addEventListener('mouseleave', () => resumeAfterDelay());
                card.addEventListener('touchstart', () => setInteracting(true), { passive: true });
                card.addEventListener('touchend', () => resumeAfterDelay(), { passive: true });

                const interactiveElements = card.querySelectorAll('a, button');
                interactiveElements.forEach(el => {
                    el.addEventListener('focus', () => {
                        setInteracting(true);
                        // Prevent the browser from automatically scrolling/jumping the carousel to focus the link
                        const prevScrollLeft = carouselContainer.scrollLeft;
                        const prevScrollY = window.scrollY;
                        setTimeout(() => {
                            carouselContainer.scrollLeft = prevScrollLeft;
                            window.scrollTo(window.scrollX, prevScrollY);
                        }, 0);
                    });
                    el.addEventListener('blur', () => {
                        resumeAfterDelay();
                    });
                });
            });

            // Delta-time based animation loop for consistent speed regardless of refresh rate (e.g. 60Hz/120Hz screens)
            const scrollLoop = (timestamp) => {
                if (lastTime === 0) lastTime = timestamp;
                let delta = timestamp - lastTime;
                lastTime = timestamp;

                // Clamp delta to prevent huge jumps when coming back from background tab
                if (delta > 64) {
                    delta = 16;
                }

                if (!isInteracting && currentWidth > 0 && isVisibleInViewport) {
                    carouselContainer.scrollLeft += speedPxPerMs * delta;
                }
                animationFrameId = requestAnimationFrame(scrollLoop);
            };

            const originalBehavior = carouselContainer.style.scrollBehavior;
            carouselContainer.style.scrollBehavior = 'auto';
            carouselContainer.scrollLeft = currentWidth; // Start at the second set of cards to enable wrapping immediately in both directions
            const _ = carouselContainer.offsetHeight; // force reflow
            carouselContainer.style.scrollBehavior = originalBehavior;

            lastTime = performance.now();
            animationFrameId = requestAnimationFrame(scrollLoop);
        };

        // Tab click filters
        filterTabs.forEach(tab => {
            tab.addEventListener('click', () => {
                filterTabs.forEach(t => t.classList.remove('active'));
                tab.classList.add('active');

                const filterValue = tab.getAttribute('data-filter');
                const cards = carouselContainer.querySelectorAll('.carousel-card:not(.cloned)');

                let visibleCount = 0;
                cards.forEach(card => {
                    const cardCategory = card.getAttribute('data-category');
                    if (filterValue === 'all' || cardCategory === filterValue) {
                        card.dataset.visible = 'true';
                        visibleCount++;
                    } else {
                        card.dataset.visible = 'false';
                        card.style.display = 'none';
                    }
                });

                setupInfiniteScroll(filterValue);
            });
        });

        let isVisibleInViewport = true;

        // Pause animation loop when carousel is out of viewport to save performance and prevent offset glitches
        if ('IntersectionObserver' in window) {
            const observer = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    isVisibleInViewport = entry.isIntersecting;
                    if (entry.isIntersecting) {
                        lastTime = performance.now();
                    }
                });
            }, { threshold: 0.1 });
            observer.observe(carouselContainer);
        }

        // Hover events for pausing autoscroll on desktop
        carouselContainer.addEventListener('mouseenter', () => setInteracting(true));
        carouselContainer.addEventListener('mouseleave', () => resumeAfterDelay());

        // Touch events for pausing autoscroll on mobile swipes
        carouselContainer.addEventListener('touchstart', () => setInteracting(true), { passive: true });
        carouselContainer.addEventListener('touchend', () => resumeAfterDelay(), { passive: true });
        carouselContainer.addEventListener('touchcancel', () => resumeAfterDelay(), { passive: true });

        // Initialize carousel
        const cards = carouselContainer.querySelectorAll('.carousel-card:not(.cloned)');
        cards.forEach(card => {
            card.dataset.visible = 'true';
        });
        setupInfiniteScroll('all');

        // Handle screen resizing/orientation changes dynamically
        let resizeTimeout = null;
        window.addEventListener('resize', () => {
            if (resizeTimeout) clearTimeout(resizeTimeout);
            resizeTimeout = setTimeout(() => {
                const activeTab = document.querySelector('.filter-tab.active');
                const filterValue = activeTab ? activeTab.getAttribute('data-filter') : 'all';
                setupInfiniteScroll(filterValue);
            }, 250);
        });
    }

    /* ==========================================================================
       9. Live GitHub Contributions Fetcher & Generator
       ========================================================================== */
    const githubGrid = document.getElementById('github-contributions-grid');
    const githubBentoGrid = document.getElementById('github-bento-grid');

    const generateSimulatedGrid = (gridElement, count, cols) => {
        if (!gridElement) return;
        gridElement.innerHTML = '';
        for (let i = 0; i < count; i++) {
            const tile = document.createElement('div');
            tile.className = 'github-tile';
            const rand = Math.random();
            let level = 0;
            if (rand > 0.85) level = 4;
            else if (rand > 0.70) level = 3;
            else if (rand > 0.50) level = 2;
            else if (rand > 0.25) level = 1;

            tile.classList.add(`level-${level}`);
            tile.style.animationDelay = `${(i % cols) * 0.02 + Math.floor(i / cols) * 0.015}s`;
            const contCount = level === 0 ? 0 : Math.floor(rand * 6) + 1;
            tile.setAttribute('title', `${contCount} contributions`);
            gridElement.appendChild(tile);
        }
    };

    // Fetch live GitHub contributions for the recent year (2026)
    fetch('https://github-contributions-api.jogruber.de/v4/Vans30m?y=2026')
        .then(response => response.json())
        .then(data => {
            const yearConts = data.contributions || [];
            yearConts.sort((a, b) => a.date.localeCompare(b.date));

            // Total contributions in the recent year
            const yearTotal = (data.total && data.total['2026']) ? data.total['2026'] : yearConts.reduce((acc, curr) => acc + curr.count, 0);
            
            const yearTotalEl = document.getElementById('github-year-total');
            if (yearTotalEl) yearTotalEl.innerText = yearTotal;

            const totalElements = document.querySelectorAll('.github-total-contributions');
            totalElements.forEach(el => {
                el.innerText = yearTotal;
            });

            // Calculate last 30 days commits
            const todayStr = new Date().toISOString().split('T')[0];
            const pastDays = yearConts.filter(c => c.date <= todayStr);
            const monthlyCommitsElements = document.querySelectorAll('.github-month-commits');
            if (monthlyCommitsElements.length) {
                const last30Days = pastDays.slice(-30);
                const monthTotal = last30Days.reduce((acc, curr) => acc + curr.count, 0);
                monthlyCommitsElements.forEach(el => {
                    el.innerText = monthTotal;
                });
            }

            // Render Recent Year Heatmap Grid (aligned by day of week)
            if (githubGrid && yearConts.length) {
                githubGrid.innerHTML = '';
                
                // First day offset (0 = Sunday, 1 = Monday, etc.)
                const firstDayWeekday = new Date(yearConts[0].date).getDay();
                
                // Pad starting week with invisible placeholders so days align with Mon-Wed-Fri
                for (let p = 0; p < firstDayWeekday; p++) {
                    const emptyTile = document.createElement('div');
                    emptyTile.className = 'github-tile opacity-0 pointer-events-none';
                    githubGrid.appendChild(emptyTile);
                }

                yearConts.forEach((item, idx) => {
                    const tile = document.createElement('div');
                    tile.className = `github-tile level-${item.level}`;
                    tile.setAttribute('title', `${item.count} contributions on ${item.date}`);
                    tile.style.animationDelay = `${(idx % 53) * 0.015}s`;
                    githubGrid.appendChild(tile);
                });
            }

            // Populate Bento mini calendar Grid (112 cells)
            if (githubBentoGrid) {
                githubBentoGrid.innerHTML = '';
                const last112Conts = pastDays.slice(-112);
                last112Conts.forEach((item, idx) => {
                    const tile = document.createElement('div');
                    tile.className = `github-tile level-${item.level}`;
                    tile.setAttribute('title', `${item.count} contributions on ${item.date}`);
                    tile.style.animationDelay = `${(idx % 16) * 0.02 + Math.floor(idx / 16) * 0.015}s`;
                    githubBentoGrid.appendChild(tile);
                });
            }
        })
        .catch(err => {
            console.warn('GitHub contributions API offline or blocked. Using simulated fallback.', err);
            generateSimulatedGrid(githubGrid, 365, 53);
            generateSimulatedGrid(githubBentoGrid, 112, 16);
        });

    // Scroll Progress Indicator Logic (CSS Scroll-Timeline Native Fallback)
    const progressLine = document.getElementById('scroll-progress');
    const supportsScrollTimeline = window.CSS && CSS.supports && (CSS.supports('animation-timeline', 'scroll(root)') || CSS.supports('animation-timeline', 'view()'));
    
    if (progressLine && !supportsScrollTimeline) {
        const updateScrollProgress = () => {
            const windowHeight = document.documentElement.scrollHeight - window.innerHeight;
            if (windowHeight > 0) {
                const scrolled = (window.scrollY / windowHeight) * 100;
                progressLine.style.width = `${scrolled}%`;
            }
        };
        window.addEventListener('scroll', updateScrollProgress, { passive: true });
        updateScrollProgress(); // Initial check
    }

    // Dismiss Loading Screen Overlay after exactly 1 second
    const loadingOverlay = document.getElementById('loading-overlay');
    if (loadingOverlay) {
        let dismissed = false;
        const dismissLoader = () => {
            if (dismissed) return;
            dismissed = true;
            loadingOverlay.classList.add('hidden');
        };

        // Guarantee loading screen displays for 1 second
        setTimeout(dismissLoader, 1000);
    }

    // Typewriter effect loop (typing & erasing) for the hero name text
    const typeTarget = document.querySelector('.hero-name-type');
    if (typeTarget) {
        const phrases = ["Vansh Thakur", "a Learner", "a Tech Explorer", "a Problem Solver"];
        let phraseIdx = 0;
        let charIdx = 0;
        let isDeleting = false;

        const typeLoop = () => {
            const currentPhrase = phrases[phraseIdx];

            if (isDeleting) {
                typeTarget.textContent = currentPhrase.substring(0, charIdx - 1);
                charIdx--;
            } else {
                typeTarget.textContent = currentPhrase.substring(0, charIdx + 1);
                charIdx++;
            }

            let speed = isDeleting ? 60 : 120;

            if (!isDeleting && charIdx === currentPhrase.length) {
                speed = 2200; // Hold phrase visible for 2.2 seconds
                isDeleting = true;
            } else if (isDeleting && charIdx === 0) {
                isDeleting = false;
                phraseIdx = (phraseIdx + 1) % phrases.length;
                speed = 400; // Delay before typing the next phrase
            }

            setTimeout(typeLoop, speed);
        };

        // Initial delay before typewriter starts
        setTimeout(typeLoop, 800);
    }

    /* ==========================================================================
       Command Palette (Ctrl+K) Controller
       ========================================================================== */
    const initCommandPalette = () => {
        // Disable search fully on smaller screens (mobile/tablet) and touch devices
        const isMobileOrTablet = window.innerWidth < 768;
        const isTouchDevice = ('ontouchstart' in window) || (navigator.maxTouchPoints > 0);
        if (isMobileOrTablet || isTouchDevice) {
            const triggerBtn = document.getElementById('cmd-palette-btn');
            if (triggerBtn) triggerBtn.style.display = 'none';
            return;
        }

        const items = [
            { id: 'nav-home', title: 'Home', desc: 'Go to the introduction section', url: '#home', category: 'Navigation', icon: 'fa-home', shortcut: '↵' },
            { id: 'nav-bento', title: 'Bento Dashboard', desc: 'Go to dashboard grid', url: '#bento-dashboard', category: 'Navigation', icon: 'fa-table-cells-large', shortcut: '↵' },
            { id: 'nav-projects', title: 'Projects Showcase', desc: 'Browse developed products', url: '#projects', category: 'Navigation', icon: 'fa-laptop-code', shortcut: '↵' },
            { id: 'nav-skills', title: 'Skills Matrix', desc: 'View technical expertise', url: '#skills', category: 'Navigation', icon: 'fa-bolt', shortcut: '↵' },
            { id: 'nav-about', title: 'About Me', desc: 'Read biography & profiles', url: '#about', category: 'Navigation', icon: 'fa-user', shortcut: '↵' },
            { id: 'nav-journey', title: 'Journey Log', desc: 'View academic & coding timeline', url: '#journey', category: 'Navigation', icon: 'fa-road', shortcut: '↵' },
            { id: 'nav-contact', title: 'Contact', desc: 'Get in touch / hire me', url: '#contact', category: 'Navigation', icon: 'fa-envelope', shortcut: '↵' },

            { id: 'proj-piezo', title: 'Piezoelectric Floor Case Study', desc: 'Energy harvesting floor design', url: 'html/piezoelectric-details.html', category: 'Case Studies', icon: 'fa-plug', shortcut: '↗' },
            { id: 'proj-floor', title: 'Floor Cleaning Robot Case Study', desc: 'Autonomous Arduino cleaner', url: 'html/floorcleaning-details.html', category: 'Case Studies', icon: 'fa-robot', shortcut: '↗' },

            { id: 'action-theme', title: 'Toggle Dark / Light Theme', desc: 'Switch visual appearance', url: 'action:theme', category: 'Actions', icon: 'fa-circle-half-stroke', shortcut: 'T' },
            { id: 'action-recruiter', title: 'Recruiter Mode', desc: 'Open 30-second candidate summary (Press R)', url: 'action:recruiter', category: 'Actions', icon: 'fa-user-tie', shortcut: 'R' },
            { id: 'social-github', title: 'GitHub Profile', desc: 'Check repositories & contributions', url: 'https://github.com/Vans30m', category: 'Connect', icon: 'fa-brands fa-github', shortcut: '↗', external: true },
            { id: 'social-linkedin', title: 'LinkedIn Profile', desc: 'Professional network presence', url: 'https://linkedin.com/in/vansh-thakur-vans30m/', category: 'Connect', icon: 'fa-brands fa-linkedin', shortcut: '↗', external: true },
            { id: 'action-email', title: 'Send Email', desc: 'vthakur.290905@gmail.com', url: 'mailto:vthakur.290905@gmail.com', category: 'Connect', icon: 'fa-paper-plane', shortcut: '↗' }
        ];

        // Create Palette Overlay HTML
        const overlay = document.createElement('div');
        overlay.className = 'cmd-palette-overlay';
        overlay.id = 'cmd-palette';
        overlay.setAttribute('aria-hidden', 'true');
        overlay.innerHTML = `
            <div class="cmd-palette-modal" role="dialog" aria-modal="true" aria-labelledby="cmd-palette-input">
                <div class="cmd-palette-header">
                    <i class="fa-solid fa-magnifying-glass cmd-palette-search-icon"></i>
                    <input type="text" class="cmd-palette-input" id="cmd-palette-input" placeholder="Type a command or search..." autocomplete="off" spellcheck="false">
                    <button class="cmd-palette-close-btn" id="cmd-palette-close" aria-label="Close Command Palette">Esc</button>
                </div>
                <div class="cmd-palette-results" id="cmd-palette-results"></div>
                <div class="cmd-palette-footer">
                    <div>
                        <span class="cmd-palette-key">↑↓</span> Navigate
                        <span class="cmd-palette-key" style="margin-left: 8px;">Enter</span> Select
                    </div>
                    <div>
                        <span class="cmd-palette-key">Esc</span> Close
                    </div>
                </div>
            </div>
        `;
        document.body.appendChild(overlay);

        const input = overlay.querySelector('#cmd-palette-input');
        const resultsContainer = overlay.querySelector('#cmd-palette-results');
        const closeBtn = overlay.querySelector('#cmd-palette-close');
        let activeIndex = 0;
        let filteredItems = [...items];

        const openPalette = () => {
            overlay.classList.add('active');
            overlay.setAttribute('aria-hidden', 'false');
            input.value = '';
            activeIndex = 0;
            renderResults();
            setTimeout(() => input.focus(), 50);
        };

        const closePalette = () => {
            overlay.classList.remove('active');
            overlay.setAttribute('aria-hidden', 'true');
        };

        const renderResults = () => {
            const query = input.value.trim().toLowerCase();
            if (query) {
                filteredItems = items.filter(item =>
                    item.title.toLowerCase().includes(query) ||
                    item.desc.toLowerCase().includes(query) ||
                    item.category.toLowerCase().includes(query)
                );
            } else {
                filteredItems = [...items];
            }

            if (filteredItems.length === 0) {
                resultsContainer.innerHTML = `
                    <div style="padding: 24px 16px; text-align: center; color: var(--muted); font-size: 13px;">
                        No results found for "<span class="text-white">${input.value}</span>"
                    </div>
                `;
                return;
            }

            // Group by category
            const grouped = {};
            filteredItems.forEach((item, index) => {
                if (!grouped[item.category]) {
                    grouped[item.category] = [];
                }
                grouped[item.category].push({ item, globalIndex: index });
            });

            // Ensure activeIndex is within bounds
            if (activeIndex >= filteredItems.length) {
                activeIndex = filteredItems.length - 1;
            }
            if (activeIndex < 0) {
                activeIndex = 0;
            }

            let html = '';
            for (const category in grouped) {
                html += `<div class="cmd-palette-group-title">${category}</div>`;
                grouped[category].forEach(({ item, globalIndex }) => {
                    const isActive = globalIndex === activeIndex;
                    html += `
                        <div class="cmd-palette-item ${isActive ? 'active' : ''}" data-index="${globalIndex}">
                            <div class="cmd-palette-item-content">
                                <div class="cmd-palette-item-icon">
                                    <i class="fa-solid ${item.icon}"></i>
                                </div>
                                <div class="cmd-palette-item-text">
                                    <span class="cmd-palette-item-title">${item.title}</span>
                                    <span class="cmd-palette-item-desc">${item.desc}</span>
                                </div>
                            </div>
                            <span class="cmd-palette-item-shortcut">${item.shortcut}</span>
                        </div>
                    `;
                });
            }
            resultsContainer.innerHTML = html;

            // Bind interactions to results instantly via mousedown and optimized class toggles
            const itemEls = resultsContainer.querySelectorAll('.cmd-palette-item');
            itemEls.forEach(el => {
                el.addEventListener('mousedown', (e) => {
                    e.preventDefault(); // Keep input focus
                    const idx = parseInt(el.getAttribute('data-index'), 10);
                    triggerAction(filteredItems[idx]);
                });
                el.addEventListener('mouseenter', () => {
                    activeIndex = parseInt(el.getAttribute('data-index'), 10);
                    resultsContainer.querySelectorAll('.cmd-palette-item.active').forEach(activeItem => {
                        activeItem.classList.remove('active');
                    });
                    el.classList.add('active');
                });
            });

            // Scroll active item into view
            const activeEl = resultsContainer.querySelector('.cmd-palette-item.active');
            if (activeEl) {
                activeEl.scrollIntoView({ block: 'nearest' });
            }
        };

        const triggerAction = (item) => {
            closePalette();
            if (item.url === 'action:theme') {
                if (window.togglePortfolioTheme) {
                    window.togglePortfolioTheme();
                }
                return;
            }
            if (item.url === 'action:recruiter') {
                if (window.toggleRecruiterMode) {
                    window.toggleRecruiterMode();
                }
                return;
            }
            if (item.url.startsWith('#')) {
                // Smooth scroll to the target element without altering URL bar hash
                const target = document.querySelector(item.url);
                if (target) {
                    target.scrollIntoView({ behavior: 'smooth' });
                }
            } else {
                if (item.external) {
                    window.open(item.url, '_blank');
                } else {
                    window.location.href = item.url;
                }
            }
        };

        // Event Listeners
        window.addEventListener('keydown', (e) => {
            if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
                e.preventDefault();
                if (overlay.classList.contains('active')) {
                    closePalette();
                } else {
                    openPalette();
                }
            }

            if (!overlay.classList.contains('active')) return;

            if (e.key === 'Escape') {
                closePalette();
            } else if (e.key === 'ArrowDown') {
                e.preventDefault();
                activeIndex = (activeIndex + 1) % filteredItems.length;
                renderResults();
            } else if (e.key === 'ArrowUp') {
                e.preventDefault();
                activeIndex = (activeIndex - 1 + filteredItems.length) % filteredItems.length;
                renderResults();
            } else if (e.key === 'Enter') {
                e.preventDefault();
                if (filteredItems[activeIndex]) {
                    triggerAction(filteredItems[activeIndex]);
                }
            }
        });

        input.addEventListener('input', () => {
            activeIndex = 0;
            renderResults();
        });

        // Trigger buttons
        const triggerBtn = document.getElementById('cmd-palette-btn');
        const triggerBtnMobile = document.getElementById('cmd-palette-btn-mobile');

        if (triggerBtn) {
            triggerBtn.addEventListener('click', openPalette);
        }
        if (triggerBtnMobile) {
            triggerBtnMobile.addEventListener('click', openPalette);
        }

        // Close on backdrop click
        overlay.addEventListener('click', (e) => {
            if (e.target === overlay) {
                closePalette();
            }
        });

        closeBtn.addEventListener('click', closePalette);
    };

    /* ==========================================================================
       Recruiter Mode (R Key) Controller
       ========================================================================== */
    const initRecruiterMode = () => {
        // Create Floating Pill
        const pill = document.createElement('button');
        pill.className = 'recruiter-pill';
        pill.id = 'recruiter-pill';
        pill.setAttribute('aria-label', 'Open Recruiter Mode');
        pill.innerHTML = `
            <span class="recruiter-pill-text">Click <kbd class="recruiter-pill-key">R</kbd></span>
        `;
        document.body.appendChild(pill);

        // Create Modal Overlay
        const overlay = document.createElement('div');
        overlay.className = 'recruiter-overlay';
        overlay.id = 'recruiter-overlay';
        overlay.setAttribute('aria-hidden', 'true');
        overlay.innerHTML = `
            <div class="recruiter-modal" role="dialog" aria-modal="true" aria-labelledby="recruiter-modal-title">
                <div class="recruiter-header">
                    <div class="recruiter-title-group">
                        <span class="recruiter-badge">Recruiter Mode</span>
                        <h2 class="recruiter-title" id="recruiter-modal-title">Brief</h2>
                    </div>
                    <button class="recruiter-close" id="recruiter-close-btn" aria-label="Close Recruiter Mode">&times;</button>
                </div>
                <div class="recruiter-body">
                    <div class="recruiter-pitch-sec">
                        <span class="recruiter-pitch-title">Pitch / 10-Sec Summary</span>
                        <p class="recruiter-pitch-text">
                            Software Engineer specializing in full-stack architectures and AI integrations. Focused on designing high-performance systems with modern web standards and concurrent analytics. Ready for SWE placements in 2026.
                        </p>
                        <div class="recruiter-btn-group">
                            <a href="assets/Resume me - Main till now (Improved).pdf" class="recruiter-resume-btn" download="Vansh_Thakur_Resume.pdf">
                                <i class="fa-solid fa-file-pdf"></i> Download Resume (PDF)
                            </a>
                        </div>
                    </div>
                    <div class="recruiter-side-sec">
                        <div>
                            <span class="recruiter-pitch-title" style="margin-bottom: 8px; display: block;">Key Metrics</span>
                            <div class="recruiter-stats-grid">
                                <div class="recruiter-stat-card">
                                    <i class="fa-solid fa-terminal recruiter-stat-icon"></i>
                                    <span class="recruiter-stat-val">250+</span>
                                    <span class="recruiter-stat-lbl">LeetCode</span>
                                </div>
                                <div class="recruiter-stat-card">
                                    <i class="fa-solid fa-code-commit recruiter-stat-icon"></i>
                                    <span class="recruiter-stat-val github-month-commits">95</span>
                                    <span class="recruiter-stat-lbl">Commits / Mo</span>
                                </div>
                                <div class="recruiter-stat-card">
                                    <i class="fa-solid fa-laptop-code recruiter-stat-icon"></i>
                                    <span class="recruiter-stat-val">6</span>
                                    <span class="recruiter-stat-lbl">Projects</span>
                                </div>
                            </div>
                        </div>
                        <div>
                            <span class="recruiter-pitch-title" style="margin-bottom: 8px; display: block;">Core Tech</span>
                            <div class="recruiter-skills-list">
                                <span class="recruiter-skill-tag">JavaScript / TS</span>
                                <span class="recruiter-skill-tag">React</span>
                                <span class="recruiter-skill-tag">Node.js</span>
                                <span class="recruiter-skill-tag">MongoDB</span>
                                <span class="recruiter-skill-tag">PostgreSQL</span>
                                <span class="recruiter-skill-tag">Java</span>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="recruiter-footer">
                    <span>Press <kbd class="recruiter-footer-shortcut">R</kbd> again or <kbd class="recruiter-footer-shortcut">Esc</kbd> to close</span>
                    <a href="mailto:vthakur.290905@gmail.com" class="hover:underline">vthakur.290905@gmail.com</a>
                </div>
            </div>
        `;
        document.body.appendChild(overlay);

        const closeBtn = overlay.querySelector('#recruiter-close-btn');

        const openRecruiterMode = () => {
            // Close command palette if open
            const cmdOverlay = document.getElementById('cmd-palette');
            if (cmdOverlay && cmdOverlay.classList.contains('active')) {
                cmdOverlay.classList.remove('active');
                cmdOverlay.setAttribute('aria-hidden', 'true');
            }

            overlay.classList.add('active');
            overlay.setAttribute('aria-hidden', 'false');
        };

        const closeRecruiterMode = () => {
            overlay.classList.remove('active');
            overlay.setAttribute('aria-hidden', 'true');
        };

        const toggleRecruiterMode = () => {
            if (overlay.classList.contains('active')) {
                closeRecruiterMode();
            } else {
                openRecruiterMode();
            }
        };

        // Expose toggle to global scope so command palette can trigger it
        window.toggleRecruiterMode = toggleRecruiterMode;

        // Keydown toggles
        window.addEventListener('keydown', (e) => {
            // Ignore if typing in input/textarea/select
            if (['INPUT', 'TEXTAREA', 'SELECT'].includes(document.activeElement.tagName)) return;

            if (e.key.toLowerCase() === 'r' && !e.ctrlKey && !e.metaKey && !e.altKey) {
                e.preventDefault();
                toggleRecruiterMode();
            }

            if (overlay.classList.contains('active') && e.key === 'Escape') {
                closeRecruiterMode();
            }
        });

        // Click binds
        pill.addEventListener('click', toggleRecruiterMode);
        if (closeBtn) closeBtn.addEventListener('click', closeRecruiterMode);
        overlay.addEventListener('click', (e) => {
            if (e.target === overlay) {
                closeRecruiterMode();
            }
        });
    };

    initCommandPalette();
    initRecruiterMode();
    initCodingProfileFlips();
});