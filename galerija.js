// Search & Filter
const searchInput = document.getElementById('gallerySearch');
const searchClear = document.getElementById('searchClear');
const noResults = document.getElementById('noResults');
const noResultsQuery = document.getElementById('noResultsQuery');
const filterBtns = document.querySelectorAll('.gallery__filter-btn');
const items = document.querySelectorAll('.gallery__item');

let activeFilter = 'all';

function getItemText(item) {
    const title = item.querySelector('h3')?.textContent || '';
    const desc = item.querySelector('p')?.textContent || '';
    const tag = item.querySelector('span')?.textContent || '';
    const alt = item.querySelector('img')?.alt || '';
    return (title + ' ' + desc + ' ' + tag + ' ' + alt).toLowerCase();
}

function applyFilters() {
    const query = searchInput.value.trim().toLowerCase();
    let visibleCount = 0;

    items.forEach(item => {
        const matchesFilter = activeFilter === 'all' || item.dataset.category === activeFilter;
        const matchesSearch = !query || getItemText(item).includes(query);

        if (matchesFilter && matchesSearch) {
            item.style.display = '';
            visibleCount++;
        } else {
            item.style.display = 'none';
        }
    });

    searchClear.classList.toggle('visible', query.length > 0);

    if (visibleCount === 0 && query) {
        noResultsQuery.textContent = query;
        noResults.classList.add('visible');
    } else {
        noResults.classList.remove('visible');
    }
}

searchInput.addEventListener('input', applyFilters);

searchClear.addEventListener('click', () => {
    searchInput.value = '';
    searchInput.focus();
    applyFilters();
});

filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        filterBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        activeFilter = btn.dataset.filter;
        applyFilters();
    });
});

// Lightbox
const lightbox = document.getElementById('lightbox');
const lightboxImg = document.getElementById('lightboxImg');
const lightboxClose = document.getElementById('lightboxClose');

items.forEach(item => {
    item.addEventListener('click', () => {
        if (item.style.display === 'none') return;
        const img = item.querySelector('img');
        lightboxImg.src = img.src;
        lightboxImg.alt = img.alt;
        lightbox.classList.add('open');
    });
});

lightboxClose.addEventListener('click', (e) => {
    e.stopPropagation();
    lightbox.classList.remove('open');
});

lightbox.addEventListener('click', () => {
    lightbox.classList.remove('open');
});

lightboxImg.addEventListener('click', (e) => e.stopPropagation());
