// --- GUÍAS Y GUIONES: "¿QUÉ NECESITAS?" ---
// Dudas de la vida adulta (data/guias.json) y conversaciones difíciles (data/guiones.json).
// Formato en docs/biblioteca-formato.md. Se entra por necesidad o buscando; se ven pocas cosas a la vez.

const GUIDE_NEEDS = {
    impuestos: { label: 'SAT e impuestos', icon: 'landmark' },
    dinero: { label: 'Dinero y tarjetas', icon: 'wallet' },
    tramites: { label: 'Trámites', icon: 'file-text' },
    trabajo: { label: 'Trabajo', icon: 'briefcase' },
    vivienda: { label: 'Vivienda', icon: 'home' },
    salud: { label: 'Salud', icon: 'heart-pulse' },
    casa: { label: 'Algo falla en casa', icon: 'wrench' },
    emergencias: { label: 'Emergencias', icon: 'siren' }
};
const SCRIPT_NEEDS = {
    llamar: { label: 'Hacer una llamada', icon: 'phone' },
    reclamar: { label: 'Reclamar algo', icon: 'receipt' },
    pedir: { label: 'Pedir algo', icon: 'hand' },
    limites: { label: 'Decir que no', icon: 'circle-slash' },
    trabajo: { label: 'En el trabajo', icon: 'briefcase' },
    amistades: { label: 'Amistades', icon: 'users' },
    'familia-pareja': { label: 'Familia y pareja', icon: 'heart' },
    salud: { label: 'Con el médico', icon: 'stethoscope' },
    vivienda: { label: 'Casero y vecinos', icon: 'building' }
};
const PAGE_SIZE = 6;

// Palabras distintas para lo mismo: buscar una encuentra la otra
const SYNONYM_GROUPS = [
    ['cobro', 'cargo', 'cobraron'], ['depa', 'departamento', 'renta', 'rentar', 'arrendamiento', 'casero'],
    ['luz', 'cfe', 'electricidad'], ['impuestos', 'sat', 'hacienda'], ['factura', 'cfdi', 'facturar'],
    ['jefe', 'jefa', 'trabajo'], ['doctor', 'doctora', 'medico', 'cita'], ['celular', 'telefono', 'cel'],
    ['sueldo', 'salario', 'nomina'], ['retiro', 'afore', 'pension'], ['credito', 'buro', 'tarjeta'],
    ['ine', 'credencial'], ['amigo', 'amiga', 'amistad', 'amistades'],
    ['plan', 'fiesta', 'reunion', 'invitaron', 'salir', 'boda', 'cumpleanos'], ['ansiedad', 'nervios', 'miedo', 'pena']
];
function wordVariants(word) {
    const group = SYNONYM_GROUPS.find((g) => g.includes(word));
    return group ? group : [word];
}

let GUIAS = null;
let GUIONES = null;
const libraryUI = { view: 'home', kind: null, need: null, query: '', shown: PAGE_SIZE, itemId: null, line: 0, fields: {} };

function libraryState() {
    state.library = state.library || {};
    const lib = state.library;
    lib.saved = lib.saved || [];
    lib.notes = lib.notes || {};
    lib.fields = lib.fields || {};
    return lib;
}

function libraryItems(kind) {
    return (kind === 'guion' ? GUIONES : GUIAS) || [];
}

function findLibraryItem(id) {
    return (GUIAS || []).find((g) => g.id === id) || (GUIONES || []).find((g) => g.id === id);
}

function itemKind(item) {
    return item.guion ? 'guion' : 'guia';
}

function itemTitle(item) {
    return item.pregunta || item.titulo;
}

// Palabras de relleno que no ayudan a encontrar nada
const STOPWORDS = new Set(['a', 'al', 'como', 'con', 'de', 'del', 'el', 'en', 'es', 'la', 'las', 'lo', 'los', 'me', 'mi', 'mis', 'no', 'o', 'para', 'por', 'que', 'quiero', 'se', 'su', 'tengo', 'un', 'una', 'y', 'yo', 'ir', 'hacer', 'puedo', 'debo']);

function searchLibrary(query) {
    const allWords = normalizeText(query.trim()).split(/[^a-z0-9]+/).filter(Boolean);
    const words = allWords.filter((w) => !STOPWORDS.has(w));
    if (!words.length) return [];
    const haystack = (item) => normalizeText([
        itemTitle(item), item.resumen, item.situacion, ...(item.etiquetas || []),
        ...(item.pasos || []).map((p) => p.texto), ...(item.guion || []).map((l) => l.texto)
    ].filter(Boolean).join(' '));
    const items = [...(GUIAS || []), ...(GUIONES || [])].map((item) => ({
        item,
        // Se compara el inicio de cada palabra: "factur" encuentra "facturas", pero "cargo" no encuentra "descargo"
        tokens: haystack(item).split(/[^a-z0-9]+/),
        titleTokens: normalizeText(itemTitle(item)).split(/[^a-z0-9]+/)
    }));
    const has = (list, w) => wordVariants(w).some((v) => list.some((t) => t.startsWith(v)));
    // Primero los que tienen todas las palabras; si no hay, los que tienen más
    let matches = items.filter((x) => words.every((w) => has(x.tokens, w)));
    if (!matches.length) matches = items.filter((x) => words.some((w) => has(x.tokens, w)));
    const scored = matches
        .map((x) => ({ item: x.item, score: words.filter((w) => has(x.titleTokens, w)).length * 2 + words.filter((w) => has(x.tokens, w)).length }))
        .sort((a, b) => b.score - a.score);
    return scored.map((s) => s.item);
}

// --- Vistas ---

function renderLibrarySection() {
    if (!GUIAS || !GUIONES) {
        Promise.all([loadData('guias'), loadData('guiones')]).then(([g, s]) => {
            GUIAS = g || [];
            GUIONES = s || [];
            renderLibraryRoot();
        });
        return '<div id="library-root"><p class="text-ink-faint">Cargando…</p></div>';
    }
    return `<div id="library-root">${renderLibraryView()}</div>`;
}

function renderLibraryRoot() {
    const root = document.getElementById('library-root');
    if (!root) return;
    root.innerHTML = renderLibraryView();
    lucide.createIcons();
}

function renderLibraryView() {
    if (!GUIAS.length && !GUIONES.length) return '<p class="text-ink-soft">No se pudieron cargar las guías. Revisa tu conexión e inténtalo otra vez.</p>';
    const item = findLibraryItem(libraryUI.itemId);
    if (libraryUI.view === 'item' && item) return itemKind(item) === 'guion' ? renderScript(item) : renderGuide(item);
    if (libraryUI.view === 'rehearse' && item) return renderRehearsal(item);
    if (libraryUI.view === 'need') return renderNeedList();
    return renderLibraryHome();
}

function backButton(onclick, label) {
    return `<button type="button" onclick="${onclick}" class="flex items-center gap-2 px-4 bg-surface-2 rounded-xl text-sm font-bold text-ink-soft"><i data-lucide="arrow-left" class="w-4 h-4" aria-hidden="true"></i>${label}</button>`;
}

function itemButton(item) {
    const kind = itemKind(item);
    return `
        <button type="button" onclick="openLibraryItem('${item.id}')" class="w-full text-left p-4 bg-surface-1 border border-line rounded-2xl flex items-start gap-3">
            <i data-lucide="${kind === 'guion' ? 'message-circle' : 'book-open'}" class="w-5 h-5 text-ink-faint mt-0.5 flex-shrink-0" aria-hidden="true"></i>
            <span>
                <span class="block font-bold text-ink">${escapeHtml(itemTitle(item))}</span>
                <span class="block text-sm text-ink-faint">${escapeHtml(kind === 'guion' ? item.situacion : item.resumen)}</span>
            </span>
        </button>`;
}

function needTiles(kind, needs) {
    const items = libraryItems(kind);
    return Object.entries(needs)
        .filter(([key]) => items.some((i) => i.necesidad === key))
        .map(([key, { label, icon }]) => `
            <button type="button" onclick="openNeed('${kind}', '${key}')" class="p-4 bg-surface-1 border border-line rounded-2xl flex items-center gap-3 text-left font-bold text-ink">
                <i data-lucide="${icon}" class="w-5 h-5 text-accent flex-shrink-0" aria-hidden="true"></i>${label}
            </button>`).join('');
}

function renderLibraryHome() {
    const lib = libraryState();
    const query = libraryUI.query;
    const results = query.trim() ? searchLibrary(query) : [];
    const saved = lib.saved.map(findLibraryItem).filter(Boolean);

    const resultsHtml = query.trim()
        ? (results.length
            ? `<div class="space-y-2">${results.slice(0, PAGE_SIZE).map(itemButton).join('')}</div>
               ${results.length > PAGE_SIZE ? `<p class="text-sm text-ink-faint">Hay ${results.length - PAGE_SIZE} más. Agrega otra palabra para acotar.</p>` : ''}`
            : '<p class="text-ink-soft">No encontramos nada con eso. Prueba con otra palabra o entra por un tema.</p>')
        : '';

    return `
        <div class="space-y-6">
            <div>
                <label for="library-search" class="sr-only">Buscar una duda o una conversación</label>
                <div class="relative">
                    <i data-lucide="search" class="w-5 h-5 text-ink-faint absolute left-3 top-1/2 -translate-y-1/2" aria-hidden="true"></i>
                    <input id="library-search" type="search" value="${escapeHtml(query)}" oninput="searchLibraryInput(this.value)" placeholder="Por ejemplo: RFC, aguinaldo, reclamar un cobro" class="w-full pl-11 pr-3 border rounded-xl">
                </div>
            </div>
            <div id="library-results" class="space-y-3">${resultsHtml}</div>

            <div id="library-doors" class="space-y-6 ${query.trim() ? 'hidden' : ''}">
                <section class="space-y-3" aria-labelledby="doubts-title">
                    <h4 id="doubts-title" class="font-bold text-ink">Tengo una duda</h4>
                    <div class="grid grid-cols-1 sm:grid-cols-2 gap-2">${needTiles('guia', GUIDE_NEEDS)}</div>
                </section>
                <section class="space-y-3" aria-labelledby="talk-title">
                    <div>
                        <h4 id="talk-title" class="font-bold text-ink">Tengo que hablar con alguien</h4>
                        <p class="text-sm text-ink-faint">Qué decir, qué contestar si te dicen otra cosa, y un mensaje listo para enviar.</p>
                    </div>
                    <div class="grid grid-cols-1 sm:grid-cols-2 gap-2">${needTiles('guion', SCRIPT_NEEDS)}</div>
                </section>
                ${saved.length ? `
                    <section class="space-y-2" aria-labelledby="saved-title">
                        <h4 id="saved-title" class="font-bold text-ink">Guardadas</h4>
                        <div class="space-y-2">${saved.slice(0, PAGE_SIZE).map(itemButton).join('')}</div>
                    </section>` : ''}
            </div>
        </div>`;
}

function renderNeedList() {
    const kind = libraryUI.kind;
    const needs = kind === 'guion' ? SCRIPT_NEEDS : GUIDE_NEEDS;
    const items = libraryItems(kind).filter((i) => i.necesidad === libraryUI.need);
    const shown = items.slice(0, libraryUI.shown);
    return `
        <div class="space-y-4">
            ${backButton('closeNeed()', 'Temas')}
            <h4 class="text-lg font-bold text-ink">${needs[libraryUI.need]?.label || ''}</h4>
            <div class="space-y-2">${shown.map(itemButton).join('')}</div>
            ${items.length > shown.length ? `<button type="button" onclick="showMoreLibrary()" class="px-4 bg-card border border-edge rounded-xl text-sm font-bold">Ver ${Math.min(PAGE_SIZE, items.length - shown.length)} más</button>` : ''}
        </div>`;
}

function savedButton(item) {
    const saved = libraryState().saved.includes(item.id);
    return `<button type="button" onclick="toggleLibrarySaved('${item.id}')" aria-pressed="${saved}" aria-label="${saved ? 'Quitar de guardadas' : 'Guardar'}" class="rounded-xl border border-edge ${saved ? 'bg-accent-soft text-accent' : 'bg-card text-ink-soft'} flex items-center justify-center flex-shrink-0"><i data-lucide="bookmark" class="w-5 h-5" aria-hidden="true"></i></button>`;
}

function notesBlock(item) {
    const note = libraryState().notes[item.id] || '';
    return `
        <div>
            <label for="library-note" class="block font-bold text-ink mb-1">Tus notas</label>
            <textarea id="library-note" onblur="saveLibraryNote('${item.id}', this.value)" class="w-full p-3 border rounded-xl min-h-[80px]" placeholder="Lo que te dijeron, números de folio, fechas">${escapeHtml(note)}</textarea>
        </div>`;
}

function draftNote(item) {
    return item.revisada ? '' : '<p class="text-sm text-ink-faint">Borrador: este contenido todavía no lo revisa una persona. Si algo no cuadra, confírmalo en la fuente oficial.</p>';
}

function renderGuide(g) {
    const backTarget = libraryUI.need ? 'backToNeed()' : 'closeLibraryItem()';
    return `
        <div class="space-y-5">
            ${backButton(backTarget, 'Volver')}
            <div class="flex items-start justify-between gap-3">
                <h4 class="text-xl font-bold text-ink">${escapeHtml(g.pregunta)}</h4>
                ${savedButton(g)}
            </div>
            <p class="p-4 bg-accent-soft rounded-2xl text-ink">${escapeHtml(g.resumen)}</p>

            ${g.lo_que_necesitas && g.lo_que_necesitas.length ? `
                <div>
                    <h5 class="font-bold text-ink mb-1">Lo que necesitas</h5>
                    <ul class="list-disc pl-5 text-ink-soft space-y-1">${g.lo_que_necesitas.map((x) => `<li>${escapeHtml(x)}</li>`).join('')}</ul>
                </div>` : ''}

            ${g.pasos && g.pasos.length ? `
                <div>
                    <h5 class="font-bold text-ink mb-1">Pasos <span class="font-normal text-ink-faint">(${g.pasos.length})</span></h5>
                    <ol class="space-y-2">
                        ${g.pasos.map((p, i) => `
                            <li class="flex gap-3">
                                <span class="w-7 h-7 rounded-full bg-surface-2 text-ink-soft text-sm font-bold flex items-center justify-center flex-shrink-0">${i + 1}</span>
                                <span class="text-ink-soft">${escapeHtml(p.texto)}${p.detalle ? `<span class="block text-sm text-ink-faint">${escapeHtml(p.detalle)}</span>` : ''}</span>
                            </li>`).join('')}
                    </ol>
                </div>` : ''}

            ${g.ojo && g.ojo.length ? `
                <div class="flex gap-3 p-4 bg-attention-soft text-attention rounded-2xl">
                    <i data-lucide="info" class="w-5 h-5 flex-shrink-0" aria-hidden="true"></i>
                    <div class="space-y-1">${g.ojo.map((x) => `<p>${escapeHtml(x)}</p>`).join('')}</div>
                </div>` : ''}

            ${g.si_no_puedes ? `<p class="p-4 bg-surface-1 border border-line rounded-2xl text-ink-soft"><strong class="text-ink">Si te atoras:</strong> ${escapeHtml(g.si_no_puedes)}</p>` : ''}

            ${notesBlock(g)}
            <p class="text-sm text-ink-faint">${g.fuentes && g.fuentes.length ? `Para confirmar: ${g.fuentes.map(escapeHtml).join(', ')}.` : ''} ${g.vigente_a ? `Información a ${escapeHtml(g.vigente_a)}; las reglas cambian.` : ''}</p>
            ${draftNote(g)}
        </div>`;
}

function fillTemplate(text, fields) {
    return escapeHtml(text).replace(/\{(\w[\w-]*)\}/g, (_, key) => {
        const value = fields[key];
        return value ? `<strong class="text-ink">${escapeHtml(value)}</strong>` : `<span class="px-1 rounded bg-surface-2 text-ink-faint">${key.replace(/[-_]/g, ' ')}</span>`;
    });
}

function plainTemplate(text, fields) {
    return text.replace(/\{(\w[\w-]*)\}/g, (_, key) => fields[key] || `[${key.replace(/[-_]/g, ' ')}]`);
}

function scriptFields(s) {
    return libraryState().fields[s.id] || {};
}

function renderScript(s) {
    const fields = scriptFields(s);
    const backTarget = libraryUI.need ? 'backToNeed()' : 'closeLibraryItem()';
    return `
        <div class="space-y-5">
            ${backButton(backTarget, 'Volver')}
            <div class="flex items-start justify-between gap-3">
                <div class="space-y-1">
                    <h4 class="text-xl font-bold text-ink">${escapeHtml(s.titulo)}</h4>
                    <p class="text-ink-soft">${escapeHtml(s.situacion)}</p>
                    ${s.objetivo ? `<p class="text-sm text-ink-faint">Objetivo: ${escapeHtml(s.objetivo)}</p>` : ''}
                </div>
                ${savedButton(s)}
            </div>

            ${s.antes && s.antes.length ? `
                <div>
                    <h5 class="font-bold text-ink mb-1">Antes</h5>
                    <ul class="list-disc pl-5 text-ink-soft space-y-1">${s.antes.map((x) => `<li>${escapeHtml(x)}</li>`).join('')}</ul>
                </div>` : ''}

            ${s.campos && s.campos.length ? `
                <fieldset class="space-y-3 p-4 bg-surface-1 border border-line rounded-2xl">
                    <legend class="font-bold text-ink px-1">Tus datos (opcional)</legend>
                    ${s.campos.map((c) => `
                        <div>
                            <label for="field-${c.clave}" class="block text-sm font-bold text-ink-faint mb-1">${escapeHtml(c.etiqueta)}</label>
                            <input id="field-${c.clave}" type="text" value="${escapeHtml(fields[c.clave] || '')}" placeholder="${escapeHtml(c.ejemplo || '')}" oninput="setScriptField('${s.id}', '${c.clave}', this.value)" class="w-full px-3 border rounded-xl">
                        </div>`).join('')}
                </fieldset>` : ''}

            <div id="script-body" class="space-y-5">${renderScriptBody(s, fields)}</div>

            <div class="flex flex-wrap gap-2">
                <button type="button" onclick="startRehearsal('${s.id}')" class="px-5 bg-accent-fill text-white rounded-xl font-bold flex items-center gap-2"><i data-lucide="play" class="w-4 h-4" aria-hidden="true"></i>Ensayar línea por línea</button>
                ${s.mensaje ? `<button type="button" onclick="shareScriptMessage('${s.id}')" class="px-5 bg-card border border-edge rounded-xl font-bold flex items-center gap-2"><i data-lucide="send" class="w-4 h-4" aria-hidden="true"></i>Enviar como mensaje</button>` : ''}
            </div>
            <p id="script-share-status" class="text-sm text-ink-soft" role="status" aria-live="polite"></p>

            ${notesBlock(s)}
            ${draftNote(s)}
        </div>`;
}

function renderScriptBody(s, fields) {
    return `
        <div>
            <h5 class="font-bold text-ink mb-2">Qué decir</h5>
            <div class="space-y-2">${s.guion.map((l) => `<p class="p-4 bg-card border border-line rounded-2xl text-ink">${fillTemplate(l.texto, fields)}</p>`).join('')}</div>
        </div>
        ${s.si_dicen && s.si_dicen.length ? `
            <div>
                <h5 class="font-bold text-ink mb-2">Si te dicen…</h5>
                <div class="space-y-2">
                    ${s.si_dicen.map((b) => `
                        <details class="p-4 bg-surface-1 border border-line rounded-2xl">
                            <summary class="cursor-pointer font-semibold text-ink-soft [&::-webkit-details-marker]:hidden">"${escapeHtml(b.si)}"</summary>
                            <p class="pt-2 text-ink">${fillTemplate(b.respondes, fields)}</p>
                        </details>`).join('')}
                </div>
            </div>` : ''}
        ${s.para_cerrar ? `<div><h5 class="font-bold text-ink mb-2">Para cerrar</h5><p class="p-4 bg-card border border-line rounded-2xl text-ink">${fillTemplate(s.para_cerrar, fields)}</p></div>` : ''}
        ${s.mensaje ? `<div><h5 class="font-bold text-ink mb-2">Como mensaje</h5><p class="p-4 bg-surface-1 border border-line rounded-2xl text-ink-soft whitespace-pre-line">${fillTemplate(s.mensaje, fields)}</p></div>` : ''}`;
}

function renderRehearsal(s) {
    const fields = scriptFields(s);
    const lines = [...s.guion.map((l) => l.texto), ...(s.para_cerrar ? [s.para_cerrar] : [])];
    const i = Math.min(libraryUI.line, lines.length - 1);
    const isLast = i === lines.length - 1;
    return `
        <div class="space-y-6">
            <div class="flex items-center justify-between gap-3">
                ${backButton('stopRehearsal()', 'Salir')}
                <p class="text-sm font-bold text-ink-faint">Línea ${i + 1} de ${lines.length}</p>
            </div>
            <p class="text-sm text-ink-faint">Léela en voz alta. Repite las veces que quieras.</p>
            <p class="text-xl leading-relaxed text-ink" aria-live="polite">${fillTemplate(lines[i], fields)}</p>
            <div class="flex gap-2">
                <button type="button" onclick="rehearseLine(-1)" ${i === 0 ? 'disabled' : ''} class="flex-1 bg-card border border-edge rounded-xl font-bold disabled:opacity-40">Anterior</button>
                ${isLast
                    ? `<button type="button" onclick="finishRehearsal()" class="flex-1 bg-accent-fill text-white rounded-xl font-bold">Listo</button>`
                    : '<button type="button" onclick="rehearseLine(1)" class="flex-1 bg-accent-fill text-white rounded-xl font-bold">Siguiente</button>'}
            </div>
            ${isLast && s.despues ? `<p class="text-ink-soft">${escapeHtml(s.despues)}</p>` : ''}
        </div>`;
}

// --- Acciones ---

function searchLibraryInput(value) {
    libraryUI.query = value;
    // Solo se redibujan los resultados para no perder el foco del buscador
    const temp = document.createElement('div');
    temp.innerHTML = renderLibraryHome();
    document.getElementById('library-results').innerHTML = temp.querySelector('#library-results').innerHTML;
    document.getElementById('library-doors').classList.toggle('hidden', value.trim() !== '');
    lucide.createIcons();
}

function openNeed(kind, need) {
    Object.assign(libraryUI, { view: 'need', kind, need, shown: PAGE_SIZE });
    renderLibraryRoot();
}

function closeNeed() {
    Object.assign(libraryUI, { view: 'home', kind: null, need: null });
    renderLibraryRoot();
}

function backToNeed() {
    libraryUI.view = 'need';
    renderLibraryRoot();
}

function showMoreLibrary() {
    libraryUI.shown += PAGE_SIZE;
    renderLibraryRoot();
}

function openLibraryItem(id) {
    const item = findLibraryItem(id);
    if (!item) return;
    // Desde la búsqueda o guardadas no hay tema abierto: "Volver" regresa al inicio
    if (libraryUI.view !== 'need') libraryUI.need = null;
    Object.assign(libraryUI, { view: 'item', itemId: id, line: 0 });
    renderLibraryRoot();
    document.getElementById('library-root')?.scrollIntoView({ block: 'start' });
}

function closeLibraryItem() {
    libraryUI.view = 'home';
    renderLibraryRoot();
}

function toggleLibrarySaved(id) {
    const lib = libraryState();
    lib.saved = lib.saved.includes(id) ? lib.saved.filter((x) => x !== id) : [id, ...lib.saved];
    saveState();
    renderLibraryRoot();
}

function saveLibraryNote(id, value) {
    const lib = libraryState();
    if (value.trim()) lib.notes[id] = value.trim();
    else delete lib.notes[id];
    saveState();
}

function setScriptField(id, key, value) {
    const lib = libraryState();
    lib.fields[id] = { ...(lib.fields[id] || {}), [key]: value };
    saveState();
    const s = findLibraryItem(id);
    const body = document.getElementById('script-body');
    if (s && body) body.innerHTML = renderScriptBody(s, lib.fields[id]);
}

async function shareScriptMessage(id) {
    const s = findLibraryItem(id);
    if (!s || !s.mensaje) return;
    const text = plainTemplate(s.mensaje, scriptFields(s));
    const status = document.getElementById('script-share-status');
    try {
        const result = await shareText(text);
        if (result === 'copied' && status) status.textContent = 'Mensaje copiado. Pégalo en WhatsApp o en tu correo.';
    } catch (e) {
        if (status) status.textContent = 'No se pudo copiar. Puedes seleccionar el texto de arriba y copiarlo.';
    }
}

function startRehearsal(id) {
    Object.assign(libraryUI, { view: 'rehearse', itemId: id, line: 0 });
    renderLibraryRoot();
}

function rehearseLine(delta) {
    libraryUI.line = Math.max(0, libraryUI.line + delta);
    renderLibraryRoot();
}

function stopRehearsal() {
    libraryUI.view = 'item';
    renderLibraryRoot();
}

function finishRehearsal() {
    libraryUI.view = 'item';
    renderLibraryRoot();
}

// --- Guías de temporada para Hoy: solo aparecen cuando tocan ---
const SEASONAL_GUIDES = [
    { months: [1], id: 'din-presupuesto-simple', label: 'Inicio de año' },
    { months: [3, 4], id: 'sat-declaracion-anual-personas-fisicas', label: 'Declaración anual: hasta el 30 de abril' },
    { months: [11, 12], id: 'vida-aguinaldo-minimo-y-fecha', label: 'Temporada de aguinaldo' }
];

function seasonalGuide(date = new Date()) {
    return SEASONAL_GUIDES.find((s) => s.months.includes(date.getMonth() + 1)) || null;
}

function openGuideFromHome(id) {
    Object.assign(libraryUI, { view: 'item', itemId: id, need: null, query: '' });
    navigate('guides');
}
