# Plan y casos de prueba — US-001

| Campo | Valor |
| --- | --- |
| Plan | TP-WC-001 |
| Historia | US-001 — Ver palabras, caracteres y las tres palabras más repetidas |
| Épica | EP-WC — Contador de texto en línea |
| Módulo | Editor público de https://wordcounter.net/ |
| Fuente funcional | `docs/historia-de-usuario.md` |
| Automatización | `src/features/word-counter.feature` |
| Última ejecución | 15/10/2026, suite Playwright + Cucumber |
| Evidencia | `reports/allure-report/index.html` y `reports/resumen.md` |

## Objetivo

Comprobar que, sin cambiar opciones, se ve el número de palabras y de caracteres debajo del editor, y las palabras más repetidas en Keyword Density, a la derecha.

## Alcance de la ejecución

| Qué se lee | Dónde | Criterios |
| --- | --- | --- |
| Palabras y caracteres | Pie debajo del editor: `#editor_container .panel-footer span.counted` | CA-01 a CA-13 |
| Palabras más repetidas | Panel `#kwd-density`, filas `a.list-group-item` | CA-01 a CA-09 y CA-11 a CA-13 |

No se cambia ninguna opción. No se inicia sesión. El resumen del título superior y la fila "Characters (no spaces)" no se usan como resultado.

## Estrategia

| Tipo | Casos | Intención |
| --- | --- | --- |
| Flujo principal | TC_WC_001 a TC_WC_004 | Estado inicial, una palabra, espacios y el texto de referencia |
| Flujo negativo | TC_WC_005 a TC_WC_007 | Espacios, puntuación y borrado no dejan residuos |
| Borde | TC_WC_008 a TC_WC_013 | Mayúsculas, stop words, saltos, empates, números y guion |
| Defecto obvio | TC_WC_301, TC_WC_302, TC_WC_303 y TC_WC_306 | El número de abajo y la lista de la derecha no hablan de las mismas palabras. El escenario queda Failed |

## Trazabilidad

| Criterio | Caso | Prioridad | Estado |
| --- | --- | --- | --- |
| CA-01 | TC_WC_001 | Alta | Passed |
| CA-02 | TC_WC_002 | Alta | Passed |
| CA-03 | TC_WC_003 | Alta | Passed |
| CA-04 | TC_WC_004 | Media | Passed |
| CA-05 | TC_WC_005 | Media | Passed |
| CA-06 | TC_WC_006 | Media | Passed |
| CA-07 | TC_WC_007 | Alta | Passed |
| CA-08 | TC_WC_008 | Media | Passed |
| CA-09 | TC_WC_009 | Alta | Passed |
| CA-10 | TC_WC_010 | Media | Passed |
| CA-11 | TC_WC_011 | Media | Passed |
| CA-12 | TC_WC_012 | Media | Passed |
| CA-13 | TC_WC_013 | Media | Passed |
| DEF-WC-003 | TC_WC_301 | Alta | Failed |
| DEF-WC-003 | TC_WC_302 | Alta | Failed |
| DEF-WC-003 | TC_WC_303 | Alta | Failed |
| DEF-WC-003 | TC_WC_306 | Alta | Failed |

Passed quiere decir que el sitio hizo lo que el caso pedía. Failed quiere decir que no. En estos cuatro defectos el plan y la suite usan el mismo estado: Failed. Los caminos negativos (TC_WC_005, TC_WC_006 y TC_WC_007) tienen que quedar Passed.

La captura del defecto se toma cuando el texto ya está pegado y los números ya se ven, antes de la comprobación que falla. Si el escenario pasa, la captura del final también queda guardada.

Corrida del 15/10/2026: 17 escenarios, 13 Passed y 4 Failed. Fallaron solo TC_WC_301, TC_WC_302, TC_WC_303 y TC_WC_306. En los cuatro, el número de abajo coincidió y falló la lista de la derecha. Los caminos negativos pasaron.

## Precondición común

Salvo que el caso diga otra cosa:

1. Abrir https://wordcounter.net/ en escritorio, sin sesión.
2. Dejar la configuración que trae el sitio. "Include common words in word density count" permanece apagada.
3. Confirmar que el editor está vacío antes de pegar el dato del caso.

## Casos de prueba

### TC_WC_001 — El editor vacío inicia en cero

| Campo | Contenido |
| --- | --- |
| ID | TC_WC_001 |
| Título | El editor vacío inicia en cero |
| Componente / Módulo | Editor y Keyword Density |
| Prioridad | Alta |
| Criterio | CA-01 |
| Precondiciones | Precondición común. No pegar texto. |
| Pasos | 1. Abrir la página. 2. Esperar a que el pie debajo del editor muestre un conteo. 3. Leer el pie y las filas de Keyword Density. |
| Datos de prueba | Editor vacío. |
| Resultado esperado | El pie dice `0 words 0 characters`. Keyword Density no lista palabras. |
| Resultado real | El pie mostró `0 words 0 characters` y la densidad quedó sin filas. |
| Estado | Passed |

### TC_WC_002 — Una palabra actualiza los tres indicadores

| Campo | Contenido |
| --- | --- |
| ID | TC_WC_002 |
| Título | Una palabra actualiza palabras, caracteres y densidad |
| Componente / Módulo | Editor y Keyword Density |
| Prioridad | Alta |
| Criterio | CA-02 |
| Precondiciones | Precondición común. |
| Pasos | 1. Pegar el dato en el editor. 2. Esperar a que el pie y Keyword Density queden estables. 3. Leer el resumen y la única fila de densidad. |
| Datos de prueba | `hello` |
| Resultado esperado | Resumen `1 word 5 characters`. Keyword Density: `hello`, 1 repetición, 100%. |
| Resultado real | El resumen y la fila coincidieron con el resultado esperado. |
| Estado | Passed |

### TC_WC_003 — El texto de referencia muestra el top 3

| Campo | Contenido |
| --- | --- |
| ID | TC_WC_003 |
| Título | El texto de referencia muestra palabras, caracteres y el top 3 |
| Componente / Módulo | Editor y Keyword Density |
| Prioridad | Alta |
| Criterio | CA-03 |
| Precondiciones | Precondición común. El archivo se pega con sus saltos de línea. |
| Pasos | 1. Pegar el archivo completo en el editor. 2. Esperar a que el pie y la densidad queden estables. 3. Leer palabras, caracteres y las tres primeras filas. |
| Datos de prueba | Contenido de `docs/texto-a-copiar.md`. |
| Resultado esperado | Resumen `276 words 1,586 characters`. Filas: `words` 5 (3%), `word` 5 (3%), `text` 4 (3%). |
| Resultado real | El pie y las tres primeras filas coincidieron con el resultado esperado. |
| Estado | Passed |

### TC_WC_004 — Los espacios repetidos no crean palabras

| Campo | Contenido |
| --- | --- |
| ID | TC_WC_004 |
| Título | Los espacios repetidos cuentan como caracteres y no como palabras |
| Componente / Módulo | Editor y Keyword Density |
| Prioridad | Media |
| Criterio | CA-04 |
| Precondiciones | Precondición común. |
| Pasos | 1. Pegar el dato, conservando los tres espacios entre las palabras. 2. Leer el pie y las dos filas de densidad. |
| Datos de prueba | `hello   world` |
| Resultado esperado | 2 palabras y 13 caracteres. `hello` 1 (50%) y `world` 1 (50%). |
| Resultado real | El pie contó 2 palabras y 13 caracteres. La densidad mostró las dos palabras al 50%. |
| Estado | Passed |

### TC_WC_005 — Espacios y un salto no crean palabras

| Campo | Contenido |
| --- | --- |
| ID | TC_WC_005 |
| Título | Los espacios y un salto de línea no crean palabras |
| Componente / Módulo | Editor y Keyword Density |
| Prioridad | Media |
| Criterio | CA-05 |
| Precondiciones | Precondición común. |
| Pasos | 1. Pegar tres espacios, un salto de línea y dos espacios. 2. Leer el pie y Keyword Density. |
| Datos de prueba | `   ` + salto de línea + `  ` |
| Resultado esperado | 0 palabras y 5 caracteres. Keyword Density sin filas. |
| Resultado real | El pie contó 0 palabras y 5 caracteres. La densidad quedó vacía. |
| Estado | Passed |

### TC_WC_006 — La puntuación sola no crea palabras

| Campo | Contenido |
| --- | --- |
| ID | TC_WC_006 |
| Título | La puntuación sola no crea palabras |
| Componente / Módulo | Editor y Keyword Density |
| Prioridad | Media |
| Criterio | CA-06 |
| Precondiciones | Precondición común. |
| Pasos | 1. Pegar el dato. 2. Leer el pie y Keyword Density. |
| Datos de prueba | `...` |
| Resultado esperado | 0 palabras y 3 caracteres. Keyword Density sin filas. |
| Resultado real | El pie contó 0 palabras y 3 caracteres. La densidad quedó vacía. |
| Estado | Passed |

### TC_WC_007 — Borrar el texto vuelve a cero

| Campo | Contenido |
| --- | --- |
| ID | TC_WC_007 |
| Título | Borrar el texto devuelve los contadores a cero |
| Componente / Módulo | Editor y Keyword Density |
| Prioridad | Alta |
| Criterio | CA-07 |
| Precondiciones | Precondición común. |
| Pasos | 1. Pegar el dato y confirmar que hay 2 palabras. 2. Borrar todo el editor. 3. Esperar a que el pie y la densidad queden estables. 4. Volver a leer ambos. |
| Datos de prueba | `hello world`, y después editor vacío. |
| Resultado esperado | Tras borrar, el pie dice `0 words 0 characters` y Keyword Density no lista palabras. |
| Resultado real | Después del borrado el pie volvió a cero y la densidad quedó sin filas. |
| Estado | Passed |

### TC_WC_008 — La densidad ignora mayúsculas

| Campo | Contenido |
| --- | --- |
| ID | TC_WC_008 |
| Título | La densidad ignora mayúsculas y agrupa la misma palabra |
| Componente / Módulo | Keyword Density |
| Prioridad | Media |
| Criterio | CA-08 |
| Precondiciones | Precondición común. |
| Pasos | 1. Pegar el dato respetando mayúsculas. 2. Leer el pie y la lista de densidad. |
| Datos de prueba | `Hello hello HELLO` |
| Resultado esperado | 3 palabras y 17 caracteres. Una sola fila: `hello`, 3 repeticiones, 100%. |
| Resultado real | Las tres apariciones quedaron agrupadas en `hello` con 3 repeticiones. |
| Estado | Passed |

### TC_WC_009 — Las stop words no entran en la densidad

| Campo | Contenido |
| --- | --- |
| ID | TC_WC_009 |
| Título | Las stop words se cuentan como palabras y no entran en la densidad |
| Componente / Módulo | Editor y Keyword Density |
| Prioridad | Alta |
| Criterio | CA-09 |
| Precondiciones | Precondición común. La opción de incluir palabras comunes sigue apagada. |
| Pasos | 1. Pegar el dato. 2. Leer el total de palabras y caracteres. 3. Confirmar que `the` no está en la lista y leer las filas visibles. |
| Datos de prueba | `the the the cat cat dog` |
| Resultado esperado | 6 palabras y 23 caracteres. `the` ausente. `cat` 2 (67%) y `dog` 1 (33%). |
| Resultado real | El total fue 6 y 23. La densidad mostró solo `cat` y `dog`. |
| Estado | Passed |

### TC_WC_010 — El salto de línea no suma un carácter

| Campo | Contenido |
| --- | --- |
| ID | TC_WC_010 |
| Título | El salto de línea separa palabras y no suma un carácter |
| Componente / Módulo | Editor |
| Prioridad | Media |
| Criterio | CA-10 |
| Precondiciones | Precondición común. |
| Pasos | 1. Pegar las dos palabras separadas por un solo salto de línea. 2. Leer el pie debajo del editor. |
| Datos de prueba | `hello` + salto de línea + `world` |
| Resultado esperado | 2 palabras y 10 caracteres. |
| Resultado real | El pie contó 2 palabras y 10 caracteres. |
| Estado | Passed |

### TC_WC_011 — El empate se ordena por aparición

| Campo | Contenido |
| --- | --- |
| ID | TC_WC_011 |
| Título | Un empate de repeticiones se ordena por la primera aparición |
| Componente / Módulo | Keyword Density |
| Prioridad | Media |
| Criterio | CA-11 |
| Precondiciones | Precondición común. |
| Pasos | 1. Pegar el dato. 2. Leer las filas de Keyword Density en el orden en que aparecen. |
| Datos de prueba | `alpha beta alpha gamma beta` |
| Resultado esperado | `alpha` 2 (40%), `beta` 2 (40%), `gamma` 1 (20%). |
| Resultado real | La lista respetó ese orden y esos conteos. |
| Estado | Passed |

### TC_WC_012 — Los números no aparecen en la densidad

| Campo | Contenido |
| --- | --- |
| ID | TC_WC_012 |
| Título | Los números cuentan como palabras y no aparecen en Keyword Density |
| Componente / Módulo | Editor y Keyword Density |
| Prioridad | Media |
| Criterio | CA-12 |
| Precondiciones | Precondición común. |
| Pasos | 1. Pegar el dato. 2. Leer el pie y las filas de densidad. |
| Datos de prueba | `123 456` |
| Resultado esperado | 2 palabras y 7 caracteres. Keyword Density sin filas. |
| Resultado real | El pie contó 2 palabras y 7 caracteres. La densidad quedó vacía. |
| Estado | Passed |

### TC_WC_013 — El guion no parte la palabra

| Campo | Contenido |
| --- | --- |
| ID | TC_WC_013 |
| Título | Una palabra con guion cuenta como una sola |
| Componente / Módulo | Editor y Keyword Density |
| Prioridad | Media |
| Criterio | CA-13 |
| Precondiciones | Precondición común. |
| Pasos | 1. Pegar el dato. 2. Leer el pie y la fila de densidad. |
| Datos de prueba | `word-count` |
| Resultado esperado | 1 palabra y 10 caracteres. Keyword Density: `word-count`, 1 repetición, 100%. |
| Resultado real | El texto contó como una palabra y la densidad mostró `word-count`. |
| Estado | Passed |

### TC_WC_301 — Una dirección web se cuenta igual abajo y a la derecha

| Campo | Contenido |
| --- | --- |
| ID | TC_WC_301 |
| Título | Una dirección web se cuenta igual abajo y a la derecha |
| Componente / Módulo | Editor y Keyword Density |
| Prioridad | Alta |
| Criterio | DEF-WC-003. No está en los criterios del cliente. Lo encontramos al probar textos con signos. |
| Precondiciones | Precondición común. |
| Pasos | 1. Pegar el dato. 2. Esperar a que el número de abajo y la lista de la derecha dejen de cambiar. 3. Sacar la foto en ese momento. 4. Comparar el número con las filas. |
| Datos de prueba | `https://example.com/foo` |
| Resultado esperado | Abajo: 3 palabras y 23 caracteres. A la derecha, las mismas tres palabras: `https`, `example.com` y `foo`, una vez cada una (33%). |
| Resultado real | Abajo dice 3 palabras. A la derecha hay cuatro filas: `https`, `example`, `com` y `foo`, cada una al 25%. |
| Estado | Failed |
| Evidencia | `DEF-WC-003-url.png`, tomada antes de la comprobación que falla. |

### TC_WC_302 — Un correo se cuenta igual abajo y a la derecha

| Campo | Contenido |
| --- | --- |
| ID | TC_WC_302 |
| Título | Un correo se cuenta igual abajo y a la derecha |
| Componente / Módulo | Editor y Keyword Density |
| Prioridad | Alta |
| Criterio | DEF-WC-003. No está en los criterios del cliente. |
| Precondiciones | Precondición común. |
| Pasos | 1. Pegar el dato. 2. Esperar el recálculo. 3. Sacar la foto. 4. Leer el número de abajo y la lista. |
| Datos de prueba | `user@mail.com` |
| Resultado esperado | 1 palabra y 13 caracteres. En la lista, una sola fila: `user@mail.com`, 1 vez (100%). |
| Resultado real | Abajo dice 1 palabra. La lista muestra `user`, `mail` y `com`, cada una al 33%. |
| Estado | Failed |
| Evidencia | `DEF-WC-003-correo.png`. |

### TC_WC_303 — word--word se cuenta igual abajo y a la derecha

| Campo | Contenido |
| --- | --- |
| ID | TC_WC_303 |
| Título | word--word se cuenta igual abajo y a la derecha |
| Componente / Módulo | Editor y Keyword Density |
| Prioridad | Alta |
| Criterio | DEF-WC-003. No está en los criterios del cliente. |
| Precondiciones | Precondición común. |
| Pasos | 1. Pegar el dato. 2. Esperar el recálculo. 3. Sacar la foto. 4. Leer el número de abajo y la lista. |
| Datos de prueba | `word--word` |
| Resultado esperado | Abajo hay 2 palabras. La lista muestra `word` con 2 repeticiones (100%), porque esas son las dos palabras que contó el pie. |
| Resultado real | Abajo dice 2 palabras. La lista muestra una sola fila, `word--word`, 1 vez (100%). |
| Estado | Failed |
| Evidencia | `DEF-WC-003-doble-guion.png`. |

### TC_WC_306 — Tres guiones no crean una palabra ni una fila

| Campo | Contenido |
| --- | --- |
| ID | TC_WC_306 |
| Título | Tres guiones no crean una palabra ni una fila |
| Componente / Módulo | Editor y Keyword Density |
| Prioridad | Alta |
| Criterio | DEF-WC-003. Mismo tipo de error que los tres casos anteriores. `...` (TC_WC_006) sí queda en cero y sin filas. |
| Precondiciones | Precondición común. |
| Pasos | 1. Pegar el dato. 2. Esperar el recálculo. 3. Sacar la foto. 4. Leer el número de abajo y la lista. |
| Datos de prueba | `---` |
| Resultado esperado | 0 palabras, 3 caracteres y la lista vacía. |
| Resultado real | Abajo dice 0 palabras y 3 caracteres. La lista igual muestra `---` al 100%. |
| Estado | Failed |
| Evidencia | `DEF-WC-003-solo-guiones.png`. |

## Evidencia

Cada escenario guarda una captura y el tramo de `DEBUG=pw:api`. En los cuatro defectos, además, hay una foto con nombre `DEF-WC-003-....png` tomada cuando el error ya se ve en la página, antes de la comprobación que falla. El HTML está en `reports/allure-report/index.html`. El conteo está en `reports/resumen.md`. La ficha del defecto está en `docs/issues/DEF-WC-003.md`.
