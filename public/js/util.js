// --- UTILIDADES COMPARTIDAS por recetas, ropa y biblioteca ---

function escapeHtml(text) {
    return String(text ?? '').replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
}

// Sin acentos ni mayúsculas, para que "jitomate" encuentre "Jitomate" y "champinon" encuentre "champiñón"
function normalizeText(text) {
    return String(text).toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '');
}

// Carga un archivo de public/data una sola vez y lo guarda en memoria
const dataCache = {};
function loadData(name) {
    if (!dataCache[name]) {
        dataCache[name] = fetch(`data/${name}.json`)
            .then((r) => r.json())
            .catch(() => { delete dataCache[name]; return null; });
    }
    return dataCache[name];
}

function pickRandom(items) {
    return items[Math.floor(Math.random() * items.length)];
}
