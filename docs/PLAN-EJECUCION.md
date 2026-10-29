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
- [ ] Compilar Tailwind localmente (CLI) en lugar del CDN de desarrollo.
- [ ] Fijar Lucide a una versión concreta y servirlo desde `public/`.
- [ ] Añadir `manifest.webmanifest`, íconos y un service worker sencillo para que funcione de verdad sin conexión e instalable como PWA.
- [ ] Verificar exportar e importar respaldo JSON (es la única red de seguridad de los datos).
- [ ] Opcional: partir `index.html` en módulos JS por vista para que editar sea menos frágil.

**Listo cuando:** en modo avión, la app recargada se ve y funciona igual.

### Fase 2 — Alinear la app con la Biblia (2 sesiones)
- [ ] Conectar `tokens.css`: colores, `--accent`, `--attention` (ámbar, no rojo), modo oscuro.
- [ ] Tipografía: Nunito, texto base de 18 px y espaciado entre letras ajustable de 0.04em a 0.12em. Quitar Comic Neue como "fuente para dislexia".
- [ ] `prefers-reduced-motion` en todas las animaciones (ruleta, temporizador).
- [ ] Pasada de voz con la tabla de CORE 9: quitar "¡" decorativos, "ATRASADO" y cualquier contador que pueda mostrar cero.
- [ ] Decidir el alcance de los módulos (ver "Decisiones" abajo).
- [ ] Recorrer los QA gates 1–15 pantalla por pantalla y anotar resultados.

**Listo cuando:** cada pantalla pasa los gates 1–15, con el resultado anotado.

### Fase 3 — Probar con personas reales (2–3 semanas, poco código)
- [ ] De 5 a 8 personas de la audiencia usan la versión web de Railway durante una semana.
- [ ] Una tarea guiada por persona (por ejemplo, "registra tu tarjeta y averigua cuándo pagar"), observada sin ayudar.
- [ ] Corregir lo que aparezca y repetir con 2–3 personas.

**Listo cuando:** el gate 16 tiene nombres y notas reales detrás.

### Fase 4 — App nativa (1–2 sesiones)
- [ ] `npx cap sync` y prueba en el simulador de iOS y un Android.
- [ ] Cambiar `localStorage` por almacenamiento cifrado (Keychain y Keystore) en la versión nativa.
- [ ] Íconos y splash con la identidad de la Biblia.
- [ ] Página de política de privacidad publicada en Railway (`/privacidad`). Ambas tiendas la exigen.

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
