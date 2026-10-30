// --- CAPA NATIVA ---
// La misma app corre en el navegador (Railway) y dentro de la app de iOS/Android (Capacitor).
// Aquí se decide qué usar en cada caso; el resto del código llama a estas funciones y no necesita saberlo.
// En la app nativa los plugins se usan por Capacitor.Plugins (no hay empaquetador de JS).

function isNativeApp() {
    return !!(window.Capacitor && window.Capacitor.isNativePlatform && window.Capacitor.isNativePlatform());
}

function nativePlugin(name) {
    return isNativeApp() ? window.Capacitor.Plugins[name] : null;
}

// --- Datos ---
// localStorage sigue siendo la copia rápida que la app lee al arrancar. En la app nativa además se guarda
// en Preferences, porque iOS puede borrar el almacenamiento del WebView si el teléfono se queda sin espacio.

const STORAGE_KEY = 'modo_adulto_combined_state_v2';
let nativeSaveTimer = null;

function persistNative(json) {
    const Preferences = nativePlugin('Preferences');
    if (!Preferences) return;
    clearTimeout(nativeSaveTimer);
    nativeSaveTimer = setTimeout(() => {
        Preferences.set({ key: STORAGE_KEY, value: json }).catch(() => {});
    }, 300);
}

// Si el WebView perdió los datos pero Preferences los tiene, se restauran y se recarga una vez
async function restoreNativeData() {
    const Preferences = nativePlugin('Preferences');
    if (!Preferences) return;
    try {
        const { value } = await Preferences.get({ key: STORAGE_KEY });
        const local = localStorage.getItem(STORAGE_KEY);
        if (value && !local) {
            localStorage.setItem(STORAGE_KEY, value);
            location.reload();
        } else if (local && !value) {
            await Preferences.set({ key: STORAGE_KEY, value: local });
        }
    } catch (e) {
        // Sin Preferences la app sigue funcionando con localStorage
    }
}

// --- Ubicación ---
// Devuelve { latitude, longitude } o lanza un error con code 'denied' | 'unavailable'

async function getCurrentLocation() {
    const Geolocation = nativePlugin('Geolocation');
    if (Geolocation) {
        try {
            let perm = await Geolocation.checkPermissions();
            if (perm.location !== 'granted' && perm.coarseLocation !== 'granted') {
                perm = await Geolocation.requestPermissions({ permissions: ['coarseLocation'] });
            }
            if (perm.location !== 'granted' && perm.coarseLocation !== 'granted') throw { code: 'denied' };
            const pos = await Geolocation.getCurrentPosition({ enableHighAccuracy: false, timeout: 15000 });
            return pos.coords;
        } catch (e) {
            throw { code: e && e.code === 'denied' ? 'denied' : 'unavailable' };
        }
    }
    if (!navigator.geolocation) throw { code: 'unavailable' };
    return new Promise((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(
            (pos) => resolve(pos.coords),
            (err) => reject({ code: err && err.code === 1 ? 'denied' : 'unavailable' }),
            { enableHighAccuracy: false, timeout: 15000 }
        );
    });
}

// true si ya hay permiso y se puede pedir la ubicación sin mostrar un diálogo
async function hasLocationPermission() {
    const Geolocation = nativePlugin('Geolocation');
    try {
        if (Geolocation) {
            const perm = await Geolocation.checkPermissions();
            return perm.location === 'granted' || perm.coarseLocation === 'granted';
        }
        if (navigator.permissions) {
            const p = await navigator.permissions.query({ name: 'geolocation' });
            return p.state === 'granted';
        }
    } catch (e) {
        return false;
    }
    return false;
}

// --- Compartir texto ---
// Devuelve 'shared' | 'copied' | 'cancelled'; lanza si no se pudo ni compartir ni copiar

async function shareText(text) {
    const Share = nativePlugin('Share');
    try {
        if (Share) {
            await Share.share({ text });
            return 'shared';
        }
        if (navigator.share) {
            await navigator.share({ text });
            return 'shared';
        }
    } catch (e) {
        const msg = String((e && (e.message || e.name)) || '');
        if (/cancel|abort/i.test(msg)) return 'cancelled';
    }
    await navigator.clipboard.writeText(text);
    return 'copied';
}

// --- Guardar un archivo (respaldo) ---
// En el navegador se descarga; en la app se guarda en caché y se abre el menú de compartir
// para mandarlo a Archivos, Drive, correo, etc.

async function saveTextFile(filename, text) {
    const Filesystem = nativePlugin('Filesystem');
    const Share = nativePlugin('Share');
    if (Filesystem && Share) {
        const { uri } = await Filesystem.writeFile({ path: filename, data: text, directory: 'CACHE', encoding: 'utf8' });
        try {
            await Share.share({ title: filename, files: [uri] });
        } catch (e) {
            const msg = String((e && (e.message || e.name)) || '');
            if (!/cancel|abort/i.test(msg)) throw e;
            return 'cancelled';
        }
        return 'shared';
    }
    const blob = new Blob([text], { type: 'application/json' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    link.remove();
    URL.revokeObjectURL(link.href);
    return 'downloaded';
}

// --- Avisos programados ---
// En la app nativa llegan aunque la app esté cerrada o la pantalla apagada; en el navegador no hacen nada.

async function scheduleNotice(id, at, title, body) {
    const LocalNotifications = nativePlugin('LocalNotifications');
    if (!LocalNotifications) return;
    try {
        let perm = await LocalNotifications.checkPermissions();
        if (perm.display !== 'granted') perm = await LocalNotifications.requestPermissions();
        if (perm.display !== 'granted') return;
        await LocalNotifications.schedule({
            notifications: [{ id, title, body, schedule: { at: new Date(at), allowWhileIdle: true } }]
        });
    } catch (e) {
        // Si no hay permiso o falla, lo de la pantalla sigue funcionando
    }
}

async function cancelNotice(id) {
    const LocalNotifications = nativePlugin('LocalNotifications');
    if (!LocalNotifications) return;
    try {
        await LocalNotifications.cancel({ notifications: [{ id }] });
    } catch (e) {
        // Nada que cancelar
    }
}

// Temporizador de cocina: un solo aviso a la vez
const TIMER_NOTIFICATION_ID = 4101;

function scheduleTimerNotice(endsAt, title, body) {
    return scheduleNotice(TIMER_NOTIFICATION_ID, endsAt, title, body);
}

function cancelTimerNotice() {
    return cancelNotice(TIMER_NOTIFICATION_ID);
}
