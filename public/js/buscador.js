// --- BUSCADOR DE TODA LA APP ---
// El menú muestra solo lo que la persona activó; aquí se encuentra todo lo demás:
// módulos (aunque estén ocultos), ajustes, testigos del tablero, guías y guiones, y recetas.

const SEARCH_MODULES = [
    { page: 'todos', label: 'Tareas y ruleta', icon: 'check-square', words: 'pendientes tareas ruleta que hago ahora lista' },
    { page: 'money', label: 'Dinero sin drama', icon: 'wallet', words: 'dinero presupuesto deudas tarjeta credito pagos recibos seguros impuestos' },
    { page: 'shopping', label: '¿Comprar o no?', icon: 'shopping-bag', words: 'comprar compra impulso gastar esperar horas de trabajo' },
    { page: 'food', label: 'Alimentación y recetas', icon: 'apple', words: 'comida recetas cocinar despensa super lista freidora' },
    { page: 'pets', label: 'Mis mascotas', icon: 'paw-print', words: 'mascota perro gato veterinario vacunas' },
    { page: 'auto', label: 'Mi automóvil', icon: 'car', words: 'auto carro coche moto aceite llantas tablero testigo verificacion mantenimiento' },
    { page: 'health', label: 'Hábitos y salud', icon: 'heart', words: 'salud habitos agua dormir medicinas respirar' },
    { page: 'house', label: 'Casa funcional', icon: 'home', words: 'casa limpieza reparar hogar' },
    { page: 'outfit', label: 'Qué me pongo', icon: 'cloud-sun', words: 'ropa clima outfit vestir lluvia frio calor closet' },
    { page: 'paz', label: 'Paz en redes', icon: 'instagram', words: 'redes sociales diario desconectar' },
    { page: 'guides', label: 'Dudas y conversaciones', icon: 'book-open', words: 'guias dudas sat tramites guiones conversaciones ansiedad' },
    { page: 'profile', label: 'Tu perfil', icon: 'user-round', words: 'perfil nombre figura pronombres como te hablamos modulos menu' },
    { page: 'settings', label: 'Ajustes', icon: 'settings', words: 'ajustes letra tamano color oscuro accesibilidad respaldo tono' }
];

let searchQuery = '';
let searchResults = [];

function openSearch() {
    const overlay = document.getElementById('search-overlay');
    if (!overlay) return;
    overlay.classList.remove('hidden');
    const input = document.getElementById('search-input');
    input.value = searchQuery;
    input.focus();
    input.select();
    // Las guías y recetas se cargan al abrir para que la búsqueda sea inmediata
    Promise.all([loadData('guias'), loadData('guiones'), loadRecipes()]).then(([g, s]) => {
        GUIAS = GUIAS || g || [];
        GUIONES = GUIONES || s || [];
        runSearch(document.getElementById('search-input').value);
    });
    renderSearchResults();
}

function closeSearch() {
    document.getElementById('search-overlay')?.classList.add('hidden');
}

function searchWords(query) {
    return normalizeText(query.trim()).split(/[^a-z0-9]+/).filter((w) => w && !STOPWORDS.has(w));
}

function matchesWords(text, words) {
    const tokens = normalizeText(text).split(/[^a-z0-9]+/);
    return words.every((w) => wordVariants(w).some((v) => tokens.some((t) => t.startsWith(v))));
}

function runSearch(query) {
    searchQuery = query;
    const words = searchWords(query);
    if (!words.length) {
        searchResults = [];
        renderSearchResults();
        return;
    }
    const vis = state.accessibility.visibleModules;
    const modules = SEARCH_MODULES
        .filter((m) => matchesWords(`${m.label} ${m.words}`, words))
        .map((m) => ({
            group: 'Secciones', icon: m.icon, title: m.label,
            detail: vis[m.page] === false ? 'No está en tu menú' : '',
            action: `navigate('${m.page}')`
        }));
    const lights = findWarningLights(query).slice(0, 4).map((l) => ({
        group: 'Luces del tablero', icon: 'car', title: l.nombre,
        detail: `${LIGHT_COLORS[l.color].label} · parece ${l.parece}`,
        action: `openWarningLightFromSearch('${l.id}')`
    }));
    const library = searchLibrary(query).slice(0, 6).map((item) => ({
        group: 'Dudas y conversaciones', icon: item.guion ? 'message-circle' : 'book-open',
        title: itemTitle(item), detail: item.resumen || item.situacion || '',
        action: `openGuideFromHome('${item.id}')`
    }));
    const recipes = (RECIPES || [])
        .filter((r) => matchesWords([r.titulo, r.resumen, ...(r.etiquetas || []), ...r.ingredientes.map((i) => i.texto)].join(' '), words))
        .slice(0, 5)
        .map((r) => ({ group: 'Recetas', icon: 'chef-hat', title: r.titulo, detail: `${r.minutos} min`, action: `openRecipeFromSearch('${r.id}')` }));
    searchResults = [...modules, ...lights, ...library, ...recipes];
    renderSearchResults();
}

function renderSearchResults() {
    const list = document.getElementById('search-results');
    if (!list) return;
    if (!searchWords(searchQuery).length) {
        list.innerHTML = `<p class="px-2 py-4 text-ink-faint">Busca lo que sea: "me cobraron de más", "pollo", "luz con forma de lámpara", "ropa".</p>`;
        return;
    }
    if (!searchResults.length) {
        list.innerHTML = `<p class="px-2 py-4 text-ink-soft">No encontramos nada con "${escapeHtml(searchQuery)}". Prueba con otra palabra.</p>`;
        return;
    }
    let html = '';
    let group = '';
    searchResults.forEach((r) => {
        if (r.group !== group) {
            group = r.group;
            html += `<p class="px-2 pt-3 pb-1 text-xs font-bold text-ink-faint">${group}</p>`;
        }
        html += `
            <button type="button" onclick="closeSearch(); ${r.action}" class="w-full flex items-start gap-3 p-2 rounded-xl text-left hover:bg-surface-1 focus:bg-surface-1">
                <i data-lucide="${r.icon}" class="w-5 h-5 text-ink-faint mt-0.5 flex-shrink-0" aria-hidden="true"></i>
                <span class="min-w-0">
                    <span class="block font-semibold text-ink">${escapeHtml(r.title)}</span>
                    ${r.detail ? `<span class="block text-sm text-ink-faint truncate">${escapeHtml(r.detail)}</span>` : ''}
                </span>
            </button>`;
    });
    list.innerHTML = html;
    lucide.createIcons();
}

function openRecipeFromSearch(id) {
    Object.assign(recipeUI, { view: 'detail', recipeId: id });
    navigate('food');
    document.getElementById('recipes-root')?.scrollIntoView({ block: 'start' });
}

// "/" o Cmd/Ctrl+K abren el buscador; Esc lo cierra
document.addEventListener('keydown', (e) => {
    const typing = /input|textarea|select/i.test(document.activeElement?.tagName || '');
    if ((e.key === 'k' && (e.metaKey || e.ctrlKey)) || (e.key === '/' && !typing)) {
        e.preventDefault();
        openSearch();
    } else if (e.key === 'Escape') {
        closeSearch();
    }
});
