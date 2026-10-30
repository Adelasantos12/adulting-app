// --- SALUD: MEDICINAS Y CITAS ---
// Recordatorios, no consejos médicos: la persona anota lo que su médico le indicó y la app le avisa.
// Medicinas: horarios del día, se marcan como tomadas y se repite el aviso diario hasta la fecha de fin.
// Citas: se ven las próximas; en Hoy aparecen las de hoy y mañana.

const MAX_MED_TIMES = 4;
const healthUI = { form: null, editingId: null, draftTimes: ['08:00'] };

function healthPlannerState() {
    const h = state.health;
    h.meds = h.meds || [];
    h.appointments = h.appointments || [];
    h.medLog = h.medLog || {};
    return h;
}

function localIso(date = new Date()) {
    const d = new Date(date);
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
}

function medIsActive(med, iso = localIso()) {
    return (!med.start || med.start <= iso) && (!med.until || med.until >= iso);
}

// Tomas de hoy, en orden de hora: [{ med, time, key, taken }]
function todaysDoses() {
    const today = localIso();
    const log = healthPlannerState().medLog[today] || [];
    return healthPlannerState().meds
        .filter((m) => medIsActive(m, today))
        .flatMap((med) => med.times.map((time) => ({ med, time, key: `${med.id}@${time}`, taken: log.includes(`${med.id}@${time}`) })))
        .sort((a, b) => a.time.localeCompare(b.time));
}

function upcomingAppointments() {
    const now = new Date();
    return healthPlannerState().appointments
        .filter((a) => appointmentDate(a) >= new Date(now.getTime() - 2 * 3600000))
        .sort((a, b) => appointmentDate(a) - appointmentDate(b));
}

function appointmentDate(a) {
    const [y, m, d] = a.date.split('-').map(Number);
    const [hh, mm] = (a.time || '09:00').split(':').map(Number);
    return new Date(y, m - 1, d, hh, mm);
}

function appointmentWhen(a) {
    const days = daysUntil(a.date);
    const day = days === 0 ? 'Hoy' : days === 1 ? 'Mañana' : formatDocDate(a.date);
    return `${day}${a.time ? ` a las ${a.time}` : ''}`;
}

// --- Avisos del teléfono ---

function medNoticeId(med, index) {
    return 300000000 + (med.id % 10000000) * 10 + index;
}

function appointmentNoticeIds(a) {
    const base = 500000000 + (a.id % 50000000) * 2;
    return [base, base + 1];
}

function syncMedNotices(med) {
    for (let i = 0; i < MAX_MED_TIMES; i++) cancelNotice(medNoticeId(med, i));
    if (!medIsActive(med) && !(med.start && med.start > localIso())) return;
    med.times.forEach((time, i) => {
        const [hour, minute] = time.split(':').map(Number);
        scheduleDailyNotice(medNoticeId(med, i), hour, minute, `Toca ${med.name}`, med.dose ? `${med.dose}${med.note ? ` · ${med.note}` : ''}` : (med.note || 'Márcala en Modo Adulto cuando la tomes.'));
    });
}

function syncAppointmentNotices(a) {
    const [dayBefore, sameDay] = appointmentNoticeIds(a);
    cancelNotice(dayBefore);
    cancelNotice(sameDay);
    const when = appointmentDate(a);
    const eve = new Date(when);
    eve.setDate(eve.getDate() - 1);
    eve.setHours(19, 0, 0, 0);
    const soon = new Date(when.getTime() - 2 * 3600000);
    const now = new Date();
    if (eve > now) scheduleNotice(dayBefore, eve, `Mañana: ${a.title}`, `${a.time ? `A las ${a.time}` : 'Mañana'}${a.place ? ` en ${a.place}` : ''}.`);
    if (soon > now) scheduleNotice(sameDay, soon, `En 2 horas: ${a.title}`, a.place || 'Revisa cómo vas a llegar.');
}

function syncAllHealthNotices() {
    if (!isNativeApp()) return;
    const h = healthPlannerState();
    h.meds.forEach(syncMedNotices);
    upcomingAppointments().forEach(syncAppointmentNotices);
}

// --- Vistas (van arriba de la página de Hábitos y salud) ---

function renderHealthPlanner() {
    return `<div id="health-planner" class="grid grid-cols-1 lg:grid-cols-2 gap-6">${renderHealthPlannerView()}</div>`;
}

function renderHealthPlannerRoot() {
    const root = document.getElementById('health-planner');
    if (!root) return;
    root.innerHTML = renderHealthPlannerView();
    lucide.createIcons();
}

function renderHealthPlannerView() {
    if (healthUI.form === 'med') return `<div class="lg:col-span-2">${renderMedForm()}</div>`;
    if (healthUI.form === 'appointment') return `<div class="lg:col-span-2">${renderAppointmentForm()}</div>`;
    return renderMedsCard() + renderAppointmentsCard();
}

function renderMedsCard() {
    const meds = healthPlannerState().meds;
    const doses = todaysDoses();
    const today = localIso();
    return `
        <div class="bg-card p-6 rounded-2xl border border-line shadow-sm space-y-4">
            <div class="flex items-center justify-between gap-3">
                <h3 class="font-bold text-base text-ink flex items-center gap-2"><i data-lucide="pill" class="w-5 h-5 text-accent" aria-hidden="true"></i>Medicinas</h3>
                <button type="button" onclick="openMedForm()" class="px-4 bg-accent-fill text-white rounded-xl text-sm font-bold flex items-center gap-2"><i data-lucide="plus" class="w-4 h-4" aria-hidden="true"></i>Agregar</button>
            </div>
            ${doses.length ? `
                <div class="space-y-2">
                    <p class="text-sm font-bold text-ink-faint">Hoy</p>
                    ${doses.map(doseRow).join('')}
                </div>` : `<p class="text-ink-soft">${meds.length ? 'Nada que tomar hoy.' : 'Anota lo que te recetaron y a qué horas; te avisamos y marcas cuando lo tomes.'}</p>`}
            ${meds.length ? `
                <div class="space-y-1 pt-2 border-t border-line">
                    <p class="text-sm font-bold text-ink-faint pt-2">Tus medicinas</p>
                    ${meds.map((m) => `
                        <button type="button" onclick="openMedForm(${m.id})" class="w-full flex items-center justify-between gap-3 p-2 rounded-xl text-left hover:bg-surface-1">
                            <span class="min-w-0">
                                <span class="block font-semibold text-ink truncate">${escapeHtml(m.name)}${m.dose ? ` <span class="font-normal text-ink-faint">· ${escapeHtml(m.dose)}</span>` : ''}</span>
                                <span class="block text-sm text-ink-faint">${m.times.join(', ')}${m.until ? ` · hasta ${formatDocDate(m.until)}` : ''}</span>
                            </span>
                            ${medIsActive(m, today) ? '' : `<span class="px-2 py-0.5 bg-surface-2 text-ink-soft text-xs rounded-full font-bold">${m.until && m.until < today ? 'Terminada' : 'Aún no empieza'}</span>`}
                        </button>`).join('')}
                </div>` : ''}
            <p class="text-sm text-ink-faint">Solo es un recordatorio. Sigue lo que te indicó tu médico.</p>
        </div>`;
}

function doseRow(d) {
    return `
        <label class="flex items-center gap-3 p-3 bg-surface-1 border border-line rounded-xl ${d.taken ? 'opacity-60' : ''}">
            <input type="checkbox" ${d.taken ? 'checked' : ''} onchange="toggleDose('${d.key}')" class="w-6 h-6 text-accent rounded">
            <span class="font-bold text-ink w-12">${d.time}</span>
            <span class="min-w-0">
                <span class="block font-semibold text-ink ${d.taken ? 'line-through' : ''}">${escapeHtml(d.med.name)}</span>
                ${d.med.dose || d.med.note ? `<span class="block text-sm text-ink-faint">${escapeHtml([d.med.dose, d.med.note].filter(Boolean).join(' · '))}</span>` : ''}
            </span>
        </label>`;
}

function renderAppointmentsCard() {
    const upcoming = upcomingAppointments();
    return `
        <div class="bg-card p-6 rounded-2xl border border-line shadow-sm space-y-4">
            <div class="flex items-center justify-between gap-3">
                <h3 class="font-bold text-base text-ink flex items-center gap-2"><i data-lucide="calendar-heart" class="w-5 h-5 text-accent" aria-hidden="true"></i>Citas</h3>
                <button type="button" onclick="openAppointmentForm()" class="px-4 bg-accent-fill text-white rounded-xl text-sm font-bold flex items-center gap-2"><i data-lucide="plus" class="w-4 h-4" aria-hidden="true"></i>Agregar</button>
            </div>
            ${upcoming.length ? upcoming.map((a) => `
                <button type="button" onclick="openAppointmentForm(${a.id})" class="w-full flex items-start gap-3 p-3 bg-surface-1 border border-line rounded-xl text-left">
                    <i data-lucide="calendar" class="w-5 h-5 text-ink-faint mt-0.5 flex-shrink-0" aria-hidden="true"></i>
                    <span class="min-w-0">
                        <span class="block font-semibold text-ink">${escapeHtml(a.title)}</span>
                        <span class="block text-sm text-ink-soft">${appointmentWhen(a)}</span>
                        ${a.place ? `<span class="block text-sm text-ink-faint">${escapeHtml(a.place)}</span>` : ''}
                    </span>
                </button>`).join('') : '<p class="text-ink-soft">Dentista, análisis, terapia, consulta… Te avisamos un día antes y dos horas antes.</p>'}
            <button type="button" onclick="emergencyUI.view = 'plan'; navigate('emergency')" class="flex items-center gap-2 text-sm font-bold text-accent"><i data-lucide="heart-pulse" class="w-4 h-4" aria-hidden="true"></i>Tu ficha de emergencia: sangre y alergias</button>
        </div>`;
}

function renderMedForm() {
    const med = healthPlannerState().meds.find((m) => m.id === healthUI.editingId);
    const times = healthUI.draftTimes;
    return `
        <form onsubmit="saveMed(event)" class="bg-card p-6 rounded-2xl border border-line shadow-sm space-y-4 max-w-xl">
            ${backButton('closeHealthForm()', 'Salud')}
            <h3 class="font-bold text-lg text-ink">${med ? 'Editar medicina' : 'Nueva medicina'}</h3>
            <div>
                <label for="med-name" class="block text-sm font-bold text-ink-faint mb-1">¿Qué medicina?</label>
                <input id="med-name" type="text" required maxlength="50" value="${escapeHtml(med?.name || '')}" placeholder="Como viene en la receta" class="w-full px-3 py-2 border rounded-xl">
            </div>
            <div>
                <label for="med-dose" class="block text-sm font-bold text-ink-faint mb-1">¿Cuánto? (opcional)</label>
                <input id="med-dose" type="text" maxlength="40" value="${escapeHtml(med?.dose || '')}" placeholder="Ej. 1 tableta" class="w-full px-3 py-2 border rounded-xl">
            </div>
            <fieldset class="space-y-2">
                <legend class="text-sm font-bold text-ink-faint mb-1">¿A qué horas?</legend>
                <div class="flex flex-wrap gap-2">
                    ${times.map((t, i) => `
                        <span class="flex items-center gap-1">
                            <input type="time" required value="${t}" onchange="setDraftTime(${i}, this.value)" aria-label="Hora ${i + 1}" class="px-3 py-2 border rounded-xl">
                            ${times.length > 1 ? `<button type="button" onclick="removeDraftTime(${i})" class="px-2 text-ink-faint" aria-label="Quitar esta hora"><i data-lucide="x" class="w-4 h-4" aria-hidden="true"></i></button>` : ''}
                        </span>`).join('')}
                    ${times.length < MAX_MED_TIMES ? `<button type="button" onclick="addDraftTime()" class="px-4 bg-surface-2 rounded-xl text-sm font-bold text-ink-soft">Otra hora</button>` : ''}
                </div>
            </fieldset>
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                    <label for="med-start" class="block text-sm font-bold text-ink-faint mb-1">Desde</label>
                    <input id="med-start" type="date" value="${med?.start || localIso()}" class="w-full px-3 py-2 border rounded-xl">
                </div>
                <div>
                    <label for="med-until" class="block text-sm font-bold text-ink-faint mb-1">Hasta (vacío si no termina)</label>
                    <input id="med-until" type="date" value="${med?.until || ''}" class="w-full px-3 py-2 border rounded-xl">
                </div>
            </div>
            <div>
                <label for="med-note" class="block text-sm font-bold text-ink-faint mb-1">Nota (opcional)</label>
                <input id="med-note" type="text" maxlength="60" value="${escapeHtml(med?.note || '')}" placeholder="Ej. con comida" class="w-full px-3 py-2 border rounded-xl">
            </div>
            <div class="flex flex-wrap gap-2">
                <button type="submit" class="flex-1 px-5 bg-accent-fill text-white rounded-xl font-bold">Guardar</button>
                ${med ? `<button type="button" onclick="deleteMed(${med.id})" class="px-5 bg-surface-2 rounded-xl font-bold text-ink-soft">Borrar</button>` : ''}
            </div>
        </form>`;
}

function renderAppointmentForm() {
    const a = healthPlannerState().appointments.find((x) => x.id === healthUI.editingId);
    return `
        <form onsubmit="saveAppointment(event)" class="bg-card p-6 rounded-2xl border border-line shadow-sm space-y-4 max-w-xl">
            ${backButton('closeHealthForm()', 'Salud')}
            <h3 class="font-bold text-lg text-ink">${a ? 'Editar cita' : 'Nueva cita'}</h3>
            <div>
                <label for="ap-title" class="block text-sm font-bold text-ink-faint mb-1">¿Con quién o para qué?</label>
                <input id="ap-title" type="text" required maxlength="50" value="${escapeHtml(a?.title || '')}" placeholder="Ej. Dentista, análisis de sangre" class="w-full px-3 py-2 border rounded-xl">
            </div>
            <div class="grid grid-cols-2 gap-3">
                <div>
                    <label for="ap-date" class="block text-sm font-bold text-ink-faint mb-1">Día</label>
                    <input id="ap-date" type="date" required value="${a?.date || ''}" class="w-full px-3 py-2 border rounded-xl">
                </div>
                <div>
                    <label for="ap-time" class="block text-sm font-bold text-ink-faint mb-1">Hora</label>
                    <input id="ap-time" type="time" value="${a?.time || ''}" class="w-full px-3 py-2 border rounded-xl">
                </div>
            </div>
            <div>
                <label for="ap-place" class="block text-sm font-bold text-ink-faint mb-1">Dónde (opcional)</label>
                <input id="ap-place" type="text" maxlength="80" value="${escapeHtml(a?.place || '')}" placeholder="Ej. Clínica 25 del IMSS, consultorio 4" class="w-full px-3 py-2 border rounded-xl">
            </div>
            <div>
                <label for="ap-note" class="block text-sm font-bold text-ink-faint mb-1">Llevar o preguntar (opcional)</label>
                <textarea id="ap-note" rows="2" maxlength="200" placeholder="Ej. ir en ayunas, llevar estudios anteriores" class="w-full p-3 border rounded-xl">${escapeHtml(a?.note || '')}</textarea>
            </div>
            <div class="flex flex-wrap gap-2">
                <button type="submit" class="flex-1 px-5 bg-accent-fill text-white rounded-xl font-bold">Guardar</button>
                ${a ? `<button type="button" onclick="deleteAppointment(${a.id})" class="px-5 bg-surface-2 rounded-xl font-bold text-ink-soft">Borrar</button>` : ''}
            </div>
        </form>`;
}

// --- Acciones ---

function openMedForm(id) {
    const med = healthPlannerState().meds.find((m) => m.id === id);
    Object.assign(healthUI, { form: 'med', editingId: id || null, draftTimes: med ? [...med.times] : ['08:00'] });
    renderHealthPlannerRoot();
}

function openAppointmentForm(id) {
    Object.assign(healthUI, { form: 'appointment', editingId: id || null });
    renderHealthPlannerRoot();
}

function closeHealthForm() {
    Object.assign(healthUI, { form: null, editingId: null });
    renderHealthPlannerRoot();
}

// Las horas se guardan en el borrador para no perder lo escrito al agregar o quitar una
function keepDraftFields() {
    ['med-name', 'med-dose', 'med-start', 'med-until', 'med-note'].forEach((id) => {
        const el = document.getElementById(id);
        if (el) healthUI[id] = el.value;
    });
}

function restoreDraftFields() {
    ['med-name', 'med-dose', 'med-start', 'med-until', 'med-note'].forEach((id) => {
        const el = document.getElementById(id);
        if (el && healthUI[id] !== undefined) el.value = healthUI[id];
    });
}

function setDraftTime(index, value) {
    healthUI.draftTimes[index] = value;
}

function addDraftTime() {
    keepDraftFields();
    const last = healthUI.draftTimes[healthUI.draftTimes.length - 1] || '08:00';
    const next = (Number(last.slice(0, 2)) + 8) % 24;
    healthUI.draftTimes.push(`${String(next).padStart(2, '0')}:${last.slice(3, 5)}`);
    renderHealthPlannerRoot();
    restoreDraftFields();
}

function removeDraftTime(index) {
    keepDraftFields();
    healthUI.draftTimes.splice(index, 1);
    renderHealthPlannerRoot();
    restoreDraftFields();
}

function saveMed(e) {
    e.preventDefault();
    const meds = healthPlannerState().meds;
    const fields = {
        name: document.getElementById('med-name').value.trim(),
        dose: document.getElementById('med-dose').value.trim(),
        times: [...new Set(healthUI.draftTimes.filter(Boolean))].sort(),
        start: document.getElementById('med-start').value,
        until: document.getElementById('med-until').value,
        note: document.getElementById('med-note').value.trim()
    };
    let med = meds.find((m) => m.id === healthUI.editingId);
    if (med) Object.assign(med, fields);
    else {
        med = { id: Date.now(), ...fields };
        meds.push(med);
    }
    saveState();
    syncMedNotices(med);
    clearDraft();
    closeHealthForm();
}

function clearDraft() {
    ['med-name', 'med-dose', 'med-start', 'med-until', 'med-note'].forEach((id) => delete healthUI[id]);
}

function deleteMed(id) {
    const med = healthPlannerState().meds.find((m) => m.id === id);
    if (!med) return;
    for (let i = 0; i < MAX_MED_TIMES; i++) cancelNotice(medNoticeId(med, i));
    Object.assign(healthUI, { form: null, editingId: null });
    clearDraft();
    removeWithUndo(() => state.health.meds, id, `"${med.name}"`, 'health');
}

function toggleDose(key) {
    const log = healthPlannerState().medLog;
    const today = localIso();
    const list = log[today] || [];
    log[today] = list.includes(key) ? list.filter((k) => k !== key) : [...list, key];
    // Solo se guarda una semana de registro
    Object.keys(log).filter((d) => daysUntil(d) < -7).forEach((d) => delete log[d]);
    saveState();
    renderHealthPlannerRoot();
    if (currentPage === 'dashboard') navigate('dashboard');
}

function saveAppointment(e) {
    e.preventDefault();
    const list = healthPlannerState().appointments;
    const fields = {
        title: document.getElementById('ap-title').value.trim(),
        date: document.getElementById('ap-date').value,
        time: document.getElementById('ap-time').value,
        place: document.getElementById('ap-place').value.trim(),
        note: document.getElementById('ap-note').value.trim()
    };
    let a = list.find((x) => x.id === healthUI.editingId);
    if (a) Object.assign(a, fields);
    else {
        a = { id: Date.now(), ...fields };
        list.push(a);
    }
    // Las citas pasadas de hace más de un mes se borran solas
    state.health.appointments = list.filter((x) => daysUntil(x.date) >= -30);
    saveState();
    syncAppointmentNotices(a);
    closeHealthForm();
}

function deleteAppointment(id) {
    const a = healthPlannerState().appointments.find((x) => x.id === id);
    if (!a) return;
    appointmentNoticeIds(a).forEach(cancelNotice);
    Object.assign(healthUI, { form: null, editingId: null });
    removeWithUndo(() => state.health.appointments, id, `"${a.title}"`, 'health');
}

// Tarjeta en Hoy: tomas pendientes de hoy y citas de hoy o mañana
function renderHealthReminder() {
    if (state.accessibility.visibleModules.health === false) return '';
    const pending = todaysDoses();
    const soon = upcomingAppointments().filter((a) => daysUntil(a.date) <= 1);
    if (!pending.length && !soon.length) return '';
    const left = pending.filter((d) => !d.taken).length;
    return `
        <div class="bg-card p-6 rounded-3xl border border-line shadow-sm space-y-3">
            <h3 class="font-bold text-base text-ink flex items-center gap-1.5"><i data-lucide="pill" class="w-4 h-4 text-accent" aria-hidden="true"></i>Tu salud hoy</h3>
            ${soon.map((a) => `
                <button type="button" onclick="navigate('health'); openAppointmentForm(${a.id})" class="w-full flex items-center gap-3 p-3 bg-surface-1 border border-line rounded-xl text-left">
                    <i data-lucide="calendar" class="w-5 h-5 text-accent flex-shrink-0" aria-hidden="true"></i>
                    <span><span class="block font-semibold text-ink">${escapeHtml(a.title)}</span><span class="block text-sm text-ink-soft">${appointmentWhen(a)}</span></span>
                </button>`).join('')}
            ${pending.length ? `
                <p class="text-sm font-bold text-ink-faint">${left ? `Te faltan ${left} de ${pending.length} tomas` : 'Ya tomaste todo lo de hoy'}</p>
                ${pending.filter((d) => !d.taken).slice(0, 3).map(doseRow).join('')}` : ''}
        </div>`;
}
