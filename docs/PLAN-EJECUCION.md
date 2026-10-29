# Modo Adulto — Plan de ejecución por fases

Fecha: 28 oct 2026
Rama de trabajo: `jules-692301298752577914-1f7d37ad` (repo `Adelasantos12/adulting-app`)
En vivo: https://ser-adulto.up.railway.app

---

## Dónde estamos

**Ya existe y funciona**
- Una SPA de un solo archivo (`public/index.html`, ~3 100 líneas) con 15 vistas: Inicio, Tareas y Ruleta, Dinero, ¿Comprar o no?, Alimentación, Mascotas, Auto, Casa, Qué me pongo, Salud, Guías, Paz en Redes, Solitario, Ellie, Ajustes.
- Servidor Express mínimo (`server.js`) desplegado en Railway. Lo que sirve Railway es exactamente esta rama (mismo `index.html`, 206 293 bytes).
- Datos guardados solo en el dispositivo (`localStorage`).
- Capacitor ya instalado y con carpetas `android/` e `ios/` creadas. Es decir, la Fase 1 del plan anterior ya se hizo.

**El plan anterior** (estaba en el README, commit `f2e936d`, y luego se borró) tenía 6 fases: empaquetar con Capacitor, login con Firebase, cobro de $2/año con RevenueCat, seguridad, infraestructura escalable (Cloudflare, Supabase, autoscaling) y publicación en tiendas.

**Lo que ese plan no tomaba en cuenta**
1. **La app y tu Biblia se contradicen.** `CORE.md` y `tokens.css` definen colores, tipografía (Nunito, 18 px), voz y 16 QA gates, pero la app no usa nada de eso:
   - Ofrece Comic Neue como fuente "para dislexia", cuando CORE 4.2 dice que no se envía fuente para dislexia (grado E).
   - No respeta `prefers-reduced-motion` (gate 11).
   - Usa 24 signos "¡" y el texto "ATRASADO", cuando CORE 9 y 8.4 piden lo contrario.
   - No usa los tokens de color, así que no se ha comprobado el contraste.
2. **Dice "offline-first", pero no lo es.** No tiene manifest ni service worker, y carga Tailwind y Lucide desde CDN (`lucide@latest`, sin fijar la versión). Sin internet, o dentro de la app nativa, se rompe el estilo.
3. **Gran parte del plan anterior sobra mientras los datos sean locales.** Firebase Auth, Supabase, Cloudflare, autoscaling y SSL pinning resuelven problemas que la app no tiene. Para cobrar, RevenueCat funciona sin cuentas de usuario: la compra queda ligada a la cuenta de Apple o Google, y "Restaurar compras" la recupera.
4. **Nadie de la audiencia la ha probado** (gate 16). Es más barato descubrir problemas en la web de Railway que después de pagar las tiendas.

---

## Las fases

Cada fase cabe en una o dos sesiones de trabajo y termina con algo desplegado en Railway que puedes abrir y revisar. No se avanza a la siguiente hasta cumplir el "Listo cuando".

### Fase 0 — Ordenar la casa (1 sesión corta)
- [x] Decidir dónde se trabaja: la carpeta de la Biblia ahora es el repo, y la Biblia vive en `docs/bible/`.
- [ ] Confirmar en Railway qué rama despliega y dejar una rama principal clara (por ejemplo, fusionar esta rama en `main`).
- [x] Borrar restos: `patch_render.py`, `test` vacío en `package.json`.
- [x] Enlazar este plan y la Biblia desde el README.

**Listo cuando:** un push a la rama principal se despliega solo en Railway, y la Biblia vive junto al código.

### Fase 1 — Cimientos técnicos (1–2 sesiones)
- [x] Compilar Tailwind localmente (CLI) en lugar del CDN de desarrollo.
- [x] Fijar Lucide a una versión concreta y servirlo desde `public/`.
- [x] Añadir `manifest.webmanifest`, íconos y un service worker sencillo para que funcione de verdad sin conexión e instalable como PWA. El ícono es provisional, hasta tener la identidad visual.
- [x] Verificar exportar e importar respaldo JSON. No existía: se agregó en Ajustes → Tus datos.
- [ ] Opcional: partir `index.html` en módulos JS por vista para que editar sea menos frágil.

**Listo cuando:** en modo avión, la app recargada se ve y funciona igual.

Notas al cerrar la fase:
- Se corrigió de paso un error que ya estaba en producción: la pantalla de Mascotas no abría (`getZodiacSign` se había borrado).
- Las fuentes siguen viniendo de Google Fonts; el service worker las guarda tras la primera visita. En la Fase 2 se cambian a Nunito y conviene servirlas desde `public/`.
- Pendiente para la Fase 4: en la app nativa, "Descargar respaldo" necesitará el plugin de compartir archivos de Capacitor.

### Fase 2 — Alinear la app con la Biblia (2 sesiones)
- [x] Conectar los tokens: colores como variables en `src/tailwind.css`, atención en ámbar (nunca rojo), modo oscuro con los valores de la Biblia.
- [x] Selector de acento con 5 opciones (decisión del 28 oct). Verde por defecto; las cinco pasan 4.5:1 en claro y oscuro.
- [x] Tipografía: Nunito servida desde `public/fonts`, escala de `tokens.css` (cuerpo 18px, mínimo 14px), espacio entre letras ajustable de 0.04 a 0.12em. Se quitó Comic Neue "para dislexia" (CORE 4.2).
- [x] Movimiento reducido: respeta la preferencia del sistema y hay un ajuste manual. La ruleta elige sin girar.
- [x] Pasada de voz: sin "¡!", sin "ATRASADO" (ahora "Pendiente desde" con ícono, y solo si la fecha ya pasó), sin mayúsculas, estados vacíos que dicen para qué es el espacio.
- [x] Diseño más sobrio: sin 88 emojis, sin degradados ni sombras de color, ruleta en tonos neutros.
- [x] Alcance de módulos (decisión del 28 oct): Paz en Redes y Juegos ocultos por defecto, se activan en Ajustes. "Qué me pongo" ahora está en el menú.
- [x] Recorrer los QA gates 1–15 (resultado abajo).

**Resultado de los QA gates (28 oct 2026, medido en las 12 pantallas visibles, claro y oscuro)**

| Gate | Estado | Nota |
|---|---|---|
| 1 Cubrir la cara de la mascota | No aplica | Aún no hay mascota en la app |
| 2 Escala de grises | Pasa | Los vencidos llevan ícono y texto, no solo color |
| 3 Significado por metáfora | Pasa | |
| 4 Recordar datos de otra pantalla | Sin medir | Requiere revisión pantalla por pantalla con personas |
| 5 Contraste | Pasa | Script: todo texto ≥ 4.5:1 en claro y oscuro |
| 6 Pasteles con significado | Pasa | No se usan pasteles |
| 7 Mayúsculas en cuerpo | Pasa | Se quitaron 20 `uppercase` y las etiquetas `[HOGAR]` |
| 8 Tramas o rayas | Pasa | |
| 9 Texto ≥ 18px | Parcial | Cuerpo 18px, tarjetas 16px, notas 14px. Todo escala con el ajuste de tamaño |
| 10 Destellos > 3Hz | Pasa | |
| 11 Movimiento reducido | Pasa | CSS global + ruleta |
| 12 Parallax o autoplay | Pasa | |
| 13 Contadores en cero | Pasa | No se encontraron |
| 14 Avisos que implican deuda | Pasa | Textos reescritos |
| 15 Todo se puede deshacer | Pasa (29 oct) | Borrar muestra "Deshacer" 8 segundos; el elemento vuelve a su lugar. Sin diálogos de confirmación |

Áreas táctiles: 287 de 289 controles miden ≥ 48px (casillas 24px). Las dos excepciones son el deslizador y el campo de archivo oculto, cuya área es su etiqueta.

**Cerrado el 29 oct**
- "Deshacer" al borrar tareas, deudas, seguros, chequeos, vehículos y mascotas (gate 15).
- Títulos, menús y etiquetas en mayúscula solo inicial; "&" cambiado por "y"; nombres más cortos ("Hoy", "Ajustes", "Lo de hoy").
- `docs/bible/tokens.css` actualizado con los grises nuevos de `ink-faint`.
- Botones que estaban rotos en producción desde julio y ya funcionan: "Añadir mascota", "Eliminar perfil de mascota" y la revisión semanal de Hoy (ahora 3 preguntas opcionales).
- Queda código sin uso del módulo "Mi trabajo" (entrevistas): no está en el menú ni tiene pantalla. Decidir si se recupera o se borra.

**Listo cuando:** cada pantalla pasa los gates 1–15, con el resultado anotado.

### Contenido interactivo (en paralelo a la Fase 3)

Idea del 29 oct: que recetas, guías de auto y "Qué me pongo" no sean listas que se leen una vez, sino contenido que se busca y te muestra una cosa a la vez según tu situación. País: **México**.

**Recetas — hecho (29 oct)**
- [x] 58 recetas en `public/data/recetas.json` (formato en [`recetas-formato.md`](recetas-formato.md)): 24 en freidora de aire, 9 en microondas, 5 sin cocinar; 23 de poca energía.
- [x] "¿Qué cocino hoy?": una sugerencia a la vez, "Otra" sin repetir, buscador sin acentos, filtros de energía, utensilio, tiempo y tipo de comida.
- [x] "Lo que tengo": despensa marcable; filtra recetas que puedes hacer ya y dice qué falta.
- [x] Agregar lo que falta a la lista del súper; quitar lo comprado con "Deshacer".
- [x] Modo cocina: un paso por pantalla, temporizador, "Terminé" guarda en "Hechas hace poco".
- [x] Favoritas y notas por receta.
- [ ] **Probar las recetas en cocina.** Son borradores redactados con IA (`revisada: false`) y la app lo dice. Prioridad: las de pollo, cerdo y pescado en freidora.
- [ ] IA para adaptar una receta existente (cambiar ingrediente, porciones, pasar a freidora). Requiere servidor y llave de la API de Anthropic.
- [ ] Crecer hacia 365 recetas.

**Qué me pongo — hecho (29 oct)**
- [x] 125 prendas en `public/data/prendas.json`, por capa (base, media, exterior, abajo, calzado, accesorios), con rango de temperatura, lluvia, viento, sol y ocasión.
- [x] Pronóstico de 7:00 a 21:00 (sensación térmica, lluvia, viento, UV); si cambia mucho durante el día, sugiere capas que se quitan.
- [x] Ocasión (casual, trabajo, formal, noche, ejercicio), "Otra combinación", no repite lo de los últimos 3 días ("Me pongo esto").
- [x] Clima a mano si no hay ubicación o conexión; "Mi clóset" para usar solo lo que tienes.

**Dudas y conversaciones — hecho (29 oct)**
- [x] 65 guías en `public/data/guias.json`: 21 del SAT (RFC, e.firma, régimen, declaración anual, deducciones, facturas, multas…), 8 de dinero, 10 de trámites, 8 de trabajo, 7 de vivienda, 5 de salud, 3 de casa y 3 de emergencias.
- [x] 37 guiones en `public/data/guiones.json` para llamar, reclamar, pedir, decir que no, trabajo, amistades, familia y pareja, médico y vivienda.
- [x] Entrada por necesidad ("Tengo una duda" / "Tengo que hablar con alguien") o buscador con sinónimos; máximo 6 resultados a la vez.
- [x] Guiones con tus datos, "Si te dicen…", ensayo línea por línea y "Enviar como mensaje".
- [x] Guardadas y notas; guía de temporada en Hoy (declaración anual en marzo y abril, aguinaldo en noviembre y diciembre, presupuesto en enero).
- [ ] **Revisar los datos legales y teléfonos** listados en [`revision-contenido.md`](revision-contenido.md).

**Siguientes:** guías de auto (buscador, entrada por síntoma, paso a paso con dibujos). Mover las guías de Casa funcional (lavadora, foco, apagón) a la biblioteca.

### Fase 3 — Probar con personas reales (2–3 semanas, poco código)
Material listo (29 oct): guion, 8 tareas, preguntas de cierre, hoja de notas y cómo ordenar hallazgos en [`fase-3-pruebas.md`](fase-3-pruebas.md).

- [ ] De 5 a 8 personas de la audiencia usan la versión web de Railway durante una semana.
- [ ] Una tarea guiada por persona (por ejemplo, "registra tu tarjeta y averigua cuándo pagar"), observada sin ayudar.
- [ ] Corregir lo que aparezca y repetir con 2–3 personas.

**Listo cuando:** el gate 16 tiene nombres y notas reales detrás.

### Fase 4 — App nativa (1–2 sesiones)
- [x] Capa nativa en `public/js/native.js` (29 oct): la misma app decide si usa la función del teléfono o la del navegador.
  - Datos: además de `localStorage`, se guardan en Preferences (almacenamiento nativo). Si iOS borra los datos del WebView, se recuperan solos.
  - Ubicación con permiso nativo (aproximada, solo para el clima). Textos de permiso en `Info.plist` y `AndroidManifest.xml`.
  - Respaldo: se guarda el archivo y se abre el menú de compartir (Archivos, Drive, correo).
  - Guiones: "Enviar como mensaje" usa el menú de compartir nativo.
  - Temporizador de cocina: notificación local aunque la pantalla esté apagada.
- [x] `npx cap sync` con 5 plugins (preferences, geolocation, filesystem, share, local-notifications), versión 8.
- [ ] **Instalar herramientas (tú):** Xcode desde la App Store de Mac; Android Studio; JDK 21 (hoy hay Java 8).
- [ ] Probar en el simulador de iOS, un iPhone y un Android.
- [ ] **Decidir el nombre** (hoy: "SerAdulto" en Capacitor, "Modo Adulto" en la app) y el identificador `com.seradulto.app`, que no se puede cambiar después de publicar.
- [ ] Ícono final de 1024 px y pantalla de inicio; generar todos los tamaños con `@capacitor/assets`.
- [ ] Página de política de privacidad publicada en Railway (`/privacidad`). Ambas tiendas la exigen. Debe decir que la ubicación redondeada va a Open-Meteo.
- [ ] Al publicar en Google Play: el plugin de notificaciones declara `SCHEDULE_EXACT_ALARM`; Play Console pide justificarlo (temporizador de cocina).

**Listo cuando:** la app corre en un iPhone y un Android reales, sin conexión, con datos que sobreviven a un reinicio.

### Fase 5 — Cobro (1 sesión, si se decide cobrar)
- [ ] RevenueCat sin login: suscripción anual, pantalla de pago y "Restaurar compras".
- [ ] Revisar el precio. A $2 al año, después de la comisión de la tienda (15 %), cubrir solo los $99 anuales de Apple requiere unos 60 suscriptores. ¿Pago único, $2 al año o gratis con donación?

### Fase 6 — Publicar en tiendas
- [ ] Google Play: cuenta ($25 una vez) y prueba cerrada obligatoria con 12 personas durante 14 días para cuentas personales nuevas. Las personas de la Fase 3 pueden servir.
- [ ] Apple: Developer Program ($99 al año), capturas, formulario "App Privacy" (sin datos recolectados) y revisión.

### No hacer todavía
Firebase o login, Supabase, Cloudflare, autoscaling y SSL pinning. Solo tienen sentido si algún día los datos se sincronizan en la nube, y esa decisión cambia la promesa de privacidad de la app.

---

## Decisiones que son tuyas

1. **¿Para quién es la Biblia de 240 páginas?** `ARCHITECTURE.md` A.5 ya lo plantea. Para construir la app bastan `CORE.md` y `tokens.css`. Los volúmenes restantes pueden escribirse en paralelo o después.
2. **Alcance de módulos.** ¿Solitario, Ellie the Astronaut, Paz en Redes y el signo zodiacal de las mascotas son parte del producto? CORE 1 define "dinero, casa, hábitos, trámites, salud".
3. **País.** Las guías mencionan 401k, que es de EE. UU. ¿El público principal es México, España u otro país? Eso cambia impuestos, retiro (Afore, etc.) y vocabulario.
4. **Modelo de cobro** (Fase 5).
