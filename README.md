# SerAdulto® - Tu Guía de Supervivencia (Adulting App en Español)

Una aplicación web interactiva de tipo Single Page Application (SPA) y Progressive Web App (PWA) inspirada en **Get Adulting**, diseñada específicamente en español para ayudar a jóvenes adultos y personas neurodivergentes (ADHD/TDAH) a gestionar las responsabilidades cotidianas sin abrumarse.

## 🌟 Características Clave

1. **100% Privada y Offline-First**: Todos tus datos personales (salud, finanzas, tareas, vehículos y notas personales) se almacenan localmente en tu navegador a través de `localStorage`. Nada se envía a servidores externos ni se comparte con terceros.
2. **Dashboard de Supervivencia**: Alertas visuales destacadas ("Hazards") sobre mantenimientos de coche atrasados o facturas vencidas antes de tu próximo pago.
3. **Tareas y la Ruleta de Decisiones**: Un gestor de tareas amigable con una ruleta animada en un lienzo interactivo (HTML5 Canvas). Si sufres de parálisis por análisis, ¡deja que la ruleta elija una tarea pendiente por ti!
4. **Mi Garaje**: Registra hasta 4 vehículos, realiza un seguimiento de su kilometraje y de los límites recomendados para cambios de aceite, vigencia de pólizas de seguros y consulta guías paso a paso offline sobre cómo cambiar una rueda o pasar corriente a la batería de forma segura.
5. **Mi Presupuesto**: Controla tus ingresos y facturas sin necesidad de conectar tu cuenta bancaria. Incorpora una sección educativa de la regla financiera **50/30/20** adaptada a tus ingresos reales calculados en tiempo real.
6. **Salud y Mascotas**: Perfiles para llevar el control de vacunas, recetas médicas con alarmas y perfiles para tus mascotas (¡incluyendo el cálculo zodiacal automático basado en su cumpleaños!).
7. **Adulting 101**: Guías interactivas y breves para entender temas complejos como el alquiler de departamentos o los impuestos de forma directa, además de **guiones telefónicos interactivos** diseñados para mitigar la ansiedad social.
8. **Salud Mental y Paz**: Módulo de relajación con un ejercicio circular guiado de respiración en caja (Inhala 4s, Mantén 4s, Exhala 4s) y un diario privado.
9. **Personalización Absoluta**:
   - Selector dinámico de temas de color (Púrpura, Azul, Verde, Rosa, Naranja).
   - Selector de fuentes amigables para personas con dislexia (Comic Neue).
   - Ajuste de tamaño de textos para mejorar la accesibilidad visual.
   - Herramientas para **Exportar** e **Importar** copias de seguridad de todos tus datos en un solo archivo JSON seguro.

## 🛠️ Tecnologías Utilizadas

- **HTML5**: Estructura semántica avanzada.
- **Tailwind CSS**: Estilos responsivos (Mobile-first) con soporte nativo de modo oscuro.
- **JavaScript (ES6+)**: Gestión de estado reactivo local y animaciones del canvas para la ruleta.
- **Lucide Icons**: Iconografía moderna y limpia para cada sección.

## 🚀 Cómo Ejecutar la Aplicación

No requiere servidores, compilación de node_modules ni bases de datos complejas. Puedes ejecutarla de la siguiente manera:

1. Clona el repositorio o descarga el archivo `index.html`.
2. Haz doble clic sobre `index.html` para abrirlo en cualquier navegador web moderno (Chrome, Safari, Firefox, Edge, etc.).
3. ¡Eso es todo! Puedes comenzar a organizar tu vida con total privacidad de datos.

## ☁️ Cómo Desplegar en Railway (Paso a Paso)

Railway es una de las formas más rápidas y sencillas de desplegar esta aplicación de forma gratuita o con un costo mínimo. Sigue estos sencillos pasos:

### Paso 1: Sube la aplicación a GitHub
1. Crea un repositorio privado o público en tu cuenta de GitHub.
2. Sube estos tres archivos principales:
   - `index.html` (La SPA/PWA con toda la interfaz de la aplicación).
   - `server.js` (El microservidor Express para entregar el sitio estático).
   - `package.json` (Las especificaciones de dependencias para Node.js).

### Paso 2: Configura tu cuenta en Railway
1. Ve a [railway.app](https://railway.app) e inicia sesión con tu cuenta de GitHub.
2. Si es tu primera vez, puedes vincular una tarjeta o usar los créditos gratuitos si están disponibles.

### Paso 3: Crea un nuevo proyecto en Railway
1. En tu panel de control de Railway, haz clic en **New Project** (Nuevo Proyecto).
2. Elige la opción **Deploy from GitHub repo** (Desplegar desde repositorio de GitHub).
3. Selecciona el repositorio donde subiste la aplicación `seradulto-app`.

### Paso 4: Despliegue automático
1. Railway detectará automáticamente el archivo `package.json` y que es un proyecto de Node.js.
2. Ejecutará automáticamente `npm install` para descargar Express y `npm start` para levantar el servidor en el puerto dinámico asignado por el sistema (`process.env.PORT`).
3. Una vez finalizada la construcción, ve a la pestaña **Settings** (Configuración) de tu servicio en Railway y en la sección **Environment** (Entorno), haz clic en **Generate Domain** (Generar Dominio) para obtener una URL pública (ejemplo: `seradulto-production.up.railway.app`).

¡Listo! Ya tienes tu aplicación de supervivencia personal 100% en español accesible desde cualquier dispositivo móvil o computadora de forma totalmente privada y rápida.

## 🧥 Módulo Integrado: "Qué me pongo" (Recomendador de Ropa)

Este módulo está inspirado y adaptado del proyecto libre `outfitready` adaptado al español.

- **Geolocalización 100% Local**: Consulta las coordenadas de latitud y longitud actuales a través de la API nativa del navegador bajo el consentimiento explícito del usuario.
- **Predicción Meteorológica**: Se conecta de forma anónima con la API gratuita de **Open-Meteo** para descodificar las variables de temperatura (°C), velocidad del viento (km/h) y código de lluvia/nieve (WMO codes).
- **Matriz de Recomendaciones**:
  - Clasifica las temperaturas en 5 franjas clave: **Calor** (>=25°C), **Cálido** (>=18°C), **Templado** (>=10°C), **Fresco** (>=3°C) y **Muy Frío** (<3°C).
  - Sugiere un outfit principal de ropa del **guardarropa cápsula** (pantalones de vestir, chinos, jeans, camisa Oxford, blazer, suéteres, abrigos, tenis blancos o botines) adaptado dinámicamente a la formalidad de tu día: **Casual**, **Trabajo**, **Evento Social** o **Gala**.
  - Propone variaciones inteligentes alternativas si decides cambiar alguna de tus capas principales.
- **Modificadores del Clima**: Adapta automáticamente el calzado de tenis blancos a botas oscuras o botines en caso de lluvia extrema, y añade accesorios preventivos como **paraguas** o **bufandas** si detecta tormentas o nevadas inminentes.
