/**
 * Vansh Thakur Portfolio - JavaScript Core Router & Event Controller
 * Highly optimized, clean & lightweight.
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

    // Custom Scroll Animations (IntersectionObserver)
    const initScrollAnimations = () => {
        const aosElements = document.querySelectorAll('[data-aos]');
        const observer = new IntersectionObserver((entries, obs) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const el = entry.target;
                    const delay = el.getAttribute('data-aos-delay');
                    const duration = el.getAttribute('data-aos-duration');
                    const easing = el.getAttribute('data-aos-easing');

                    if (delay) el.style.transitionDelay = `${delay}ms`;
                    if (duration) el.style.transitionDuration = `${duration}ms`;
                    if (easing) el.style.transitionTimingFunction = easing;

                    el.classList.add('aos-animate');
                    obs.unobserve(el);
                }
            });
        }, { root: null, rootMargin: '0px 0px -40px 0px', threshold: 0.05 });

        aosElements.forEach(el => observer.observe(el));
    };
    initScrollAnimations();

    /* ==========================================================================
       Engineering Journey Metro Line & Station Router Controller
       ========================================================================== */
    const initMetroJourneyRouter = () => {
        const journeySection = document.getElementById('journey');
        const trackLine = document.querySelector('.metro-track-line');
        const trackProgress = document.querySelector('.metro-track-progress');
        const stations = document.querySelectorAll('.metro-station-node');
        if (!journeySection || !trackProgress || !stations.length) return;

        let isManualOverride = false;
        let manualTimeout = null;
        let currentActiveStation = null;

        const handleScrollProgress = () => {
            if (isManualOverride) return;
            const lineRect = trackLine ? trackLine.getBoundingClientRect() : journeySection.getBoundingClientRect();
            const viewportMiddle = window.innerHeight * 0.52;

            const travelDistance = viewportMiddle - lineRect.top;
            const totalLineHeight = lineRect.height;
            let progressPct = Math.max(0, Math.min(100, (travelDistance / totalLineHeight) * 100));
            trackProgress.style.height = `${progressPct}%`;

            let stationToActivate = null;
            stations.forEach((st) => {
                const badge = st.querySelector('.metro-station-badge');
                if (!badge) return;
                const bRect = badge.getBoundingClientRect();

                if (bRect.top <= viewportMiddle + 10) {
                    badge.classList.add('station-passed');
                    stationToActivate = st;
                } else {
                    badge.classList.remove('station-passed');
                }
            });

            if (!stationToActivate && lineRect.top < window.innerHeight * 0.75) {
                stationToActivate = stations[0];
            }

            if (stationToActivate && stationToActivate !== currentActiveStation) {
                currentActiveStation = stationToActivate;
                stations.forEach(s => s.classList.remove('active'));
                stationToActivate.classList.add('active');
            }
        };

        window.addEventListener('scroll', handleScrollProgress, { passive: true });
        window.addEventListener('resize', handleScrollProgress, { passive: true });
        handleScrollProgress();

        const toggleStation = (targetStation) => {
            const isAlreadyActive = targetStation.classList.contains('active');

            stations.forEach(station => station.classList.remove('active'));

            if (!isAlreadyActive) {
                targetStation.classList.add('active');
                currentActiveStation = targetStation;

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

        if (stations[0]) {
            stations[0].classList.add('active');
        }
    };
    initMetroJourneyRouter();

    /* ==========================================================================
       Button Ripple Micro-Interaction
       ========================================================================== */
    const initButtonRipples = () => {
        const rippleTargetSelectors = [
            '.filter-tab',
            '.connect-btn',
            '#email-btn',
            '#form-submit',
            '#footer-totop',
            '#email-btn-cta'
        ];

        document.querySelectorAll(rippleTargetSelectors.join(', ')).forEach(btn => {
            btn.classList.add('btn-ripple');
            btn.addEventListener('click', (e) => {
                const rect = btn.getBoundingClientRect();
                const size = Math.max(rect.width, rect.height);
                const x = e.clientX - rect.left - size / 2;
                const y = e.clientY - rect.top - size / 2;

                const ripple = document.createElement('span');
                ripple.className = 'ripple';
                ripple.style.cssText = `width:${size}px;height:${size}px;left:${x}px;top:${y}px;`;
                btn.appendChild(ripple);
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
    const menuToggle = document.getElementById('menu-toggle');
    const mobileMenu = document.getElementById('mobile-menu');
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
    const getStoredTheme = () => localStorage.getItem('portfolio-theme') || 'light';

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
        applyTheme(currentTheme === 'dark' ? 'light' : 'dark', true);
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

    window.togglePortfolioTheme = (e) => animatedToggle(e);
    window.setPortfolioTheme = applyTheme;

    applyTheme(getStoredTheme(), false);

    if (themeToggleBtn) themeToggleBtn.addEventListener('click', animatedToggle);
    if (themeToggleMobile) themeToggleMobile.addEventListener('click', animatedToggle);

    /* ==========================================================================
       Single-page Scroll Active Anchor Highlight
       ========================================================================== */
    let isScrollingFromClick = false;
    let clickScrollTimeout = null;

    const sections = document.querySelectorAll('section[id]');
    const handleActiveLinkOnScroll = () => {
        if (isScrollingFromClick) return;

        let currentSectionId = 'home';
        if ((window.innerHeight + window.scrollY) >= document.documentElement.scrollHeight - 100) {
            currentSectionId = 'contact';
        } else {
            sections.forEach(section => {
                if (window.scrollY >= section.offsetTop - 150) {
                    currentSectionId = section.getAttribute('id');
                }
            });
        }

        const activeNavId = currentSectionId === 'other-systems-preview' ? 'projects' : currentSectionId;

        const updateLinks = (links) => {
            links.forEach(link => {
                link.classList.remove('clicked');
                link.classList.toggle('active', link.getAttribute('href') === `#${activeNavId}`);
            });
        };
        updateLinks(navLinks);
        updateLinks(mobileNavLinks);
    };

    const handleLinkClick = (e, clickedLink) => {
        const targetHref = clickedLink.getAttribute('href');
        if (targetHref && targetHref.startsWith('#')) {
            e.preventDefault();
            if (targetHref === '#home') {
                window.scrollTo({ top: 0, behavior: 'smooth' });
            } else {
                const targetEl = document.querySelector(targetHref);
                if (targetEl) targetEl.scrollIntoView({ behavior: 'smooth' });
            }
        }

        isScrollingFromClick = true;

        navLinks.forEach(link => link.classList.toggle('active', link.getAttribute('href') === targetHref));
        mobileNavLinks.forEach(link => link.classList.toggle('active', link.getAttribute('href') === targetHref));

        if (clickScrollTimeout) clearTimeout(clickScrollTimeout);
        clickScrollTimeout = setTimeout(() => {
            isScrollingFromClick = false;
        }, 1000);
    };

    document.querySelectorAll('a[href^="#"]').forEach(link => {
        link.addEventListener('click', (e) => handleLinkClick(e, link));
    });

    const initialHomeLink = Array.from(navLinks).find(link => link.getAttribute('href') === '#home');
    if (initialHomeLink) initialHomeLink.classList.add('active');

    /* ==========================================================================
       Scroll & Back to Top visibility
       ========================================================================== */
    const handleScrollEffects = () => {
        handleActiveLinkOnScroll();
        if (backToTop) {
            const shouldShow = window.scrollY > 300;
            backToTop.style.opacity = shouldShow ? '1' : '0';
            backToTop.style.pointerEvents = shouldShow ? 'auto' : 'none';
        }
    };
    window.addEventListener('scroll', handleScrollEffects, { passive: true });
    handleScrollEffects();

    /* ==========================================================================
       Mobile Navigation Drawer Controls
       ========================================================================== */
    const toggleMobileDrawer = () => {
        const isActive = mobileMenu.classList.toggle('active');
        if (menuToggle) menuToggle.classList.toggle('active', isActive);
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

    document.addEventListener('click', (e) => {
        if (mobileMenu && mobileMenu.classList.contains('active')) {
            const isClickInsideMenu = mobileMenu.contains(e.target);
            const isClickToggle = menuToggle && menuToggle.contains(e.target);
            if (!isClickInsideMenu && !isClickToggle) {
                toggleMobileDrawer();
            }
        }
    });

    window.addEventListener('scroll', () => {
        if (mobileMenu && mobileMenu.classList.contains('active')) {
            toggleMobileDrawer();
        }
    }, { passive: true });

    /* ==========================================================================
       Clipboard Copy Utility
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
       Asynchronous EmailJS Form Handler
       ========================================================================== */
    if (contactForm) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();

            const nameEl = document.getElementById('form-name');
            const emailEl = document.getElementById('form-email');
            const messageEl = document.getElementById('form-message');
            const submitText = document.getElementById('form-submit-text');

            const name = nameEl ? nameEl.value.trim() : '';
            const email = emailEl ? emailEl.value.trim() : '';
            const message = messageEl ? messageEl.value.trim() : '';

            if (!name || !email || !message) return;

            formSubmit.disabled = true;
            if (submitText) {
                submitText.innerText = "Transmitting message...";
            } else {
                formSubmit.innerText = "Transmitting message...";
            }

            formStatus.className = 'form-status-pending font-mono text-xs text-center mt-3 p-3 rounded-xl block';
            formStatus.innerText = "Sending your message directly via secure server...";

            const params = {
                name,
                from_name: name,
                email,
                reply_to: email,
                user_email: email,
                message
            };

            const resetBtn = () => {
                formSubmit.disabled = false;
                if (submitText) {
                    submitText.innerText = "Send Message";
                } else {
                    formSubmit.innerText = "Send Message";
                }
            };

            const showSuccess = () => {
                formStatus.className = 'form-status-success font-mono text-xs text-center mt-3 p-3 rounded-xl block';
                formStatus.innerText = "✓ Message sent successfully! I'll get back to you shortly.";
                contactForm.reset();
                resetBtn();
                setTimeout(() => {
                    formStatus.classList.add('hidden');
                }, 7000);
            };

            const showError = (errorMsg) => {
                formStatus.className = 'form-status-error font-mono text-xs text-center mt-3 p-3 rounded-xl block';
                formStatus.innerHTML = `<span>✕ Could not dispatch message (${errorMsg || 'service unavailable'}).</span> <a href="mailto:vthakur.290905@gmail.com" class="underline font-bold hover:opacity-80 ml-1">Send via email instead ↗</a>`;
                resetBtn();
            };

            if (window.emailjs && typeof emailjs.send === 'function') {
                emailjs.send('service_t3hkbsw', 'template_1894rk8', params)
                    .then(() => {
                        emailjs.send('service_t3hkbsw', 'template_qx3u0d8', params).catch(() => {});
                        showSuccess();
                    })
                    .catch((err) => {
                        const msg = (err && (err.text || err.message)) ? (err.text || err.message) : 'error';
                        showError(msg);
                    });
            } else {
                showError("Email client library offline");
            }
        });
    }

    /* ==========================================================================
       Scroll Reset to Top Level
       ========================================================================== */
    const scrollToTopSmooth = (e) => {
        e.preventDefault();
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    if (backToTop) backToTop.addEventListener('click', scrollToTopSmooth);
    const footerToTop = document.getElementById('footer-totop');
    if (footerToTop) footerToTop.addEventListener('click', scrollToTopSmooth);

    /* ==========================================================================
       Filterable Carousel Interactions
       ========================================================================== */
    const filterTabs = document.querySelectorAll('.filter-tab');
    const carouselContainer = document.getElementById('project-carousel');

    if (filterTabs.length && carouselContainer) {
        const speedPxPerMs = 0.12;
        let animationFrameId = null;
        let isInteracting = false;
        let interactionTimeout = null;
        let currentWidth = 0;
        let lastTime = performance.now();
        let isVisibleInViewport = true;

        const setInteracting = (value) => {
            isInteracting = value;
            if (value && interactionTimeout) {
                clearTimeout(interactionTimeout);
            }
        };

        const resumeAfterDelay = () => {
            if (interactionTimeout) clearTimeout(interactionTimeout);
            interactionTimeout = setTimeout(() => {
                setInteracting(false);
                lastTime = performance.now();
            }, 1500);
        };

        carouselContainer.addEventListener('scroll', () => {
            if (isInteracting) {
                resumeAfterDelay();
            }

            if (currentWidth > 0) {
                if (carouselContainer.scrollLeft >= currentWidth * 2) {
                    carouselContainer.scrollLeft -= currentWidth;
                } else if (carouselContainer.scrollLeft < currentWidth) {
                    carouselContainer.scrollLeft += currentWidth;
                }
            }
        });

        const setupInfiniteScroll = () => {
            if (animationFrameId) {
                cancelAnimationFrame(animationFrameId);
            }

            const clonedCards = carouselContainer.querySelectorAll('.carousel-card.cloned');
            clonedCards.forEach(c => c.remove());

            const originalCards = Array.from(carouselContainer.querySelectorAll('.carousel-card:not(.cloned)'))
                .filter(c => c.dataset.visible === 'true');

            if (originalCards.length === 0) return;

            currentWidth = 0;
            originalCards.forEach(c => {
                c.style.display = 'flex';
                currentWidth += c.offsetWidth + 24;
            });

            if (currentWidth > 0) {
                const firstOriginal = originalCards[0];
                originalCards.forEach(card => {
                    const clone = card.cloneNode(true);
                    clone.classList.add('cloned');
                    carouselContainer.insertBefore(clone, firstOriginal);
                });

                originalCards.forEach(card => {
                    const clone = card.cloneNode(true);
                    clone.classList.add('cloned');
                    carouselContainer.appendChild(clone);
                });
            }

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

            const scrollLoop = (timestamp) => {
                if (lastTime === 0) lastTime = timestamp;
                let delta = timestamp - lastTime;
                lastTime = timestamp;

                if (delta > 64) delta = 16;

                if (!isInteracting && currentWidth > 0 && isVisibleInViewport) {
                    carouselContainer.scrollLeft += speedPxPerMs * delta;
                }
                animationFrameId = requestAnimationFrame(scrollLoop);
            };

            const originalBehavior = carouselContainer.style.scrollBehavior;
            carouselContainer.style.scrollBehavior = 'auto';
            carouselContainer.scrollLeft = currentWidth;
            const _ = carouselContainer.offsetHeight; // force reflow
            carouselContainer.style.scrollBehavior = originalBehavior;

            lastTime = performance.now();
            animationFrameId = requestAnimationFrame(scrollLoop);
        };

        filterTabs.forEach(tab => {
            tab.addEventListener('click', () => {
                filterTabs.forEach(t => t.classList.remove('active'));
                tab.classList.add('active');

                const filterValue = tab.getAttribute('data-filter');
                const cards = carouselContainer.querySelectorAll('.carousel-card:not(.cloned)');

                cards.forEach(card => {
                    const cardCategory = card.getAttribute('data-category');
                    if (filterValue === 'all' || cardCategory === filterValue) {
                        card.dataset.visible = 'true';
                    } else {
                        card.dataset.visible = 'false';
                        card.style.display = 'none';
                    }
                });

                setupInfiniteScroll();
            });
        });

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

        carouselContainer.addEventListener('mouseenter', () => setInteracting(true));
        carouselContainer.addEventListener('mouseleave', () => resumeAfterDelay());
        carouselContainer.addEventListener('touchstart', () => setInteracting(true), { passive: true });
        carouselContainer.addEventListener('touchend', () => resumeAfterDelay(), { passive: true });
        carouselContainer.addEventListener('touchcancel', () => resumeAfterDelay(), { passive: true });

        const cards = carouselContainer.querySelectorAll('.carousel-card:not(.cloned)');
        cards.forEach(card => {
            card.dataset.visible = 'true';
        });
        setupInfiniteScroll();

        let resizeTimeout = null;
        window.addEventListener('resize', () => {
            if (resizeTimeout) clearTimeout(resizeTimeout);
            resizeTimeout = setTimeout(() => {
                setupInfiniteScroll();
            }, 250);
        });
    }

    /* ==========================================================================
       GitHub Contributions Fetcher & Generator
       ========================================================================== */
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

    fetch('https://github-contributions-api.jogruber.de/v4/Vans30m?y=2026')
        .then(response => response.json())
        .then(data => {
            const yearConts = data.contributions || [];
            yearConts.sort((a, b) => a.date.localeCompare(b.date));

            const yearTotal = (data.total && data.total['2026']) ? data.total['2026'] : yearConts.reduce((acc, curr) => acc + curr.count, 0);

            document.querySelectorAll('.github-total-contributions').forEach(el => {
                el.innerText = yearTotal;
            });

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
            generateSimulatedGrid(githubBentoGrid, 112, 16);
        });

    // Scroll Progress Indicator Logic
    const progressLine = document.getElementById('scroll-progress');
    const supportsScrollTimeline = window.CSS && CSS.supports && (CSS.supports('animation-timeline', 'scroll(root)') || CSS.supports('animation-timeline', 'view()'));

    if (progressLine && !supportsScrollTimeline) {
        const updateScrollProgress = () => {
            const windowHeight = document.documentElement.scrollHeight - window.innerHeight;
            if (windowHeight > 0) {
                progressLine.style.width = `${(window.scrollY / windowHeight) * 100}%`;
            }
        };
        window.addEventListener('scroll', updateScrollProgress, { passive: true });
        updateScrollProgress();
    }

    // Dismiss Loading Screen Overlay after exactly 1 second
    const loadingOverlay = document.getElementById('loading-overlay');
    if (loadingOverlay) {
        setTimeout(() => {
            loadingOverlay.classList.add('hidden');
        }, 1000);
    }

    // Typewriter effect loop for the hero name text
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
                speed = 2200;
                isDeleting = true;
            } else if (isDeleting && charIdx === 0) {
                isDeleting = false;
                phraseIdx = (phraseIdx + 1) % phrases.length;
                speed = 400;
            }

            setTimeout(typeLoop, speed);
        };

        setTimeout(typeLoop, 800);
    }

    /* ==========================================================================
       Command Palette (Ctrl+K) Controller
       ========================================================================== */
    const initCommandPalette = () => {
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

            const grouped = {};
            filteredItems.forEach((item, index) => {
                if (!grouped[item.category]) {
                    grouped[item.category] = [];
                }
                grouped[item.category].push({ item, globalIndex: index });
            });

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

            const itemEls = resultsContainer.querySelectorAll('.cmd-palette-item');
            itemEls.forEach(el => {
                el.addEventListener('mousedown', (e) => {
                    e.preventDefault();
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

            const activeEl = resultsContainer.querySelector('.cmd-palette-item.active');
            if (activeEl) {
                activeEl.scrollIntoView({ block: 'nearest' });
            }
        };

        const triggerAction = (item) => {
            closePalette();
            if (item.url === 'action:theme') {
                if (window.togglePortfolioTheme) window.togglePortfolioTheme();
                return;
            }
            if (item.url === 'action:recruiter') {
                if (window.toggleRecruiterMode) window.toggleRecruiterMode();
                return;
            }
            if (item.url.startsWith('#')) {
                if (item.url === '#home') {
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                } else {
                    const target = document.querySelector(item.url);
                    if (target) target.scrollIntoView({ behavior: 'smooth' });
                }
            } else {
                if (item.external) {
                    window.open(item.url, '_blank');
                } else {
                    window.location.href = item.url;
                }
            }
        };

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

        const triggerBtn = document.getElementById('cmd-palette-btn');
        const triggerBtnMobile = document.getElementById('cmd-palette-btn-mobile');

        if (triggerBtn) triggerBtn.addEventListener('click', openPalette);
        if (triggerBtnMobile) triggerBtnMobile.addEventListener('click', openPalette);

        overlay.addEventListener('click', (e) => {
            if (e.target === overlay) closePalette();
        });

        closeBtn.addEventListener('click', closePalette);
    };

    /* ==========================================================================
       Recruiter Mode (R Key) Controller
       ========================================================================== */
    const initRecruiterMode = () => {
        const pill = document.createElement('button');
        pill.className = 'recruiter-pill';
        pill.id = 'recruiter-pill';
        pill.setAttribute('aria-label', 'Open Recruiter Mode');
        pill.innerHTML = `<span class="recruiter-pill-text">Click <kbd class="recruiter-pill-key">R</kbd></span>`;
        document.body.appendChild(pill);

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
                                    <span class="recruiter-stat-val">9</span>
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

        window.toggleRecruiterMode = toggleRecruiterMode;

        window.addEventListener('keydown', (e) => {
            if (['INPUT', 'TEXTAREA', 'SELECT'].includes(document.activeElement.tagName)) return;

            if (e.key.toLowerCase() === 'r' && !e.ctrlKey && !e.metaKey && !e.altKey) {
                e.preventDefault();
                toggleRecruiterMode();
            }

            if (overlay.classList.contains('active') && e.key === 'Escape') {
                closeRecruiterMode();
            }
        });

        pill.addEventListener('click', toggleRecruiterMode);
        if (closeBtn) closeBtn.addEventListener('click', closeRecruiterMode);
        overlay.addEventListener('click', (e) => {
            if (e.target === overlay) closeRecruiterMode();
        });
    };

    initCommandPalette();
    initRecruiterMode();
});
