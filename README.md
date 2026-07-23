# Modo Adulto® - Guía de Supervivencia (Adulting App Combinada y Unificada)

Una aplicación web de tipo Single Page Application (SPA) y Progressive Web App (PWA) diseñada en español, privada y offline-first, para ayudar a jóvenes adultos y personas neurodivergentes (ADHD/TDAH) a gestionar las responsabilidades cotidianas sin abrumarse.

Esta versión es una **fusión perfecta y combinada** de todas las herramientas anteriores junto con los nuevos módulos interactivos, permitiendo tener un control total de tu vida desde una sola app limpia y responsiva.

---

## 🌟 Estructura Completa de la App

La aplicación unifica todas las herramientas y guías en **9 secciones independientes** accesibles desde la barra de navegación lateral y móvil:

### 1. 🏠 Inicio / Hoy
- **Acción Inmediata**: Vista consolidada de tus mínimos diarios de la casa, estado del clima local, frase de afirmación y panel de alertas críticas ("Hazards").
- **Sistema Mínimo**: Alertas de coche por vencer, cambio de aceite retrasado o facturas de presupuesto vencidas.

### 2. 🎯 Tareas & La Ruleta
- **Acción Inmediata**: La **Ruleta de Decisiones** en HTML5 Canvas con animación de velocidad física y fricción. ¡Gira y deja que la ruleta elija tu siguiente tarea pendiente!
- **Sistema Mínimo**: Gestor de tareas por categorías (Hogar, Trámites, Personal).

### 3. 💳 Dinero sin Drama
- **Acción Inmediata**: Calculadora de fechas de tarjetas de crédito (Corte, Límite, Saldo para no generar intereses y Pago mínimo).
- **Sistema Mínimo**:
  - Control de Deudas: Tabla dinámica que implementa los dos principales métodos de pago: **Avalancha** (mayor interés primero) y **Bola de Nieve** (menor saldo primero).
  - Presupuesto Mensual: Flujo de caja libre e ingresos.
  - Retención de Impuestos: Cálculo del 30% mensual.
  - Gestión de Seguros: Ficha interactiva de contacto rápido para tus pólizas.

### 4. 🛍️ ¿Comprar o no?
- **Acción Inmediata**: Asistente de 5 pasos que calcula el coste real de un producto en base a tus **horas reales de esfuerzo/trabajo** y pautas de espera basadas en el valor del artículo.
- **Pantalla de Emergencia**:
  - **Botón contra Impulsos**: Botón para iniciar una pausa reflexiva de 10 minutos y frases realistas contra el consumismo emocional.
  - **Alivio por Gastos Necesarios**: Mensajes tranquilizadores para eliminar la culpa al realizar gastos cruciales y planificados.

### 5. 🏥 Hábitos & Salud
- **Acción Inmediata**: Registro diario y emocional de alcohol, tabaco o nicotina (hábitos atómicos de James Clear).
- **Sistema Mínimo**:
  - Control de Medicinas: Recetas médicas con dosis y horarios.
  - Mascotas: Perfiles de cuidado (vacunas, veterinario) ¡con el **cálculo automático de su signo zodiacal** por cumpleaños!
  - Alergias y notas de salud personalizadas.

### 6. 🏠 Casa & Garaje
- **Acción Inmediata**: Checklist de los **5 Mínimos Diarios** y el **Reset de 15 Minutos** (temporizador activo con cuenta regresiva).
- **Sistema Mínimo**:
  - Despensa de Emergencia: Guías balanceadas de supervivencia para 3, 5 o 15 días.
  - Insumos Periódicos: Lista de control de productos de limpieza recurrentes.
  - **Garaje**: Registro de vehículos, seguimiento del kilometraje y de los límites recomendados para cambios de aceite, vigencia de pólizas de seguros y consulta de guías de averías.
  - **Qué me pongo**: Recomendador del clima y vestimenta (capsule wardrobe) según tu ubicación.

### 7. 📱 Paz en Redes
- **Acción Inmediata**: Botón de pánico **"Estoy Saturado"** con un temporizador e indicaciones cognitivas para detener el scroll e identificar la comparación social.
- **Sistema Mínimo**:
  - **Caja de Respiración**: Animación circular guiada de 12 segundos (Inhala 4s, Mantén 4s, Exhala 4s).
  - Diario de Gratitud: Espacio privado para registrar tus pensamientos.

### 8. 🤝 Guías & Vínculos
- **Acción Inmediata**: Guía "Hacer amigos después de los 20/30" con consejos sobre regularidad y guiones interactivos listos para conversar.
- **Sistema Mínimo**:
  - Adulting 101: Manuales de alquiler e impuestos.
  - Guiones de asertividad telefónica para mitigar la ansiedad social.

### 9. ⚙️ Ajustes & Autocuidado
- Temas de color (Púrpura, Azul, Verde, Rosa, Naranja), Modo Oscuro, fuentes de accesibilidad y **fuente para dislexia** (Comic Neue).
- Botones de exportación/importación local JSON.
- Lanzador de **Evaluación Semanal** (dinero, consumos, hogar y atención).
- **Modo Mínimo** de emergencia para semanas difíciles.

---

## 🔒 Privacidad y Control Absoluto de Datos

Toda la información personal introducida se almacena localmente en el dispositivo mediante `localStorage`. Ningún dato se transmite a servidores ni se comparte externamente, respetando de forma estricta los principios de privacidad-first. Puedes realizar copias de seguridad de forma regular descargando el archivo JSON desde la pestaña de Ajustes.
