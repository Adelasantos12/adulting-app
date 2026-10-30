// --- ENTRADA A LA APP ---
// Usuario y contraseña, o Apple, solo para abrir la app en este dispositivo. No hay servidor ni cuentas en la nube:
// la contraseña se guarda como huella (PBKDF2 con sal) junto a los demás datos, y de Apple solo la huella de su id.
// Si se olvida la contraseña no hay forma de recuperarla; queda empezar de nuevo.

const ACCESS_SESSION_KEY = 'modo_adulto_unlocked';
const PASSWORD_ITERATIONS = 150000;

function accessState() {
    state.access = state.access || {};
    const a = state.access;
    a.method = a.method || null;   // 'password' | 'apple' | 'none' (eligió usar sin usuario) | null (no ha decidido)
    a.username = a.username || '';
    return a;
}

let accessMode = 'create';
let accessMessage = '';

function isUnlocked() {
    try {
        return sessionStorage.getItem(ACCESS_SESSION_KEY) === '1';
    } catch (e) {
        return false;
    }
}

function markUnlocked(on) {
    try {
        if (on) sessionStorage.setItem(ACCESS_SESSION_KEY, '1');
        else sessionStorage.removeItem(ACCESS_SESSION_KEY);
    } catch (e) {
        // Sin sessionStorage se pide la entrada en cada recarga
    }
}

// Se llama al arrancar: decide si hay que mostrar la pantalla de entrada
function showAccessIfNeeded() {
    const a = accessState();
    if (a.method === 'none') return;
    if (a.method && isUnlocked()) return;
    openAccess(a.method ? 'login' : 'create');
}

function openAccess(mode) {
    accessMode = mode;
    accessMessage = '';
    let screen = document.getElementById('access-screen');
    if (!screen) {
        screen = document.createElement('div');
        screen.id = 'access-screen';
        screen.className = 'fixed inset-0 z-50 bg-ground overflow-y-auto';
        document.body.appendChild(screen);
    }
    screen.classList.remove('hidden');
    renderAccess();
    setTimeout(() => screen.querySelector('input')?.focus(), 50);
}

function closeAccess() {
    document.getElementById('access-screen')?.classList.add('hidden');
}

function lockApp() {
    markUnlocked(false);
    openAccess('login');
}

// --- Huellas (nunca se guarda la contraseña ni el id de Apple tal cual) ---

function toHex(buffer) {
    return Array.from(new Uint8Array(buffer)).map((b) => b.toString(16).padStart(2, '0')).join('');
}

function fromHex(hex) {
    return new Uint8Array(hex.match(/.{2}/g).map((h) => parseInt(h, 16)));
}

async function passwordHash(password, saltHex) {
    const key = await crypto.subtle.importKey('raw', new TextEncoder().encode(password), 'PBKDF2', false, ['deriveBits']);
    const bits = await crypto.subtle.deriveBits(
        { name: 'PBKDF2', hash: 'SHA-256', salt: fromHex(saltHex), iterations: PASSWORD_ITERATIONS },
        key, 256
    );
    return toHex(bits);
}

async function sha256(text) {
    return toHex(await crypto.subtle.digest('SHA-256', new TextEncoder().encode(text)));
}

async function setPassword(username, password) {
    const a = accessState();
    a.salt = toHex(crypto.getRandomValues(new Uint8Array(16)));
    a.hash = await passwordHash(password, a.salt);
    a.username = username;
    a.method = 'password';
    delete a.apple;
}

async function checkPassword(password) {
    const a = accessState();
    if (!a.salt || !a.hash) return false;
    return (await passwordHash(password, a.salt)) === a.hash;
}

// --- Acciones del formulario ---

function accessFail(text) {
    accessMessage = text;
    renderAccess();
}

async function submitCreate(event) {
    event.preventDefault();
    const username = document.getElementById('access-user').value.trim();
    const password = document.getElementById('access-pass').value;
    const repeat = document.getElementById('access-pass2').value;
    if (!username) return accessFail('Escribe un nombre de usuario.');
    if (password.length < 4) return accessFail('La contraseña necesita al menos 4 caracteres.');
    if (password !== repeat) return accessFail('Las contraseñas no coinciden.');
    await setPassword(username, password);
    saveState();
    markUnlocked(true);
    closeAccess();
    renderSettingsIfOpen();
}

async function submitLogin(event) {
    event.preventDefault();
    const password = document.getElementById('access-pass').value;
    if (await checkPassword(password)) {
        markUnlocked(true);
        closeAccess();
    } else {
        accessFail('Esa no es la contraseña.');
    }
}

async function submitChange(event) {
    event.preventDefault();
    const current = document.getElementById('access-current').value;
    const password = document.getElementById('access-pass').value;
    const repeat = document.getElementById('access-pass2').value;
    if (!(await checkPassword(current))) return accessFail('La contraseña actual no es esa.');
    if (password.length < 4) return accessFail('La nueva contraseña necesita al menos 4 caracteres.');
    if (password !== repeat) return accessFail('Las contraseñas nuevas no coinciden.');
    await setPassword(accessState().username, password);
    saveState();
    accessMode = 'changed';
    accessMessage = '';
    renderAccess();
}

function useWithoutAccount() {
    const a = accessState();
    a.method = 'none';
    delete a.salt;
    delete a.hash;
    delete a.apple;
    saveState();
    markUnlocked(true);
    closeAccess();
    renderSettingsIfOpen();
}

function removeAccess() {
    if (!confirm('La app ya no te pedirá usuario para entrar. ¿Seguro?')) return;
    useWithoutAccount();
}

function forgotPassword() {
    accessMode = 'forgot';
    accessMessage = '';
    renderAccess();
}

function startOver() {
    if (!confirm('Se borra todo lo que guardaste en esta app en este dispositivo. No se puede deshacer. ¿Empezar de nuevo?')) return;
    try {
        localStorage.removeItem(STORAGE_KEY);
        nativePlugin('Preferences')?.remove({ key: STORAGE_KEY });
    } catch (e) {
        // Si algo falla, recargar igual muestra lo que quedó
    }
    markUnlocked(false);
    location.reload();
}

// --- Apple ---
// Solo en la app de iPhone. Se pide sin correo ni nombre: Apple devuelve un id fijo para esta app y este usuario,
// y aquí se guarda su huella para reconocerte la próxima vez.

async function appleUserHash() {
    const SignInWithApple = nativePlugin('SignInWithApple');
    if (!SignInWithApple) {
        accessFail('Entrar con Apple funciona en la app para iPhone. Aquí usa usuario y contraseña.');
        return null;
    }
    try {
        const result = await SignInWithApple.authorize({
            clientId: 'com.seradulto.app',
            redirectURI: 'https://ser-adulto.up.railway.app',
            scopes: ''
        });
        const id = result?.response?.user;
        if (!id) throw new Error('sin id');
        return await sha256(id);
    } catch (e) {
        accessFail('No se completó la entrada con Apple. Intenta otra vez.');
        return null;
    }
}

async function continueWithApple() {
    const hash = await appleUserHash();
    if (!hash) return;
    const a = accessState();
    if (a.method === 'apple' && a.apple !== hash) return accessFail('Ese no es el Apple ID con el que entraste antes.');
    if (a.method !== 'apple') {
        a.method = 'apple';
        a.apple = hash;
        delete a.salt;
        delete a.hash;
        saveState();
    }
    markUnlocked(true);
    closeAccess();
    renderSettingsIfOpen();
}

function renderSettingsIfOpen() {
    if (typeof currentPage !== 'undefined' && currentPage === 'settings') navigate('settings');
}

// --- Pantalla ---

const ACCESS_PRIVACY = `
    <div class="flex items-start gap-3 p-4 bg-surface-1 border border-line rounded-2xl">
        <i data-lucide="smartphone" class="w-5 h-5 text-accent flex-shrink-0 mt-0.5" aria-hidden="true"></i>
        <p class="text-sm text-ink-soft">Todo se queda en este dispositivo. No hay nube ni servidor: tu usuario, tu contraseña y lo que anotes no se suben a ningún lado y no guardamos nada tuyo.</p>
    </div>`;

function accessField(id, label, type, autocomplete) {
    return `
        <label for="${id}" class="block">
            <span class="block font-bold text-ink mb-1">${label}</span>
            <input id="${id}" type="${type}" autocomplete="${autocomplete}" ${type === 'text' ? 'autocapitalize="none" spellcheck="false" maxlength="40"' : ''} class="w-full px-4 py-3 border border-edge rounded-xl bg-card text-ink">
        </label>`;
}

function appleButton(label) {
    return `
        <button type="button" onclick="continueWithApple()" class="w-full py-3 bg-black text-white rounded-xl text-lg font-bold flex items-center justify-center gap-2">
            <svg viewBox="0 0 24 24" class="w-5 h-5" fill="currentColor" aria-hidden="true"><path d="M16.37 12.6c-.02-2.2 1.8-3.26 1.88-3.31-1.03-1.5-2.62-1.7-3.18-1.73-1.35-.14-2.64.8-3.33.8-.69 0-1.74-.78-2.87-.76-1.47.02-2.83.86-3.59 2.18-1.53 2.66-.39 6.6 1.1 8.76.73 1.06 1.6 2.24 2.73 2.2 1.1-.05 1.51-.71 2.84-.71 1.32 0 1.7.71 2.86.69 1.18-.02 1.93-1.07 2.65-2.13.84-1.22 1.18-2.41 1.2-2.47-.03-.01-2.3-.88-2.33-3.5zM14.2 6.13c.6-.73 1.01-1.75.9-2.76-.87.04-1.92.58-2.54 1.31-.56.64-1.05 1.67-.92 2.66.97.08 1.96-.49 2.56-1.21z"/></svg>
            ${label}
        </button>`;
}

function renderAccess() {
    const screen = document.getElementById('access-screen');
    if (!screen) return;
    const a = accessState();
    const name = a.username || profileState().name;
    const message = `<p class="text-sm font-bold text-attention min-h-[1.25rem]" role="alert">${escapeHtml(accessMessage)}</p>`;
    let body = '';

    if (accessMode === 'create') {
        body = `
            <div class="space-y-2">
                ${a.method === 'none' ? '<button type="button" onclick="closeAccess()" class="float-right p-2 text-ink-faint" aria-label="Cerrar"><i data-lucide="x" class="w-5 h-5" aria-hidden="true"></i></button>' : ''}
                <h1 class="text-2xl font-extrabold text-ink">Modo Adulto</h1>
                <p class="text-ink-soft">Crea un usuario para entrar a la app.</p>
            </div>
            <form onsubmit="submitCreate(event)" class="space-y-4">
                ${accessField('access-user', 'Nombre de usuario', 'text', 'username')}
                ${accessField('access-pass', 'Contraseña', 'password', 'new-password')}
                ${accessField('access-pass2', 'Repite la contraseña', 'password', 'new-password')}
                ${message}
                <button type="submit" class="w-full py-3 bg-accent-fill text-white rounded-xl text-lg font-bold">Crear y entrar</button>
            </form>
            <div class="flex items-center gap-3 text-sm text-ink-faint"><span class="flex-1 border-t border-line"></span>o<span class="flex-1 border-t border-line"></span></div>
            ${appleButton('Continuar con Apple')}
            ${ACCESS_PRIVACY}
            <p class="text-sm text-ink-faint">Si olvidas tu contraseña no la podemos recuperar, porque no la tenemos.</p>
            <button type="button" onclick="useWithoutAccount()" class="w-full text-sm font-bold text-ink-faint py-2">Usar sin usuario</button>`;
    } else if (accessMode === 'login') {
        body = `
            <div class="flex flex-col items-center text-center gap-3">
                ${profileFigureSvg(profileState().figureSeed, 72)}
                <h1 class="text-2xl font-extrabold text-ink">${name ? `Hola, ${escapeHtml(name)}` : 'Hola'}</h1>
            </div>
            ${a.method === 'apple' ? `
                ${message}
                ${appleButton('Entrar con Apple')}` : `
                <form onsubmit="submitLogin(event)" class="space-y-4">
                    <input type="text" autocomplete="username" value="${escapeHtml(a.username)}" class="hidden" aria-hidden="true" tabindex="-1">
                    ${accessField('access-pass', 'Contraseña', 'password', 'current-password')}
                    ${message}
                    <button type="submit" class="w-full py-3 bg-accent-fill text-white rounded-xl text-lg font-bold">Entrar</button>
                </form>
                <button type="button" onclick="forgotPassword()" class="w-full text-sm font-bold text-ink-faint py-2">Olvidé mi contraseña</button>`}
            ${ACCESS_PRIVACY}`;
    } else if (accessMode === 'change') {
        body = `
            <div class="flex items-start justify-between gap-3">
                <h1 class="text-2xl font-extrabold text-ink">Cambiar contraseña</h1>
                <button type="button" onclick="closeAccess()" class="p-2 text-ink-faint" aria-label="Cerrar"><i data-lucide="x" class="w-5 h-5" aria-hidden="true"></i></button>
            </div>
            <form onsubmit="submitChange(event)" class="space-y-4">
                ${accessField('access-current', 'Contraseña actual', 'password', 'current-password')}
                ${accessField('access-pass', 'Nueva contraseña', 'password', 'new-password')}
                ${accessField('access-pass2', 'Repite la nueva', 'password', 'new-password')}
                ${message}
                <button type="submit" class="w-full py-3 bg-accent-fill text-white rounded-xl text-lg font-bold">Guardar</button>
            </form>`;
    } else if (accessMode === 'changed') {
        body = `
            <h1 class="text-2xl font-extrabold text-ink">Listo</h1>
            <p class="text-ink-soft">Cambiaste tu contraseña. La próxima vez entra con la nueva.</p>
            <button type="button" onclick="closeAccess()" class="w-full py-3 bg-accent-fill text-white rounded-xl text-lg font-bold">Volver</button>`;
    } else if (accessMode === 'forgot') {
        body = `
            <h1 class="text-2xl font-extrabold text-ink">Olvidé mi contraseña</h1>
            <p class="text-ink-soft">Tu contraseña no está en ningún servidor, así que nadie la puede recuperar ni cambiar por ti.</p>
            <p class="text-ink-soft">Intenta otra vez con calma, o empieza de nuevo: se borra lo que guardaste en esta app y creas otro usuario.</p>
            <button type="button" onclick="openAccess('login')" class="w-full py-3 bg-accent-fill text-white rounded-xl text-lg font-bold">Intentar otra vez</button>
            <button type="button" onclick="startOver()" class="w-full py-3 bg-surface-2 text-ink rounded-xl font-bold">Borrar todo y empezar de nuevo</button>`;
    }

    screen.innerHTML = `
        <div class="min-h-full flex items-center justify-center px-4 py-10">
            <div class="w-full max-w-sm space-y-6">${body}</div>
        </div>`;
    lucide.createIcons();
}

// Sección de Ajustes
function renderAccessSettings() {
    const a = accessState();
    const row = (onclick, icon, text) => `<button type="button" onclick="${onclick}" class="px-4 py-2 bg-surface-2 rounded-xl text-sm font-bold text-ink-soft flex items-center gap-2"><i data-lucide="${icon}" class="w-4 h-4" aria-hidden="true"></i>${text}</button>`;
    const status = a.method === 'password' ? `Entras con tu usuario <strong>${escapeHtml(a.username)}</strong> y contraseña.`
        : a.method === 'apple' ? 'Entras con Apple.'
        : 'La app no pide usuario para entrar.';
    const actions = a.method === 'password' ? row('lockApp()', 'lock', 'Cerrar sesión') + row("openAccess('change')", 'key-round', 'Cambiar contraseña') + row('removeAccess()', 'lock-open', 'Ya no pedir usuario')
        : a.method === 'apple' ? row('lockApp()', 'lock', 'Cerrar sesión') + row('removeAccess()', 'lock-open', 'Ya no pedir usuario')
        : row("openAccess('create')", 'user-round', 'Crear usuario');
    return `
        <div class="p-4 bg-surface-1 border border-line rounded-2xl space-y-3">
            <h3 class="font-bold text-base text-ink">Entrada a la app</h3>
            <p class="text-ink-soft">${status} Todo se queda en este dispositivo; no hay nube.</p>
            <div class="flex flex-wrap gap-2">${actions}</div>
        </div>`;
}
