/**
 * Vansh Thakur Portfolio - JavaScript Core Router & Event Controller
 * Highly optimized, merged UI/UX scripts.
 */
document.addEventListener('DOMContentLoaded', () => {

    // Safety Fallback: Force AOS elements visible if library fails to trigger on scroll
    setTimeout(() => {
        const aosElements = document.querySelectorAll('[data-aos]');
        aosElements.forEach(el => {
            el.style.opacity = '1';
            el.style.transform = 'none';
        });
    }, 1200);

    // Initialize Scroll Animations (AOS)
    try {
        AOS.init({
            once: true,
            duration: 800,
            easing: 'cubic-bezier(0.16, 1, 0.3, 1)',
            offset: 40
        });
    } catch (e) {
        console.warn("AOS did not initialize. Using clean fallback layout.");
    }

    // Initialize EmailJS
    try {
        emailjs.init("VlUq-Vn5S6V2_G1d7"); // Customize with actual key
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
    const sections = document.querySelectorAll('section[id]');
    const scrollObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const id = entry.target.getAttribute('id');
                // Remove active from all links
                navLinks.forEach(link => {
                    if (link.getAttribute('href') === `#${id}`) {
                        link.classList.add('active');
                    } else {
                        link.classList.remove('active');
                    }
                });
                mobileNavLinks.forEach(link => {
                    if (link.getAttribute('href') === `#${id}`) {
                        link.classList.add('active');
                    } else {
                        link.classList.remove('active');
                    }
                });
            }
        });
    }, {
        threshold: 0.25,
        rootMargin: "-20% 0px -60% 0px"
    });

    sections.forEach(section => {
        scrollObserver.observe(section);
    });


    /* ==========================================================================
       2. Scroll & Back to Top visibility
       ========================================================================== */
    const handleScrollEffects = () => {
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
        const isHidden = mobileMenu.classList.contains('hidden');
        if (isHidden) {
            mobileMenu.classList.remove('hidden');
            mobileMenu.classList.add('flex');
            menuIcon.setAttribute('d', 'M6 18L18 6M6 6l12 12');
            document.body.style.overflow = 'hidden';
        } else {
            mobileMenu.classList.add('hidden');
            mobileMenu.classList.remove('flex');
            menuIcon.setAttribute('d', 'M4 6h16M4 12h16M4 18h16');
            document.body.style.overflow = '';
        }
    };

    if (menuToggle) {
        menuToggle.addEventListener('click', toggleMobileDrawer);
    }

    mobileNavLinks.forEach(link => {
        link.addEventListener('click', () => {
            if (!mobileMenu.classList.contains('hidden')) {
                toggleMobileDrawer();
            }
        });
    });

    /* ==========================================================================
       4. Premium Hover Mouse Coordinate Tracking
       ========================================================================== */
    const updateMouseCoordinates = (e, card) => {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        card.style.setProperty('--mouse-x', `${x}px`);
        card.style.setProperty('--mouse-y', `${y}px`);
    };

    const attachCardMouseTracking = () => {
        const cards = document.querySelectorAll('.bentocard, .bento-card-dark');
        cards.forEach(card => {
            card.addEventListener('mousemove', (e) => updateMouseCoordinates(e, card));
        });
    };
    attachCardMouseTracking();

    /* ==========================================================================
       5. Clipboard Copy Utility
       ========================================================================== */
    if (emailBtn && emailText) {
        emailBtn.addEventListener('click', () => {
            const rawEmail = "vthakur.290905@gmail.com";
            navigator.clipboard.writeText(rawEmail).then(() => {
                const originalText = emailText.innerText;
                emailText.innerText = "COPIED TO CLIPBOARD!";
                emailBtn.style.borderColor = "var(--accent)";
                emailBtn.style.color = "var(--accent)";

                setTimeout(() => {
                    emailText.innerText = originalText;
                    emailBtn.style.borderColor = "";
                    emailBtn.style.color = "";
                }, 2000);
            }).catch(err => {
                console.error("Clipboard copy failed:", err);
            });
        });
    }

    /* ==========================================================================
       6. Asynchronous EmailJS Form Handler
       ========================================================================== */
    if (contactForm) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();

            formSubmit.disabled = true;
            formSubmit.innerText = "TRANSMITTING SIGNAL DATA...";
            formStatus.classList.remove('hidden', 'bg-red-500/10', 'text-red-400', 'bg-emerald-500/10', 'text-emerald-400');

            const params = {
                from_name: document.getElementById('form-name').value,
                reply_to: document.getElementById('form-email').value,
                message: document.getElementById('form-message').value
            };

            emailjs.send('service_default', 'template_default', params)
                .then(() => {
                    formStatus.innerText = "SUCCESS: Correspondence packet parsed and dispatched.";
                    formStatus.classList.add('bg-emerald-500/10', 'text-emerald-400');
                    formStatus.classList.remove('hidden');
                    contactForm.reset();
                })
                .catch((err) => {
                    formStatus.innerText = "CRITICAL FAILURE: Delivery channel offline. Try direct email.";
                    formStatus.classList.add('bg-red-500/10', 'text-red-400');
                    formStatus.classList.remove('hidden');
                    console.error("Mail Dispatch Failure:", err);
                })
                .finally(() => {
                    formSubmit.disabled = false;
                    formSubmit.innerText = "TRANSMIT SIGNAL PACKAGE";
                });
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
        let scrollSpeed = 2.5; // pixels per frame (increased speed)
        let animationFrameId = null;
        let isHovered = false;
        let currentWidth = 0;

        const setupInfiniteScroll = (filterValue = 'all') => {
            // Cancel existing animation loop
            if (animationFrameId) {
                cancelAnimationFrame(animationFrameId);
            }

            // Remove any previously cloned cards
            const clonedCards = carouselContainer.querySelectorAll('.carousel-card.cloned');
            clonedCards.forEach(c => c.remove());

            // Get original visible cards for the current filter
            const originalCards = Array.from(carouselContainer.querySelectorAll('.carousel-card:not(.cloned)'))
                .filter(c => c.dataset.visible === 'true');

            if (originalCards.length === 0) return;

            // Compute total width of one set of cards
            currentWidth = 0;
            originalCards.forEach(c => {
                c.style.display = 'flex';
                // Include width and spacing (approx 24px gap)
                currentWidth += c.offsetWidth + 24;
            });

            // Clone visible cards until total width is at least 3x the container width to guarantee seamlessness
            const containerWidth = carouselContainer.offsetWidth;
            if (currentWidth > 0) {
                const targetWidth = containerWidth * 3;
                let widthAdded = 0;
                while (widthAdded < targetWidth) {
                    originalCards.forEach(card => {
                        const clone = card.cloneNode(true);
                        clone.classList.add('cloned');
                        // Re-attach hover coordinate tracking for cursor glows on the clone
                        clone.addEventListener('mousemove', (e) => updateMouseCoordinates(e, clone));
                        carouselContainer.appendChild(clone);
                        widthAdded += card.offsetWidth + 24;
                    });
                }
            }

            // Continuous animation loop
            const scroll = () => {
                if (!isHovered) {
                    carouselContainer.scrollLeft += scrollSpeed;
                    
                    // Seamless wrap around
                    if (carouselContainer.scrollLeft >= currentWidth) {
                        carouselContainer.scrollLeft -= currentWidth;
                    }
                }
                animationFrameId = requestAnimationFrame(scroll);
            };

            // Reset scroll position and start
            carouselContainer.scrollLeft = 0;
            animationFrameId = requestAnimationFrame(scroll);
        };

        // Filter click handlers
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

                setupInfiniteScroll(filterValue);
            });
        });

        // Hover pause listeners
        carouselContainer.addEventListener('mouseenter', () => {
            isHovered = true;
        });
        carouselContainer.addEventListener('mouseleave', () => {
            isHovered = false;
        });

        // Prev/Next manual override buttons with loop wrapping safety
        if (prevBtn && nextBtn) {
            prevBtn.addEventListener('click', () => {
                let targetScroll = carouselContainer.scrollLeft - 320;
                if (targetScroll < 0 && currentWidth > 0) {
                    carouselContainer.scrollLeft = currentWidth + targetScroll;
                } else {
                    carouselContainer.scrollTo({
                        left: targetScroll,
                        behavior: 'smooth'
                    });
                }
            });
            nextBtn.addEventListener('click', () => {
                let targetScroll = carouselContainer.scrollLeft + 320;
                if (targetScroll >= currentWidth && currentWidth > 0) {
                    carouselContainer.scrollLeft = targetScroll - currentWidth;
                } else {
                    carouselContainer.scrollTo({
                        left: targetScroll,
                        behavior: 'smooth'
                    });
                }
            });
        }

        // Initialize: set all to visible and trigger infinite scroll setup
        const cards = carouselContainer.querySelectorAll('.carousel-card:not(.cloned)');
        cards.forEach(card => {
            card.dataset.visible = 'true';
        });
        setupInfiniteScroll('all');
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

            // Update yearly totals dynamically
            const totalElements = document.querySelectorAll('.github-total-contributions');
            const currentYear = new Date().getFullYear();
            const yearTotal = data.total[currentYear] || data.total[Object.keys(data.total).sort().pop()] || '342';
            totalElements.forEach(el => {
                el.innerText = yearTotal;
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

            // Populate Main Calendar Grid (371 cells)
            if (githubGrid) {
                githubGrid.innerHTML = '';
                const lastYearConts = pastContributions.slice(-371);
                
                // Render Month Labels dynamically
                const githubMonths = document.getElementById('github-months-container');
                if (githubMonths) {
                    githubMonths.innerHTML = '';
                    const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
                    let lastMonthIdx = -1;
                    
                    for (let col = 0; col < 53; col++) {
                        const dayIdx = col * 7;
                        if (dayIdx >= lastYearConts.length) break;
                        
                        const d = new Date(lastYearConts[dayIdx].date);
                        const currentMonthIdx = d.getMonth();
                        
                        if (currentMonthIdx !== lastMonthIdx) {
                            const span = document.createElement('span');
                            span.innerText = monthNames[currentMonthIdx];
                            // Each column is 8px wide with 3px gap (11px total offset)
                            span.style.left = `${col * 11}px`;
                            span.style.position = 'absolute';
                            githubMonths.appendChild(span);
                            lastMonthIdx = currentMonthIdx;
                        }
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
});