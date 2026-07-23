# Modo Adulto® - Guía de Supervivencia (Arquitectura de Accesibilidad Cognitiva)

Una aplicación web interactiva Single Page Application (SPA) y Progressive Web App (PWA) diseñada en español, privada y offline-first, para ayudar a jóvenes adultos y personas neurodivergentes (ADHD/TDAH, autismo, dislexia) a gestionar las responsabilidades cotidianas reduciendo la carga cognitiva y externalizando tareas de memoria.

Esta versión es una **fusión perfecta y combinada** de todas las herramientas anteriores junto con los nuevos módulos interactivos, permitiendo tener un control total de tu vida desde una sola app limpia y responsiva.

---

## 🌟 Arquitectura Estructural de Accesibilidad y Comodidad

La accesibilidad en **Modo Adulto** no es una capa posterior de marketing ni una etiqueta visual: se concibe como un requisito estructural del diseño de software.

### Panel Configurable: "Accesibilidad y comodidad"
El panel permite un control independiente y granular para diferentes capacidades visuales, motoras, cognitivas y sensoriales:
1. **Frecuencia de Recordatorios y Detalle**: Permite ajustar la cantidad de estímulos visibles en el panel principal.
2. **Escala de grises y Contraste Elevado**: Reduce estímulos visuales distractores para evitar la fatiga mental y fotosensibilidad.
3. **Fuentes para la Legibilidad**: Ofrece opciones tipográficas legibles e independientes:
   - Sistema / Estándar.
   - Atkinson Hyperlegible.
   - Comic Neue (validada para legibilidad disléxica, reduciendo el truncamiento de textos críticos).
4. **Tono de Recordatorios**: Configura el tono de voz de las alarmas y mensajes:
   - *Directo*: "El seguro vence mañana."
   - *Amable*: "Tu seguro vence mañana. Puedes revisarlo ahora o programar otro recordatorio."
   - *Muy breve*: "Seguro · vence mañana."
   *(Evita en todo momento el uso de lenguaje que atribuya culpa o punitivo).*
5. **Reducir Señales de Urgencia**: Al activarse, sustituye los tonos rojos brillantes por tonos neutrales, elimina signos de exclamación decorativos, reduce parpadeos y animaciones, y cambia textos de "ATRASADO" a "Pendiente desde...".
6. **Ocultar y Reordenar Módulos**: Los usuarios pueden ocultar o reordenar por completo las tarjetas visibles del Dashboard para evitar la sobre-estimulación.

---

## 🗂️ Estructura Completa de la App: 9 Módulos Independientes

### 1. 🏠 Inicio / Hoy (Dashboard Minimalista)
- **Criterio de Diseño**: El Dashboard no abruma con decenas de estadísticas. Se limita a mostrar un **máximo de 3 tarjetas prioritarias**:
  1. *Próximo vencimiento* (factura o póliza de auto).
  2. *Una acción prioritaria* (mínimo de limpieza diaria o indispensable de comida).
  3. *Una revisión sugerida* (chequeo anual de salud o evaluación semanal).
- Notas de ánimo y frases motivacionales amables configurables al inicio del panel.
- Botón de "Ver todo" para acceder de forma rápida y consciente a todos los módulos.

### 2. 🎯 Tareas & La Ruleta
- **Acción Inmediata**: La **Ruleta de Decisiones** en HTML5 Canvas con animación de velocidad física y fricción. ¡Gira y deja que la ruleta elija tu siguiente tarea para romper la parálisis por análisis!
- **Sistema Mínimo**: Gestor de tareas por categorías (Hogar, Trámites, Personal).

### 3. 💳 Dinero sin Drama
- **Acción Inmediata**: Calculadora de fechas de tarjetas de crédito (Corte, Límite, Saldo para no generar intereses y Pago mínimo).
- **Sistema Mínimo**:
  - Control de Deudas: Tabla dinámica que implementa los dos principales métodos de pago: **Avalancha** (mayor interés primero) y **Bola de Nieve** (menor saldo primero).
  - Presupuesto Mensual: Ingresos, gastos fijos y regla calculada del 50/30/20.
  - Retención de Impuestos: Cálculo del 30% mensual.
  - Gestión de Seguros: Ficha interactiva de contacto rápido para tus pólizas.

### 4. 🛍️ ¿Comprar o no?
- **Acción Inmediata**: Asistente de 5 pasos que calcula el coste real de un producto en base a tus **horas reales de esfuerzo/trabajo** y pautas de espera basadas en el valor del artículo.
- **Pantalla de Emergencia**:
  - **Botón contra Impulsos**: Botón para iniciar una pausa reflexiva de 10 minutos y frases realistas contra el consumismo emocional.
  - **Alivio por Gastos Necesarios**: Mensajes tranquilizadores para eliminar la culpa al realizar gastos cruciales y planificados.

### 5. 🥑 Alimentación (Módulo Independiente)
- **Acción Inmediata**: Lista de "indispensables" interactiva (checked) para el súper (proteínas, verduras, frutas, carbohidratos).
- **Sistema Mínimo**:
  - Notas de alimentación e hidratación diaria.
  - Guías sencillas de recetas rápidas para novatos que no saben cocinar (recetas variadas con huevo cocido y ensalada de atún).

### 6. 🐶 Mis Mascotas (Módulo Independiente)
- **Acción Inmediata**: Perfiles completos para perros y gatos (paseos diarios para perros, entrenamientos, microchip, vacunas, veterinario).
- **Sistema Mínimo**:
  - Cálculo automático de su signo zodiacal en base a su cumpleaños.
  - Avatares visuales SVG interactivos representando fotos de perros o gatos.

### 7. 🚘 Mi Automóvil (Módulo Independiente)
- **Acción Inmediata**: Placas, póliza de seguro, aseguradora, contacto de emergencia de aseguradora.
- **Sistema Mínimo**:
  - Checklists de neumáticos (presión, rotación), aceite, kilometraje.
  - Guía visual interactiva de qué significan los iconos más comunes del tablero (Check Engine, Aceite, Batería, Presión de llantas).

### 8. 🏠 Casa Funcional
- **Acción Inmediata**: Checklist de los **5 Mínimos Diarios** y el **Reset de 15 Minutos** (temporizador activo con cuenta regresiva).
- **Sistema Mínimo**:
  - Guías domésticas interactivas para cambiar un foco de forma segura, subir la palanca de los fusibles tras apagones o usar la lavadora con tips de lavado eficaces.
  - Insumos Periódicos: Lista de control de productos de limpieza recurrentes (jabón de trastes, detergente, etc.).
  - **Qué me pongo**: Recomendador del clima y vestimenta inteligente (cápsula wardrobe) según tu ubicación por geolocalización.

### 9. 🤝 Guías & Vínculos
- **Acción Inmediata**: Guía "Hacer amigos después de los 20/30" con consejos sobre regularidad y guiones interactivos listos para conversar.
- **Sistema Mínimo**:
  - Adulting 101: Manuales de alquiler, impuestos, préstamos estudiantiles y jubilación (401k).
  - Guiones de asertividad telefónica para mitigar la ansiedad social.

---

## 🔒 Privacidad y Control Absoluto de Datos

Toda la información personal introducida se almacena localmente en el dispositivo mediante `localStorage`. Ningún dato se transmite a servidores ni se comparte externamente, respetando de forma estricta los de privacidad-first de la W3C. Puedes realizar copias de seguridad de forma regular descargando el archivo JSON desde la pestaña de Ajustes.

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
