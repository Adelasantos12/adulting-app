// --- DOCUMENTOS Y VENCIMIENTOS ---
// La persona anota qué documentos tiene y cuándo vencen; la app avisa con tiempo para renovarlos.
// Solo se guarda el tipo, la fecha y una nota: nada de números de documento.
// En Hoy solo aparece lo que ya está por vencer; en la app nativa además llega una notificación.

const DOC_TYPES = {
    ine: { label: 'Credencial del INE', icon: 'id-card', remind: 90, guide: 'vida-ine-sacar-o-renovar', hint: 'La vigencia viene impresa en el frente de tu credencial.' },
    pasaporte: { label: 'Pasaporte', icon: 'book-user', remind: 180, guide: 'vida-pasaporte-cita-y-requisitos', hint: 'Muchos países piden que tenga al menos 6 meses de vigencia para entrar.' },
    licencia: { label: 'Licencia de manejo', icon: 'car-front', remind: 30, guide: 'vida-licencia-de-conducir' },
    circulacion: { label: 'Tarjeta de circulación', icon: 'file-badge', remind: 30 },
    verificacion: { label: 'Verificación vehicular', icon: 'leaf', remind: 15, hint: 'El periodo depende de tu estado y de tu placa; viene en tu último comprobante.' },
    tenencia: { label: 'Tenencia o refrendo', icon: 'receipt-text', remind: 30, hint: 'Se paga una vez al año y cada estado pone su fecha límite.' },
    'seguro-auto': { label: 'Seguro del auto', icon: 'shield-check', remind: 30 },
    efirma: { label: 'e.firma del SAT', icon: 'key-round', remind: 30, guide: 'sat-renovar-efirma', hint: 'Si se vence, ya no puedes hacer muchos trámites del SAT en línea.' },
    visa: { label: 'Visa', icon: 'plane', remind: 180 },
    'seguro-medico': { label: 'Seguro de gastos médicos', icon: 'heart-pulse', remind: 30, guide: 'vida-seguro-gastos-medicos-mayores' },
    renta: { label: 'Contrato de renta', icon: 'house', remind: 60, hint: 'Con tiempo puedes negociar la renovación o buscar otro lugar.' },
    tarjeta: { label: 'Tarjeta del banco', icon: 'credit-card', remind: 30, hint: 'Anota solo de qué banco es. Nunca guardes el número completo.' },
    garantia: { label: 'Garantía', icon: 'badge-check', remind: 30 },
    otro: { label: 'Otro documento', icon: 'file-text', remind: 30 }
};
const QUICK_DOC_TYPES = ['ine', 'pasaporte', 'licencia', 'efirma', 'seguro-auto', 'verificacion'];
const REMIND_OPTIONS = [7, 15, 30, 60, 90, 180];

const docsUI = { view: 'list', editingId: null, draftType: null };

function documentsState() {
    state.documents = state.documents || [];
    return state.documents;
}

// --- Fechas ---

function parseLocalDate(iso) {
    const [y, m, d] = iso.split('-').map(Number);
    return new Date(y, m - 1, d);
}

function daysUntil(iso) {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return Math.round((parseLocalDate(iso) - today) / 86400000);
}

function formatDocDate(iso) {
    return parseLocalDate(iso).toLocaleDateString('es-MX', { day: 'numeric', month: 'short', year: 'numeric' });
}

function relativeDays(days) {
    if (days === 0) return 'hoy';
    if (days === 1) return 'mañana';
    if (days === -1) return 'ayer';
    if (days < 0) return `hace ${-days} días`;
    if (days < 60) return `en ${days} días`;
    const months = Math.round(days / 30);
    return months < 24 ? `en ${months} meses` : `en ${Math.round(days / 365)} años`;
}

// 'vencido' | 'pronto' | 'vigente'
function docStatus(doc) {
    const days = daysUntil(doc.expires);
    if (days < 0) return 'vencido';
    if (days <= doc.remindDays) return 'pronto';
    return 'vigente';
}

function docsNeedingAttention() {
    return documentsState()
        .filter((d) => docStatus(d) !== 'vigente')
        .sort((a, b) => a.expires.localeCompare(b.expires));
}

function docName(doc) {
    return doc.name || DOC_TYPES[doc.type]?.label || 'Documento';
}

function docStatusChip(doc) {
    const status = docStatus(doc);
    const days = daysUntil(doc.expires);
    if (status === 'vigente') return `<span class="px-2 py-0.5 bg-surface-2 text-ink-soft text-xs rounded-full font-bold">Vigente</span>`;
    const calm = state.accessibility.reduceUrgencies;
    const text = status === 'vencido' ? `Venció ${relativeDays(days)}` : `Vence ${relativeDays(days)}`;
    return calm
        ? `<span class="px-2 py-0.5 bg-surface-2 text-ink-soft text-xs rounded-full font-bold">${text}</span>`
        : `<span class="inline-flex items-center gap-1 px-2 py-0.5 bg-attention-soft text-attention text-xs rounded-full font-bold"><i data-lucide="clock" class="w-3 h-3" aria-hidden="true"></i>${text}</span>`;
}

// --- Avisos del teléfono ---
// Un aviso por documento, el día en que entra a su ventana de aviso, a las 10 de la mañana

function docNoticeId(doc) {
    return 100000 + (doc.id % 1000000000);
}

function syncDocumentNotice(doc) {
    const at = parseLocalDate(doc.expires);
    at.setDate(at.getDate() - doc.remindDays);
    at.setHours(10, 0, 0, 0);
    cancelNotice(docNoticeId(doc));
    if (at > new Date()) {
        scheduleNotice(docNoticeId(doc), at, `${docName(doc)}: renuévalo con tiempo`, `Vence el ${formatDocDate(doc.expires)}.`);
    }
}

function syncAllDocumentNotices() {
    if (!isNativeApp()) return;
    documentsState().forEach(syncDocumentNotice);
}

// --- Vistas ---

function renderModuloDocuments() {
    return `<div id="docs-root" class="max-w-2xl mx-auto">${renderDocumentsView()}</div>`;
}

function renderDocumentsRoot() {
    const root = document.getElementById('docs-root');
    if (!root) return;
    root.innerHTML = renderDocumentsView();
    lucide.createIcons();
}

function renderDocumentsView() {
    if (docsUI.view === 'form') return renderDocumentForm();
    const docs = documentsState();
    if (!docs.length) {
        return `
            <div class="bg-card p-6 rounded-3xl border border-line shadow-sm space-y-4">
                <h3 class="font-bold text-base text-ink">Que no se te venza nada</h3>
                <p class="text-ink-soft">Anota cuándo vence cada documento y te avisamos con tiempo para renovarlo. Solo guardamos la fecha, nada de números.</p>
                <p class="text-sm font-bold text-ink-faint">Empieza con uno</p>
                <div class="grid grid-cols-2 sm:grid-cols-3 gap-2">
                    ${QUICK_DOC_TYPES.map((t) => docTypeButton(t)).join('')}
                </div>
                <button type="button" onclick="newDocument()" class="px-4 bg-surface-2 rounded-xl text-sm font-bold text-ink-soft">Ver todos los tipos</button>
            </div>`;
    }
    const attention = docsNeedingAttention();
    const rest = docs.filter((d) => docStatus(d) === 'vigente').sort((a, b) => a.expires.localeCompare(b.expires));
    return `
        <div class="space-y-4">
            <div class="flex items-center justify-between gap-3">
                <h3 class="font-bold text-base text-ink">Tus documentos</h3>
                <button type="button" onclick="newDocument()" class="px-4 bg-accent-fill text-white rounded-xl text-sm font-bold flex items-center gap-2"><i data-lucide="plus" class="w-4 h-4" aria-hidden="true"></i>Agregar</button>
            </div>
            ${attention.length ? `
                <div class="bg-card p-4 rounded-3xl border border-line shadow-sm space-y-1">
                    <p class="px-2 text-sm font-bold text-ink-faint">Por renovar</p>
                    ${attention.map(docRow).join('')}
                </div>` : ''}
            ${rest.length ? `
                <div class="bg-card p-4 rounded-3xl border border-line shadow-sm space-y-1">
                    <p class="px-2 text-sm font-bold text-ink-faint">Vigentes</p>
                    ${rest.map(docRow).join('')}
                </div>` : ''}
            <p class="text-sm text-ink-faint">${isNativeApp() ? 'Te llega una notificación cuando toca renovar cada uno.' : 'Los avisos aparecen en Hoy cuando toca renovar. En la app del teléfono también llegan como notificación.'}</p>
        </div>`;
}

function docTypeButton(type) {
    const t = DOC_TYPES[type];
    return `
        <button type="button" onclick="newDocument('${type}')" class="flex items-center gap-2 p-3 bg-surface-1 border border-line rounded-xl text-left text-sm font-semibold text-ink">
            <i data-lucide="${t.icon}" class="w-5 h-5 text-accent flex-shrink-0" aria-hidden="true"></i>${t.label}
        </button>`;
}

function docRow(doc) {
    const t = DOC_TYPES[doc.type] || DOC_TYPES.otro;
    return `
        <button type="button" onclick="editDocument(${doc.id})" class="w-full flex items-center gap-3 p-2 rounded-xl text-left hover:bg-surface-1">
            <span class="w-10 h-10 rounded-xl bg-surface-2 text-ink-soft flex items-center justify-center flex-shrink-0"><i data-lucide="${t.icon}" class="w-5 h-5" aria-hidden="true"></i></span>
            <span class="flex-1 min-w-0">
                <span class="block font-semibold text-ink truncate">${escapeHtml(docName(doc))}</span>
                <span class="block text-sm text-ink-faint">${docStatus(doc) === 'vencido' ? 'Venció' : 'Vence'} ${formatDocDate(doc.expires)}</span>
            </span>
            ${docStatusChip(doc)}
        </button>`;
}

function renderDocumentForm() {
    const doc = documentsState().find((d) => d.id === docsUI.editingId);
    const type = doc ? doc.type : docsUI.draftType;
    if (!type) {
        return `
            <div class="bg-card p-6 rounded-3xl border border-line shadow-sm space-y-4">
                ${backButton('closeDocumentForm()', 'Tus documentos')}
                <h3 class="font-bold text-base text-ink">¿Qué documento?</h3>
                <div class="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    ${Object.keys(DOC_TYPES).map((t) => docTypeButton(t)).join('')}
                </div>
            </div>`;
    }
    const t = DOC_TYPES[type];
    const remind = doc ? doc.remindDays : t.remind;
    return `
        <form onsubmit="saveDocument(event)" class="bg-card p-6 rounded-3xl border border-line shadow-sm space-y-5">
            ${backButton('closeDocumentForm()', 'Tus documentos')}
            <div class="flex items-center gap-3">
                <span class="w-12 h-12 rounded-2xl bg-accent-soft text-accent flex items-center justify-center"><i data-lucide="${t.icon}" class="w-6 h-6" aria-hidden="true"></i></span>
                <h3 class="font-bold text-lg text-ink">${t.label}</h3>
            </div>
            ${t.hint ? `<p class="text-ink-soft">${t.hint}</p>` : ''}
            <div>
                <label for="doc-name" class="block text-sm font-bold text-ink-faint mb-1">Nombre para reconocerlo (opcional)</label>
                <input id="doc-name" type="text" maxlength="40" value="${escapeHtml(doc?.name || '')}" placeholder="${escapeHtml(t.label)}" class="w-full px-3 py-2 border rounded-xl">
            </div>
            <div>
                <label for="doc-expires" class="block text-sm font-bold text-ink-faint mb-1">¿Cuándo vence?</label>
                <input id="doc-expires" type="date" required value="${doc?.expires || ''}" class="w-full px-3 py-2 border rounded-xl">
            </div>
            <div>
                <label for="doc-remind" class="block text-sm font-bold text-ink-faint mb-1">Avísame</label>
                <select id="doc-remind" class="w-full px-3 py-2 border rounded-xl">
                    ${REMIND_OPTIONS.map((n) => `<option value="${n}" ${n === remind ? 'selected' : ''}>${n < 30 ? `${n} días` : `${n / 30 === 1 ? '1 mes' : `${n / 30} meses`}`} antes</option>`).join('')}
                </select>
            </div>
            <div>
                <label for="doc-note" class="block text-sm font-bold text-ink-faint mb-1">Nota (opcional)</label>
                <textarea id="doc-note" rows="2" maxlength="200" placeholder="Ej. dónde lo guardas o qué necesitas para renovarlo" class="w-full p-3 border rounded-xl">${escapeHtml(doc?.note || '')}</textarea>
            </div>
            ${t.guide ? `<button type="button" onclick="openGuideFromHome('${t.guide}')" class="flex items-center gap-2 text-sm font-bold text-accent"><i data-lucide="book-open" class="w-4 h-4" aria-hidden="true"></i>¿Cómo se renueva?</button>` : ''}
            <div class="flex flex-wrap gap-2">
                <button type="submit" class="flex-1 px-5 bg-accent-fill text-white rounded-xl font-bold">Guardar</button>
                ${doc ? `<button type="button" onclick="deleteDocument(${doc.id})" class="px-5 bg-surface-2 rounded-xl font-bold text-ink-soft">Borrar</button>` : ''}
            </div>
        </form>`;
}

// --- Acciones ---

function newDocument(type) {
    Object.assign(docsUI, { view: 'form', editingId: null, draftType: type || null });
    renderDocumentsRoot();
}

function editDocument(id) {
    Object.assign(docsUI, { view: 'form', editingId: id, draftType: null });
    renderDocumentsRoot();
}

function closeDocumentForm() {
    Object.assign(docsUI, { view: 'list', editingId: null, draftType: null });
    renderDocumentsRoot();
}

function saveDocument(e) {
    e.preventDefault();
    const docs = documentsState();
    const existing = docs.find((d) => d.id === docsUI.editingId);
    const fields = {
        name: document.getElementById('doc-name').value.trim(),
        expires: document.getElementById('doc-expires').value,
        remindDays: Number(document.getElementById('doc-remind').value),
        note: document.getElementById('doc-note').value.trim()
    };
    let doc;
    if (existing) {
        doc = Object.assign(existing, fields);
    } else {
        doc = { id: Date.now(), type: docsUI.draftType, ...fields };
        docs.push(doc);
    }
    saveState();
    syncDocumentNotice(doc);
    closeDocumentForm();
}

function deleteDocument(id) {
    const doc = documentsState().find((d) => d.id === id);
    if (!doc) return;
    cancelNotice(docNoticeId(doc));
    Object.assign(docsUI, { view: 'list', editingId: null, draftType: null });
    removeWithUndo(() => state.documents, id, `"${docName(doc)}"`, 'documents');
}

// Tarjeta en Hoy: solo si algo ya está por vencer
function renderDocumentsReminder() {
    if (state.accessibility.visibleModules.documents === false) return '';
    const due = docsNeedingAttention();
    if (!due.length) return '';
    return `
        <div class="bg-card p-6 rounded-3xl border border-line shadow-sm space-y-2">
            <h3 class="font-bold text-base text-ink flex items-center gap-1.5"><i data-lucide="file-clock" class="w-4 h-4 text-accent" aria-hidden="true"></i>Documentos por renovar</h3>
            ${due.slice(0, 3).map((d) => `
                <button type="button" onclick="navigate('documents'); editDocument(${d.id})" class="w-full flex items-center justify-between gap-3 py-2 text-left">
                    <span class="font-semibold text-ink">${escapeHtml(docName(d))}</span>
                    ${docStatusChip(d)}
                </button>`).join('')}
            ${due.length > 3 ? `<button type="button" onclick="navigate('documents')" class="text-sm font-bold text-accent">Ver los ${due.length}</button>` : ''}
        </div>`;
}
