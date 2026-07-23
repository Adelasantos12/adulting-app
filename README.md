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

---

# 📱 GUÍA DE PRODUCCIÓN: APPS MÓVILES, MONETIZACIÓN Y ESCALABILIDAD

Si deseas convertir esta aplicación web estática (`SerAdulto`) en una aplicación móvil oficial disponible en la **Apple App Store** y **Google Play Store**, que permita el registro de usuarios, cobre una suscripción anual de **$2.00 USD**, implemente altos estándares de seguridad y escale a **miles de usuarios simultáneos en múltiples países de habla hispana**, sigue esta hoja de ruta técnica paso a paso.

---

## 🛠️ FASE 1: Empaquetar para iOS y Android (Capacitor vs React Native)

Para reutilizar todo el código actual de HTML5, Tailwind CSS y JS nativo en lugar de reescribir la app desde cero, la herramienta idónea es **Capacitor.js** (desarrollada por Ionic). Permite convertir cualquier proyecto web estático en una App Nativa híbrida.

### Pasos para empaquetar con Capacitor:
1. **Instala Capacitor en tu proyecto:**
   ```bash
   npm install @capacitor/core @capacitor/cli
   npx cap init "SerAdulto" "com.seradulto.app" --web-dir=.
   ```
2. **Añade las plataformas nativas:**
   ```bash
   npm install @capacitor/android @capacitor/ios
   npx cap add android
   npx cap add ios
   ```
3. **Sincroniza el código web con las carpetas nativas:**
   ```bash
   npx cap sync
   ```
4. **Abrir en editores nativos:**
   - **Android**: `npx cap open android` (Abrirá Android Studio para compilar el archivo `.aab` para Google Play).
   - **iOS**: `npx cap open ios` (Abrirá Xcode en macOS para compilar la app y firmarla para el App Store).

---

## 🔐 FASE 2: Autenticación Segura y Privada (Sign-In)

Dado que la app está diseñada para ser **"Privacy-First"**, debes mantener la autenticación lo más limpia posible.

1. **Autenticación sin Contraseña (Federada)**:
   - **Apple Sign-In** (Obligatorio en iOS si ofreces otros métodos sociales).
   - **Google Sign-In** (El estándar en Android).
2. **Implementación de Clientes**:
   - Utiliza **Firebase Authentication** junto con el plugin oficial `@capacitor-firebase/authentication`. Firebase gestionará de forma segura las llaves, validará los JSON Web Tokens (JWT) y te dará un UID único por usuario de forma gratuita.
3. **Base de Datos de Usuarios**:
   - Almacena el UID de Firebase del usuario y su estado de suscripción en una base de datos segura en la nube (ej. **PostgreSQL** o **Supabase**), pero mantén sus datos de tareas, diario y mascotas **locales en el dispositivo (cifrados)** para respetar la filosofía de privacidad del proyecto original.

---

## 💳 FASE 3: Cobro de Suscripción Anual ($2 USD/año)

Las App Stores (Apple y Google) prohíben estrictamente el uso de pasarelas de pago externas (como Stripe o PayPal) para la compra de contenidos digitales o suscripciones dentro de la app (In-App Purchases). Si las usas, rechazarán tu app.

### La solución estándar de la industria: RevenueCat
**RevenueCat** actúa como un backend unificado que se conecta con Apple App Store (StoreKit) y Google Play (Billing Library) y expone un SDK sencillo para Capacitor.

1. **Registra tus Productos**:
   - En **App Store Connect**: Crea una "Suscripción Auto-renovable" llamada `seradulto_anual` con un precio equivalente a **$1.99 USD** (las App Stores tienen matrices de precios locales automáticas en euros, pesos mexicanos, pesos colombianos, etc.).
   - En **Google Play Console**: Registra el mismo ID de suscripción con su precio regional.
2. **Instala RevenueCat**:
   ```bash
   npm install @revenuecat/purchases-capacitor
   ```
3. **Lógica de Bloqueo en JS**:
   - Al iniciar la app, consulta a RevenueCat si el usuario tiene una suscripción activa:
     ```javascript
     import { Purchases } from '@revenuecat/purchases-capacitor';

     const customerInfo = await Purchases.getCustomerInfo();
     if (customerInfo.entitlements.active['premium']) {
         // Permitir acceso completo a la app
     } else {
         // Mostrar pantalla de pago (Paywall)
     }
     ```

---

## 🔒 FASE 4: Comprobación de Seguridad (Security Checklist)

Para que las tiendas aprueben tu app y protejas a tus usuarios de hackeos:

1. **Cifrado de Datos Locales**:
   - `localStorage` de los navegadores web no está cifrado. En dispositivos móviles, debes migrar a **Capacitor Secure Storage** (`@capacitor-community/secure-storage`), que utiliza el **Keystore** de Android y el **Keychain** de iOS para cifrar los datos en el disco duro del móvil.
2. **OWASP Mobile Top 10**:
   - **Seguridad en Tránsito (HTTPS)**: Todas las peticiones a APIs externas (Open-Meteo, Firebase, RevenueCat) deben realizarse obligatoriamente sobre canales HTTPS seguros con certificado SSL/TLS vigente.
   - **SSL Pinning**: Protege tu app contra ataques Man-In-The-Middle (interceptación de peticiones) utilizando el plugin `@capacitor-community/http` configurando certificados anclados.
3. **Prueba de Penetración Básica**:
   - Comprueba que la consola del dispositivo no imprima datos sensibles (claves, tokens de Firebase) en entornos de producción (`console.log`).

---

## 🚀 FASE 5: Infraestructura de Nube Escalable para miles de usuarios

Para soportar miles de usuarios en España, México, Colombia, Argentina, etc., sin latencia y con alta disponibilidad:

```
[Usuario Móvil] ──> [Cloudflare CDN / DNS] ──> [Balanceador de Carga] ──> [Servidores Express en Railway / AWS] ──> [Supabase/PostgreSQL (Réplicas de Lectura)]
```

### 1. Servidor Stateless (Express en Railway)
El código de tu backend (en nuestro caso `server.js`) debe ser completamente **stateless** (sin guardar sesiones locales en archivos o memoria).
- Despliega en **Railway** usando su escalado horizontal automático (Autoscaling) basado en consumo de CPU/Memoria.
- Si la carga de peticiones sube, Railway levantará múltiples instancias de tu servidor Express de forma automática.

### 2. CDN y Caché Geográfica (Cloudflare)
- Apunta tus dominios a **Cloudflare**.
- Cloudflare interceptará las llamadas, protegerá tus servidores de ataques DDoS (Denegación de Servicio), y servirá las secciones estáticas directamente desde servidores locales en Madrid, Ciudad de México, Bogotá, etc., reduciendo la carga de tus servidores al 5%.

### 3. Base de Datos Escalable (Supabase / PostgreSQL)
- **Supabase** es excelente para escalar. Su base de datos PostgreSQL integrada permite configurar réplicas de lectura automáticas y tiene soporte nativo para gestionar picos masivos de conexiones con **PgBouncer**.

---

## 📝 FASE 6: Proceso de Publicación en Tiendas

### En Google Play Store (Android):
1. Crea una cuenta de Desarrollador en [Google Play Console](https://play.google.com/console) ($25 USD pago único).
2. Sube el paquete de la app compilado en Android Studio (`.aab`).
3. Completa los cuestionarios obligatorios (política de privacidad, clasificación de edad, recopilación de datos de seguridad).
4. Google requiere obligatoriamente que realices una **Prueba Cerrada** con al menos 20 usuarios activos durante 14 días antes de permitirte publicar en producción.

### En Apple App Store (iOS):
1. Crea una cuenta de Desarrollador en [Apple Developer Program](https://developer.apple.com) ($99 USD anuales).
2. Sube la compilación de tu app usando **Xcode** o **Transporter** en macOS.
3. Configura la página del producto en **App Store Connect** con capturas de pantalla de la app en iPhone y iPad.
4. Redacta de forma muy transparente las directrices de privacidad en la sección **App Privacy** indicando que los datos personales nunca se comparten fuera del dispositivo del usuario.
5. Envía a revisión por el equipo de Apple (suele tomar de 24 a 48 horas).
