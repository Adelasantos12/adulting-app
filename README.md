# Modo Adulto® - Guía de Supervivencia (Adulting App Unificada)

Una aplicación web interactiva Single Page Application (SPA) y Progressive Web App (PWA) diseñada en español para ayudar a jóvenes adultos y personas neurodivergentes (ADHD/TDAH) a gestionar las responsabilidades cotidianas sin abrumarse. Inspirada en la simplicidad y el control local absoluto.

## 🌟 Estructura de la App: Los 5 Módulos del "Modo Adulto"

La aplicación está dividida en 5 módulos completamente independientes, cada uno diseñado con una acción inmediata, un sistema mínimo de seguimiento y una pantalla de emergencia para momentos de ansiedad o saturación.

### 💳 1. Dinero sin Drama
- **Acción Inmediata**: Calculadora de fechas de tarjetas de crédito (Corte, Límite, Saldo para no generar intereses y Pago mínimo).
- **Sistema Mínimo**:
  - Control de Deudas: Tabla dinámica que implementa los dos principales métodos de pago: **Avalancha** (mayor tasa primero para ahorrar intereses) y **Bola de Nieve** (menor saldo primero para victorias psicológicas).
  - Retención de Impuestos: Automatización sencilla del cálculo del 30% mensual.
  - Gestión de Seguros: Ficha interactiva de contacto rápido para pólizas prioritarias.

### 🛍️ 2. ¿Comprar o no? (Asistente de Impulsos)
- **Acción Inmediata**: Asistente de 5 pasos que calcula el coste real de un producto en base a tus **horas reales de esfuerzo/trabajo** y te sugiere pautas de espera preventivas basadas en el valor del artículo.
- **Pantalla de Emergencia / Cable a Tierra**:
  - **Botón contra Impulsos**: Mensajes racionales para desmantelar la gratificación instantánea inducida por la publicidad y un botón para iniciar una pausa reflexiva de 10 minutos.
  - **Alivio por Gastos Necesarios**: Mensajes tranquilizadores para eliminar la culpa al realizar gastos cruciales y planificados en salud, mantenimiento o vivienda.

### 🍷 3. Hábitos & Consumos (Reducción Atómica)
- **Acción Inmediata**: Registro diario y emocional de alcohol, tabaco o nicotina (¿qué sentías antes?, ¿qué sentiste después?, dinero gastado).
- **Sistema Mínimo**:
  - Guía Atómica de Reducción: Basada en la fórmula de hábitos de James Clear ("Después de [situación], haré [alternativa]").
  - Técnicas para TDAH: Incremento deliberado de la fricción (escala de grises, desinstalar apps adictivas, retrasos temporales).

### 🏠 4. Casa Funcional & Clima
- **Acción Inmediata**: Checklist interactiva de los **5 Mínimos Diarios** (fregar platos, tirar basura, vaciar superficies, ordenar ropa y preparar mañana) para mantener la casa en funcionamiento básico.
- **Sistema Mínimo**:
  - **Reset de 15 Minutos**: Temporizador activo con cuenta regresiva. Pon el reloj, limpia lo que puedas y detente sin culpa cuando acabe el tiempo.
  - **Despensa Mínima**: Guías para despensas balanceadas de supervivencia para 3, 5 o 15 días.
  - **Insumos Periódicos**: Lista de control de productos de limpieza recurrentes.
  - **Qué me pongo**: Recomendador del clima y vestimenta inteligente (cápsula wardrobe) según la geolocalización local por Open-Meteo.

### 📱 5. Paz en Redes y Conectar
- **Acción Inmediata**: Botón de pánico **"Estoy Saturado"** con un temporizador e indicaciones cognitivas para detener el scroll, calmar la mente e identificar la distorsión de la comparación social en redes.
- **Sistema Mínimo**:
  - Guía "Hacer amigos después de los 20/30": Directrices claras basadas en la ley de la regularidad y guiones interactivos listos para conversar.
  - Ajustes de Accesibilidad: Temas de colores (Púrpura, Azul, Verde, Rosa, Naranja), Modo Oscuro, tamaños de texto y **fuente para dislexia** (Comic Neue), con importación y exportación de respaldos JSON.

---

## 🔒 Privacidad y Control Absoluto de Datos

Toda la información personal introducida se almacena localmente en el dispositivo mediante `localStorage`. Ningún dato se transmite a servidores ni se comparte externamente, respetando de forma estricta los principios de privacidad-first. Puedes realizar copias de seguridad de forma regular descargando el archivo JSON desde la pestaña de Ajustes.

---

## 🛠️ Cómo Ejecutar el Proyecto de Forma Local

1. Instala las dependencias:
   ```bash
   npm install
   ```
2. Inicia el servidor local corriendo:
   ```bash
   node server.js
   ```
3. Abre la URL en tu navegador: `http://localhost:3000`

---

## ☁️ Cómo Desplegar en Railway (Paso a Paso)

1. Sube este repositorio a tu cuenta de GitHub.
2. Inicia sesión en railway.app y haz clic en **New Project**.
3. Selecciona la opción **Deploy from GitHub repo** y elige tu repositorio.
4. En **Settings**, genera un dominio público. ¡Eso es todo! El servidor Express se levantará y compilará la app de manera autónoma.
