# Modelo de negocio

Decidido el 30 de octubre de 2026. El código está en `public/js/plan.js`.

## Precio

| Plan | Precio | Prueba |
|---|---|---|
| Mensual | $30 MXN al mes | 7 días gratis |
| Anual | $299 MXN al año (dos meses gratis) | 7 días gratis |

Los precios de las tiendas ya incluyen IVA. Apple y Google se quedan con 15 % si la app factura menos de 1 millón de dólares al año (hay que inscribirse a su programa para pequeños negocios).

## Qué es gratis

Todo se puede probar gratis, con límites:

| Función | Gratis | Completo |
|---|---|---|
| Documentos y vencimientos | 3 documentos | Sin límite |
| Pagos fijos y suscripciones | 3 pagos | Sin límite |
| Citas médicas | 2 próximas | Sin límite |
| Contactos de emergencia | 1 | Hasta 5 |
| Recetas | Ver todas | Cocinar paso a paso y recetas según lo que tienes |
| Guías | Vida adulta y guiones | Además, las del SAT y de dinero (ids `sat-` y `din-`) |
| Qué me pongo | Outfit por clima | Además, "Mi clóset" |

Siempre gratis y sin límite: medicinas, luces del tablero, llamar al 911, qué hacer en una emergencia, Hoy, tareas, ¿Comprar o no?, perfil y buscador.

Los límites se cambian en `FREE_LIMITS` de `plan.js`.

## Estado actual

`PAYWALL_ENABLED = false`: nadie ve candados porque todavía no se puede pagar. Para ver cómo se vería, abre la app con `?paywall=1` (por ejemplo `https://ser-adulto.up.railway.app/?paywall=1`); dura hasta cerrar la pestaña, y `?paywall=0` lo quita.

Lo que ya funciona: los límites, los candados en las guías y la pantalla de suscripción con precios, prueba y "Restaurar compra". El botón de comprar todavía solo muestra un aviso.

## Para cobrar de verdad

1. **Cuentas (te tocan a ti):** Apple Developer (99 USD al año), Google Play Console (25 USD una vez) y RevenueCat (gratis hasta cierto ingreso).
2. **Nombre y appId definitivos.** Hoy es `com.seradulto.app`; no se puede cambiar después de publicar.
3. **Productos en las tiendas:** un grupo de suscripción "Modo Adulto completo" con dos productos, `completo_mensual` y `completo_anual`, cada uno con oferta de prueba de 1 semana gratis.
4. **RevenueCat:** un entitlement `completo` con los dos productos; se instala su plugin de Capacitor y `startPurchase()` y `restorePurchases()` de `plan.js` lo llaman. La tienda confirma la compra y la app guarda `state.plan.premium`.
5. **Requisitos de las tiendas:** enlace a términos y a aviso de privacidad en la pantalla de suscripción, botón para restaurar compras (ya está) y explicación clara del cobro después de la prueba (ya está).
6. **Cambiar `PAYWALL_ENABLED` a `true`** solo cuando una compra de prueba funcione en TestFlight y en la prueba interna de Google Play.

## Cuentas de usuario (después)

Con la suscripción de la tienda no hace falta cuenta: la compra va con el Apple ID o la cuenta de Google y se recupera con "Restaurar compra". Las cuentas con correo o "Iniciar sesión con Apple" sirven para usar la app en varios dispositivos y para respaldo en la nube. Requieren:

- Un servidor de cuentas y datos (propuesta: Supabase).
- Botón para borrar la cuenta dentro de la app (lo exigen las tiendas).
- "Iniciar sesión con Apple" obligatorio en iPhone si se ofrece cualquier otro inicio de sesión de terceros, como Google.
- Aviso de privacidad conforme a la ley mexicana de protección de datos, porque se guardarían correos.

## La web

En la web (Railway) se puede cobrar con Stripe o Mercado Pago, que acepta OXXO. RevenueCat también conecta Stripe, así que la misma suscripción serviría en la web y en el teléfono. Queda para después de las tiendas.
