# Fase 3 — Pruebas con personas reales

Material para probar Modo Adulto con 5 a 8 personas de la audiencia, usando la versión web: https://ser-adulto.up.railway.app

Es el QA gate 16 de `docs/bible/CORE.md`: nada está validado hasta que lo revisen personas de la audiencia.

---

## 1. Qué queremos saber

1. **¿Se entiende para qué sirve?** En los primeros segundos, sin explicación.
2. **¿Se pueden hacer las tareas principales sin ayuda?** Agregar, decidir, consultar, borrar y recuperar, ajustar.
3. **¿Cómo se siente?** La Biblia descarta dos fallas: **condescendencia** y **presión**. Buscamos cualquier momento en que la app suene a regaño, a niñería o a urgencia.
4. **¿Qué falta o sobra?** Qué módulos usarían de verdad y cuáles ignorarían.

No estamos midiendo a la persona. Estamos midiendo la app.

---

## 2. A quién invitar

**Cuántas:** 5 a 8 personas. Con 5 ya aparecen la mayoría de los problemas grandes; si a las 5 los hallazgos siguen cambiando mucho, sigue hasta 8.

**Perfil:**
- Personas adultas a quienes algo de la vida administrativa se les complica: pagos, trámites, la casa, el súper. No hace falta que sea todos los días.
- Que usen el celular a diario. Al menos 3 deberían probar en su propio teléfono.
- Mezcla de edades dentro de la audiencia y al menos una persona que no conozcas de cerca (las amistades tienden a ser amables de más).
- Mezcla de formas de pensar y de leer. **No pidas diagnósticos.** La Biblia (CORE 2.5) prohíbe pedir que alguien declare una condición; si una persona lo comparte por su cuenta, anótalo solo con su permiso.

**Guarda los contactos:** Google Play exige una prueba cerrada con 12 personas durante 14 días antes de publicar (Fase 6). Estas personas pueden ser parte de ese grupo.

---

## 3. Antes de cada sesión

- **Duración:** 30 a 40 minutos. Presencial o por videollamada con pantalla compartida.
- **Dispositivo:** idealmente su propio celular. Que abra el enlace en el navegador; no hace falta instalar nada.
- **Datos de ejemplo:** la app trae datos de ejemplo (tareas, deudas, dos mascotas). Están bien para la prueba. **Pide que no escriban datos reales** (números de tarjeta, pólizas, direcciones).
- **Si ya la usó antes en ese teléfono:** sus datos se quedan en el teléfono. Para empezar limpio, que abra el enlace en una ventana privada o de incógnito.
- **Grabar:** solo con permiso explícito. Si no, notas a mano bastan.
- **Agradecimiento:** si puedes, ofrece algo (una tarjeta de regalo pequeña, un café). Es tiempo de otra persona.

---

## 4. Guion para la sesión

Lee o adapta. Lo importante es el tono: tranquilo, sin prisa, sin examen.

### Bienvenida (3 min)

> Gracias por venir. Estoy probando una app que se llama Modo Adulto. Te voy a pedir que hagas algunas cosas con ella.
>
> Estamos probando la app, no a ti. Si algo no sale, es información valiosa sobre la app. No hay respuestas incorrectas.
>
> Te pido que pienses en voz alta: lo que ves, lo que esperas que pase, lo que te confunde. Si te quedas callada o callado un rato, te voy a preguntar "¿qué estás pensando?".
>
> Yo casi no voy a ayudarte, porque quiero ver cómo funciona la app sola. Si te atoras, dime y seguimos con otra cosa.
>
> Puedes parar cuando quieras. ¿Te parece bien que tome notas? ¿Y que grabe la pantalla? (Solo si dijo que sí.)

### Mientras observas

- **No ayudes ni señales.** Si pregunta "¿aquí?", responde: "¿Qué harías si yo no estuviera?".
- **Si se atora más de 2 minutos**, da una pista y anótala como "con ayuda". Si sigue sin poder, pasa a la siguiente tarea.
- **Anota sus palabras exactas**, sobre todo cuando algo le sorprende, le molesta o le hace reír.
- **No defiendas la app.** Si critica algo, solo di "gracias, eso ayuda" o "cuéntame más".
- **Fíjate en el cuerpo:** suspiros, acercar el teléfono a la cara (letra chica), dudar con el dedo encima de un botón.

---

## 5. Las tareas

Léelas una por una, en voz alta, sin decir en qué parte de la app está cada cosa. Después de cada tarea, pregunta:

> Del 1 al 7, ¿qué tan fácil o difícil fue? (1 = muy difícil, 7 = muy fácil)

### Tarea 0 — Primera impresión (1 min)

Abre la app y deja que mire la pantalla de Hoy 10 segundos. Luego:

> Sin tocar nada: ¿para qué crees que sirve esta app? ¿Qué es lo primero que harías?

**Qué buscar:** si entiende que es para el día a día adulto. Si el mensaje del recuadro verde le suena amable o le suena raro.

### Tarea 1 — Una tarea y la ruleta (4 min)

> Tienes que pagar el internet esta semana. Anótalo como pendiente. Luego, deja que la app elija qué haces primero de tu lista.

**Éxito:** agrega "Pagar el internet" (cualquier categoría) y gira la ruleta.
**Qué buscar:** si encuentra Tareas desde el menú. Si entiende para qué sirve la ruleta. Si la ruleta le parece útil o un juguete.

### Tarea 2 — Qué deuda pagar primero (5 min)

> Tienes dos deudas en la app. Quieres saber cuál te conviene pagar primero para pagar menos intereses. Averígualo.

**Éxito:** llega a Dinero, abre la estrategia "Avalancha" y dice cuál deuda va primero (la de mayor interés: Tarjeta de crédito oro, 48 %).
**Qué buscar:** si los nombres "Avalancha" y "Bola de nieve" se entienden o hay que adivinarlos.

### Tarea 3 — ¿Lo compro? (4 min)

> Quieres comprar unos tenis de $1,800 y ganas unos $90 por hora. Usa la app para ver cuánto trabajo te cuestan.

**Éxito:** llega a "¿Comprar o no?" y obtiene unas 20 horas.
**Qué buscar:** si el resultado le cambia la decisión o le parece un sermón.

### Tarea 4 — Qué me pongo (3 min)

> Vas a salir en un rato. Pregúntale a la app qué te conviene ponerte hoy.

**Éxito:** llega a "Qué me pongo", da permiso de ubicación y lee la sugerencia.
**Qué buscar:** cómo reacciona al pedido de ubicación. Si la sugerencia le parece útil o genérica. Si no quiere dar la ubicación, eso también es un resultado: anótalo.

### Tarea 5 — Borrar y recuperar (3 min)

> Borra la deuda "Préstamo personal". (Cuando lo haga:) Uy, era un error. Recupérala.

**Éxito:** usa "Deshacer" antes de que desaparezca el aviso.
**Qué buscar:** si nota el aviso. Si 8 segundos le alcanzan.

### Tarea 6 — Ajustar la app a ti (4 min)

> Imagina que la letra se te hace chica y que vas a usar la app de noche. Ajústala para que te quede cómoda.

**Éxito:** sube el tamaño de texto y activa el modo oscuro.
**Qué buscar:** si encuentra Ajustes. Qué otras opciones le llaman la atención (espacio entre letras, color de acento, reducir movimiento).

### Tarea 7 — Opcional, si hay tiempo: pasar tus datos a otro teléfono (3 min)

> Vas a cambiar de teléfono. ¿Cómo te llevarías lo que tienes guardado en la app?

**Éxito:** encuentra Ajustes → Tus datos → Descargar respaldo.
**Qué buscar:** si entiende que sus datos viven solo en ese teléfono. Esto importa: si se pierde el teléfono, se pierden los datos.

---

## 6. Preguntas de cierre (5 min)

1. ¿Qué fue lo más útil? ¿Lo usarías esta semana? ¿Para qué?
2. ¿Hubo algún momento en que la app te hiciera sentir regañada o regañado, apurada o apurado, o tratada o tratado como principiante?
3. ¿Qué le quitarías? ¿Qué le falta?
4. Si tuvieras que describírsela a alguien en una frase, ¿qué dirías?
5. ¿Pagarías por ella? Si sí, ¿cuánto y cómo: una vez, al año o al mes? (Sirve para la decisión de cobro de la Fase 5.)

---

## 7. Hoja de notas (una por persona)

Copia esta tabla para cada sesión.

**Persona:** P__  **Fecha:** ____  **Dispositivo:** ____  **Presencial / remota:** ____  **¿Grabación autorizada?** Sí / No

| Tarea | Resultado | Facilidad 1–7 | Dónde dudó o se atoró | Palabras textuales |
|---|---|---|---|---|
| 0 Primera impresión | — | — | | |
| 1 Tarea y ruleta | Sola / con pista / no | | | |
| 2 Qué deuda primero | Sola / con pista / no | | | |
| 3 ¿Lo compro? | Sola / con pista / no | | | |
| 4 Qué me pongo | Sola / con pista / no | | | |
| 5 Borrar y recuperar | Sola / con pista / no | | | |
| 6 Ajustes | Sola / con pista / no | | | |
| 7 Respaldo (opcional) | Sola / con pista / no | | | |

**Momentos de condescendencia o presión** (qué pantalla, qué texto, qué dijo):

**Lo más útil para esta persona:**

**Lo que quitaría / lo que falta:**

**Frase para describirla:**

**¿Pagaría? ¿Cuánto y cómo?**

---

## 8. Después de las sesiones: cómo ordenar lo que salió

1. **Junta todos los problemas en una lista.** Uno por renglón: qué pasó, en qué pantalla, cuántas personas.
2. **Dale una gravedad a cada uno:**
   - **Bloquea:** no pudo terminar la tarea sin ayuda.
   - **Confunde:** terminó, pero dudó, se equivocó o lo dijo.
   - **Molesta:** lo notó y no le gustó, pero no le impidió nada.
   - **Tono:** algo sonó a regaño, a niñería o a presión. Para esta app cuenta tanto como "Bloquea".
3. **Ordena por gravedad y luego por cuántas personas lo vivieron.** Lo que bloqueó a 2 o más personas va primero.
4. **Corrige y vuelve a probar** con 2 o 3 personas nuevas solo lo que cambió.

**Fase 3 lista cuando:** ninguna tarea tiene un "Bloquea" de 2 o más personas, ningún problema de tono quedó sin corregir, y el gate 16 tiene nombres (o códigos P1, P2…) y notas reales.

---

## 9. Lo que ya sabemos antes de empezar

Para no gastar tiempo de las sesiones en descubrirlo:

- **La sección de tarjeta de crédito no calcula nada.** Guarda el día de corte y los días para pagar, pero no dice cuándo pagar. El README la llama "calculadora". Hay que decidir si se completa o se cambia el texto.
- **Contenido pensado para Estados Unidos.** Las guías mencionan 401k. Si alguien de México o España lo nota, anótalo: ayuda a decidir el país.
- **Los datos viven solo en el teléfono.** No hay cuenta ni nube. La tarea 7 mide si eso se entiende.
