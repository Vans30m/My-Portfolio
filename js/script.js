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
    const initTimelineProgress = () => {
        const timeline = document.querySelector('#journey .relative');
        const line = document.querySelector('.timeline-line');
        if (!timeline || !line) return;

        const updateTimelineLine = () => {
            const rect = timeline.getBoundingClientRect();
            const viewportHeight = window.innerHeight;

            // Trigger point is at 70% of the viewport height
            const triggerPoint = viewportHeight * 0.7;

            // Calculate how much of the timeline has scrolled past the trigger point
            const totalHeight = rect.height;
            const scrolledHeight = triggerPoint - rect.top;

            // Clamp progress percentage between 0 and 100
            const progress = Math.max(0, Math.min(100, (scrolledHeight / totalHeight) * 100));
            line.style.setProperty('--scroll-progress', `${progress}%`);

            // Illuminate dots as they are reached
            const dots = timeline.querySelectorAll('.timeline-dot');
            dots.forEach(dot => {
                const dotRect = dot.getBoundingClientRect();
                if (dotRect.top < triggerPoint) {
                    dot.classList.add('active-dot');
                } else {
                    dot.classList.remove('active-dot');
                }
            });
        };

        const timelineObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    window.addEventListener('scroll', updateTimelineLine, { passive: true });
                    updateTimelineLine();
                } else {
                    window.removeEventListener('scroll', updateTimelineLine);
                }
            });
        }, { rootMargin: '100px 0px' });

        timelineObserver.observe(timeline);
    };

    initTimelineProgress();

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
            '.carousel-btn',
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
            navigator.clipboard.writeText(rawEmail).then(() => {
                const targetText = textEl || btn;
                const originalText = targetText.innerText;
                targetText.innerText = "COPIED TO CLIPBOARD!";
                btn.style.borderColor = "var(--accent)";
                btn.style.color = "#55D6BE";

                setTimeout(() => {
                    targetText.innerText = originalText;
                    btn.style.borderColor = "";
                    btn.style.color = "";
                }, 2000);
            }).catch(err => {
                console.error("Clipboard copy failed:", err);
            });
        });
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
    const prevBtn = document.getElementById('carousel-prev');
    const nextBtn = document.getElementById('carousel-next');

    if (filterTabs.length && carouselContainer) {
        let speedPxPerMs = 0.22; // increased autoscroll speed (~220px/sec)
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
                carouselContainer.style.scrollSnapType = 'x mandatory';
            } else {
                carouselContainer.style.scrollSnapType = 'none';
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
                    const originalSnap = carouselContainer.style.scrollSnapType;
                    const originalBehavior = carouselContainer.style.scrollBehavior;
                    carouselContainer.style.scrollSnapType = 'none';
                    carouselContainer.style.scrollBehavior = 'auto';
                    carouselContainer.scrollLeft -= currentWidth;
                    const _ = carouselContainer.offsetHeight; // force reflow
                    carouselContainer.style.scrollSnapType = originalSnap;
                    carouselContainer.style.scrollBehavior = originalBehavior;
                }
                // If we scroll to the left past the start of the second set, shift forward by one set width
                else if (carouselContainer.scrollLeft < currentWidth) {
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
                let delta = timestamp - lastTime;
                lastTime = timestamp;

                // If tab was inactive or frame dropped, clamp delta to prevent jumping
                if (delta > 64) {
                    delta = 16;
                }

                if (!isInteracting && currentWidth > 0) {
                    carouselContainer.scrollLeft += speedPxPerMs * delta;
                }
                animationFrameId = requestAnimationFrame(scrollLoop);
            };

            const originalBehavior = carouselContainer.style.scrollBehavior;
            carouselContainer.style.scrollBehavior = 'auto';
            carouselContainer.scrollLeft = currentWidth; // Start at the second set of cards to enable wrapping immediately in both directions
            const _ = carouselContainer.offsetHeight; // force reflow
            carouselContainer.style.scrollBehavior = originalBehavior;
            carouselContainer.style.scrollSnapType = isInteracting ? 'x mandatory' : 'none';

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

                // Hide prev/next navigation arrows if filtering hardware/indev or visible cards count is <= 2
                const navContainer = prevBtn ? prevBtn.parentElement : null;
                if (navContainer) {
                    if (filterValue === 'hardware' || filterValue === 'indev' || visibleCount <= 2) {
                        navContainer.style.display = 'none';
                    } else {
                        navContainer.style.display = 'flex';
                    }
                }

                setupInfiniteScroll(filterValue);
            });
        });

        // Hover events for pausing autoscroll on desktop
        carouselContainer.addEventListener('mouseenter', () => setInteracting(true));
        carouselContainer.addEventListener('mouseleave', () => resumeAfterDelay());

        // Touch events for pausing autoscroll on mobile swipes
        carouselContainer.addEventListener('touchstart', () => setInteracting(true), { passive: true });
        carouselContainer.addEventListener('touchend', () => resumeAfterDelay(), { passive: true });

        // Prev/Next manual button triggers
        if (prevBtn && nextBtn) {
            prevBtn.addEventListener('click', () => {
                setInteracting(true);
                animateScroll(-380, 300);
            });

            nextBtn.addEventListener('click', () => {
                setInteracting(true);
                animateScroll(380, 300);
            });
        }

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

    // Try fetching live data
    fetch('https://github-contributions-api.jogruber.de/v4/Vans30m')
        .then(response => response.json())
        .then(data => {
            // Sort contributions chronologically since they are returned grouped by year in descending order
            data.contributions.sort((a, b) => a.date.localeCompare(b.date));

            // Filter out future dates placeholders from the contributions list
            const todayStr = new Date().toISOString().split('T')[0];
            const pastContributions = data.contributions.filter(c => c.date <= todayStr);

            // Update yearly totals dynamically (last 365 days)
            const totalElements = document.querySelectorAll('.github-total-contributions');
            const last365Days = pastContributions.slice(-365);
            const total365 = last365Days.reduce((acc, curr) => acc + curr.count, 0);
            totalElements.forEach(el => {
                el.innerText = total365;
            });

            // Calculate last 30 days contributions for bento monthly commit indicator
            const monthlyCommitsElements = document.querySelectorAll('.github-month-commits');
            if (monthlyCommitsElements.length) {
                const last30Days = pastContributions.slice(-30);
                const monthTotal = last30Days.reduce((acc, curr) => acc + curr.count, 0);
                monthlyCommitsElements.forEach(el => {
                    el.innerText = monthTotal;
                });
            }

            // Populate Main Calendar Grid (371 cells = 53 weeks * 7 days)
            if (githubGrid) {
                githubGrid.innerHTML = '';
                const gridParent = githubGrid.parentElement;
                // Clean up previous divider lines
                if (gridParent) {
                    gridParent.querySelectorAll('.github-month-divider').forEach(d => d.remove());
                }

                // Take exactly 371 past contributions to fill a 53-column x 7-row grid
                const lastYearConts = pastContributions.slice(-371);

                // Render month barrier divider lines after each month transition
                let lastMonthIdx = -1;
                const totalCols = Math.ceil(lastYearConts.length / 7);

                for (let col = 0; col < totalCols; col++) {
                    let firstMonthInWeek = -1;
                    for (let row = 0; row < 7; row++) {
                        const idx = col * 7 + row;
                        if (idx < lastYearConts.length) {
                            const parts = lastYearConts[idx].date.split('-');
                            const monthIdx = parseInt(parts[1], 10) - 1;
                            if (firstMonthInWeek === -1) {
                                firstMonthInWeek = monthIdx;
                            }
                        }
                    }

                    if (firstMonthInWeek !== -1) {
                        if (lastMonthIdx !== -1 && firstMonthInWeek !== lastMonthIdx && col > 0) {
                            // Place vertical barrier line right between tile columns in gap center
                            const divider = document.createElement('div');
                            divider.className = 'github-month-divider';
                            const pixelPos = col * 13 - 2; // Exact 3px column gap midpoint
                            divider.style.left = `${pixelPos}px`;
                            githubGrid.appendChild(divider);
                        }
                        lastMonthIdx = firstMonthInWeek;
                    }
                }

                lastYearConts.forEach((item, idx) => {
                    const tile = document.createElement('div');
                    tile.className = `github-tile level-${item.level}`;
                    tile.setAttribute('title', `${item.count} contributions on ${item.date}`);
                    // Sweep animation left-to-right week-by-week (column index = Math.floor(idx / 7))
                    tile.style.animationDelay = `${Math.floor(idx / 7) * 0.015 + (idx % 7) * 0.01}s`;
                    githubGrid.appendChild(tile);
                });
            }

            // Populate Bento mini calendar Grid (112 cells)
            if (githubBentoGrid) {
                githubBentoGrid.innerHTML = '';
                const last112Conts = pastContributions.slice(-112);
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
            // Fallback to random simulated grids
            generateSimulatedGrid(githubGrid, 371, 53);
            generateSimulatedGrid(githubBentoGrid, 112, 16);
        });

    // Scroll Progress Indicator Logic
    const progressLine = document.getElementById('scroll-progress');
    const updateScrollProgress = () => {
        if (progressLine) {
            const windowHeight = document.documentElement.scrollHeight - window.innerHeight;
            if (windowHeight > 0) {
                const scrolled = (window.scrollY / windowHeight) * 100;
                progressLine.style.width = `${scrolled}%`;
            }
        }
    };
    window.addEventListener('scroll', updateScrollProgress, { passive: true });
    updateScrollProgress(); // Initial check

    // Dismiss Loading Screen Overlay 2 seconds after page finishes loading
    const loadingOverlay = document.getElementById('loading-overlay');
    if (loadingOverlay) {
        let dismissed = false;
        const dismissLoader = () => {
            if (dismissed) return;
            dismissed = true;
            loadingOverlay.classList.add('hidden');
        };

        window.addEventListener('load', () => {
            setTimeout(dismissLoader, 2000); // Hold for 2 seconds after load completes
        });

        // Safety timeout to guarantee loader hides even if assets get stuck
        setTimeout(dismissLoader, 5000);
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

            { id: 'proj-focusora', title: 'FocusoraHQ Workspace', desc: 'Productivity & study workspace ecosystem', url: 'https://focusorahq.vercel.app', category: 'Projects', icon: 'fa-laptop-code', shortcut: '↗', external: true },
            { id: 'proj-piezo', title: 'Piezoelectric Floor Case Study', desc: 'Energy harvesting floor design', url: 'html/piezoelectric-details.html', category: 'Case Studies', icon: 'fa-plug', shortcut: '↗' },
            { id: 'proj-floor', title: 'Floor Cleaning Robot Case Study', desc: 'Autonomous Arduino cleaner', url: 'html/floorcleaning-details.html', category: 'Case Studies', icon: 'fa-robot', shortcut: '↗' },

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
            <span class="recruiter-pill-dot"></span>
            <span>Recruiter Mode <kbd style="margin-left: 4px; opacity: 0.7; font-size: 9px; font-weight: 600; background: rgba(232,163,61,0.15); color: #e8a33d; padding: 2px 5px; border-radius: 4px; border: 1px solid rgba(232,163,61,0.3);">R</kbd></span>
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
                        <h2 class="recruiter-title" id="recruiter-modal-title">Vansh Thakur Summary</h2>
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
                                    <span class="recruiter-stat-val github-month-commits">35</span>
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
                    <a href="mailto:vthakur.290905@gmail.com" style="color: var(--acc3); text-decoration: none;" class="hover:underline">vthakur.290905@gmail.com</a>
                </div>
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
        closeBtn.addEventListener('click', closeRecruiterMode);
        overlay.addEventListener('click', (e) => {
            if (e.target === overlay) {
                closeRecruiterMode();
            }
        });
    };

    /* ==========================================================================
       Coding Profiles Click-to-Flip Interaction
       ========================================================================== */
    const initCodingProfileFlips = () => {
        // Direct links enabled on cards; flip functionality disabled
    };

    initCommandPalette();
    initRecruiterMode();
    initCodingProfileFlips();
});