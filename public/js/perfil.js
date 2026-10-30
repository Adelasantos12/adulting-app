// --- TU PERFIL ---
// Sin avatar con cara ni cuerpo: una figura abstracta que se genera de un número (semilla) y se puede cambiar.
// Las preguntas de inicio deciden qué módulos aparecen en el menú; lo demás sigue a mano en el buscador.

const FIGURE_PALETTES = [
    ['#4F7F4A', '#C9D8B6', '#F2B66D'],
    ['#2F5D8A', '#9CC3E6', '#F4D35E'],
    ['#A8324F', '#F2B5C4', '#5B8E7D'],
    ['#9A4A12', '#F0C49A', '#3E6A8A'],
    ['#5B3F8C', '#C8B6E8', '#F29E6B'],
    ['#1F6F6B', '#A6DCD2', '#E8607A'],
    ['#3D3D3D', '#D9D4C7', '#E0A33A'],
    ['#7A5C2E', '#E8D3A8', '#6E8FC7']
];

const FORMS_OF_ADDRESS = {
    nombre: 'Solo por mi nombre',
    ella: 'Ella',
    el: 'Él',
    elle: 'Elle'
};

// Lo que la persona responde al inicio y qué módulos enciende cada respuesta
const LIFE_AREAS = [
    { key: 'todos', label: 'Tareas y pendientes de la casa', modules: ['todos', 'house'] },
    { key: 'money', label: 'Ordenar mi dinero y mis compras', modules: ['money', 'shopping'] },
    { key: 'payments', label: 'Que me avisen de mis pagos fijos y suscripciones', modules: ['payments'] },
    { key: 'food', label: 'Cocinar o aprender a hacerlo', modules: ['food'] },
    { key: 'outfit', label: 'Qué ponerme según el clima', modules: ['outfit'] },
    { key: 'auto', label: 'Tengo auto o moto', modules: ['auto'] },
    { key: 'emergency', label: 'Plan para sismos y emergencias', modules: ['emergency'] },
    { key: 'documents', label: 'Que me avisen antes de que venzan mis documentos', modules: ['documents'] },
    { key: 'pets', label: 'Tengo mascotas', modules: ['pets'] },
    { key: 'health', label: 'Medicinas, citas y salud', modules: ['health'] },
    { key: 'guides', label: 'Dudas de adulto y conversaciones difíciles', modules: ['guides'] },
    { key: 'paz', label: 'Desconectarme de las redes', modules: ['paz'] }
];

function profileState() {
    state.profile = state.profile || {};
    const p = state.profile;
    p.name = p.name || '';
    p.address = p.address || 'nombre';
    if (typeof p.figureSeed !== 'number') p.figureSeed = Math.floor(Math.random() * 1e9);
    p.onboarded = !!p.onboarded;
    return p;
}

// Generador de números repetible: la misma semilla siempre da la misma figura
function seededRandom(seed) {
    let a = seed >>> 0;
    return () => {
        a = (a + 0x6D2B79F5) >>> 0;
        let t = a;
        t = Math.imul(t ^ (t >>> 15), t | 1);
        t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
        return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
}

let figureCount = 0;
function profileFigureSvg(seed, size, label) {
    const rand = seededRandom(seed);
    const [c1, c2, c3] = FIGURE_PALETTES[Math.floor(rand() * FIGURE_PALETTES.length)];
    const id = `fig${++figureCount}`;
    const angle = Math.floor(rand() * 360);
    const orb = { x: 14 + rand() * 36, y: 14 + rand() * 36, r: 16 + rand() * 12 };
    const glow = { x: 64 - orb.x, y: 64 - orb.y, r: 10 + rand() * 10 };
    // Una forma nítida encima de los degradados: aro, media luna o píldora
    const shapeKind = Math.floor(rand() * 3);
    const sx = 20 + rand() * 24;
    const sy = 20 + rand() * 24;
    const shape = [
        `<circle cx="${sx}" cy="${sy}" r="${7 + rand() * 6}" fill="none" stroke="white" stroke-opacity="0.75" stroke-width="3"/>`,
        `<path d="M${sx - 10} ${sy} a10 10 0 0 0 20 0z" fill="white" fill-opacity="0.7" transform="rotate(${angle} ${sx} ${sy})"/>`,
        `<rect x="${sx - 12}" y="${sy - 4}" width="24" height="8" rx="4" fill="white" fill-opacity="0.7" transform="rotate(${angle} ${sx} ${sy})"/>`
    ][shapeKind];
    return `
        <svg width="${size}" height="${size}" viewBox="0 0 64 64" role="img" aria-label="${escapeHtml(label || 'Tu figura')}" class="flex-shrink-0 rounded-full">
            <defs>
                <linearGradient id="${id}g" gradientTransform="rotate(${angle} .5 .5)"><stop offset="0" stop-color="${c1}"/><stop offset="1" stop-color="${c2}"/></linearGradient>
                <filter id="${id}b" x="-50%" y="-50%" width="200%" height="200%"><feGaussianBlur stdDeviation="6"/></filter>
                <clipPath id="${id}c"><circle cx="32" cy="32" r="32"/></clipPath>
            </defs>
            <g clip-path="url(#${id}c)">
                <rect width="64" height="64" fill="url(#${id}g)"/>
                <circle cx="${orb.x}" cy="${orb.y}" r="${orb.r}" fill="${c3}" filter="url(#${id}b)" opacity="0.9"/>
                <circle cx="${glow.x}" cy="${glow.y}" r="${glow.r}" fill="white" filter="url(#${id}b)" opacity="0.45"/>
                ${shape}
            </g>
        </svg>`;
}

// Pie del menú lateral: figura y nombre, lleva al perfil
function renderProfileBadge() {
    const p = profileState();
    const mobile = document.getElementById('profile-badge-mobile');
    if (mobile) mobile.innerHTML = profileFigureSvg(p.figureSeed, 32);
    const el = document.getElementById('profile-badge');
    if (!el) return;
    el.innerHTML = `
        ${profileFigureSvg(p.figureSeed, 32)}
        <div class="flex-1 min-w-0 text-left">
            <p class="text-sm font-semibold text-ink-soft truncate">${escapeHtml(p.name || 'Tu perfil')}</p>
            <p class="text-xs text-ink-faint truncate">${p.onboarded ? 'Editar perfil' : 'Hazla tuya en un minuto'}</p>
        </div>`;
}

// Tarjeta en Hoy mientras la persona no ha hecho las preguntas de inicio
function renderProfilePrompt() {
    const p = profileState();
    if (p.onboarded) return '';
    return `
        <div class="bg-card p-6 rounded-3xl border border-line shadow-sm flex flex-col sm:flex-row sm:items-center gap-4">
            ${profileFigureSvg(p.figureSeed, 56)}
            <div class="flex-1">
                <h3 class="font-bold text-base text-ink">Haz la app tuya en un minuto</h3>
                <p class="text-ink-soft">Tu nombre, cómo te hablamos y qué quieres tener a la mano. Lo demás queda en el buscador.</p>
            </div>
            <div class="flex gap-2">
                <button type="button" onclick="navigate('profile')" class="px-5 bg-accent-fill text-white rounded-xl font-bold">Empezar</button>
                <button type="button" onclick="dismissProfilePrompt()" class="px-4 bg-surface-2 rounded-xl font-bold text-ink-soft">Ahora no</button>
            </div>
        </div>`;
}

function dismissProfilePrompt() {
    profileState().onboarded = true;
    saveState();
    renderProfileBadge();
    navigate('dashboard');
}

let figureChoices = [];

function renderModuloProfile() {
    const p = profileState();
    if (!figureChoices.length) newFigureChoices();
    const vis = state.accessibility.visibleModules;
    const areaOn = (area) => area.modules.some((m) => vis[m] !== false);
    const garments = outfitState().garments;
    const option = (onclick, active, label) => `<button type="button" onclick="${onclick}" aria-pressed="${active}" class="px-4 rounded-full border text-sm font-semibold ${active ? 'bg-accent-fill text-white border-transparent' : 'bg-card text-ink-soft border-edge'}">${label}</button>`;

    return `
        <div class="bg-card p-6 rounded-3xl border border-line shadow-sm space-y-8 max-w-2xl mx-auto">
            <section class="space-y-3">
                <h3 class="font-bold text-base text-ink">Tu figura</h3>
                <p class="text-ink-soft">Formas y colores que te representan, sin cara ni cuerpo. Elige una o genera otras.</p>
                <div class="flex flex-wrap items-center gap-3">
                    ${[p.figureSeed, ...figureChoices.filter((s) => s !== p.figureSeed)].slice(0, 6).map((seed) => `
                        <button type="button" onclick="chooseFigure(${seed})" aria-pressed="${seed === p.figureSeed}" aria-label="Elegir esta figura" class="p-1 rounded-full ${seed === p.figureSeed ? 'ring-4 ring-accent' : 'ring-1 ring-line'}">
                            ${profileFigureSvg(seed, 56, seed === p.figureSeed ? 'Tu figura actual' : 'Figura para elegir')}
                        </button>`).join('')}
                    <button type="button" onclick="newFigureChoices(true)" class="px-4 bg-surface-2 rounded-xl text-sm font-bold text-ink-soft flex items-center gap-2"><i data-lucide="shuffle" class="w-4 h-4" aria-hidden="true"></i>Otras</button>
                </div>
            </section>

            <section class="space-y-3">
                <label for="profile-name" class="block font-bold text-base text-ink">¿Cómo te llamas?</label>
                <input id="profile-name" type="text" value="${escapeHtml(p.name)}" oninput="setProfileName(this.value)" maxlength="40" placeholder="Tu nombre o apodo (opcional)" class="w-full px-3 py-2 border rounded-xl">
            </section>

            <section class="space-y-3">
                <h3 class="font-bold text-base text-ink">¿Cómo te hablamos?</h3>
                <p class="text-ink-soft">Los textos de la app son neutros; esto nos ayuda cuando haga falta referirnos a ti.</p>
                <div class="flex flex-wrap gap-2">
                    ${Object.entries(FORMS_OF_ADDRESS).map(([k, label]) => option(`setProfileAddress('${k}')`, p.address === k, label)).join('')}
                </div>
            </section>

            <section class="space-y-3">
                <h3 class="font-bold text-base text-ink">¿Qué ropa quieres que te sugiramos?</h3>
                <div class="flex flex-wrap gap-2">
                    ${Object.entries(GARMENT_PREFS).map(([k, label]) => option(`setProfileGarments('${k}')`, garments === k, label)).join('')}
                </div>
            </section>

            <section class="space-y-3">
                <h3 class="font-bold text-base text-ink">¿Qué quieres tener a la mano?</h3>
                <p class="text-ink-soft">Solo esto aparece en tu menú. Lo que no marques sigue disponible en el buscador.</p>
                <div class="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    ${LIFE_AREAS.map((area) => `
                        <label class="flex items-center gap-3 p-3 bg-surface-1 border border-line rounded-xl font-semibold text-ink-soft">
                            <input type="checkbox" ${areaOn(area) ? 'checked' : ''} onchange="toggleLifeArea('${area.key}', this.checked)" class="w-6 h-6 text-accent rounded">
                            ${area.label}
                        </label>`).join('')}
                </div>
            </section>

            <button type="button" onclick="finishProfile()" class="w-full px-5 bg-accent-fill text-white rounded-xl font-bold">Listo</button>
        </div>`;
}

function newFigureChoices(rerender) {
    figureChoices = Array.from({ length: 5 }, () => Math.floor(Math.random() * 1e9));
    if (rerender) navigate('profile');
}

function chooseFigure(seed) {
    profileState().figureSeed = seed;
    saveState();
    renderProfileBadge();
    navigate('profile');
}

function setProfileName(value) {
    profileState().name = value.trim();
    saveState();
    renderProfileBadge();
}

function setProfileAddress(key) {
    profileState().address = key;
    saveState();
    navigate('profile');
}

function setProfileGarments(key) {
    outfitState().garments = key;
    saveState();
    navigate('profile');
}

function toggleLifeArea(key, on) {
    const area = LIFE_AREAS.find((a) => a.key === key);
    if (!area) return;
    area.modules.forEach((m) => { state.accessibility.visibleModules[m] = on; });
    saveState();
    renderMenus();
}

function finishProfile() {
    profileState().onboarded = true;
    saveState();
    renderProfileBadge();
    navigate('dashboard');
}
