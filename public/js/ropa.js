// --- QUÉ ME PONGO: OUTFIT POR CAPAS ---
// Las prendas viven en data/prendas.json (formato en docs/biblioteca-formato.md).
// Con el pronóstico de hoy (de 7:00 a 21:00) y la ocasión, se arma un outfit por capas.
// Se evita repetir lo de los últimos días; "Mi clóset" limita a lo que la persona tiene.

const OCCASIONS = { casual: 'Casual', trabajo: 'Trabajo', formal: 'Formal', noche: 'Salir de noche', ejercicio: 'Ejercicio' };
const LAYER_INFO = {
    base: { label: 'Arriba', icon: 'shirt' },
    media: { label: 'Capa media', icon: 'layers' },
    exterior: { label: 'Por encima', icon: 'cloud-rain-wind' },
    abajo: { label: 'Abajo', icon: 'rectangle-vertical' },
    calzado: { label: 'Calzado', icon: 'footprints' },
    accesorio: { label: 'Llévate', icon: 'briefcase' }
};
const MANUAL_WEATHER = {
    frio: { label: 'Frío (menos de 12 °C)', min: 4, max: 12 },
    fresco: { label: 'Fresco (12 a 18 °C)', min: 11, max: 18 },
    templado: { label: 'Templado (18 a 24 °C)', min: 15, max: 24 },
    calor: { label: 'Calor (24 a 30 °C)', min: 20, max: 30 },
    'mucho-calor': { label: 'Mucho calor (más de 30 °C)', min: 25, max: 35 }
};

let todayWeather = null;    // { min, max, minHour, maxHour, rain, rainHour, wind, uv, label, icon, manual }
let currentOutfit = null;   // { base, media, exterior, abajo, calzado, accesorios: [] }
let outfitView = 'outfit';  // 'outfit' | 'closet'

function outfitState() {
    state.outfit = state.outfit || {};
    const o = state.outfit;
    o.occasion = o.occasion || 'casual';
    o.closet = o.closet || [];
    o.onlyCloset = !!o.onlyCloset;
    o.history = o.history || [];
    return o;
}

// --- Clima ---

async function fetchHourlyWeather(lat, lon) {
    const url = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}`
        + '&hourly=temperature_2m,apparent_temperature,precipitation_probability,wind_speed_10m,uv_index'
        + '&current=temperature_2m,weather_code&timezone=auto&forecast_days=1';
    const data = await (await fetch(url)).json();
    const h = data.hourly;
    // Solo las horas en que normalmente se está fuera de casa
    const idx = h.time.map((t, i) => [Number(t.slice(11, 13)), i]).filter(([hour]) => hour >= 7 && hour <= 21).map(([, i]) => i);
    const at = (arr, i) => arr[i] ?? 0;
    const feels = idx.map((i) => at(h.apparent_temperature, i));
    const minI = idx[feels.indexOf(Math.min(...feels))];
    const maxI = idx[feels.indexOf(Math.max(...feels))];
    const rains = idx.map((i) => at(h.precipitation_probability, i));
    const rainI = idx[rains.indexOf(Math.max(...rains))];
    const weather = describeWeather(data.current.weather_code);
    return {
        now: Math.round(data.current.temperature_2m),
        min: Math.round(Math.min(...feels)),
        max: Math.round(Math.max(...feels)),
        minHour: h.time[minI].slice(11, 16),
        maxHour: h.time[maxI].slice(11, 16),
        rain: Math.max(...rains),
        rainHour: h.time[rainI].slice(11, 16),
        wind: Math.round(Math.max(...idx.map((i) => at(h.wind_speed_10m, i)))),
        uv: Math.round(Math.max(...idx.map((i) => at(h.uv_index, i)))),
        label: weather.label,
        icon: weather.icon,
        manual: false
    };
}

function useManualWeather(key, rainy) {
    const m = MANUAL_WEATHER[key];
    todayWeather = { min: m.min, max: m.max, rain: rainy ? 70 : 0, wind: 0, uv: m.max >= 24 ? 7 : 3, label: m.label, icon: rainy ? 'cloud-rain' : 'cloud-sun', manual: true, manualKey: key };
    currentOutfit = buildOutfit();
    renderOutfitRoot();
}

function toggleManualRain() {
    if (!todayWeather || !todayWeather.manual) return;
    useManualWeather(todayWeather.manualKey, todayWeather.rain === 0);
}

function requestOutfitWeather() {
    setOutfitStatus('Buscando tu ubicación…');
    if (!navigator.geolocation) {
        setOutfitStatus('Este navegador no permite usar la ubicación. Elige cómo está el clima abajo.');
        return;
    }
    navigator.geolocation.getCurrentPosition(async (pos) => {
        setOutfitStatus('Consultando el pronóstico de hoy…');
        try {
            todayWeather = await fetchHourlyWeather(pos.coords.latitude.toFixed(2), pos.coords.longitude.toFixed(2));
            currentOutfit = buildOutfit();
            renderOutfitRoot();
        } catch (e) {
            setOutfitStatus('No se pudo consultar el clima. Elige cómo está el clima abajo, o inténtalo otra vez.');
        }
    }, () => {
        setOutfitStatus('Sin permiso de ubicación. Elige cómo está el clima abajo.');
    });
}

function setOutfitStatus(message) {
    const el = document.getElementById('outfit-status');
    if (el) el.textContent = message;
}

// --- Armar el outfit ---

function fitsTemp(item, temp) {
    return item.temp_min <= temp && item.temp_max >= temp;
}

function recentlyWorn() {
    return new Set(outfitState().history.slice(0, 3).flatMap((h) => h.ids));
}

// Elige una prenda: primero lo que la persona tiene y no ha usado estos días; si no hay, va soltando condiciones
function choose(items, filters, avoid) {
    const o = outfitState();
    const worn = recentlyWorn();
    const byOccasion = items.filter((i) => i.ocasiones.includes(o.occasion));
    const pools = [byOccasion, items];
    for (const pool of pools) {
        let candidates = pool.filter(filters);
        if (o.onlyCloset && o.closet.length) {
            const owned = candidates.filter((i) => o.closet.includes(i.id));
            if (owned.length) candidates = owned;
        }
        if (!candidates.length) continue;
        const fresh = candidates.filter((i) => !worn.has(i.id) && !avoid.has(i.id));
        const notSame = candidates.filter((i) => !avoid.has(i.id));
        return pickRandom(fresh.length ? fresh : notSame.length ? notSame : candidates);
    }
    return null;
}

function buildOutfit(previous) {
    const items = PRENDAS || [];
    const w = todayWeather;
    if (!items.length || !w) return null;
    const avoid = new Set(previous ? Object.values(previous).flat().filter(Boolean).map((i) => i.id) : []);
    const byLayer = (layer) => items.filter((i) => i.capa === layer);
    const mid = Math.round((w.min + w.max) / 2);
    const rainy = w.rain >= 40;
    const windy = w.wind >= 30;
    const swing = w.max - w.min;

    const outfit = { accesorios: [] };
    outfit.base = choose(byLayer('base'), (i) => fitsTemp(i, w.max) && (!i.completo || !rainy || w.min >= 16), avoid);
    if (!outfit.base || !outfit.base.completo) {
        outfit.abajo = choose(byLayer('abajo'), (i) => fitsTemp(i, mid), avoid);
    }
    // Capa media cuando la parte fría del día no se aguanta solo con la base
    if (w.min < 20 && (w.min < w.max - 4 || w.min < 16)) {
        outfit.media = choose(byLayer('media'), (i) => fitsTemp(i, w.min), avoid);
    }
    if (w.min < 13 || rainy || windy) {
        outfit.exterior = choose(byLayer('exterior'), (i) =>
            (w.min < 13 ? fitsTemp(i, w.min) : true) && (!rainy || i.lluvia) && (!windy || rainy || i.viento), avoid)
            || (rainy ? null : choose(byLayer('exterior'), (i) => fitsTemp(i, w.min), avoid));
    }
    // Con lluvia, primero calzado que aguante agua; si no hay para la ocasión, al menos nada abierto
    const occasion = outfitState().occasion;
    outfit.calzado = (rainy && choose(byLayer('calzado'), (i) => i.lluvia && i.ocasiones.includes(occasion) && fitsTemp(i, mid), avoid))
        || choose(byLayer('calzado'), (i) => fitsTemp(i, mid) && (!rainy || !/sandalia|huarache|chancla|flat/i.test(i.nombre)), avoid);

    const acc = byLayer('accesorio');
    const add = (filter) => {
        const pick = choose(acc, (i) => filter(i) && !outfit.accesorios.includes(i), new Set());
        if (pick) outfit.accesorios.push(pick);
    };
    if (rainy && !(outfit.exterior && outfit.exterior.lluvia)) add((i) => i.lluvia);
    if (w.uv >= 6) add((i) => i.sol && !i.lluvia && !/bloqueador/i.test(i.nombre));
    if (w.uv >= 3 && w.max >= 22) add((i) => /bloqueador/i.test(i.nombre));
    if (w.min < 8) add((i) => !i.sol && !i.lluvia && i.temp_max <= 14);
    if (w.max >= 30) add((i) => /botella/i.test(i.nombre));

    outfit.why = outfitReasons(w, swing, rainy, windy);
    return outfit;
}

function outfitReasons(w, swing, rainy, windy) {
    const reasons = [];
    if (!w.manual) {
        reasons.push(`Hoy se siente desde ${w.min} °C (${w.minHour}) hasta ${w.max} °C (${w.maxHour}).`);
    }
    if (swing >= 8) reasons.push('Cambia bastante durante el día: la capa media o la de encima se quitan cuando sube la temperatura.');
    if (rainy) reasons.push(w.manual ? 'Puede llover.' : `Probabilidad de lluvia de ${w.rain} % alrededor de las ${w.rainHour}.`);
    if (windy) reasons.push(`Habrá viento (hasta ${w.wind} km/h).`);
    if (w.uv >= 6 && !w.manual) reasons.push(`Sol fuerte (índice UV ${w.uv}).`);
    return reasons;
}

function anotherOutfit() {
    currentOutfit = buildOutfit(currentOutfit);
    renderOutfitRoot();
}

function wearOutfit() {
    if (!currentOutfit) return;
    const o = outfitState();
    const ids = ['base', 'media', 'exterior', 'abajo', 'calzado'].map((k) => currentOutfit[k]?.id).filter(Boolean);
    const today = new Date().toISOString().slice(0, 10);
    o.history = [{ date: today, ids }, ...o.history.filter((h) => h.date !== today)].slice(0, 14);
    saveState();
    const status = document.getElementById('outfit-wear-status');
    if (status) status.textContent = 'Listo. Mañana te sugerimos otra cosa.';
}

function setOccasion(key) {
    outfitState().occasion = key;
    saveState();
    currentOutfit = buildOutfit();
    renderOutfitRoot();
}

// --- Vistas ---

let PRENDAS = null;

function renderOutfitSection() {
    if (!PRENDAS) {
        loadData('prendas').then((data) => {
            PRENDAS = data || [];
            // Si el clima llegó antes que las prendas, el outfit se arma ahora
            if (todayWeather && !currentOutfit) currentOutfit = buildOutfit();
            renderOutfitRoot();
        });
    }
    return `<div id="outfit-root">${PRENDAS ? renderOutfitView() : '<p class="text-ink-faint">Cargando…</p>'}</div>`;
}

function renderOutfitRoot() {
    const root = document.getElementById('outfit-root');
    if (!root) return;
    root.innerHTML = renderOutfitView();
    lucide.createIcons();
}

function chip(onclick, active, label) {
    return `<button type="button" onclick="${onclick}" aria-pressed="${active}" class="px-4 rounded-full border text-sm font-semibold ${active ? 'bg-accent-fill text-white border-transparent' : 'bg-card text-ink-soft border-edge'}">${label}</button>`;
}

function renderOutfitView() {
    if (!PRENDAS || !PRENDAS.length) return '<p class="text-ink-soft">No se pudieron cargar las prendas. Revisa tu conexión e inténtalo otra vez.</p>';
    if (outfitView === 'closet') return renderClosetEditor();
    const o = outfitState();
    const w = todayWeather;

    const weatherHtml = w ? `
        <div class="flex items-start gap-4">
            <span class="w-12 h-12 rounded-2xl bg-accent-soft text-accent flex items-center justify-center flex-shrink-0"><i data-lucide="${w.icon}" class="w-6 h-6" aria-hidden="true"></i></span>
            <div>
                <p class="text-lg font-bold text-ink">${w.manual ? escapeHtml(w.label) : `${w.now} °C · ${escapeHtml(w.label)}`}</p>
                ${(currentOutfit?.why || []).map((r) => `<p class="text-ink-soft">${escapeHtml(r)}</p>`).join('')}
            </div>
        </div>` : `
        <div class="space-y-3">
            <p class="text-ink-soft">Con tu ubicación vemos el pronóstico de todo el día, no solo de ahorita. No se guarda.</p>
            <button type="button" onclick="requestOutfitWeather()" class="px-5 bg-accent-fill text-white rounded-xl font-bold">Usar mi ubicación</button>
        </div>`;

    const manualHtml = `
        <details class="group" ${w ? '' : 'open'}>
            <summary class="cursor-pointer font-bold text-ink-soft gap-2 [&::-webkit-details-marker]:hidden"><i data-lucide="thermometer" class="w-4 h-4" aria-hidden="true"></i>${w ? 'Cambiar el clima a mano' : 'O elige cómo está el clima'}</summary>
            <div class="flex flex-wrap gap-2 pt-3">
                ${Object.entries(MANUAL_WEATHER).map(([k, m]) => chip(`useManualWeather('${k}', ${w && w.manual ? w.rain > 0 : false})`, w && w.manual && w.manualKey === k, m.label)).join('')}
                ${w && w.manual ? chip('toggleManualRain()', w.rain > 0, 'Puede llover') : ''}
            </div>
            ${w && w.manual ? '<button type="button" onclick="requestOutfitWeather()" class="mt-3 px-4 bg-card border border-edge rounded-xl text-sm font-bold">Usar mi ubicación</button>' : ''}
        </details>`;

    const occasionHtml = `
        <div class="space-y-2">
            <p class="text-sm font-bold text-ink-faint">Para</p>
            <div class="flex flex-wrap gap-2">${Object.entries(OCCASIONS).map(([k, label]) => chip(`setOccasion('${k}')`, o.occasion === k, label)).join('')}</div>
        </div>`;

    let outfitHtml = '';
    if (w && currentOutfit) {
        const rows = ['base', 'media', 'exterior', 'abajo', 'calzado']
            .filter((k) => currentOutfit[k])
            .map((k) => outfitRow(LAYER_INFO[k], currentOutfit[k].completo ? 'Arriba y abajo' : null, currentOutfit[k]));
        if (currentOutfit.accesorios.length) {
            rows.push(outfitRow(LAYER_INFO.accesorio, null, { nombre: currentOutfit.accesorios.map((a) => a.nombre).join(', '), nota: '' }));
        }
        outfitHtml = `
            <div class="p-5 bg-surface-1 border border-line rounded-2xl space-y-1">
                ${rows.join('')}
            </div>
            <div class="flex flex-wrap gap-2">
                <button type="button" onclick="anotherOutfit()" class="px-5 bg-card border border-edge rounded-xl font-bold flex items-center gap-2"><i data-lucide="shuffle" class="w-4 h-4" aria-hidden="true"></i>Otra combinación</button>
                <button type="button" onclick="wearOutfit()" class="px-5 bg-accent-fill text-white rounded-xl font-bold">Me pongo esto</button>
            </div>
            <p id="outfit-wear-status" class="text-sm text-ink-soft" role="status" aria-live="polite"></p>`;
    }

    return `
        <div class="space-y-5">
            ${weatherHtml}
            <p id="outfit-status" class="text-ink-soft" role="status" aria-live="polite"></p>
            ${w ? occasionHtml + outfitHtml + manualHtml : manualHtml + occasionHtml}
            <div class="flex flex-wrap items-center gap-3 pt-1">
                <label class="flex items-center gap-3 font-semibold text-ink-soft">
                    <input type="checkbox" ${o.onlyCloset ? 'checked' : ''} ${o.closet.length ? '' : 'disabled'} onchange="toggleOnlyCloset()">
                    Solo lo que tengo
                </label>
                <button type="button" onclick="openCloset()" class="px-4 bg-card border border-edge rounded-xl text-sm font-bold">${o.closet.length ? `Mi clóset (${o.closet.length})` : 'Marcar lo que tengo'}</button>
            </div>
        </div>`;
}

function outfitRow(info, labelOverride, item) {
    return `
        <div class="flex items-start gap-3 py-2 border-b border-line last:border-0">
            <i data-lucide="${info.icon}" class="w-5 h-5 text-ink-faint mt-0.5 flex-shrink-0" aria-hidden="true"></i>
            <div>
                <p class="text-sm font-bold text-ink-faint">${labelOverride || info.label}</p>
                <p class="font-semibold text-ink">${escapeHtml(item.nombre)}</p>
                ${item.nota ? `<p class="text-sm text-ink-faint">${escapeHtml(item.nota)}</p>` : ''}
            </div>
        </div>`;
}

function renderClosetEditor() {
    const closet = outfitState().closet;
    const layers = ['base', 'media', 'exterior', 'abajo', 'calzado', 'accesorio'];
    return `
        <div class="space-y-5">
            <button type="button" onclick="closeCloset()" class="flex items-center gap-2 px-4 bg-surface-2 rounded-xl text-sm font-bold text-ink-soft"><i data-lucide="arrow-left" class="w-4 h-4" aria-hidden="true"></i>Listo</button>
            <div>
                <h4 class="text-lg font-bold text-ink">Mi clóset</h4>
                <p class="text-ink-soft">Marca lo que tienes. Con "Solo lo que tengo" las sugerencias usan esas prendas cuando sirven para el clima.</p>
            </div>
            ${layers.map((layer) => `
                <fieldset class="space-y-2">
                    <legend class="text-sm font-bold text-ink-faint pb-1">${layer === 'base' ? 'Arriba' : LAYER_INFO[layer].label}</legend>
                    <div class="flex flex-wrap gap-2">
                        ${PRENDAS.filter((i) => i.capa === layer).map((i) => chip(`toggleClosetItem('${i.id}')`, closet.includes(i.id), escapeHtml(i.nombre))).join('')}
                    </div>
                </fieldset>`).join('')}
        </div>`;
}

function openCloset() { outfitView = 'closet'; renderOutfitRoot(); }
function closeCloset() { outfitView = 'outfit'; currentOutfit = todayWeather ? buildOutfit() : null; renderOutfitRoot(); }

function toggleClosetItem(id) {
    const o = outfitState();
    o.closet = o.closet.includes(id) ? o.closet.filter((x) => x !== id) : [...o.closet, id];
    if (!o.closet.length) o.onlyCloset = false;
    saveState();
    renderOutfitRoot();
}

function toggleOnlyCloset() {
    const o = outfitState();
    o.onlyCloset = !o.onlyCloset;
    saveState();
    currentOutfit = buildOutfit();
    renderOutfitRoot();
}
