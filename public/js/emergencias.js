// --- EMERGENCIAS Y SISMO ---
// Qué hacer en el momento (pasos cortos, letra grande) y un plan propio preparado con calma:
// contactos, punto de reunión, ficha médica, mochila y botiquín. Todo se guarda solo en el teléfono.
// Redactado con IA a partir de recomendaciones generales de protección civil: ver docs/revision-contenido.md.

const EMERGENCY_SITUATIONS = [
    {
        id: 'sismo', label: 'Está temblando', icon: 'activity', words: 'sismo temblor terremoto alerta sismica',
        steps: [
            'Conserva la calma: no corras, no grites, no empujes.',
            'Si estás en planta baja y la salida está cerca, sal a un lugar abierto, lejos de postes, cables y bardas.',
            'Si no, ve a la zona de menor riesgo que elegiste: lejos de ventanas, vidrios y muebles que puedan caer.',
            'No uses el elevador ni bajes escaleras mientras tiembla.',
            'Si vas manejando, detente con cuidado lejos de puentes, postes y edificios, y quédate en el auto.'
        ],
        then: 'sismo-despues'
    },
    {
        id: 'sismo-despues', label: 'Ya pasó el sismo', icon: 'hand-heart', words: 'sismo temblor despues replica grietas',
        steps: [
            'Revisa si tú o alguien más está herido. Si hay lesiones graves, llama al 911.',
            'Si huele a gas, no prendas luces ni cerillos: cierra la llave del gas y sal.',
            'Ponte zapatos y sal con calma por las escaleras hacia tu punto de reunión.',
            'Puede haber réplicas: aléjate de muros con grietas y de cristales rotos.',
            'Avisa que estás bien con un mensaje corto; deja las llamadas para quien tiene una emergencia.',
            'Infórmate con Protección Civil y medios oficiales, no con cadenas de mensajes.'
        ],
        share: true
    },
    {
        id: 'incendio', label: 'Hay fuego', icon: 'flame', words: 'incendio fuego humo extintor quemadura',
        steps: [
            'Si el fuego es pequeño y sabes usar el extintor, apunta a la base de las llamas. Si crece, sal.',
            'Si se prende aceite en la cocina, tápalo con una tapa y apaga la estufa. Nunca le eches agua.',
            'Sal lo más abajo posible, incluso gateando: el humo sube.',
            'Antes de abrir una puerta, tócala con el dorso de la mano. Si está caliente, busca otra salida.',
            'No uses el elevador.',
            'Ya afuera, llama al 911 y no regreses por nada.'
        ]
    },
    {
        id: 'gas', label: 'Huele a gas', icon: 'wind', words: 'gas fuga olor tanque estacionario',
        steps: [
            'No prendas ni apagues luces ni aparatos, y no uses cerillos ni encendedores.',
            'Cierra la llave del tanque o del medidor.',
            'Abre puertas y ventanas.',
            'Sal y, ya afuera, llama al 911 o a tu proveedor de gas.',
            'No regreses hasta que lo revise alguien que sepa.'
        ]
    },
    {
        id: 'inundacion', label: 'Lluvia fuerte o inundación', icon: 'cloud-rain-wind', words: 'inundacion lluvia agua tormenta huracan encharcamiento',
        steps: [
            'No cruces calles inundadas a pie ni en auto: aunque parezca poca agua, puede arrastrarte.',
            'Si el agua puede entrar a tu casa, baja el interruptor de la luz y sube lo importante.',
            'Aléjate de cables caídos y coladeras.',
            'Si el agua sigue subiendo, ve a un lugar alto y llama al 911.'
        ]
    },
    {
        id: 'medica', label: 'Alguien se desmayó o está grave', icon: 'heart-pulse', words: 'desmayo emergencia medica infarto convulsion accidente herido ambulancia',
        steps: [
            'Llama al 911 y pon el altavoz: te van a guiar.',
            'Si no responde y no respira con normalidad, haz lo que te indiquen desde el 911, como compresiones en el pecho.',
            'Si respira, acuéstala de lado y no le des nada de comer ni de beber.',
            'Si se cayó o tuvo un choque, no la muevas, salvo que haya peligro donde está.',
            'Ten a la mano su ficha de emergencia: alergias y medicinas.'
        ]
    }
];

// Guías que ya existen en Dudas y conversaciones
const EMERGENCY_GUIDES = [
    { id: 'vida-me-robaron-el-celular', label: 'Me robaron el celular', icon: 'smartphone' },
    { id: 'vida-perdi-mi-cartera', label: 'Perdí mi cartera', icon: 'wallet' },
    { id: 'vida-numeros-de-emergencia', label: 'Números de emergencia', icon: 'phone' }
];

const KIT_LISTS = {
    mochila: {
        label: 'Mochila de emergencia', icon: 'backpack',
        items: ['Agua embotellada', 'Comida que no se eche a perder (y abrelatas)', 'Linterna con pilas', 'Radio de pilas', 'Batería portátil para el celular', 'Copias de tus documentos en una bolsa de plástico', 'Efectivo en billetes chicos y monedas', 'Las medicinas que tomas', 'Botiquín', 'Silbato', 'Cobija o manta térmica', 'Ropa y zapatos cómodos', 'Cubrebocas y artículos de higiene', 'Llaves de repuesto', 'Teléfonos importantes en papel']
    },
    botiquin: {
        label: 'Botiquín', icon: 'briefcase-medical',
        items: ['Curitas', 'Gasas', 'Vendas', 'Cinta adhesiva médica', 'Antiséptico', 'Guantes desechables', 'Tijeras', 'Termómetro', 'Analgésico que ya conozcas', 'Suero oral']
    }
};

const emergencyUI = { view: 'home', situation: null, kit: null };

function emergencyState() {
    state.emergency = state.emergency || {};
    const e = state.emergency;
    e.contacts = e.contacts || [];
    e.meetingPoint = e.meetingPoint || '';
    e.safeSpot = e.safeSpot || '';
    e.medical = e.medical || { blood: '', allergies: '', conditions: '', meds: '' };
    e.kits = e.kits || { mochila: [], botiquin: [] };
    e.kitsChecked = e.kitsChecked || {};
    return e;
}

// --- Vistas ---

function renderModuloEmergency() {
    return `<div id="emergency-root" class="max-w-2xl mx-auto space-y-4">${renderEmergencyView()}</div>`;
}

function renderEmergencyRoot() {
    const root = document.getElementById('emergency-root');
    if (!root) return;
    root.innerHTML = renderEmergencyView();
    lucide.createIcons();
}

function renderEmergencyView() {
    const situation = EMERGENCY_SITUATIONS.find((s) => s.id === emergencyUI.situation);
    if (emergencyUI.view === 'situation' && situation) return renderSituation(situation);
    if (emergencyUI.view === 'kit' && KIT_LISTS[emergencyUI.kit]) return renderKit(emergencyUI.kit);
    if (emergencyUI.view === 'plan') return renderEmergencyPlan();
    return renderEmergencyHome();
}

function call911Button() {
    return `<a href="tel:911" class="flex items-center justify-center gap-3 w-full py-4 bg-attention-fill text-white rounded-2xl text-lg font-bold no-underline"><i data-lucide="phone" class="w-5 h-5" aria-hidden="true"></i>Llamar al 911</a>`;
}

function renderEmergencyHome() {
    const e = emergencyState();
    const kitProgress = (key) => `${e.kits[key].length} de ${KIT_LISTS[key].items.length}`;
    const planDone = [e.contacts.length, e.meetingPoint, e.safeSpot, e.medical.blood || e.medical.allergies].filter(Boolean).length;
    return `
        ${call911Button()}
        <div class="bg-card p-5 rounded-3xl border border-line shadow-sm space-y-3">
            <h3 class="font-bold text-base text-ink">¿Qué está pasando?</h3>
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-2">
                ${EMERGENCY_SITUATIONS.map((s) => `
                    <button type="button" onclick="openSituation('${s.id}')" class="flex items-center gap-3 p-4 bg-surface-1 border border-line rounded-2xl text-left font-bold text-ink">
                        <i data-lucide="${s.icon}" class="w-6 h-6 text-attention flex-shrink-0" aria-hidden="true"></i>${s.label}
                    </button>`).join('')}
                ${EMERGENCY_GUIDES.map((g) => `
                    <button type="button" onclick="openGuideFromHome('${g.id}')" class="flex items-center gap-3 p-4 bg-surface-1 border border-line rounded-2xl text-left font-bold text-ink">
                        <i data-lucide="${g.icon}" class="w-6 h-6 text-ink-faint flex-shrink-0" aria-hidden="true"></i>${g.label}
                    </button>`).join('')}
            </div>
        </div>
        ${e.contacts.length ? `
            <div class="bg-card p-5 rounded-3xl border border-line shadow-sm space-y-2">
                <h3 class="font-bold text-base text-ink">Tus contactos</h3>
                ${e.contacts.map((c) => `
                    <a href="tel:${escapeHtml(c.phone.replace(/[^\d+]/g, ''))}" class="flex items-center justify-between gap-3 p-3 bg-surface-1 rounded-xl no-underline">
                        <span class="font-semibold text-ink">${escapeHtml(c.name)}</span>
                        <span class="flex items-center gap-2 text-accent font-bold"><i data-lucide="phone" class="w-4 h-4" aria-hidden="true"></i>Llamar</span>
                    </a>`).join('')}
            </div>` : ''}
        <div class="bg-card p-5 rounded-3xl border border-line shadow-sm space-y-3">
            <h3 class="font-bold text-base text-ink">Prepárate con calma</h3>
            <p class="text-ink-soft">Hazlo un día tranquilo, no cuando ya está pasando.</p>
            <button type="button" onclick="openEmergencyPlan()" class="w-full flex items-center gap-3 p-3 bg-surface-1 border border-line rounded-xl text-left">
                <i data-lucide="users" class="w-5 h-5 text-accent" aria-hidden="true"></i>
                <span class="flex-1"><span class="block font-bold text-ink">Tu plan</span><span class="block text-sm text-ink-faint">Contactos, punto de reunión y ficha médica · ${planDone} de 4</span></span>
                <i data-lucide="chevron-right" class="w-4 h-4 text-ink-faint" aria-hidden="true"></i>
            </button>
            ${Object.entries(KIT_LISTS).map(([key, kit]) => `
                <button type="button" onclick="openKit('${key}')" class="w-full flex items-center gap-3 p-3 bg-surface-1 border border-line rounded-xl text-left">
                    <i data-lucide="${kit.icon}" class="w-5 h-5 text-accent" aria-hidden="true"></i>
                    <span class="flex-1"><span class="block font-bold text-ink">${kit.label}</span><span class="block text-sm text-ink-faint">${kitProgress(key)} listos${e.kitsChecked[key] ? ` · revisado el ${formatDocDate(e.kitsChecked[key])}` : ''}</span></span>
                    <i data-lucide="chevron-right" class="w-4 h-4 text-ink-faint" aria-hidden="true"></i>
                </button>`).join('')}
        </div>
        <p class="text-sm text-ink-faint">Recomendaciones generales, en revisión. En una emergencia, sigue siempre lo que te indiquen el 911 y Protección Civil.</p>`;
}

function renderSituation(s) {
    const e = emergencyState();
    const next = s.then ? EMERGENCY_SITUATIONS.find((x) => x.id === s.then) : null;
    return `
        ${backButton('closeEmergencyView()', 'Emergencias')}
        <div class="bg-card p-6 rounded-3xl border border-line shadow-sm space-y-5">
            <h3 class="flex items-center gap-3 text-xl font-bold text-ink"><i data-lucide="${s.icon}" class="w-7 h-7 text-attention" aria-hidden="true"></i>${s.label}</h3>
            ${s.id === 'sismo' && e.safeSpot ? `<p class="p-3 bg-accent-soft text-ink rounded-xl font-semibold">Tu zona segura: ${escapeHtml(e.safeSpot)}</p>` : ''}
            ${s.id === 'sismo-despues' && e.meetingPoint ? `<p class="p-3 bg-accent-soft text-ink rounded-xl font-semibold">Tu punto de reunión: ${escapeHtml(e.meetingPoint)}</p>` : ''}
            <ol class="space-y-4">
                ${s.steps.map((step, i) => `
                    <li class="flex gap-3 text-lg leading-snug text-ink">
                        <span class="w-8 h-8 rounded-full bg-surface-2 text-ink-soft font-bold flex items-center justify-center flex-shrink-0 text-base">${i + 1}</span>
                        <span>${escapeHtml(step)}</span>
                    </li>`).join('')}
            </ol>
            ${s.share ? `
                <button type="button" onclick="shareImOk()" class="w-full py-3 bg-accent-fill text-white rounded-xl font-bold flex items-center justify-center gap-2"><i data-lucide="share-2" class="w-5 h-5" aria-hidden="true"></i>Avisar que estoy bien</button>
                <p id="im-ok-status" class="text-sm text-ink-soft" role="status" aria-live="polite"></p>` : ''}
            ${next ? `<button type="button" onclick="openSituation('${next.id}')" class="w-full py-3 bg-surface-2 rounded-xl font-bold text-ink">${next.label}: qué hacer</button>` : ''}
        </div>
        ${s.id === 'medica' && (e.medical.blood || e.medical.allergies || e.medical.meds) ? renderMedicalCard() : ''}
        ${call911Button()}`;
}

function renderMedicalCard() {
    const m = emergencyState().medical;
    const row = (label, value) => value ? `<p><span class="text-ink-faint">${label}:</span> <span class="font-semibold text-ink">${escapeHtml(value)}</span></p>` : '';
    return `
        <div class="bg-card p-5 rounded-3xl border border-line shadow-sm space-y-1">
            <h3 class="font-bold text-base text-ink mb-2">Tu ficha de emergencia</h3>
            ${row('Tipo de sangre', m.blood)}${row('Alergias', m.allergies)}${row('Padecimientos', m.conditions)}${row('Medicinas', m.meds)}
        </div>`;
}

function renderEmergencyPlan() {
    const e = emergencyState();
    const m = e.medical;
    const field = (id, label, value, placeholder, onchange) => `
        <div>
            <label for="${id}" class="block text-sm font-bold text-ink-faint mb-1">${label}</label>
            <input id="${id}" type="text" maxlength="120" value="${escapeHtml(value)}" placeholder="${placeholder}" onchange="${onchange}" class="w-full px-3 py-2 border rounded-xl">
        </div>`;
    return `
        ${backButton('closeEmergencyView()', 'Emergencias')}
        <div class="bg-card p-6 rounded-3xl border border-line shadow-sm space-y-4">
            <h3 class="font-bold text-base text-ink">Contactos de emergencia</h3>
            <p class="text-ink-soft">Personas a quienes llamar o avisar. Se guardan solo en tu teléfono.</p>
            ${e.contacts.map((c) => `
                <div class="flex items-center justify-between gap-3 p-3 bg-surface-1 rounded-xl">
                    <span><span class="block font-semibold text-ink">${escapeHtml(c.name)}</span><span class="block text-sm text-ink-faint">${escapeHtml(c.phone)}</span></span>
                    <button type="button" onclick="removeEmergencyContact(${c.id})" class="px-3 text-sm font-bold text-ink-faint" aria-label="Quitar a ${escapeHtml(c.name)}">Quitar</button>
                </div>`).join('')}
            ${!isPremium() && e.contacts.length >= FREE_LIMITS.contacts && e.contacts.length < 5 ? `
                <button type="button" onclick="openPremium('contacts')" class="flex items-center gap-2 text-sm font-bold text-accent"><i data-lucide="lock" class="w-4 h-4" aria-hidden="true"></i>Agregar otro contacto</button>` : ''}
            ${e.contacts.length < (isPremium() ? 5 : FREE_LIMITS.contacts) ? `
                <form onsubmit="addEmergencyContact(event)" class="grid grid-cols-1 sm:grid-cols-[1fr_1fr_auto] gap-2">
                    <input id="ec-name" type="text" required maxlength="40" placeholder="Nombre" aria-label="Nombre del contacto" class="px-3 py-2 border rounded-xl">
                    <input id="ec-phone" type="tel" required maxlength="20" placeholder="Teléfono" aria-label="Teléfono del contacto" class="px-3 py-2 border rounded-xl">
                    <button type="submit" class="px-4 bg-accent-fill text-white rounded-xl font-bold">Agregar</button>
                </form>` : ''}
        </div>
        <div class="bg-card p-6 rounded-3xl border border-line shadow-sm space-y-4">
            <h3 class="font-bold text-base text-ink">Dónde ir</h3>
            ${field('ep-safe', 'Zona de menor riesgo en tu casa o trabajo', e.safeSpot, 'Ej. junto a la columna del pasillo', "setEmergencyField('safeSpot', this.value)")}
            ${field('ep-meet', 'Punto de reunión afuera', e.meetingPoint, 'Ej. el parque de la esquina', "setEmergencyField('meetingPoint', this.value)")}
        </div>
        <div class="bg-card p-6 rounded-3xl border border-line shadow-sm space-y-4">
            <h3 class="font-bold text-base text-ink">Ficha de emergencia</h3>
            <p class="text-ink-soft">Lo que alguien tendría que saber si no puedes hablar.</p>
            ${field('ep-blood', 'Tipo de sangre', m.blood, 'Ej. O+', "setMedicalField('blood', this.value)")}
            ${field('ep-allergies', 'Alergias', m.allergies, 'Ej. penicilina', "setMedicalField('allergies', this.value)")}
            ${field('ep-conditions', 'Padecimientos', m.conditions, 'Ej. asma', "setMedicalField('conditions', this.value)")}
            ${field('ep-meds', 'Medicinas que tomas', m.meds, 'Ej. salbutamol', "setMedicalField('meds', this.value)")}
        </div>`;
}

function renderKit(key) {
    const kit = KIT_LISTS[key];
    const have = emergencyState().kits[key];
    const checked = emergencyState().kitsChecked[key];
    return `
        ${backButton('closeEmergencyView()', 'Emergencias')}
        <div class="bg-card p-6 rounded-3xl border border-line shadow-sm space-y-4">
            <h3 class="flex items-center gap-2 font-bold text-base text-ink"><i data-lucide="${kit.icon}" class="w-5 h-5 text-accent" aria-hidden="true"></i>${kit.label}</h3>
            <p class="text-ink-soft">Marca lo que ya tienes. Revísalo cada 6 meses: el agua, la comida, las pilas y las medicinas caducan.</p>
            <div class="space-y-2">
                ${kit.items.map((item, i) => `
                    <label class="flex items-center gap-3 p-3 bg-surface-1 border border-line rounded-xl font-semibold text-ink-soft">
                        <input type="checkbox" ${have.includes(i) ? 'checked' : ''} onchange="toggleKitItem('${key}', ${i})" class="w-6 h-6 text-accent rounded">
                        ${escapeHtml(item)}
                    </label>`).join('')}
            </div>
            <button type="button" onclick="markKitChecked('${key}')" class="w-full px-5 bg-accent-fill text-white rounded-xl font-bold">Ya lo revisé hoy</button>
            ${checked ? `<p class="text-sm text-ink-faint">Última revisión: ${formatDocDate(checked)}</p>` : ''}
        </div>`;
}

// --- Acciones ---

function openSituation(id) {
    Object.assign(emergencyUI, { view: 'situation', situation: id });
    renderEmergencyRoot();
    document.getElementById('page-content').scrollTop = 0;
}

function openSituationFromSearch(id) {
    Object.assign(emergencyUI, { view: 'situation', situation: id });
    navigate('emergency');
}

function openEmergencyPlan() {
    emergencyUI.view = 'plan';
    renderEmergencyRoot();
}

function openKit(key) {
    Object.assign(emergencyUI, { view: 'kit', kit: key });
    renderEmergencyRoot();
}

function closeEmergencyView() {
    Object.assign(emergencyUI, { view: 'home', situation: null, kit: null });
    renderEmergencyRoot();
}

function addEmergencyContact(e) {
    e.preventDefault();
    emergencyState().contacts.push({
        id: Date.now(),
        name: document.getElementById('ec-name').value.trim(),
        phone: document.getElementById('ec-phone').value.trim()
    });
    saveState();
    renderEmergencyRoot();
}

function removeEmergencyContact(id) {
    const contact = emergencyState().contacts.find((c) => c.id === id);
    emergencyUI.view = 'plan';
    removeWithUndo(() => state.emergency.contacts, id, contact ? contact.name : 'el contacto', 'emergency');
}

function setEmergencyField(key, value) {
    emergencyState()[key] = value.trim();
    saveState();
}

function setMedicalField(key, value) {
    emergencyState().medical[key] = value.trim();
    saveState();
}

function toggleKitItem(key, index) {
    const kits = emergencyState().kits;
    kits[key] = kits[key].includes(index) ? kits[key].filter((i) => i !== index) : [...kits[key], index];
    saveState();
}

function markKitChecked(key) {
    emergencyState().kitsChecked[key] = new Date().toISOString().slice(0, 10);
    saveState();
    renderEmergencyRoot();
}

async function shareImOk() {
    const where = emergencyState().meetingPoint;
    const text = `Estoy bien.${where ? ` Voy al punto de reunión: ${where}.` : ''} Te aviso cualquier cosa.`;
    const status = document.getElementById('im-ok-status');
    try {
        const result = await shareText(text);
        if (status && result === 'copied') status.textContent = 'Mensaje copiado. Pégalo en tu chat.';
    } catch (e) {
        if (status) status.textContent = `Escribe: "${text}"`;
    }
}
