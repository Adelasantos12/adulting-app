// --- PLAN GRATIS Y MODO ADULTO COMPLETO ---
// Todo se puede probar gratis con límites; la suscripción quita los límites.
// Siempre gratis y sin límite: medicinas, luces del tablero, el 911 y los pasos de emergencia.
// Precios, productos y pasos para conectar las tiendas en docs/modelo-de-negocio.md.

// Apagado hasta que la compra funcione en las tiendas: mientras, nadie ve candados.
// Para revisar cómo se ve, abre la app con ?paywall=1 (dura hasta cerrar la pestaña; ?paywall=0 lo quita).
const PAYWALL_ENABLED = false;

const PLAN_PRICES = {
    mensual: { label: 'Mensual', price: 30, per: 'al mes', productId: 'completo_mensual' },
    anual: { label: 'Anual', price: 299, per: 'al año', productId: 'completo_anual', note: 'Ahorras $61: dos meses gratis' }
};
const TRIAL_DAYS = 7;

// Lo que el plan gratis permite de cada cosa
const FREE_LIMITS = {
    documents: 3,
    payments: 3,
    appointments: 2,
    contacts: 1
};

// Para qué sirve pagar, en el orden en que se muestra
const PREMIUM_FEATURES = [
    { icon: 'file-clock', text: 'Documentos, pagos y citas sin límite' },
    { icon: 'chef-hat', text: 'Cocinar paso a paso con temporizador, y recetas según lo que tienes' },
    { icon: 'landmark', text: 'Todas las guías del SAT y de dinero' },
    { icon: 'shirt', text: 'Tu clóset: outfits solo con tu ropa' },
    { icon: 'users', text: 'Hasta 5 contactos de emergencia' }
];

// Por qué se abrió la pantalla de suscripción, para decirlo arriba
const PREMIUM_REASONS = {
    documents: `En el plan gratis puedes guardar ${FREE_LIMITS.documents} documentos.`,
    payments: `En el plan gratis puedes guardar ${FREE_LIMITS.payments} pagos fijos.`,
    appointments: `En el plan gratis puedes tener ${FREE_LIMITS.appointments} citas próximas.`,
    contacts: `En el plan gratis puedes guardar ${FREE_LIMITS.contacts} contacto de emergencia.`,
    cook: 'Cocinar paso a paso es parte de Modo Adulto completo.',
    pantry: 'Las recetas según lo que tienes son parte de Modo Adulto completo.',
    closet: 'Tu clóset es parte de Modo Adulto completo.',
    guide: 'Esta guía es parte de Modo Adulto completo.'
};

function planState() {
    state.plan = state.plan || {};
    const p = state.plan;
    p.premium = !!p.premium;      // lo confirma la tienda, nunca la app por su cuenta
    p.product = p.product || null;
    return p;
}

// ?paywall=1 lo prende y ?paywall=0 lo apaga; se lee una vez al cargar
try {
    const flag = new URLSearchParams(location.search).get('paywall');
    if (flag === '1') sessionStorage.setItem('modo_adulto_paywall', '1');
    if (flag === '0') sessionStorage.removeItem('modo_adulto_paywall');
} catch (e) {
    // Sin sessionStorage la vista previa no está disponible
}

function paywallActive() {
    if (PAYWALL_ENABLED) return true;
    try {
        return sessionStorage.getItem('modo_adulto_paywall') === '1';
    } catch (e) {
        return false;
    }
}

function isPremium() {
    return !paywallActive() || planState().premium;
}

// Devuelve true si se puede seguir; si no, abre la pantalla de suscripción
function allowPremium(reason) {
    if (isPremium()) return true;
    openPremium(reason);
    return false;
}

function allowMore(kind, currentCount) {
    if (isPremium() || currentCount < FREE_LIMITS[kind]) return true;
    openPremium(kind);
    return false;
}

function isPremiumGuide(id) {
    return /^(sat|din)-/.test(id);
}

function lockBadge(id) {
    return !isPremium() && isPremiumGuide(id)
        ? '<span class="inline-flex items-center gap-1 px-2 py-0.5 bg-surface-2 text-ink-soft text-xs rounded-full font-bold"><i data-lucide="lock" class="w-3 h-3" aria-hidden="true"></i>Completo</span>'
        : '';
}

// --- Pantalla de suscripción (ventana encima de donde estás) ---

let premiumChoice = 'anual';
let premiumReason = null;

function openPremium(reason) {
    premiumReason = reason || null;
    let modal = document.getElementById('premium-modal');
    if (!modal) {
        modal = document.createElement('div');
        modal.id = 'premium-modal';
        modal.className = 'fixed inset-0 z-50 bg-ink/40 flex items-end sm:items-center justify-center sm:px-4';
        modal.onclick = (e) => { if (e.target === modal) closePremium(); };
        document.body.appendChild(modal);
    }
    modal.classList.remove('hidden');
    renderPremium();
}

function closePremium() {
    document.getElementById('premium-modal')?.classList.add('hidden');
}

function choosePremiumPlan(key) {
    premiumChoice = key;
    renderPremium();
}

function renderPremium() {
    const modal = document.getElementById('premium-modal');
    if (!modal) return;
    const plan = PLAN_PRICES[premiumChoice];
    const p = planState();
    const option = (key) => {
        const o = PLAN_PRICES[key];
        const active = premiumChoice === key;
        return `
            <button type="button" onclick="choosePremiumPlan('${key}')" aria-pressed="${active}" class="flex-1 p-4 rounded-2xl border-2 text-left ${active ? 'border-accent bg-accent-soft' : 'border-line bg-card'}">
                <span class="block text-sm font-bold text-ink-faint">${o.label}</span>
                <span class="block text-2xl font-extrabold text-ink">$${o.price}</span>
                <span class="block text-sm text-ink-soft">${o.per}</span>
                ${o.note ? `<span class="block text-xs font-bold text-accent mt-1">${o.note}</span>` : ''}
            </button>`;
    };
    modal.innerHTML = `
        <div class="bg-card w-full sm:max-w-md rounded-t-3xl sm:rounded-3xl shadow-2xl border border-line p-6 space-y-5 max-h-[92vh] overflow-y-auto" role="dialog" aria-modal="true" aria-labelledby="premium-title">
            <div class="flex items-start justify-between gap-3">
                <div>
                    ${premiumReason && PREMIUM_REASONS[premiumReason] ? `<p class="text-sm font-bold text-ink-faint mb-1">${PREMIUM_REASONS[premiumReason]}</p>` : ''}
                    <h3 id="premium-title" class="text-xl font-extrabold text-ink">Modo Adulto completo</h3>
                </div>
                <button type="button" onclick="closePremium()" class="p-2 text-ink-faint" aria-label="Cerrar"><i data-lucide="x" class="w-5 h-5" aria-hidden="true"></i></button>
            </div>
            ${p.premium ? `
                <p class="p-3 bg-accent-soft rounded-xl font-semibold text-ink">Ya tienes Modo Adulto completo. Gracias por apoyar la app.</p>
                <p class="text-sm text-ink-soft">Tu suscripción se administra desde tu cuenta de ${/android/i.test(navigator.userAgent) ? 'Google Play' : 'Apple'}.</p>` : `
                <ul class="space-y-3">
                    ${PREMIUM_FEATURES.map((f) => `<li class="flex items-start gap-3 text-ink"><i data-lucide="${f.icon}" class="w-5 h-5 text-accent flex-shrink-0 mt-0.5" aria-hidden="true"></i>${f.text}</li>`).join('')}
                </ul>
                <p class="text-sm text-ink-soft">Siempre gratis: medicinas, luces del tablero, llamar al 911 y qué hacer en una emergencia.</p>
                <div class="flex gap-2">${option('anual')}${option('mensual')}</div>
                <button type="button" onclick="startPurchase()" class="w-full py-3 bg-accent-fill text-white rounded-xl text-lg font-bold">Probar ${TRIAL_DAYS} días gratis</button>
                <p class="text-sm text-ink-faint text-center">Después, $${plan.price} ${plan.per}. Cancela cuando quieras desde tu cuenta de la tienda; si cancelas antes del día ${TRIAL_DAYS + 1}, no se te cobra.</p>
                <p id="premium-status" class="text-sm text-ink-soft text-center" role="status" aria-live="polite"></p>
                <button type="button" onclick="restorePurchases()" class="w-full text-sm font-bold text-ink-faint">Ya pagué: restaurar compra</button>`}
        </div>`;
    lucide.createIcons();
}

// La compra la hace la tienda (Apple o Google). Se conecta con RevenueCat cuando existan las cuentas.
async function startPurchase() {
    setPremiumStatus('La suscripción se activa cuando la app esté en las tiendas. Por ahora todo sigue abierto.');
}

async function restorePurchases() {
    setPremiumStatus('Cuando la app esté en las tiendas, aquí recuperas tu suscripción en un teléfono nuevo.');
}

function setPremiumStatus(text) {
    const el = document.getElementById('premium-status');
    if (el) el.textContent = text;
}

// Fila de Ajustes
function renderPlanSettingsRow() {
    if (!paywallActive()) return '';
    const premium = planState().premium;
    return `
        <button type="button" onclick="openPremium()" class="w-full flex items-center gap-3 p-3 bg-surface-1 border border-line rounded-2xl text-left">
            <i data-lucide="sparkles" class="w-5 h-5 text-accent" aria-hidden="true"></i>
            <span class="flex-1">
                <span class="block font-bold text-ink">Tu plan: ${premium ? 'Modo Adulto completo' : 'Gratis'}</span>
                <span class="block text-ink-faint">${premium ? 'Administrar suscripción' : `Prueba ${TRIAL_DAYS} días gratis lo completo`}</span>
            </span>
            <i data-lucide="chevron-right" class="w-4 h-4 text-ink-faint" aria-hidden="true"></i>
        </button>`;
}
