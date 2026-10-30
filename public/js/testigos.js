// --- TESTIGOS DEL TABLERO ---
// Las luces que se encienden en el tablero, dibujadas como se ven y con qué hacer.
// Se encuentran por color, por nombre o por cómo se ven ("lámpara", "herradura", "olas").
// Redactado con IA y sin revisar con mecánico: ver docs/revision-contenido.md.

const LIGHT_COLORS = {
    rojo: { label: 'Rojo', hex: '#F2555A', words: 'rojo roja' },
    ambar: { label: 'Ámbar', hex: '#F5A524', words: 'ambar amarillo amarilla naranja anaranjada' },
    verde: { label: 'Verde', hex: '#45C46F', words: 'verde' },
    azul: { label: 'Azul', hex: '#4D96FF', words: 'azul' }
};

const LIGHT_URGENCY = {
    detente: { label: 'Detente en cuanto sea seguro', icon: 'octagon-alert' },
    pronto: { label: 'Llévalo a revisar pronto', icon: 'wrench' },
    aviso: { label: 'Atiéndelo, no es una falla', icon: 'info' },
    info: { label: 'Solo te avisa que algo está encendido', icon: 'info' }
};

// Dibujos en una cuadrícula de 24 × 24, con trazo; la letra va como texto
const BRACKETS = '<path d="M5 6.5a8 8 0 0 0 0 11M19 6.5a8 8 0 0 1 0 11"/><circle cx="12" cy="12" r="5.5"/>';
const lightText = (t, size) => `<text x="12" y="${12 + size * 0.36}" text-anchor="middle" font-size="${size}" font-weight="700" fill="currentColor" stroke="none" font-family="Arial, sans-serif">${t}</text>`;

const WARNING_LIGHTS = [
    {
        id: 'aceite', nombre: 'Presión de aceite', color: 'rojo', urgencia: 'detente',
        parece: 'una lámpara mágica o aceitera con una gota',
        palabras: 'aceite lampara genio aceitera gota motor',
        svg: '<path d="M4 10h9l2 2 5-3v1.2l-6 5.8H4z"/><path d="M7 10V8h4v2M4 11.5 2 10.5v3l2 1"/><path d="M21 16.5a1.2 1.2 0 1 1-2.4 0c0-.9 1.2-2.3 1.2-2.3s1.2 1.4 1.2 2.3z" fill="currentColor"/>',
        significa: 'El motor no tiene suficiente presión de aceite. Sin aceite, el motor se daña en minutos.',
        hacer: ['Oríllate en cuanto sea seguro y apaga el motor.', 'Espera unos minutos y revisa el nivel con la varilla.', 'Si está bajo, rellena con el aceite que dice tu manual.', 'Si el nivel está bien y la luz sigue, no lo manejes: pide grúa.'],
        manejar: 'No. Manejar con esta luz puede desbielar el motor.'
    },
    {
        id: 'temperatura', nombre: 'Temperatura del motor', color: 'rojo', urgencia: 'detente',
        parece: 'un termómetro sobre olas',
        palabras: 'temperatura termometro olas agua calentamiento anticongelante radiador',
        svg: '<path d="M10.5 4a1.5 1.5 0 0 1 3 0v8.2a2.8 2.8 0 1 1-3 0z"/><path d="M13.5 6h2.5M13.5 9h2.5"/><path d="M3 19.5c1.5-1 3-1 4.5 0s3 1 4.5 0 3-1 4.5 0 3 1 4.5 0"/>',
        significa: 'El motor se está sobrecalentando.',
        hacer: ['Si estás en tráfico, apaga el aire y pon la calefacción al máximo mientras buscas dónde orillarte: saca calor del motor.', 'Oríllate y apaga el motor.', 'No abras el tapón del radiador en caliente: el líquido sale hirviendo.', 'Después de unos 30 minutos revisa el depósito de anticongelante.'],
        manejar: 'No, hasta que se enfríe y sepas por qué pasó.'
    },
    {
        id: 'bateria', nombre: 'Batería o carga', color: 'rojo', urgencia: 'pronto',
        parece: 'una batería con un más y un menos',
        palabras: 'bateria carga alternador acumulador mas menos rectangulo',
        svg: '<rect x="3" y="7" width="18" height="12" rx="1.5"/><path d="M6 7V5h3v2M15 7V5h3v2M6 13h3M15 13h3M16.5 11.5v3"/>',
        significa: 'El auto no está cargando la batería. Muchas veces falla el alternador, no la batería.',
        hacer: ['Apaga lo que no necesites: aire, radio, cargadores.', 'Ve directo a un taller cercano sin apagar el motor si puedes.', 'Ten en cuenta que puede apagarse solo y no volver a arrancar.'],
        manejar: 'Solo un tramo corto, directo al taller.'
    },
    {
        id: 'frenos', nombre: 'Sistema de frenos', color: 'rojo', urgencia: 'detente',
        parece: 'un signo de admiración en un círculo, entre paréntesis',
        palabras: 'frenos freno exclamacion admiracion circulo parentesis liquido',
        svg: `${BRACKETS}<path d="M12 9v3.5"/><path d="M12 15v.2" stroke-width="2.4"/>`,
        significa: 'El freno de mano está puesto, o hay poco líquido de frenos o una falla en el sistema.',
        hacer: ['Revisa que el freno de mano esté completamente abajo.', 'Si sigue encendida, oríllate y revisa el depósito del líquido de frenos.', 'Si el pedal se siente esponjoso o baja más de lo normal, pide grúa.'],
        manejar: 'No, salvo que se apague al bajar el freno de mano.'
    },
    {
        id: 'freno-mano', nombre: 'Freno de estacionamiento', color: 'rojo', urgencia: 'aviso',
        parece: 'una P en un círculo, entre paréntesis',
        palabras: 'freno mano estacionamiento p parking circulo parentesis',
        svg: `${BRACKETS}${lightText('P', 7)}`,
        significa: 'El freno de mano o de estacionamiento está puesto.',
        hacer: ['Quítalo antes de avanzar.', 'Si se queda encendida con el freno quitado, revisa la luz de frenos.'],
        manejar: 'Sí, en cuanto lo quites.'
    },
    {
        id: 'check-engine', nombre: 'Check engine (motor)', color: 'ambar', urgencia: 'pronto',
        parece: 'un motor visto de lado',
        palabras: 'check engine motor falla emisiones escaner obd',
        svg: '<path d="M3 10v5M3 12.5h2M5 9h2V7h3V5.5h4V7h2.5L18 9h2.5v6H18l-1.5 2H9l-2-2H5z"/><path d="M10 5.5h4"/>',
        significa: 'La computadora del auto detectó una falla en el motor o en las emisiones. Puede ser algo pequeño, como el tapón de gasolina flojo.',
        hacer: ['Revisa que el tapón de gasolina esté bien cerrado.', 'Pide que lo lean con un escáner OBD2: muchas refaccionarias y talleres lo hacen.', 'Si parpadea, la falla es seria: baja la velocidad y llévalo al taller ya.'],
        manejar: 'Fija: sí, con calma, y revísalo pronto. Parpadeando: lo mínimo posible.'
    },
    {
        id: 'abs', nombre: 'ABS', color: 'ambar', urgencia: 'pronto',
        parece: 'las letras ABS en un círculo, entre paréntesis',
        palabras: 'abs frenos antibloqueo letras circulo parentesis',
        svg: `${BRACKETS}${lightText('ABS', 5.2)}`,
        significa: 'El freno antibloqueo está desactivado. Los frenos funcionan, pero las llantas pueden bloquearse si frenas fuerte.',
        hacer: ['Deja más distancia con el auto de enfrente.', 'Llévalo a revisar.', 'Si se enciende junto con la luz roja de frenos, oríllate.'],
        manejar: 'Sí, con más cuidado al frenar.'
    },
    {
        id: 'llantas', nombre: 'Presión de llantas', color: 'ambar', urgencia: 'pronto',
        parece: 'una herradura con un signo de admiración',
        palabras: 'llantas llanta presion aire herradura exclamacion ponchada neumatico',
        svg: '<path d="M6.3 19A8 8 0 1 1 17.7 19"/><path d="M5 19.5h14M8 19.5V21M12 19.5V21M16 19.5V21"/><path d="M12 8v5"/><path d="M12 15.6v.2" stroke-width="2.4"/>',
        significa: 'Una o más llantas tienen poca presión. Si parpadea al encender el auto, falla el sensor.',
        hacer: ['Ve despacio a la gasolinera más cercana.', 'Infla las cuatro a la presión de la etiqueta en el marco de la puerta del conductor, no la del costado de la llanta.', 'Si una se ve baja o ponchada, cámbiala por la de refacción.'],
        manejar: 'Despacio y poco, hasta revisarlas.'
    },
    {
        id: 'bolsa-aire', nombre: 'Bolsas de aire', color: 'rojo', urgencia: 'pronto',
        parece: 'una persona sentada con una pelota enfrente',
        palabras: 'bolsa aire airbag persona sentada pelota circulo',
        svg: '<circle cx="7" cy="4.5" r="1.9"/><path d="M7 8.5V14h5l1.5 5.5"/><path d="M4 7.5V16h3"/><circle cx="16.5" cy="8.5" r="3.6"/>',
        significa: 'Hay una falla en las bolsas de aire: podrían no abrirse en un choque.',
        hacer: ['Llévalo pronto a revisar a la agencia o a un taller.', 'Mientras, no lleves niñas o niños en el asiento delantero.'],
        manejar: 'Sí, pero revísalo pronto.'
    },
    {
        id: 'cinturon', nombre: 'Cinturón de seguridad', color: 'rojo', urgencia: 'aviso',
        parece: 'una persona con una banda cruzada',
        palabras: 'cinturon seguridad persona banda',
        svg: '<circle cx="11" cy="4.5" r="1.9"/><path d="M11 8.5V14h5l1.5 5.5"/><path d="M7 7.5V16h4"/><path d="M14.5 8.5 8.5 15.5" stroke-width="2.2"/>',
        significa: 'Alguien no lleva el cinturón abrochado.',
        hacer: ['Abróchalo, y pide a quien vaya contigo que lo haga.', 'Si suena aunque no haya nadie, puede ser una bolsa pesada en el asiento.'],
        manejar: 'Sí, con el cinturón puesto.'
    },
    {
        id: 'traccion', nombre: 'Control de tracción o estabilidad', color: 'ambar', urgencia: 'aviso',
        parece: 'un coche con dos líneas en zigzag',
        palabras: 'traccion estabilidad esp esc coche zigzag eses derrape patina lluvia',
        svg: '<path d="M5.5 11.5 7 7.2A1.5 1.5 0 0 1 8.4 6h7.2a1.5 1.5 0 0 1 1.4 1.2l1.5 4.3"/><rect x="4" y="11.5" width="16" height="4" rx="1"/><path d="M6 15.5v1.5M18 15.5v1.5M7 13.5h1.5M15.5 13.5H17"/><path d="M8.5 23c1.6-1.4-1.6-2.6 0-4.5M15.5 23c1.6-1.4-1.6-2.6 0-4.5"/>',
        significa: 'Si parpadea mientras manejas, el sistema está trabajando porque las llantas patinan. Si se queda fija, está apagado o falló.',
        hacer: ['Parpadeando: suelta un poco el acelerador y maneja con suavidad.', 'Fija con la palabra OFF: alguien lo apagó con el botón; vuelve a encenderlo.', 'Fija sin OFF: llévalo a revisar.'],
        manejar: 'Sí, con suavidad, sobre todo con lluvia.'
    },
    {
        id: 'gasolina', nombre: 'Reserva de gasolina', color: 'ambar', urgencia: 'aviso',
        parece: 'una bomba de gasolina',
        palabras: 'gasolina combustible reserva bomba tanque',
        svg: '<path d="M4 20V5a1 1 0 0 1 1-1h7a1 1 0 0 1 1 1v15M3 20h11M6 7h5v4H6z"/><path d="M13 10h2a1.5 1.5 0 0 1 1.5 1.5V16a1.5 1.5 0 0 0 3 0V8l-2.5-2.5"/>',
        significa: 'Estás en la reserva del tanque. Lo que alcanza depende del auto; revisa tu manual.',
        hacer: ['Carga en la próxima gasolinera.', 'Evita andar seguido en reserva: puede dañar la bomba de gasolina.'],
        manejar: 'Sí, hasta la gasolinera más cercana.'
    },
    {
        id: 'direccion', nombre: 'Dirección asistida', color: 'ambar', urgencia: 'pronto',
        parece: 'un volante con un signo de admiración',
        palabras: 'direccion volante asistida hidraulica electrica exclamacion pesado duro',
        svg: '<circle cx="10" cy="12" r="6.5"/><circle cx="10" cy="12" r="1.5"/><path d="M3.5 12h5M11.5 12h5M10 13.5V18.5"/><path d="M21 7.5v5.5"/><path d="M21 15.6v.2" stroke-width="2.4"/>',
        significa: 'Falla la ayuda de la dirección: el volante se siente pesado.',
        hacer: ['Maneja despacio y con las dos manos.', 'Llévalo a revisar.', 'Si la luz es roja o el volante se pone muy duro, oríllate.'],
        manejar: 'Despacio, directo al taller.'
    },
    {
        id: 'puerta', nombre: 'Puerta, cajuela o cofre abiertos', color: 'rojo', urgencia: 'aviso',
        parece: 'un coche visto desde arriba con una puerta abierta',
        palabras: 'puerta abierta cajuela cofre coche arriba',
        svg: '<rect x="7" y="3" width="10" height="18" rx="2.5"/><path d="M7 8h10M7 16h10M7 10l-3.5 3"/>',
        significa: 'Una puerta, la cajuela o el cofre no están bien cerrados.',
        hacer: ['Oríllate y ciérrala bien.'],
        manejar: 'No hasta cerrarla: se puede abrir en movimiento.'
    },
    {
        id: 'servicio', nombre: 'Servicio o mantenimiento', color: 'ambar', urgencia: 'aviso',
        parece: 'una llave de tuercas',
        palabras: 'servicio mantenimiento llave tuercas afinacion',
        svg: '<path d="M14.5 4.5a4 4 0 0 0-5 5L4 15l3 3 5.5-5.5a4 4 0 0 0 5-5l-2.5 2.5-2-.5-.5-2z"/>',
        significa: 'Ya toca el servicio programado por kilómetros o por tiempo.',
        hacer: ['Agenda el servicio.', 'El taller la apaga después; no es una falla.'],
        manejar: 'Sí.'
    },
    {
        id: 'luces-altas', nombre: 'Luces altas', color: 'azul', urgencia: 'info',
        parece: 'una lámpara con rayas rectas',
        palabras: 'luces altas lampara rayas rectas azul faros',
        svg: '<path d="M13 6c4 0 7 2.7 7 6s-3 6-7 6z"/><path d="M3 7.5h7M3 10.5h7M3 13.5h7M3 16.5h7"/>',
        significa: 'Llevas las luces altas encendidas.',
        hacer: ['Cámbialas a bajas cuando venga un coche de frente o vayas detrás de otro: deslumbran.'],
        manejar: 'Sí.'
    },
    {
        id: 'luces', nombre: 'Luces encendidas', color: 'verde', urgencia: 'info',
        parece: 'una lámpara con rayas inclinadas',
        palabras: 'luces bajas encendidas lampara rayas inclinadas faros verde',
        svg: '<path d="M13 6c4 0 7 2.7 7 6s-3 6-7 6z"/><path d="M3.5 7.5l6 1.8M3.5 11.5l6 1.8M3.5 15.5l6 1.8"/>',
        significa: 'Las luces están encendidas.',
        hacer: ['Nada. Recuerda apagarlas al estacionarte si tu auto no lo hace solo.'],
        manejar: 'Sí.'
    },
    {
        id: 'antiniebla', nombre: 'Luces antiniebla', color: 'verde', urgencia: 'info',
        parece: 'una lámpara con rayas cruzadas por una línea ondulada',
        palabras: 'antiniebla niebla neblina lampara olas ondulada',
        svg: '<path d="M14 6c4 0 7 2.7 7 6s-3 6-7 6z"/><path d="M3 8h7M3 12h7M3 16h7"/><path d="M7 5c-1 2.3 1 4.5 0 7s1 4.7 0 7"/>',
        significa: 'Las luces antiniebla están encendidas. Las de atrás suelen marcarse en ámbar.',
        hacer: ['Úsalas solo con niebla o lluvia muy fuerte; si no, deslumbran.'],
        manejar: 'Sí.'
    },
    {
        id: 'crucero', nombre: 'Control de crucero', color: 'verde', urgencia: 'info',
        parece: 'un velocímetro con una aguja',
        palabras: 'crucero velocidad velocimetro aguja',
        svg: '<path d="M4.5 17a8 8 0 1 1 15 0"/><path d="M12 15l3.5-4.5"/><circle cx="12" cy="15" r="1"/>',
        significa: 'El control de crucero está activo y mantiene la velocidad.',
        hacer: ['Se desactiva al pisar el freno.'],
        manejar: 'Sí.'
    }
];

const lightsUI = { query: '', color: null, selected: null };

function warningLightIcon(light, size) {
    return `
        <span class="inline-flex items-center justify-center rounded-2xl flex-shrink-0" style="width:${size}px;height:${size}px;background:#16181B;color:${LIGHT_COLORS[light.color].hex}">
            <svg viewBox="0 0 24 24" width="${Math.round(size * 0.66)}" height="${Math.round(size * 0.66)}" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${light.svg}</svg>
        </span>`;
}

// Palabras con que se describe cualquier luz y que no ayudan a distinguirlas
const LIGHT_FILLER = new Set(['luz', 'foco', 'forma', 'tablero', 'testigo', 'icono', 'dibujo', 'parece', 'prendio', 'prendida', 'encendio', 'encendida', 'sale', 'salio', 'auto', 'carro', 'coche']);

function findWarningLights(query) {
    const words = normalizeText(query.trim()).split(/[^a-z0-9]+/).filter((w) => w && !STOPWORDS.has(w) && !LIGHT_FILLER.has(w));
    if (!words.length) return [];
    const scored = WARNING_LIGHTS.map((l) => {
        const tokens = normalizeText(`${l.nombre} ${l.parece} ${l.palabras} ${LIGHT_COLORS[l.color].words}`).split(/[^a-z0-9]+/);
        return { l, hits: words.filter((w) => tokens.some((t) => t.startsWith(w))).length };
    });
    // Primero las que tienen todas las palabras; si ninguna, las que tienen alguna
    const all = scored.filter((x) => x.hits === words.length);
    const some = scored.filter((x) => x.hits > 0).sort((a, b) => b.hits - a.hits);
    return (all.length ? all : some).map((x) => x.l);
}

function renderWarningLightsSection() {
    return `<div id="lights-root" class="bg-card p-6 rounded-2xl border border-line shadow-sm space-y-4">${renderWarningLightsView()}</div>`;
}

function renderWarningLightsRoot() {
    const root = document.getElementById('lights-root');
    if (!root) return;
    root.innerHTML = renderWarningLightsView();
    lucide.createIcons();
}

function renderWarningLightsView() {
    const selected = WARNING_LIGHTS.find((l) => l.id === lightsUI.selected);
    if (selected) return renderWarningLightDetail(selected);

    const byQuery = lightsUI.query.trim() ? findWarningLights(lightsUI.query) : WARNING_LIGHTS;
    const list = byQuery.filter((l) => !lightsUI.color || l.color === lightsUI.color || (lightsUI.color === 'verde' && l.color === 'azul'));
    const colorChip = (key, label) => {
        const active = lightsUI.color === key;
        const dot = key ? `<span class="w-3 h-3 rounded-full" style="background:${LIGHT_COLORS[key].hex}" aria-hidden="true"></span>` : '';
        return `<button type="button" onclick="setLightColor(${key ? `'${key}'` : 'null'})" aria-pressed="${active}" class="px-4 rounded-full border text-sm font-semibold flex items-center gap-2 ${active ? 'bg-accent-fill text-white border-transparent' : 'bg-card text-ink-soft border-edge'}">${dot}${label}</button>`;
    };

    return `
        <div>
            <h3 class="text-base font-bold text-ink">¿Se prendió una luz en el tablero?</h3>
            <p class="text-ink-soft">Búscala por su color o por cómo se ve. Rojo: oríllate. Ámbar: revísalo pronto. Verde o azul: solo te avisa.</p>
        </div>
        <input type="search" value="${escapeHtml(lightsUI.query)}" oninput="searchWarningLights(this.value)" placeholder='Ej. "lámpara", "herradura", "termómetro"' class="w-full px-3 py-2 border rounded-xl" aria-label="Buscar testigo del tablero">
        <div class="flex flex-wrap gap-2">
            ${colorChip(null, 'Todos')}${colorChip('rojo', 'Rojo')}${colorChip('ambar', 'Ámbar')}${colorChip('verde', 'Verde o azul')}
        </div>
        <div id="lights-list" class="grid grid-cols-2 sm:grid-cols-3 gap-2">
            ${list.length ? list.map((l) => `
                <button type="button" onclick="openWarningLight('${l.id}')" class="flex items-center gap-3 p-2 bg-surface-1 border border-line rounded-xl text-left">
                    ${warningLightIcon(l, 44)}
                    <span class="text-sm font-semibold text-ink leading-snug">${escapeHtml(l.nombre)}</span>
                </button>`).join('') : '<p class="col-span-full text-ink-soft">No encontramos esa luz. Prueba con su color o con otra palabra para describirla.</p>'}
        </div>`;
}

function renderWarningLightDetail(l) {
    const urgency = LIGHT_URGENCY[l.urgencia];
    const stop = l.urgencia === 'detente';
    return `
        ${backButton('closeWarningLight()', 'Todas las luces')}
        <div class="flex items-center gap-4">
            ${warningLightIcon(l, 72)}
            <div>
                <h3 class="text-lg font-bold text-ink">${escapeHtml(l.nombre)}</h3>
                <p class="text-ink-faint">${LIGHT_COLORS[l.color].label} · parece ${escapeHtml(l.parece)}</p>
            </div>
        </div>
        <p class="flex items-center gap-2 p-3 rounded-xl font-bold ${stop ? 'bg-attention-soft text-attention' : 'bg-surface-1 text-ink-soft'}">
            <i data-lucide="${urgency.icon}" class="w-5 h-5 flex-shrink-0" aria-hidden="true"></i>${urgency.label}
        </p>
        <p class="text-ink">${escapeHtml(l.significa)}</p>
        <div class="space-y-2">
            <h4 class="font-bold text-ink">Qué hacer</h4>
            <ol class="list-decimal pl-5 space-y-1 text-ink-soft">${l.hacer.map((h) => `<li>${escapeHtml(h)}</li>`).join('')}</ol>
        </div>
        <div class="p-3 bg-surface-1 border border-line rounded-xl">
            <p class="text-sm font-bold text-ink-faint">¿Puedo seguir manejando?</p>
            <p class="font-semibold text-ink">${escapeHtml(l.manejar)}</p>
        </div>
        <p class="text-sm text-ink-faint">Cada auto es distinto: si tienes el manual, confírmalo ahí. Contenido en revisión.</p>`;
}

function searchWarningLights(value) {
    lightsUI.query = value;
    // Solo se redibuja la lista para no perder el foco del campo
    const root = document.getElementById('lights-root');
    if (!root) return;
    const tmp = document.createElement('div');
    tmp.innerHTML = renderWarningLightsView();
    document.getElementById('lights-list').replaceWith(tmp.querySelector('#lights-list'));
}

function setLightColor(color) {
    lightsUI.color = color;
    renderWarningLightsRoot();
}

function openWarningLight(id) {
    lightsUI.selected = id;
    renderWarningLightsRoot();
    document.getElementById('lights-root')?.scrollIntoView({ block: 'start' });
}

function closeWarningLight() {
    lightsUI.selected = null;
    renderWarningLightsRoot();
}

// Desde el buscador de la app
function openWarningLightFromSearch(id) {
    lightsUI.selected = id;
    navigate('auto');
    document.getElementById('lights-root')?.scrollIntoView({ block: 'start' });
}
