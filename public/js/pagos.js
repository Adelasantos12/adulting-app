// --- PAGOS FIJOS Y SUSCRIPCIONES ---
// Renta, servicios, suscripciones y créditos que se repiten. Muestra cuánto se va al mes,
// avisa antes de cada pago y, al marcarlo como pagado, pasa a la siguiente fecha.
// Los que se cobran solos (cargo automático) avanzan por su cuenta: solo se avisa antes del cobro.

const PAYMENT_FREQUENCIES = {
    semanal: { label: 'Cada semana', months: 12 / 52 },
    mensual: { label: 'Cada mes', months: 1 },
    bimestral: { label: 'Cada 2 meses', months: 2 },
    anual: { label: 'Cada año', months: 12 }
};

const PAYMENT_TEMPLATES = [
    { name: 'Renta', icon: 'building-2', kind: 'casa', frequency: 'mensual' },
    { name: 'Luz (CFE)', icon: 'zap', kind: 'servicio', frequency: 'bimestral' },
    { name: 'Agua', icon: 'droplet', kind: 'servicio', frequency: 'bimestral' },
    { name: 'Gas', icon: 'flame', kind: 'servicio', frequency: 'mensual' },
    { name: 'Internet', icon: 'wifi', kind: 'servicio', frequency: 'mensual' },
    { name: 'Celular', icon: 'smartphone', kind: 'servicio', frequency: 'mensual' },
    { name: 'Tarjeta de crédito', icon: 'credit-card', kind: 'credito', frequency: 'mensual' },
    { name: 'Streaming (Netflix, Disney+…)', icon: 'tv', kind: 'suscripcion', frequency: 'mensual', autopay: true },
    { name: 'Música (Spotify…)', icon: 'music', kind: 'suscripcion', frequency: 'mensual', autopay: true },
    { name: 'Gimnasio', icon: 'dumbbell', kind: 'suscripcion', frequency: 'mensual' },
    { name: 'Predial', icon: 'landmark', kind: 'casa', frequency: 'anual' },
    { name: 'Seguro', icon: 'shield', kind: 'seguro', frequency: 'anual' },
    { name: 'Otro', icon: 'repeat', kind: 'otro', frequency: 'mensual' }
];
const PAYMENT_KINDS = { casa: 'Casa', servicio: 'Servicio', suscripcion: 'Suscripción', credito: 'Crédito', seguro: 'Seguro', otro: 'Otro' };

const paymentsUI = { view: 'list', editingId: null, template: null };

function paymentsState() {
    state.payments = state.payments || [];
    return state.payments;
}

function money(amount) {
    return Number(amount || 0).toLocaleString('es-MX', { style: 'currency', currency: 'MXN', maximumFractionDigits: 0 });
}

function monthlyCost(p) {
    return Number(p.amount || 0) / PAYMENT_FREQUENCIES[p.frequency].months;
}

function addFrequency(iso, frequency) {
    const d = parseLocalDate(iso);
    if (frequency === 'semanal') d.setDate(d.getDate() + 7);
    else {
        const day = d.getDate();
        d.setDate(1);
        d.setMonth(d.getMonth() + PAYMENT_FREQUENCIES[frequency].months);
        // Si el mes no tiene ese día (31 en abril), se queda en el último
        const last = new Date(d.getFullYear(), d.getMonth() + 1, 0).getDate();
        d.setDate(Math.min(day, last));
    }
    return localIso(d);
}

// Los cargos automáticos que ya pasaron se dan por pagados y avanzan solos
function advanceAutopay() {
    let changed = false;
    paymentsState().forEach((p) => {
        while (p.autopay && daysUntil(p.nextDue) < 0) {
            p.lastPaid = p.nextDue;
            p.nextDue = addFrequency(p.nextDue, p.frequency);
            changed = true;
        }
    });
    if (changed) saveState();
}

function paymentsDueSoon() {
    advanceAutopay();
    return paymentsState()
        .filter((p) => daysUntil(p.nextDue) <= p.remindDays)
        .sort((a, b) => a.nextDue.localeCompare(b.nextDue));
}

function paymentDueText(p) {
    const days = daysUntil(p.nextDue);
    // Lo vencido se nombra sin culpa: "Pendiente desde", nunca "atrasado"
    if (days < 0) return `Pendiente desde el ${parseLocalDate(p.nextDue).toLocaleDateString('es-MX', { day: 'numeric', month: 'short' })}`;
    const verb = p.autopay ? 'Se cobra' : 'Vence';
    return `${verb} ${relativeDays(days)}`;
}

function paymentChip(p) {
    const days = daysUntil(p.nextDue);
    const urgent = !p.autopay && days <= p.remindDays;
    const calm = state.accessibility.reduceUrgencies || !urgent;
    return calm
        ? `<span class="px-2 py-0.5 bg-surface-2 text-ink-soft text-xs rounded-full font-bold">${paymentDueText(p)}</span>`
        : `<span class="inline-flex items-center gap-1 px-2 py-0.5 bg-attention-soft text-attention text-xs rounded-full font-bold"><i data-lucide="clock" class="w-3 h-3" aria-hidden="true"></i>${paymentDueText(p)}</span>`;
}

function paymentIcon(p) {
    return PAYMENT_TEMPLATES.find((t) => t.name === p.template)?.icon || 'repeat';
}

// --- Avisos del teléfono ---

function paymentNoticeId(p) {
    return 700000000 + (p.id % 100000000);
}

function syncPaymentNotice(p) {
    cancelNotice(paymentNoticeId(p));
    const at = parseLocalDate(p.nextDue);
    at.setDate(at.getDate() - p.remindDays);
    at.setHours(10, 0, 0, 0);
    if (at > new Date()) {
        const title = p.autopay ? `Se cobra pronto: ${p.name}` : `Por pagar: ${p.name}`;
        scheduleNotice(paymentNoticeId(p), at, title, `${money(p.amount)} el ${formatDocDate(p.nextDue)}.`);
    }
}

function syncAllPaymentNotices() {
    if (!isNativeApp()) return;
    advanceAutopay();
    paymentsState().forEach(syncPaymentNotice);
}

// --- Vistas ---

function renderModuloPayments() {
    advanceAutopay();
    return `<div id="payments-root" class="max-w-2xl mx-auto space-y-4">${renderPaymentsView()}</div>`;
}

function renderPaymentsRoot() {
    const root = document.getElementById('payments-root');
    if (!root) return;
    root.innerHTML = renderPaymentsView();
    lucide.createIcons();
}

function renderPaymentsView() {
    if (paymentsUI.view === 'form') return renderPaymentForm();
    const list = paymentsState();
    if (!list.length) {
        return `
            <div class="bg-card p-6 rounded-3xl border border-line shadow-sm space-y-4">
                <h3 class="font-bold text-base text-ink">Lo que pagas cada mes, en un solo lugar</h3>
                <p class="text-ink-soft">Anota tus pagos fijos y suscripciones: te decimos cuánto se va al mes y te avisamos antes de cada cobro.</p>
                ${templateGrid()}
            </div>`;
    }
    const total = list.reduce((sum, p) => sum + monthlyCost(p), 0);
    const subs = list.filter((p) => p.kind === 'suscripcion');
    const subsTotal = subs.reduce((sum, p) => sum + monthlyCost(p), 0);
    const sorted = [...list].sort((a, b) => a.nextDue.localeCompare(b.nextDue));
    const soon = sorted.filter((p) => daysUntil(p.nextDue) <= 7);
    const later = sorted.filter((p) => daysUntil(p.nextDue) > 7);
    return `
        <div class="bg-card p-6 rounded-3xl border border-line shadow-sm space-y-2">
            <p class="text-sm font-bold text-ink-faint">Al mes se van, más o menos</p>
            <p class="text-3xl font-extrabold text-ink">${money(total)}</p>
            ${subs.length ? `<p class="text-ink-soft">${subs.length === 1 ? '1 suscripción' : `${subs.length} suscripciones`}: ${money(subsTotal)} al mes, ${money(subsTotal * 12)} al año. ¿Las usas todas?</p>` : ''}
        </div>
        <div class="flex items-center justify-between gap-3">
            <h3 class="font-bold text-base text-ink">Tus pagos</h3>
            <button type="button" onclick="newPayment()" class="px-4 bg-accent-fill text-white rounded-xl text-sm font-bold flex items-center gap-2"><i data-lucide="plus" class="w-4 h-4" aria-hidden="true"></i>Agregar</button>
        </div>
        ${soon.length ? `
            <div class="bg-card p-4 rounded-3xl border border-line shadow-sm space-y-1">
                <p class="px-2 text-sm font-bold text-ink-faint">Esta semana</p>
                ${soon.map(paymentRow).join('')}
            </div>` : ''}
        ${later.length ? `
            <div class="bg-card p-4 rounded-3xl border border-line shadow-sm space-y-1">
                <p class="px-2 text-sm font-bold text-ink-faint">Más adelante</p>
                ${later.map(paymentRow).join('')}
            </div>` : ''}
        <p id="payments-status" class="text-sm text-ink-soft" role="status" aria-live="polite"></p>`;
}

function templateGrid() {
    return `
        <div class="grid grid-cols-2 sm:grid-cols-3 gap-2">
            ${PAYMENT_TEMPLATES.map((t, i) => `
                <button type="button" onclick="newPayment(${i})" class="flex items-center gap-2 p-3 bg-surface-1 border border-line rounded-xl text-left text-sm font-semibold text-ink">
                    <i data-lucide="${t.icon}" class="w-5 h-5 text-accent flex-shrink-0" aria-hidden="true"></i>${t.name}
                </button>`).join('')}
        </div>`;
}

function paymentRow(p) {
    const canPay = !p.autopay && daysUntil(p.nextDue) <= 7;
    return `
        <div class="p-2 rounded-xl space-y-1">
            <button type="button" onclick="editPayment(${p.id})" class="w-full flex items-center gap-3 text-left">
                <span class="w-10 h-10 rounded-xl bg-surface-2 text-ink-soft flex items-center justify-center flex-shrink-0"><i data-lucide="${paymentIcon(p)}" class="w-5 h-5" aria-hidden="true"></i></span>
                <span class="flex-1 min-w-0">
                    <span class="block font-semibold text-ink truncate">${escapeHtml(p.name)}</span>
                    <span class="block text-sm text-ink-faint">${money(p.amount)} · ${PAYMENT_FREQUENCIES[p.frequency].label.toLowerCase()}${p.autopay ? ' · cargo automático' : ''}</span>
                </span>
            </button>
            <div class="flex flex-wrap items-center justify-between gap-2 pl-[3.25rem]">
                ${paymentChip(p)}
                ${canPay ? `<button type="button" onclick="markPaymentPaid(${p.id})" class="px-3 text-sm font-bold text-accent">Ya lo pagué</button>` : ''}
            </div>
        </div>`;
}

function renderPaymentForm() {
    const p = paymentsState().find((x) => x.id === paymentsUI.editingId);
    const t = PAYMENT_TEMPLATES[paymentsUI.template];
    if (!p && !t) {
        return `
            <div class="bg-card p-6 rounded-3xl border border-line shadow-sm space-y-4">
                ${backButton('closePaymentForm()', 'Tus pagos')}
                <h3 class="font-bold text-base text-ink">¿Qué pago?</h3>
                ${templateGrid()}
            </div>`;
    }
    const v = p || { name: t.name === 'Otro' ? '' : t.name, kind: t.kind, frequency: t.frequency, autopay: !!t.autopay, remindDays: 3, amount: '', nextDue: '' };
    return `
        <form onsubmit="savePayment(event)" class="bg-card p-6 rounded-3xl border border-line shadow-sm space-y-4">
            ${backButton('closePaymentForm()', 'Tus pagos')}
            <h3 class="font-bold text-lg text-ink">${p ? 'Editar pago' : 'Nuevo pago'}</h3>
            <div>
                <label for="pay-name" class="block text-sm font-bold text-ink-faint mb-1">Nombre</label>
                <input id="pay-name" type="text" required maxlength="40" value="${escapeHtml(v.name)}" placeholder="Ej. Netflix" class="w-full px-3 py-2 border rounded-xl">
            </div>
            <div class="grid grid-cols-2 gap-3">
                <div>
                    <label for="pay-amount" class="block text-sm font-bold text-ink-faint mb-1">¿Cuánto?</label>
                    <input id="pay-amount" type="number" min="0" step="1" inputmode="decimal" required value="${v.amount}" placeholder="$" class="w-full px-3 py-2 border rounded-xl">
                </div>
                <div>
                    <label for="pay-frequency" class="block text-sm font-bold text-ink-faint mb-1">¿Cada cuándo?</label>
                    <select id="pay-frequency" class="w-full px-3 py-2 border rounded-xl">
                        ${Object.entries(PAYMENT_FREQUENCIES).map(([k, f]) => `<option value="${k}" ${v.frequency === k ? 'selected' : ''}>${f.label}</option>`).join('')}
                    </select>
                </div>
            </div>
            <div>
                <label for="pay-due" class="block text-sm font-bold text-ink-faint mb-1">Próxima fecha de pago</label>
                <input id="pay-due" type="date" required value="${v.nextDue}" class="w-full px-3 py-2 border rounded-xl">
            </div>
            <div>
                <label for="pay-kind" class="block text-sm font-bold text-ink-faint mb-1">Tipo</label>
                <select id="pay-kind" class="w-full px-3 py-2 border rounded-xl">
                    ${Object.entries(PAYMENT_KINDS).map(([k, label]) => `<option value="${k}" ${v.kind === k ? 'selected' : ''}>${label}</option>`).join('')}
                </select>
            </div>
            <label class="flex items-center gap-3 p-3 bg-surface-1 border border-line rounded-xl font-semibold text-ink-soft">
                <input id="pay-autopay" type="checkbox" ${v.autopay ? 'checked' : ''} class="w-6 h-6 text-accent rounded">
                Se cobra solo (cargo automático a tarjeta o cuenta)
            </label>
            <div>
                <label for="pay-remind" class="block text-sm font-bold text-ink-faint mb-1">Avísame</label>
                <select id="pay-remind" class="w-full px-3 py-2 border rounded-xl">
                    ${[1, 3, 5, 7].map((n) => `<option value="${n}" ${v.remindDays === n ? 'selected' : ''}>${n === 1 ? '1 día' : `${n} días`} antes</option>`).join('')}
                </select>
            </div>
            <div class="flex flex-wrap gap-2">
                <button type="submit" class="flex-1 px-5 bg-accent-fill text-white rounded-xl font-bold">Guardar</button>
                ${p ? `<button type="button" onclick="deletePayment(${p.id})" class="px-5 bg-surface-2 rounded-xl font-bold text-ink-soft">Borrar</button>` : ''}
            </div>
        </form>`;
}

// --- Acciones ---

function newPayment(templateIndex) {
    if (!allowMore('payments', paymentsState().length)) return;
    Object.assign(paymentsUI, { view: 'form', editingId: null, template: templateIndex ?? null });
    renderPaymentsRoot();
}

function editPayment(id) {
    Object.assign(paymentsUI, { view: 'form', editingId: id, template: null });
    renderPaymentsRoot();
}

function closePaymentForm() {
    Object.assign(paymentsUI, { view: 'list', editingId: null, template: null });
    renderPaymentsRoot();
}

function savePayment(e) {
    e.preventDefault();
    const list = paymentsState();
    const fields = {
        name: document.getElementById('pay-name').value.trim(),
        amount: Number(document.getElementById('pay-amount').value) || 0,
        frequency: document.getElementById('pay-frequency').value,
        nextDue: document.getElementById('pay-due').value,
        kind: document.getElementById('pay-kind').value,
        autopay: document.getElementById('pay-autopay').checked,
        remindDays: Number(document.getElementById('pay-remind').value)
    };
    let p = list.find((x) => x.id === paymentsUI.editingId);
    if (p) Object.assign(p, fields);
    else {
        p = { id: Date.now(), template: PAYMENT_TEMPLATES[paymentsUI.template]?.name || 'Otro', lastPaid: null, ...fields };
        list.push(p);
    }
    advanceAutopay();
    saveState();
    syncPaymentNotice(p);
    closePaymentForm();
}

function markPaymentPaid(id) {
    const p = paymentsState().find((x) => x.id === id);
    if (!p) return;
    const previous = { nextDue: p.nextDue, lastPaid: p.lastPaid };
    p.lastPaid = localIso();
    p.nextDue = addFrequency(p.nextDue, p.frequency);
    saveState();
    syncPaymentNotice(p);
    navigate(currentPage);
    showUndoToast(`${p.name}: el siguiente es el ${formatDocDate(p.nextDue)}.`, () => {
        Object.assign(p, previous);
        saveState();
        syncPaymentNotice(p);
        navigate(currentPage);
    });
}

function deletePayment(id) {
    const p = paymentsState().find((x) => x.id === id);
    if (!p) return;
    cancelNotice(paymentNoticeId(p));
    Object.assign(paymentsUI, { view: 'list', editingId: null, template: null });
    removeWithUndo(() => state.payments, id, `"${p.name}"`, 'payments');
}

// Tarjeta en Hoy: pagos que ya entraron en su aviso
function renderPaymentsReminder() {
    if (state.accessibility.visibleModules.payments === false) return '';
    const due = paymentsDueSoon();
    if (!due.length) return '';
    return `
        <div class="bg-card p-6 rounded-3xl border border-line shadow-sm space-y-2">
            <h3 class="font-bold text-base text-ink flex items-center gap-1.5"><i data-lucide="calendar-clock" class="w-4 h-4 text-accent" aria-hidden="true"></i>Pagos por venir</h3>
            ${due.slice(0, 4).map(paymentRow).join('')}
            ${due.length > 4 ? `<button type="button" onclick="navigate('payments')" class="text-sm font-bold text-accent">Ver los ${due.length}</button>` : ''}
        </div>`;
}

function hasOverduePayments() {
    return paymentsState().some((p) => !p.autopay && daysUntil(p.nextDue) < 0);
}
