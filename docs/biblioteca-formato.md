# Formato de la biblioteca: guías, guiones y prendas

Mismo principio que las recetas: mucho contenido guardado como datos, pero la persona entra por **lo que necesita** y ve una cosa a la vez. Nunca listas completas.

País: **México**. Voz: CORE 9 (sin "¡!", sin emojis, sin mayúsculas sostenidas, sin "fácil" ni "principiante", en tú, frases cortas, sin culpa).

Todo el contenido redactado con IA lleva `"revisada": false` hasta que una persona lo revise.

---

## 1. Guías: `public/data/guias.json`

Dudas de la vida adulta. Responden una pregunta concreta y dicen qué hacer.

```json
{
  "id": "rfc-que-es-y-como-sacarlo",
  "necesidad": "impuestos",
  "pregunta": "¿Qué es el RFC y cómo lo saco?",
  "resumen": "Es tu registro ante el SAT. Lo puedes sacar en línea con tu CURP en unos 15 minutos.",
  "etiquetas": ["sat", "rfc", "tramite"],
  "lo_que_necesitas": ["CURP", "Correo electrónico", "Comprobante de domicilio (si lo hace en oficina)"],
  "pasos": [
    { "texto": "Entra a sat.gob.mx y busca \"Inscripción al RFC con CURP\".", "detalle": "Opcional: una aclaración corta." }
  ],
  "ojo": ["Avisos importantes: plazos, multas, errores comunes."],
  "si_no_puedes": "Qué hacer si te atoras: a dónde ir, a quién llamar.",
  "fuentes": ["sat.gob.mx"],
  "vigente_a": "2026-10",
  "revisada": false
}
```

| Campo | Notas |
|---|---|
| `necesidad` | Una de: `impuestos`, `dinero`, `tramites`, `trabajo`, `vivienda`, `salud`, `casa`, `emergencias` |
| `pregunta` | Como la escribiría una persona. Mayúscula solo inicial |
| `resumen` | La respuesta corta en 1–2 frases (máx. 200 caracteres). Si alguien solo lee esto, ya sabe qué hacer |
| `lo_que_necesitas` | Documentos, datos o cosas. Puede ir vacío |
| `pasos` | Una acción por paso, máx. ~35 palabras. `detalle` opcional |
| `ojo` | 0–3 avisos: plazos, multas, trampas. Nunca alarmistas |
| `si_no_puedes` | Siempre hay una salida: oficina, teléfono, quién ayuda (contador, Profeco, etc.) |
| `fuentes` | Dominios oficiales donde se puede confirmar (`sat.gob.mx`, `gob.mx/...`, `imss.gob.mx`, `profeco.gob.mx`). Nunca inventes una URL concreta; el dominio basta |
| `vigente_a` | Año-mes en que se verificó. Las reglas fiscales cambian cada año |

Cifras, plazos y porcentajes (topes de deducción, días de aguinaldo, fechas de declaración, montos de multas) **solo si se verificaron** en una fuente oficial; si no, se describe sin número ("hay un tope; revísalo en el SAT").

## 2. Guiones: `public/data/guiones.json`

Conversaciones que dan ansiedad: llamar, reclamar, decir que no, pedir algo, hacer amistades. Se pueden leer, ensayar línea por línea o convertir en mensaje.

```json
{
  "id": "llamar-para-agendar-cita-medica",
  "necesidad": "llamar",
  "titulo": "Agendar una cita médica por teléfono",
  "situacion": "Necesitas una cita y te cuesta llamar.",
  "objetivo": "Salir de la llamada con fecha y hora.",
  "antes": ["Ten a la mano tu credencial o número de afiliación.", "Piensa en dos horarios que te queden bien."],
  "guion": [
    { "texto": "Hola, buenos días. Quisiera agendar una cita con medicina general." },
    { "texto": "Me quedan bien los {dias} por la {turno}. ¿Tienen algo disponible?" }
  ],
  "si_dicen": [
    { "si": "No hay citas esta semana.", "respondes": "Entiendo. ¿Cuál es la fecha más próxima que tienen?" }
  ],
  "para_cerrar": "Perfecto, entonces quedo el {fecha} a las {hora}. Gracias.",
  "mensaje": "Hola, buen día. Quisiera agendar una cita con medicina general. Me quedan bien los {dias} por la {turno}. ¿Tienen disponibilidad? Gracias.",
  "campos": [
    { "clave": "dias", "etiqueta": "Qué días puedes", "ejemplo": "martes o jueves" },
    { "clave": "turno", "etiqueta": "Mañana o tarde", "ejemplo": "tarde" }
  ],
  "despues": "Ya está. Anota la fecha en tu calendario.",
  "revisada": false
}
```

| Campo | Notas |
|---|---|
| `necesidad` | Una de: `llamar`, `reclamar`, `pedir`, `limites`, `trabajo`, `amistades`, `familia-pareja`, `salud`, `vivienda` |
| `situacion` | Una frase en segunda persona, sin juzgar |
| `antes` | 1–3 cosas para preparar. Pueden incluir una pausa para respirar, sin promesas clínicas |
| `guion` | Líneas que dice la persona, en orden. `{campo}` para lo que ella rellena |
| `si_dicen` | 2–4 respuestas posibles de la otra persona y qué contestar |
| `para_cerrar` | Una frase para terminar la conversación con amabilidad |
| `mensaje` | Versión para WhatsApp o correo, si aplica. Puede ir vacío |
| `campos` | Lo que se rellena; cada `{clave}` del guion o mensaje tiene su campo |
| `despues` | Una frase corta de cierre. Sin celebrar ni exagerar |

Registro: amable y firme, ni sumiso ni agresivo. Usted cuando se habla con instituciones o desconocidos mayores; tú con amistades.

## 3. Prendas: `public/data/prendas.json`

Para "Qué me pongo". La app arma el outfit por capas según el pronóstico del día y la ocasión.

```json
{
  "id": "sueter-ligero",
  "nombre": "Suéter ligero",
  "capa": "media",
  "temp_min": 14,
  "temp_max": 22,
  "lluvia": false,
  "viento": false,
  "ocasiones": ["casual", "trabajo"],
  "nota": "Se quita rápido si sube la temperatura."
}
```

| Campo | Valores |
|---|---|
| `capa` | `base` (lo que va pegado: playera, blusa, camisa), `media` (suéter, cárdigan, sudadera, chaleco), `exterior` (chamarra, abrigo, impermeable, rompevientos), `abajo` (pantalón, falda, short), `calzado`, `accesorio`. Un vestido u overol va con `capa: "base"` y `"completo": true` |
| `temp_min`, `temp_max` | Rango en °C en que la prenda es cómoda **como esa capa** |
| `lluvia` | `true` si protege de la lluvia (impermeable, botas, paraguas) |
| `viento` | `true` si corta el viento |
| `sol` | `true` para accesorios de sol (lentes, gorra, bloqueador) |
| `ocasiones` | `casual`, `trabajo`, `formal`, `ejercicio`, `noche`, `casa` |
| `completo` | Solo en vestidos u overoles: cubren `base` y `abajo` |
| `nota` | Opcional, máx. 80 caracteres |

Nombres neutros y mexicanos (chamarra, playera, sudadera, tenis). Prendas para cualquier persona; nada marcado como "de hombre" o "de mujer".
