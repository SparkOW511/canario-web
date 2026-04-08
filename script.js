/* ================================================
   CANARIO – Interactive Features
   1. Contact Form Validation
   2. Light/Dark Theme Toggle
   3. Show/Hide Content (Accordion + Toggles)
   ================================================ */

(function () {
    'use strict';

    // ===== MOBILE NAVIGATION =====
    var hamburger = document.getElementById('hamburger');
    var navLinks = document.getElementById('navLinks');

    hamburger.addEventListener('click', function () {
        hamburger.classList.toggle('active');
        navLinks.classList.toggle('open');
    });

    navLinks.querySelectorAll('.nav__link').forEach(function (link) {
        link.addEventListener('click', function () {
            hamburger.classList.remove('active');
            navLinks.classList.remove('open');
        });
    });

    // Header scroll effect
    var header = document.getElementById('header');
    window.addEventListener('scroll', function () {
        header.classList.toggle('scrolled', window.scrollY > 20);
    });

    // ===== 1. CONTACT FORM VALIDATION =====
    var contactForm = document.getElementById('contactForm');
    var formSuccess = document.getElementById('formSuccess');
    if (contactForm) {

    var fields = {
        name: {
            element: document.getElementById('name'),
            error: document.getElementById('nameError'),
            validate: function (val) {
                if (!val.trim()) return 'Ime in priimek je obvezno polje.';
                if (val.trim().length < 3) return 'Vnesite vsaj 3 znake.';
                if (!/^[a-zA-ZčšžČŠŽáéíóúàèìòùäöüÄÖÜ\s\-]+$/.test(val.trim()))
                    return 'Ime lahko vsebuje samo črke in presledke.';
                return '';
            }
        },
        email: {
            element: document.getElementById('email'),
            error: document.getElementById('emailError'),
            validate: function (val) {
                if (!val.trim()) return 'E-pošta je obvezno polje.';
                if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val.trim()))
                    return 'Vnesite veljaven e-poštni naslov.';
                return '';
            }
        },
        phone: {
            element: document.getElementById('phone'),
            error: document.getElementById('phoneError'),
            validate: function (val) {
                if (val.trim() && !/^[\d\s\+\-\(\)]{6,20}$/.test(val.trim()))
                    return 'Vnesite veljavno telefonsko številko.';
                return '';
            }
        },
        subject: {
            element: document.getElementById('subject'),
            error: document.getElementById('subjectError'),
            validate: function (val) {
                if (!val) return 'Izberite zadevo.';
                return '';
            }
        },
        message: {
            element: document.getElementById('message'),
            error: document.getElementById('messageError'),
            validate: function (val) {
                if (!val.trim()) return 'Sporočilo je obvezno polje.';
                if (val.trim().length < 10) return 'Sporočilo mora imeti vsaj 10 znakov.';
                return '';
            }
        },
        privacy: {
            element: document.getElementById('privacy'),
            error: document.getElementById('privacyError'),
            validate: function () {
                if (!document.getElementById('privacy').checked)
                    return 'Strinjati se morate s pogoji zasebnosti.';
                return '';
            }
        }
    };

    function validateField(name) {
        var field = fields[name];
        var value = field.element.type === 'checkbox' ? '' : field.element.value;
        var errorMsg = field.validate(value);
        field.error.textContent = errorMsg;

        if (field.element.type !== 'checkbox') {
            field.element.classList.remove('error', 'valid');
            if (errorMsg) field.element.classList.add('error');
            else if (value.trim()) field.element.classList.add('valid');
        }
        return !errorMsg;
    }

    Object.keys(fields).forEach(function (name) {
        var field = fields[name];
        var eventType = field.element.type === 'checkbox' ? 'change' : 'input';
        field.element.addEventListener(eventType, function () { validateField(name); });
    });

    contactForm.addEventListener('submit', function (e) {
        e.preventDefault();
        var allValid = true;
        Object.keys(fields).forEach(function (name) {
            if (!validateField(name)) allValid = false;
        });

        if (allValid) {
            formSuccess.classList.add('visible');
            contactForm.reset();
            Object.keys(fields).forEach(function (name) {
                fields[name].element.classList.remove('valid', 'error');
                fields[name].error.textContent = '';
            });
            setTimeout(function () { formSuccess.classList.remove('visible'); }, 5000);
        }
    });
    } // end contactForm guard

    // ===== 2. LIGHT/DARK THEME TOGGLE =====
    var themeToggle = document.getElementById('themeToggle');
    var themeIcon = document.getElementById('themeIcon');

    function getPreferredTheme() {
        var stored = localStorage.getItem('canario-theme');
        if (stored) return stored;
        return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    }

    function setTheme(theme) {
        document.documentElement.setAttribute('data-theme', theme);
        localStorage.setItem('canario-theme', theme);
        if (theme === 'dark') {
            themeIcon.className = 'fa-solid fa-sun';
        } else {
            themeIcon.className = 'fa-solid fa-moon';
        }
    }

    setTheme(getPreferredTheme());

    themeToggle.addEventListener('click', function () {
        var current = document.documentElement.getAttribute('data-theme');
        setTheme(current === 'dark' ? 'light' : 'dark');
    });

    // ===== 3. SHOW/HIDE CONTENT =====

    // Feature card toggles
    document.querySelectorAll('.feature-card__toggle').forEach(function (btn) {
        btn.addEventListener('click', function () {
            var targetId = btn.getAttribute('data-toggle');
            var detail = document.getElementById(targetId);
            var isOpen = detail.classList.contains('open');
            detail.classList.toggle('open');
            btn.classList.toggle('open');
        });
    });

    // Product accordion
    document.querySelectorAll('.accordion-item__header').forEach(function (header) {
        header.addEventListener('click', function () {
            var item = header.parentElement;
            var wasActive = item.classList.contains('active');

            document.querySelectorAll('.accordion-item').forEach(function (el) {
                el.classList.remove('active');
            });

            if (!wasActive) {
                item.classList.add('active');
            }
        });
    });

    // ===== SCROLL ANIMATIONS =====
    var animatedElements = document.querySelectorAll('[data-animate]');

    var observer = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
            if (entry.isIntersecting) {
                var delay = parseInt(entry.target.getAttribute('data-delay')) || 0;
                setTimeout(function () {
                    entry.target.classList.add('visible');
                }, delay);
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });

    animatedElements.forEach(function (el) { observer.observe(el); });

    // ===== ANIMATED COUNTERS =====
    var counterElements = document.querySelectorAll('[data-count]');

    var counterObserver = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
            if (entry.isIntersecting) {
                var el = entry.target;
                var target = parseInt(el.getAttribute('data-count'));
                var duration = 1500;
                var start = 0;
                var startTime = null;

                function animateCount(timestamp) {
                    if (!startTime) startTime = timestamp;
                    var progress = Math.min((timestamp - startTime) / duration, 1);
                    var eased = 1 - Math.pow(1 - progress, 3);
                    var current = Math.floor(eased * target);
                    el.textContent = current.toLocaleString('sl-SI');
                    if (progress < 1) requestAnimationFrame(animateCount);
                    else el.textContent = target.toLocaleString('sl-SI');
                }

                requestAnimationFrame(animateCount);
                counterObserver.unobserve(el);
            }
        });
    }, { threshold: 0.5 });

    counterElements.forEach(function (el) { counterObserver.observe(el); });

    // ===== ACTIVE NAV LINK HIGHLIGHT =====
    var sections = document.querySelectorAll('section[id]');
    var navLinksAll = document.querySelectorAll('.nav__link');

    window.addEventListener('scroll', function () {
        var scrollY = window.scrollY + 100;
        sections.forEach(function (section) {
            var top = section.offsetTop;
            var height = section.offsetHeight;
            var id = section.getAttribute('id');
            if (scrollY >= top && scrollY < top + height) {
                navLinksAll.forEach(function (link) {
                    link.classList.remove('active');
                    if (link.getAttribute('href') === '#' + id) {
                        link.classList.add('active');
                    }
                });
            }
        });
    });

})();
