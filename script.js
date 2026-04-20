// ===== NAVIGATION =====
const hamburger = document.getElementById('hamburger');
const navLinks = document.getElementById('navLinks');
const header = document.getElementById('header');

const closeMenu = () => {
    hamburger.classList.remove('active');
    navLinks.classList.remove('open');
};

hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('active');
    navLinks.classList.toggle('open');
});

navLinks.querySelectorAll('.nav__link').forEach(link => {
    link.addEventListener('click', closeMenu);
});

window.addEventListener('scroll', () => {
    header.classList.toggle('scrolled', window.scrollY > 20);
}, { passive: true });

// ===== CONTACT FORM VALIDATION =====
const contactForm = document.getElementById('contactForm');
if (contactForm) {
    const formSuccess = document.getElementById('formSuccess');
    const fields = contactForm.querySelectorAll('input, select, textarea');

    const emailRe = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const phoneRe = /^[\d\s+\-()]{6,20}$/;

    const getError = el => {
        if (el.type === 'checkbox') return el.checked ? '' : 'Strinjati se morate s pogoji zasebnosti.';
        const val = el.value.trim();
        if (!val) return 'To polje je obvezno.';
        if (el.id === 'email' && !emailRe.test(val)) return 'Vnesite veljaven e-poštni naslov.';
        if (el.id === 'phone' && !phoneRe.test(val)) return 'Vnesite veljavno telefonsko številko.';
        if (el.id === 'message' && val.length < 10) return 'Sporočilo mora imeti vsaj 10 znakov.';
        return '';
    };

    const validateField = el => {
        const msg = getError(el);
        const errorEl = document.getElementById(el.id + 'Error');
        if (errorEl) errorEl.textContent = msg;
        if (el.type !== 'checkbox') {
            el.classList.toggle('error', !!msg);
            el.classList.toggle('valid', !msg && !!el.value.trim());
        }
        return !msg;
    };

    fields.forEach(el => {
        const event = el.type === 'checkbox' ? 'change' : 'input';
        el.addEventListener(event, () => validateField(el));
    });

    contactForm.addEventListener('submit', e => {
        e.preventDefault();
        const allValid = [...fields].every(validateField);
        if (!allValid) return;

        formSuccess.classList.add('visible');
        contactForm.reset();
        fields.forEach(el => el.classList.remove('valid', 'error'));
        setTimeout(() => formSuccess.classList.remove('visible'), 5000);
    });
}

// ===== LIGHT/DARK THEME =====
const themeToggle = document.getElementById('themeToggle');
const themeIcon = document.getElementById('themeIcon');
const THEME_KEY = 'canario-theme';

const getPreferredTheme = () => {
    const stored = localStorage.getItem(THEME_KEY);
    if (stored) return stored;
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
};

const setTheme = theme => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem(THEME_KEY, theme);
    themeIcon.className = theme === 'dark' ? 'fa-solid fa-sun' : 'fa-solid fa-moon';
};

setTheme(getPreferredTheme());

themeToggle.addEventListener('click', () => {
    const current = document.documentElement.getAttribute('data-theme');
    setTheme(current === 'dark' ? 'light' : 'dark');
});

// ===== SHOW / HIDE CONTENT =====
document.querySelectorAll('.feature-card__toggle').forEach(btn => {
    btn.addEventListener('click', () => {
        const detail = document.getElementById(btn.dataset.toggle);
        detail.classList.toggle('open');
        btn.classList.toggle('open');
    });
});

const accordionItems = document.querySelectorAll('.accordion-item');
accordionItems.forEach(item => {
    const header = item.querySelector('.accordion-item__header');
    header.addEventListener('click', () => {
        const wasActive = item.classList.contains('active');
        accordionItems.forEach(el => el.classList.remove('active'));
        if (!wasActive) item.classList.add('active');
    });
});

// ===== SCROLL ANIMATIONS =====
const animateObserver = new IntersectionObserver((entries, obs) => {
    entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        const delay = parseInt(entry.target.dataset.delay) || 0;
        setTimeout(() => entry.target.classList.add('visible'), delay);
        obs.unobserve(entry.target);
    });
}, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });

document.querySelectorAll('[data-animate]').forEach(el => animateObserver.observe(el));

// ===== ANIMATED COUNTERS =====
const counterObserver = new IntersectionObserver((entries, obs) => {
    entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        const el = entry.target;
        const target = parseInt(el.dataset.count);
        const duration = 1500;
        let startTime = null;

        const step = timestamp => {
            if (!startTime) startTime = timestamp;
            const progress = Math.min((timestamp - startTime) / duration, 1);
            const eased = 1 - Math.pow(1 - progress, 3);
            el.textContent = Math.floor(eased * target).toLocaleString('sl-SI');
            if (progress < 1) requestAnimationFrame(step);
            else el.textContent = target.toLocaleString('sl-SI');
        };

        requestAnimationFrame(step);
        obs.unobserve(el);
    });
}, { threshold: 0.5 });

document.querySelectorAll('[data-count]').forEach(el => counterObserver.observe(el));

// ===== ACTIVE NAV LINK HIGHLIGHT =====
const sections = document.querySelectorAll('section[id]');
if (sections.length) {
    const navLinksAll = document.querySelectorAll('.nav__link');
    const setActiveLink = id => {
        navLinksAll.forEach(link => {
            link.classList.toggle('active', link.getAttribute('href') === '#' + id);
        });
    };

    const navObserver = new IntersectionObserver(entries => {
        entries.forEach(entry => {
            if (entry.isIntersecting) setActiveLink(entry.target.id);
        });
    }, { rootMargin: '-40% 0px -50% 0px' });

    sections.forEach(section => navObserver.observe(section));
}
