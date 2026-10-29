// --- RECETAS: "¿QUÉ COCINO HOY?" ---
// Las recetas viven en data/recetas.json (formato en docs/recetas-formato.md).
// Nunca se muestra la lista completa: una sugerencia a la vez, buscador y filtros.
// Lo personal (favoritas, hechas, notas, despensa) se guarda en state.food.

const PANTRY_GROUPS = [
    ['Huevo y lácteos', { huevo: 'Huevo', leche: 'Leche', crema: 'Crema', yogur: 'Yogur', mantequilla: 'Mantequilla', 'queso-panela': 'Queso panela', 'queso-oaxaca': 'Queso Oaxaca', 'queso-manchego': 'Queso manchego', 'queso-fresco': 'Queso fresco', 'queso-crema': 'Queso crema', 'leche-condensada': 'Leche condensada', 'leche-evaporada': 'Leche evaporada' }],
    ['Tortillas y panes', { 'tortilla-maiz': 'Tortillas de maíz', 'tortilla-harina': 'Tortillas de harina', tostadas: 'Tostadas', totopos: 'Totopos', 'pan-caja': 'Pan de caja', bolillo: 'Bolillo', 'pan-molido': 'Pan molido' }],
    ['Granos y secos', { arroz: 'Arroz', pasta: 'Pasta', fideo: 'Fideo', avena: 'Avena', frijoles: 'Frijoles', lentejas: 'Lentejas', garbanzos: 'Garbanzos', harina: 'Harina', granola: 'Granola' }],
    ['Proteínas', { 'pollo-pechuga': 'Pechuga de pollo', 'pollo-piezas': 'Piezas de pollo', 'pollo-cocido': 'Pollo cocido (rosticería)', 'carne-molida': 'Carne molida', bistec: 'Bistec', 'chuleta-cerdo': 'Chuleta de cerdo', salchicha: 'Salchicha', jamon: 'Jamón', chorizo: 'Chorizo', 'atun-lata': 'Atún en lata', 'filete-pescado': 'Filete de pescado', camaron: 'Camarón', tofu: 'Tofu' }],
    ['Verduras', { jitomate: 'Jitomate', cebolla: 'Cebolla', ajo: 'Ajo', papa: 'Papa', zanahoria: 'Zanahoria', calabacita: 'Calabacita', elote: 'Elote', chayote: 'Chayote', espinaca: 'Espinaca', lechuga: 'Lechuga', pepino: 'Pepino', brocoli: 'Brócoli', champinones: 'Champiñones', pimiento: 'Pimiento', nopales: 'Nopales', chicharos: 'Chícharos', ejotes: 'Ejotes', camote: 'Camote', cilantro: 'Cilantro', 'verduras-congeladas': 'Verduras congeladas' }],
    ['Chiles y salsas', { 'chile-serrano': 'Chile serrano', 'chile-jalapeno': 'Chile jalapeño', 'chipotle-lata': 'Chipotle en lata', 'salsa-verde': 'Salsa verde', 'salsa-roja': 'Salsa roja', 'salsa-soya': 'Salsa de soya', mayonesa: 'Mayonesa', mostaza: 'Mostaza', catsup: 'Cátsup', 'consome-pollo': 'Consomé de pollo' }],
    ['Frutas', { limon: 'Limón', aguacate: 'Aguacate', platano: 'Plátano', 'platano-macho': 'Plátano macho', manzana: 'Manzana', fresa: 'Fresa', mango: 'Mango', naranja: 'Naranja', 'frutos-rojos-congelados': 'Frutos rojos congelados' }],
    ['Otros', { cacahuate: 'Cacahuate', 'crema-cacahuate': 'Crema de cacahuate', miel: 'Miel', canela: 'Canela', vainilla: 'Vainilla', chocolate: 'Chocolate', 'galletas-maria': 'Galletas María', gelatina: 'Gelatina' }]
];
const PANTRY_LABELS = Object.assign({}, ...PANTRY_GROUPS.map(([, items]) => items));

const RECIPE_FILTERS = {
    energia: { label: 'Energía de hoy', options: { poca: 'Poca', normal: 'Normal', ganas: 'Con ganas' } },
    utensilio: { label: 'Con qué', options: { freidora: 'Freidora de aire', sarten: 'Sartén', microondas: 'Microondas', olla: 'Olla', horno: 'Horno', 'sin-cocinar': 'Sin cocinar' } },
    tiempo: { label: 'Tiempo', options: { 15: 'Hasta 15 min', 30: 'Hasta 30 min' } },
    comida: { label: 'Para', options: { desayuno: 'Desayuno', comida: 'Comida', cena: 'Cena', botana: 'Botana', postre: 'Postre' } }
};
const UTENSIL_LABELS = { ...RECIPE_FILTERS.utensilio.options, licuadora: 'Licuadora' };
const ENERGY_LABELS = { poca: 'Poca energía', normal: 'Energía normal', ganas: 'Con ganas' };

let RECIPES = null;
let recipesLoading = null;
const recipeUI = { query: '', filters: {}, onlyPantry: false, suggestionId: null, view: 'browse', recipeId: null, step: 0 };
let cookTimer = { interval: null, endsAt: 0, label: '' };

function recipeState() {
    const food = state.food;
    food.pantry = food.pantry || [];
    food.recipeFavorites = food.recipeFavorites || [];
    food.recipeHistory = food.recipeHistory || [];
    food.recipeNotes = food.recipeNotes || {};
    food.recipeSeen = food.recipeSeen || [];
    return food;
}

function loadRecipes() {
    if (RECIPES) return Promise.resolve(RECIPES);
    if (!recipesLoading) {
        recipesLoading = fetch('data/recetas.json')
            .then((r) => r.json())
            .then((data) => { RECIPES = data; return data; })
            .catch(() => { recipesLoading = null; return null; });
    }
    return recipesLoading;
}

function findRecipe(id) {
    return (RECIPES || []).find((r) => r.id === id);
}

function missingIngredients(recipe) {
    const pantry = recipeState().pantry;
    return recipe.ingredientes.filter((i) => !i.opcional && i.clave !== 'basico' && !pantry.includes(i.clave));
}

function matchingRecipes() {
    const { filters, onlyPantry } = recipeUI;
    const query = normalizeText(recipeUI.query.trim());
    return (RECIPES || []).filter((r) => {
        if (filters.energia && r.energia !== filters.energia) return false;
        if (filters.utensilio && !r.utensilios.includes(filters.utensilio)) return false;
        if (filters.tiempo && r.minutos > Number(filters.tiempo)) return false;
        if (filters.comida && !r.comida.includes(filters.comida)) return false;
        if (onlyPantry && missingIngredients(r).length > 0) return false;
        if (query) {
            const haystack = normalizeText([r.titulo, r.resumen, ...r.ingredientes.map((i) => i.texto), ...(r.etiquetas || [])].join(' '));
            return query.split(/\s+/).every((word) => haystack.includes(word));
        }
        return true;
    });
}

// Elige una receta que no se haya mostrado hace poco; si ya se vieron todas, vuelve a empezar
function pickSuggestion(candidates) {
    if (candidates.length === 0) return null;
    const food = recipeState();
    let fresh = candidates.filter((r) => !food.recipeSeen.includes(r.id) && r.id !== recipeUI.suggestionId);
    if (fresh.length === 0) {
        food.recipeSeen = food.recipeSeen.filter((id) => !candidates.some((r) => r.id === id));
        fresh = candidates.filter((r) => r.id !== recipeUI.suggestionId);
        if (fresh.length === 0) fresh = candidates;
    }
    const pick = fresh[Math.floor(Math.random() * fresh.length)];
    food.recipeSeen = [pick.id, ...food.recipeSeen.filter((id) => id !== pick.id)].slice(0, 40);
    saveState();
    return pick;
}

function recipeMeta(r) {
    const utensils = r.utensilios.map((u) => UTENSIL_LABELS[u] || u).join(', ');
    return `${r.minutos} min · ${utensils} · ${r.porciones} ${r.porciones === 1 ? 'porción' : 'porciones'}`;
}

// --- Vistas ---

function renderRecipesSection() {
    if (!RECIPES) {
        loadRecipes().then((data) => {
            const root = document.getElementById('recipes-root');
            if (root) root.innerHTML = data ? renderRecipesView() : '<p class="text-ink-soft">No se pudieron cargar las recetas. Revisa tu conexión e inténtalo otra vez.</p>';
            lucide.createIcons();
        });
        return '<div id="recipes-root"><p class="text-ink-faint">Cargando recetas…</p></div>';
    }
    return `<div id="recipes-root">${renderRecipesView()}</div>`;
}

function renderRecipesView() {
    if (recipeUI.view === 'detail' && findRecipe(recipeUI.recipeId)) return renderRecipeDetail(findRecipe(recipeUI.recipeId));
    if (recipeUI.view === 'cook' && findRecipe(recipeUI.recipeId)) return renderCookMode(findRecipe(recipeUI.recipeId));
    if (recipeUI.view === 'pantry') return renderPantryEditor();
    return renderRecipeBrowse();
}

function rerenderRecipes() {
    const root = document.getElementById('recipes-root');
    if (!root) return;
    root.innerHTML = renderRecipesView();
    lucide.createIcons();
}

function filterChip(group, value, label) {
    const active = String(recipeUI.filters[group]) === String(value);
    return `<button type="button" onclick="toggleRecipeFilter('${group}', '${value}')" aria-pressed="${active}"
        class="px-4 rounded-full border text-sm font-semibold ${active ? 'bg-accent-fill text-white border-transparent' : 'bg-card text-ink-soft border-edge'}">${label}</button>`;
}

function renderRecipeBrowse() {
    const food = recipeState();
    const matches = matchingRecipes();
    const searching = recipeUI.query.trim() !== '';

    if (!searching && (!recipeUI.suggestionId || !matches.some((r) => r.id === recipeUI.suggestionId))) {
        const pick = pickSuggestion(matches);
        recipeUI.suggestionId = pick ? pick.id : null;
    }
    const suggestion = findRecipe(recipeUI.suggestionId);

    const filtersHtml = Object.entries(RECIPE_FILTERS).map(([group, { label, options }]) => `
        <div class="space-y-2">
            <p class="text-sm font-bold text-ink-faint">${label}</p>
            <div class="flex flex-wrap gap-2">${Object.entries(options).map(([value, text]) => filterChip(group, value, text)).join('')}</div>
        </div>
    `).join('');

    let resultsHtml;
    if (searching) {
        const shown = matches.slice(0, 8);
        resultsHtml = shown.length === 0
            ? '<p class="text-ink-soft">No encontramos recetas con eso. Prueba con otra palabra o quita un filtro.</p>'
            : `<div class="space-y-2">${shown.map((r) => `
                <button type="button" onclick="openRecipe('${r.id}')" class="w-full text-left p-4 bg-surface-1 border border-line rounded-2xl">
                    <span class="block font-bold text-ink">${escapeHtml(r.titulo)}</span>
                    <span class="block text-sm text-ink-faint">${recipeMeta(r)}</span>
                </button>`).join('')}
                ${matches.length > shown.length ? `<p class="text-sm text-ink-faint">Hay ${matches.length - shown.length} más. Agrega otra palabra para acotar.</p>` : ''}
            </div>`;
    } else if (!suggestion) {
        resultsHtml = '<p class="text-ink-soft">Ninguna receta cumple todos los filtros. Quita uno para ver opciones.</p>';
    } else {
        const missing = missingIngredients(suggestion);
        const pantryNote = food.pantry.length === 0 ? '' : missing.length === 0
            ? '<p class="text-sm text-accent font-semibold">Tienes todo lo necesario.</p>'
            : `<p class="text-sm text-ink-faint">Te falta: ${missing.map((i) => escapeHtml(PANTRY_LABELS[i.clave] || i.texto)).join(', ')}.</p>`;
        resultsHtml = `
            <div class="p-5 bg-surface-1 border border-line rounded-2xl space-y-3">
                <p class="text-sm font-bold text-ink-faint">${ENERGY_LABELS[suggestion.energia]}</p>
                <h4 class="text-lg font-bold text-ink">${escapeHtml(suggestion.titulo)}</h4>
                <p class="text-ink-soft">${escapeHtml(suggestion.resumen)}</p>
                <p class="text-sm text-ink-faint">${recipeMeta(suggestion)}</p>
                ${pantryNote}
                <div class="flex flex-wrap gap-2 pt-1">
                    <button type="button" onclick="openRecipe('${suggestion.id}')" class="px-5 bg-accent-fill text-white rounded-xl font-bold">Ver receta</button>
                    <button type="button" onclick="nextRecipeSuggestion()" class="px-5 bg-card border border-edge rounded-xl font-bold flex items-center gap-2"><i data-lucide="shuffle" class="w-4 h-4" aria-hidden="true"></i>Otra</button>
                </div>
            </div>
            <p class="text-sm text-ink-faint">${matches.length} ${matches.length === 1 ? 'receta coincide' : 'recetas coinciden'} con tus filtros.</p>
        `;
    }

    const quickList = (ids, title) => {
        const items = ids.map(findRecipe).filter(Boolean).slice(0, 6);
        if (items.length === 0) return '';
        return `
            <div class="space-y-2">
                <p class="text-sm font-bold text-ink-faint">${title}</p>
                <div class="flex flex-wrap gap-2">${items.map((r) => `<button type="button" onclick="openRecipe('${r.id}')" class="px-4 bg-card border border-line rounded-xl text-sm font-semibold text-ink-soft">${escapeHtml(r.titulo)}</button>`).join('')}</div>
            </div>`;
    };
    const recentIds = [...new Set(food.recipeHistory.map((h) => h.id))];
    const activeFilters = Object.keys(recipeUI.filters).length + (recipeUI.onlyPantry ? 1 : 0);

    return `
        <div class="space-y-5">
            <div>
                <label for="recipe-search" class="sr-only">Buscar receta</label>
                <div class="relative">
                    <i data-lucide="search" class="w-5 h-5 text-ink-faint absolute left-3 top-1/2 -translate-y-1/2" aria-hidden="true"></i>
                    <input id="recipe-search" type="search" value="${escapeHtml(recipeUI.query)}" oninput="searchRecipes(this.value)" placeholder="Busca por nombre o ingrediente" class="w-full pl-11 pr-3 border rounded-xl">
                </div>
            </div>

            <div id="recipe-results" class="space-y-3">${resultsHtml}</div>

            <details class="group" ${activeFilters > 0 ? 'open' : ''}>
                <summary class="cursor-pointer font-bold text-ink-soft gap-2 [&::-webkit-details-marker]:hidden">
                    <i data-lucide="sliders-horizontal" class="w-4 h-4" aria-hidden="true"></i>
                    Filtros${activeFilters > 0 ? ` (${activeFilters})` : ''}
                </summary>
                <div class="space-y-4 pt-3">
                    ${filtersHtml}
                    <div class="flex flex-wrap items-center gap-3 pt-1">
                        <label class="flex items-center gap-3 font-semibold text-ink-soft">
                            <input type="checkbox" ${recipeUI.onlyPantry ? 'checked' : ''} onchange="toggleOnlyPantry()">
                            Solo con lo que tengo
                        </label>
                        <button type="button" onclick="openPantryEditor()" class="px-4 bg-card border border-edge rounded-xl text-sm font-bold">${food.pantry.length > 0 ? `Lo que tengo (${food.pantry.length})` : 'Marcar lo que tengo'}</button>
                        ${activeFilters > 0 ? '<button type="button" onclick="clearRecipeFilters()" class="px-3 text-sm font-bold text-accent underline">Quitar filtros</button>' : ''}
                    </div>
                </div>
            </details>

            ${quickList(food.recipeFavorites, 'Tus favoritas')}
            ${quickList(recentIds, 'Hechas hace poco')}
        </div>
    `;
}

function renderRecipeDetail(r) {
    const food = recipeState();
    const isFavorite = food.recipeFavorites.includes(r.id);
    const missing = missingIngredients(r);
    const note = food.recipeNotes[r.id] || '';
    const hasPantry = food.pantry.length > 0;

    const ingredientsHtml = r.ingredientes.map((i) => {
        const have = i.clave === 'basico' || food.pantry.includes(i.clave);
        const mark = !hasPantry || i.clave === 'basico' ? '' : have
            ? '<span class="text-sm text-accent font-semibold">Tienes</span>'
            : (i.opcional ? '' : '<span class="text-sm text-ink-faint">Falta</span>');
        return `<li class="flex items-baseline justify-between gap-3 py-2 border-b border-line last:border-0">
            <span>${escapeHtml(i.texto)}${i.opcional ? ' <span class="text-ink-faint">(opcional)</span>' : ''}</span>${mark}
        </li>`;
    }).join('');

    return `
        <div class="space-y-5">
            <button type="button" onclick="closeRecipe()" class="flex items-center gap-2 px-4 bg-surface-2 rounded-xl text-sm font-bold text-ink-soft"><i data-lucide="arrow-left" class="w-4 h-4" aria-hidden="true"></i>Volver a sugerencias</button>
            <div class="flex items-start justify-between gap-3">
                <div class="space-y-1">
                    <h4 class="text-xl font-bold text-ink">${escapeHtml(r.titulo)}</h4>
                    <p class="text-ink-soft">${escapeHtml(r.resumen)}</p>
                    <p class="text-sm text-ink-faint">${recipeMeta(r)} · ${ENERGY_LABELS[r.energia]}</p>
                </div>
                <button type="button" onclick="toggleRecipeFavorite('${r.id}')" aria-pressed="${isFavorite}" aria-label="${isFavorite ? 'Quitar de favoritas' : 'Guardar en favoritas'}" class="rounded-xl border border-edge ${isFavorite ? 'bg-accent-soft text-accent' : 'bg-card text-ink-soft'} flex items-center justify-center">
                    <i data-lucide="bookmark" class="w-5 h-5" aria-hidden="true"></i>
                </button>
            </div>

            ${r.seguridad ? `<div class="flex gap-3 p-4 bg-attention-soft text-attention rounded-2xl"><i data-lucide="shield-alert" class="w-5 h-5 flex-shrink-0" aria-hidden="true"></i><p>${escapeHtml(r.seguridad)}</p></div>` : ''}

            <div>
                <h5 class="font-bold text-ink mb-1">Ingredientes</h5>
                <ul>${ingredientsHtml}</ul>
                <p class="text-sm text-ink-faint pt-2">Sal, pimienta y aceite se dan por hecho.</p>
                ${hasPantry && missing.length > 0 ? `<button type="button" onclick="addMissingToShopping('${r.id}')" class="mt-3 px-4 bg-card border border-edge rounded-xl text-sm font-bold flex items-center gap-2"><i data-lucide="shopping-cart" class="w-4 h-4" aria-hidden="true"></i>Agregar lo que falta a la lista del súper</button>` : ''}
                <p id="recipe-shopping-status" class="text-sm text-ink-soft pt-2" role="status" aria-live="polite"></p>
            </div>

            <div class="space-y-2">
                <h5 class="font-bold text-ink">Pasos <span class="font-normal text-ink-faint">(${r.pasos.length})</span></h5>
                <ol class="list-decimal pl-5 space-y-2 text-ink-soft">${r.pasos.map((p) => `<li>${escapeHtml(p.texto)}</li>`).join('')}</ol>
                <button type="button" onclick="startCooking('${r.id}')" class="mt-2 px-5 bg-accent-fill text-white rounded-xl font-bold flex items-center gap-2"><i data-lucide="chef-hat" class="w-5 h-5" aria-hidden="true"></i>Cocinar paso a paso</button>
            </div>

            ${r.consejo ? `<p class="p-4 bg-surface-1 border border-line rounded-2xl text-ink-soft"><strong class="text-ink">Consejo:</strong> ${escapeHtml(r.consejo)}</p>` : ''}

            <div>
                <label for="recipe-note" class="block font-bold text-ink mb-1">Tus notas</label>
                <textarea id="recipe-note" onblur="saveRecipeNote('${r.id}', this.value)" class="w-full p-3 border rounded-xl min-h-[80px]" placeholder="Por ejemplo: menos sal, 2 minutos más">${escapeHtml(note)}</textarea>
            </div>

            ${r.revisada ? '' : '<p class="text-sm text-ink-faint">Borrador: esta receta todavía no se ha probado en cocina. Si algo no cuadra, anótalo arriba.</p>'}
        </div>
    `;
}

function renderCookMode(r) {
    const total = r.pasos.length;
    const step = r.pasos[recipeUI.step];
    const isLast = recipeUI.step === total - 1;
    const timerRunning = cookTimer.interval !== null;

    return `
        <div class="space-y-6">
            <div class="flex items-center justify-between gap-3">
                <button type="button" onclick="exitCooking()" class="flex items-center gap-2 px-4 bg-surface-2 rounded-xl text-sm font-bold text-ink-soft"><i data-lucide="x" class="w-4 h-4" aria-hidden="true"></i>Salir</button>
                <p class="text-sm font-bold text-ink-faint">Paso ${recipeUI.step + 1} de ${total} · Puedes pausar cuando quieras</p>
            </div>
            <h4 class="font-bold text-ink-soft">${escapeHtml(r.titulo)}</h4>
            <p class="text-xl leading-relaxed text-ink" aria-live="polite">${escapeHtml(step.texto)}</p>

            ${step.minutos ? `
                <div class="p-4 bg-surface-1 border border-line rounded-2xl flex flex-wrap items-center gap-3">
                    <i data-lucide="timer" class="w-5 h-5 text-accent" aria-hidden="true"></i>
                    ${timerRunning
                        ? `<span id="cook-timer-display" class="text-lg font-bold text-ink" role="timer">${formatTimer(cookTimer.endsAt - Date.now())}</span>
                           <button type="button" onclick="stopCookTimer()" class="px-4 bg-card border border-edge rounded-xl text-sm font-bold">Detener</button>`
                        : `<span class="text-ink-soft">Este paso toma ${step.minutos} min.</span>
                           <button type="button" onclick="startCookTimer(${step.minutos})" class="px-4 bg-card border border-edge rounded-xl text-sm font-bold">Iniciar temporizador</button>`}
                    <span id="cook-timer-status" class="w-full text-sm text-ink-soft" role="status" aria-live="polite"></span>
                </div>` : (timerRunning ? `<p class="text-ink-soft">Temporizador: <span id="cook-timer-display" class="font-bold text-ink" role="timer">${formatTimer(cookTimer.endsAt - Date.now())}</span></p>` : '')}

            <div class="flex gap-2">
                <button type="button" onclick="cookStep(-1)" ${recipeUI.step === 0 ? 'disabled' : ''} class="flex-1 bg-card border border-edge rounded-xl font-bold disabled:opacity-40">Anterior</button>
                ${isLast
                    ? `<button type="button" onclick="finishCooking('${r.id}')" class="flex-1 bg-accent-fill text-white rounded-xl font-bold">Terminé</button>`
                    : '<button type="button" onclick="cookStep(1)" class="flex-1 bg-accent-fill text-white rounded-xl font-bold">Siguiente</button>'}
            </div>
        </div>
    `;
}

function renderPantryEditor() {
    const pantry = recipeState().pantry;
    return `
        <div class="space-y-5">
            <button type="button" onclick="closePantryEditor()" class="flex items-center gap-2 px-4 bg-surface-2 rounded-xl text-sm font-bold text-ink-soft"><i data-lucide="arrow-left" class="w-4 h-4" aria-hidden="true"></i>Listo</button>
            <div>
                <h4 class="text-lg font-bold text-ink">Lo que tengo en casa</h4>
                <p class="text-ink-soft">Marca lo que hay. Sirve para sugerirte recetas que puedes hacer ya y para saber qué te falta.</p>
            </div>
            ${PANTRY_GROUPS.map(([group, items]) => `
                <fieldset class="space-y-2">
                    <legend class="text-sm font-bold text-ink-faint pb-1">${group}</legend>
                    <div class="flex flex-wrap gap-2">
                        ${Object.entries(items).map(([key, label]) => {
                            const has = pantry.includes(key);
                            return `<button type="button" onclick="togglePantryItem('${key}')" aria-pressed="${has}" class="px-4 rounded-full border text-sm font-semibold ${has ? 'bg-accent-fill text-white border-transparent' : 'bg-card text-ink-soft border-edge'}">${label}</button>`;
                        }).join('')}
                    </div>
                </fieldset>
            `).join('')}
            ${pantry.length > 0 ? '<button type="button" onclick="clearPantry()" class="px-4 text-sm font-bold text-accent underline">Desmarcar todo</button>' : ''}
        </div>
    `;
}

// --- Acciones ---

function searchRecipes(value) {
    recipeUI.query = value;
    // Solo se redibujan los resultados, para no perder el foco del buscador
    const results = document.getElementById('recipe-results');
    if (!results) return;
    const temp = document.createElement('div');
    temp.innerHTML = renderRecipeBrowse();
    results.innerHTML = temp.querySelector('#recipe-results').innerHTML;
    lucide.createIcons();
}

function toggleRecipeFilter(group, value) {
    if (String(recipeUI.filters[group]) === String(value)) delete recipeUI.filters[group];
    else recipeUI.filters[group] = value;
    recipeUI.suggestionId = null;
    rerenderRecipes();
}

function clearRecipeFilters() {
    recipeUI.filters = {};
    recipeUI.onlyPantry = false;
    recipeUI.suggestionId = null;
    rerenderRecipes();
}

function toggleOnlyPantry() {
    recipeUI.onlyPantry = !recipeUI.onlyPantry;
    recipeUI.suggestionId = null;
    rerenderRecipes();
}

function nextRecipeSuggestion() {
    const pick = pickSuggestion(matchingRecipes());
    recipeUI.suggestionId = pick ? pick.id : null;
    rerenderRecipes();
}

function openRecipe(id) {
    recipeUI.view = 'detail';
    recipeUI.recipeId = id;
    rerenderRecipes();
    document.getElementById('recipes-root')?.scrollIntoView({ block: 'start' });
}

function closeRecipe() {
    recipeUI.view = 'browse';
    rerenderRecipes();
}

function toggleRecipeFavorite(id) {
    const food = recipeState();
    food.recipeFavorites = food.recipeFavorites.includes(id)
        ? food.recipeFavorites.filter((f) => f !== id)
        : [id, ...food.recipeFavorites];
    saveState();
    rerenderRecipes();
}

function saveRecipeNote(id, value) {
    const food = recipeState();
    if (value.trim()) food.recipeNotes[id] = value.trim();
    else delete food.recipeNotes[id];
    saveState();
}

function addMissingToShopping(id) {
    const recipe = findRecipe(id);
    if (!recipe) return;
    const list = state.food.indispensables;
    const existing = list.map((item) => normalizeText(item.name));
    const added = [];
    missingIngredients(recipe).forEach((i, index) => {
        const name = PANTRY_LABELS[i.clave] || i.texto;
        if (existing.includes(normalizeText(name))) return;
        list.push({ id: Date.now() + index, name, checked: false });
        added.push(name);
    });
    saveState();
    const status = document.getElementById('recipe-shopping-status');
    if (status) status.textContent = added.length ? `Agregado a la lista del súper: ${added.join(', ')}.` : 'Ya estaba todo en tu lista del súper.';
    const shopping = document.getElementById('shopping-list-items');
    if (shopping) shopping.innerHTML = renderShoppingItems();
}

function startCooking(id) {
    recipeUI.view = 'cook';
    recipeUI.recipeId = id;
    recipeUI.step = 0;
    rerenderRecipes();
    document.getElementById('recipes-root')?.scrollIntoView({ block: 'start' });
}

function cookStep(delta) {
    const recipe = findRecipe(recipeUI.recipeId);
    if (!recipe) return;
    recipeUI.step = Math.max(0, Math.min(recipe.pasos.length - 1, recipeUI.step + delta));
    rerenderRecipes();
}

function exitCooking() {
    stopCookTimer();
    recipeUI.view = 'detail';
    rerenderRecipes();
}

function finishCooking(id) {
    stopCookTimer();
    const food = recipeState();
    food.recipeHistory = [{ id, date: new Date().toISOString().slice(0, 10) }, ...food.recipeHistory].slice(0, 50);
    saveState();
    recipeUI.view = 'detail';
    rerenderRecipes();
    document.getElementById('recipe-note')?.focus();
}

function formatTimer(ms) {
    const total = Math.max(0, Math.ceil(ms / 1000));
    return `${Math.floor(total / 60)}:${String(total % 60).padStart(2, '0')}`;
}

function startCookTimer(minutes) {
    stopCookTimer();
    cookTimer.endsAt = Date.now() + minutes * 60000;
    const recipe = findRecipe(recipeUI.recipeId);
    scheduleTimerNotice(cookTimer.endsAt, 'Terminó el tiempo', recipe ? `${recipe.titulo}: revisa cómo va.` : 'Revisa cómo va.');
    cookTimer.interval = setInterval(() => {
        const left = cookTimer.endsAt - Date.now();
        const display = document.getElementById('cook-timer-display');
        if (display) display.textContent = formatTimer(left);
        if (left <= 0) {
            stopCookTimer(false);
            const status = document.getElementById('cook-timer-status');
            if (status) status.textContent = 'Terminó el tiempo. Revisa cómo va y sigue cuando quieras.';
            if (navigator.vibrate) navigator.vibrate([200, 100, 200]);
        }
    }, 1000);
    rerenderRecipes();
}

// keepNotice: al terminar solo, la notificación ya salió y no se quita
function stopCookTimer(keepNotice) {
    if (cookTimer.interval && keepNotice !== false) cancelTimerNotice();
    if (cookTimer.interval) clearInterval(cookTimer.interval);
    cookTimer.interval = null;
    const display = document.getElementById('cook-timer-display');
    if (display && recipeUI.view === 'cook') rerenderRecipes();
}

function openPantryEditor() {
    recipeUI.view = 'pantry';
    rerenderRecipes();
}

function closePantryEditor() {
    recipeUI.view = 'browse';
    recipeUI.suggestionId = null;
    rerenderRecipes();
}

function togglePantryItem(key) {
    const food = recipeState();
    food.pantry = food.pantry.includes(key) ? food.pantry.filter((k) => k !== key) : [...food.pantry, key];
    saveState();
    rerenderRecipes();
}

function clearPantry() {
    recipeState().pantry = [];
    saveState();
    rerenderRecipes();
}
