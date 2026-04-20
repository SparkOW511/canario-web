const searchInput = document.getElementById('gallerySearch');
const searchClear = document.getElementById('searchClear');
const noResults = document.getElementById('noResults');
const noResultsQuery = document.getElementById('noResultsQuery');
const filterBtns = document.querySelectorAll('.gallery__filter-btn');
const items = document.querySelectorAll('.gallery__item');

const itemsData = [...items].map(item => ({
    el: item,
    category: item.dataset.category,
    text: [
        item.querySelector('h3')?.textContent,
        item.querySelector('p')?.textContent,
        item.querySelector('span')?.textContent,
        item.querySelector('img')?.alt,
    ].join(' ').toLowerCase(),
}));

let activeFilter = 'all';

function applyFilters() {
    const query = searchInput.value.trim().toLowerCase();
    let visibleCount = 0;

    itemsData.forEach(({ el, category, text }) => {
        const matchesFilter = activeFilter === 'all' || category === activeFilter;
        const matchesSearch = !query || text.includes(query);
        const show = matchesFilter && matchesSearch;
        el.style.display = show ? '' : 'none';
        if (show) visibleCount++;
    });

    searchClear.classList.toggle('visible', query.length > 0);

    const empty = visibleCount === 0 && !!query;
    noResults.classList.toggle('visible', empty);
    if (empty) noResultsQuery.textContent = query;
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
