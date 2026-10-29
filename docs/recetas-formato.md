# Formato de las recetas

Las recetas viven en `public/data/recetas.json`: una lista de objetos con este formato. La app las filtra, busca y muestra de una en una; nunca enseña la lista entera.

```json
{
  "id": "chilaquiles-verdes-rapidos",
  "titulo": "Chilaquiles verdes rápidos",
  "resumen": "Totopos con salsa verde caliente, crema y queso. Listos en 15 minutos.",
  "comida": ["desayuno"],
  "utensilios": ["sarten"],
  "minutos": 15,
  "energia": "poca",
  "porciones": 2,
  "etiquetas": ["vegetariana", "economica"],
  "ingredientes": [
    { "clave": "totopos", "texto": "2 tazas de totopos" },
    { "clave": "salsa-verde", "texto": "1 taza de salsa verde" },
    { "clave": "crema", "texto": "Crema al gusto", "opcional": true }
  ],
  "pasos": [
    { "texto": "Calienta la salsa en el sartén a fuego medio hasta que hierva." },
    { "texto": "Agrega los totopos y mueve hasta que se cubran.", "minutos": 2 }
  ],
  "seguridad": "",
  "consejo": "Si los totopos están duros, déjalos un minuto más en la salsa."
}
```

## Campos

| Campo | Valores | Notas |
|---|---|---|
| `id` | minúsculas-con-guiones, único | |
| `titulo` | texto, mayúscula solo inicial | Sin emojis, sin "¡!", sin adjetivos de venta ("increíble", "deliciosa") |
| `resumen` | una frase, máx. 120 caracteres | Qué es y cuánto tarda |
| `comida` | `desayuno`, `comida`, `cena`, `botana`, `postre` | Una o varias |
| `utensilios` | `freidora`, `sarten`, `olla`, `microondas`, `horno`, `licuadora`, `sin-cocinar` | Lo que hace falta además de cuchillo, tabla y platos |
| `minutos` | entero | Tiempo total real, incluido picar |
| `energia` | `poca`, `normal`, `ganas` | `poca`: ≤ 15 min, ≤ 5 pasos, casi sin picar. `ganas`: más pasos o técnica |
| `porciones` | entero | |
| `etiquetas` | `vegetariana`, `sin-carne`, `alta-proteina`, `economica`, `sin-gluten`, `sin-lacteos`, `para-llevar`, `una-sola-olla` | Solo las que apliquen de verdad |
| `ingredientes[].clave` | una clave de la lista de despensa de abajo | Para "¿Qué tengo?" y la lista del súper |
| `ingredientes[].texto` | cantidad + ingrediente, como se lee | |
| `ingredientes[].opcional` | `true` si la receta funciona sin él | |
| `pasos[].texto` | una acción por paso, máx. ~30 palabras, en tú | |
| `pasos[].minutos` | entero, solo si el paso es esperar o cocinar un tiempo | La app ofrece un temporizador |
| `seguridad` | texto o vacío | Temperaturas internas, alergias, manejo de pollo crudo |
| `consejo` | texto o vacío | Un truco o una sustitución |

Sal, pimienta, aceite y agua se dan por hecho: no llevan clave (`"clave": "basico"`).

## Claves de despensa

Si un ingrediente no está aquí, usa la clave más cercana o agrégala a esta lista y al catálogo de `public/index.html` (`PANTRY_ITEMS`).

- **Básicos:** `basico` (sal, pimienta, aceite, agua, azúcar)
- **Huevo y lácteos:** `huevo`, `leche`, `crema`, `yogur`, `mantequilla`, `queso-panela`, `queso-oaxaca`, `queso-manchego`, `queso-fresco`, `queso-crema`, `leche-condensada`, `leche-evaporada`
- **Tortillas y panes:** `tortilla-maiz`, `tortilla-harina`, `tostadas`, `totopos`, `pan-caja`, `bolillo`, `pan-molido`
- **Granos y secos:** `arroz`, `pasta`, `fideo`, `avena`, `frijoles`, `lentejas`, `garbanzos`, `harina`, `granola`
- **Proteínas:** `pollo-pechuga`, `pollo-piezas`, `pollo-cocido`, `carne-molida`, `bistec`, `chuleta-cerdo`, `salchicha`, `jamon`, `chorizo`, `atun-lata`, `filete-pescado`, `camaron`, `tofu`
- **Verduras:** `jitomate`, `cebolla`, `ajo`, `papa`, `zanahoria`, `calabacita`, `elote`, `chayote`, `espinaca`, `lechuga`, `pepino`, `brocoli`, `champinones`, `pimiento`, `nopales`, `chicharos`, `ejotes`, `camote`, `cilantro`, `verduras-congeladas`
- **Chiles y salsas:** `chile-serrano`, `chile-jalapeno`, `chipotle-lata`, `salsa-verde`, `salsa-roja`, `salsa-soya`, `mayonesa`, `mostaza`, `catsup`, `consome-pollo`
- **Frutas:** `limon`, `aguacate`, `platano`, `platano-macho`, `manzana`, `fresa`, `mango`, `naranja`, `frutos-rojos-congelados`
- **Otros:** `cacahuate`, `crema-cacahuate`, `miel`, `canela`, `vainilla`, `chocolate`, `galletas-maria`, `gelatina`

## Voz (CORE 9)

- Sin "¡!", sin emojis, sin mayúsculas sostenidas, sin "fácil" ni "para principiantes": la persona no es principiante en la vida.
- En tú, frases cortas, una acción por paso.
- Nombres mexicanos: jitomate, chícharos, elote, frijoles, crema, bolillo.
- Si algo puede salir mal, se dice qué hacer, no que se hizo mal.

## Seguridad

- Pollo y cerdo: cocinar hasta que no haya partes rosadas y los jugos salgan claros (74 °C por dentro si hay termómetro).
- Freidora de aire: indicar temperatura en °C y tiempo, y si se precalienta. Pedir voltear o agitar a la mitad.
- Las recetas son borradores redactados con IA: hay que cocinarlas y revisarlas antes de darlas por buenas. Cada receta revisada se marca en `revisada: true` (por defecto `false`).
