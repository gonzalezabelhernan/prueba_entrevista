# Historia de usuario — Contadores de WordCounter

| Campo | Valor |
| --- | --- |
| Título | Ver palabras, caracteres y las tres palabras más repetidas |
| ID | US-001 |
| Épica | EP-WC — Contador de texto en línea |
| Módulo | Editor público de https://wordcounter.net/ |
| Solicitante | Farmatodo — Ingeniería de Calidad |
| Estado | Lista para validar |
| Prioridad | Alta |

## Historia

Como autor que redacta o pega un texto en WordCounter, quiero ver de inmediato cuántas palabras y cuántos caracteres lleva el texto, y cuáles son las tres palabras que más repito, para saber si cumplo un límite de extensión y si estoy concentrando el vocabulario en pocos términos.

## Contexto

La historia cubre la configuración por defecto del sitio, sin cuenta y sin cambiar opciones. El visitante escribe o pega en el editor. Debajo de esa ventana el sistema muestra un resumen con el formato `N words M characters`. A la derecha, el panel Keyword Density lista las palabras más usadas, cada una con sus repeticiones y un porcentaje.

## Criterios de aceptación

### CA-01 — Estado inicial

Dado que el autor abre https://wordcounter.net/ con la configuración por defecto,  
cuando la página termina de cargar y el editor está vacío,  
entonces el resumen debajo del editor dice `0 words 0 characters` y Keyword Density no lista palabras.

### CA-02 — Una palabra

Dado que el autor está en el editor vacío,  
cuando pega `hello`,  
entonces el resumen dice `1 word 5 characters` y Keyword Density muestra solo `hello` con 1 repetición (100%).

### CA-03 — Texto de referencia

Dado que el autor está en el editor vacío,  
cuando pega el contenido de `docs/texto-a-copiar.md`,  
entonces el resumen dice `276 words 1,586 characters` y las tres primeras filas de Keyword Density son:

| Orden | Palabra | Repeticiones | Porcentaje mostrado |
| --- | --- | --- | --- |
| 1 | words | 5 | 3% |
| 2 | word | 5 | 3% |
| 3 | text | 4 | 3% |

### CA-04 — Espacios repetidos

Dado que el autor está en el editor vacío,  
cuando pega `hello   world`,  
entonces el resumen cuenta 2 palabras y 13 caracteres, y Keyword Density muestra `hello` y `world` con 1 repetición cada una (50%).

### CA-05 — Solo espacios y un salto de línea

Dado que el autor está en el editor vacío,  
cuando pega tres espacios, un salto de línea y dos espacios,  
entonces el resumen cuenta 0 palabras y 5 caracteres, y Keyword Density no lista palabras.

### CA-06 — Solo puntuación

Dado que el autor está en el editor vacío,  
cuando pega `...`,  
entonces el resumen cuenta 0 palabras y 3 caracteres, y Keyword Density no lista palabras.

### CA-07 — Borrar el texto

Dado que el editor contiene `hello world` y el resumen muestra 2 palabras,  
cuando el autor borra todo el texto,  
entonces el resumen vuelve a `0 words 0 characters` y Keyword Density queda sin palabras.

### CA-08 — Mayúsculas

Dado que el autor está en el editor vacío,  
cuando pega `Hello hello HELLO`,  
entonces el resumen cuenta 3 palabras y 17 caracteres, y Keyword Density agrupa las tres apariciones en `hello` con 3 repeticiones (100%).

### CA-09 — Palabras comunes

Dado que la opción "Include common words in word density count" está apagada,  
cuando el autor pega `the the the cat cat dog`,  
entonces el resumen cuenta 6 palabras y 23 caracteres, Keyword Density no contiene `the`, y lista `cat` con 2 repeticiones (67%) y `dog` con 1 (33%).

### CA-10 — Salto de línea

Dado que el autor está en el editor vacío,  
cuando pega `hello` y `world` separados por un salto de línea,  
entonces el resumen cuenta 2 palabras y 10 caracteres.

### CA-11 — Empate de repeticiones

Dado que el autor está en el editor vacío,  
cuando pega `alpha beta alpha gamma beta`,  
entonces Keyword Density ordena `alpha` con 2 (40%), `beta` con 2 (40%) y `gamma` con 1 (20%).

### CA-12 — Números

Dado que el autor está en el editor vacío,  
cuando pega `123 456`,  
entonces el resumen cuenta 2 palabras y 7 caracteres, y Keyword Density no lista palabras.

### CA-13 — Palabra con guion

Dado que el autor está en el editor vacío,  
cuando pega `word-count`,  
entonces el resumen cuenta 1 palabra y 10 caracteres, y Keyword Density muestra `word-count` con 1 repetición (100%).

## Reglas de negocio

1. Una palabra es un token separado por espacios o saltos de línea. Varios espacios seguidos no crean palabras vacías.
2. El número de caracteres incluye letras, números, espacios y signos. No incluye saltos de línea (`\n` ni `\r`).
3. Un signo pegado a la palabra no la parte ni suma una palabra extra. `hello,` es una palabra. `...` son 0 palabras y 3 caracteres.
4. Un guion mantiene la expresión como una sola palabra: `word-count`.
5. Una contracción (`You'll`, `you're`) cuenta como una palabra en el total. Con la opción de palabras comunes apagada, no entra en Keyword Density.
6. Un número cuenta como palabra en el total y no entra en Keyword Density.
7. Keyword Density compara en minúsculas. `Hello` y `HELLO` son la misma palabra.
8. El orden de Keyword Density es de mayor a menor cantidad de repeticiones. Si hay empate, va primero la palabra que apareció antes en el texto.
9. El porcentaje de Keyword Density se muestra redondeado, sin decimales. Por eso 5 y 4 repeticiones pueden verse ambas como 3%.
10. La opción "Include common words in word density count" nace apagada. Mientras siga apagada, las stop words se cuentan en el total de palabras y no aparecen en la densidad.
11. El resumen que vale para esta historia es el que está debajo del editor. El del título superior muestra la misma cifra y no es la fuente de aceptación.
12. Los miles del resumen de caracteres usan separador de coma: `1,586`.

## Interfaz de referencia

No hay mockup ni archivo de Figma para esta historia. La interfaz de aceptación es la página publicada:

https://wordcounter.net/

| Zona | Qué debe verse | Uso en la historia |
| --- | --- | --- |
| Centro | Editor con el texto `Start typing, or copy and paste your document here...` | Lugar donde el autor escribe o pega |
| Debajo del editor | Texto `N word(s) M character(s)` | Palabras y caracteres |
| Derecha | Panel Keyword Density, filas con la palabra y el badge `N (P%)` | Palabras más repetidas |

La fila "Characters (no spaces)" de Details permanece oculta con la configuración por defecto y no se usa como resultado de esta historia.

## Requisitos no funcionales

| ID | Requisito |
| --- | --- |
| RNF-01 | El autor usa el sitio sin iniciar sesión y sin cambiar opciones. |
| RNF-02 | El resumen y Keyword Density deben coincidir con el texto ya pegado antes de darse por actualizados. El sitio tarda unos cientos de milisegundos en recalcular; una lectura inmediata puede mostrar el valor anterior. |
| RNF-03 | El recálculo ocurre cuando el texto entra al editor como una edición real. Asignar el valor solo por script no alcanza. |
| RNF-04 | La historia se valida en escritorio, con el editor y el panel de densidad visibles en la misma vista ancha. |
| RNF-05 | No se exige un tiempo máximo de carga de la página. El sitio depende de su propia infraestructura y de publicidad de terceros. |

## Dependencias y datos

| Dependencia | Detalle |
| --- | --- |
| Sitio | https://wordcounter.net/, disponible de forma anónima |
| Configuración | La que trae el sitio al entrar. No se enciende "Include common words in word density count" |
| Dato de prueba principal | `docs/texto-a-copiar.md`, con sus saltos de línea originales |
| Resultado esperado de ese archivo | 276 palabras, 1,586 caracteres, top 3 `words` (5), `word` (5), `text` (4) |
| Integraciones | Ninguna API propia. No hay base de datos ni migración |

## Fuera de alcance

- Iniciar sesión, registrarse o usar Auto-Save entre visitas.
- Gramática, plagio, lectura en voz alta, metas, temas, fuente y limpieza de texto.
- Encender o apagar opciones del sitio, incluidas las palabras comunes y "characters (no spaces)".
- Combinaciones de dos o tres palabras (x2 y x3) dentro de Keyword Density.
- El resto de métricas de Details: oraciones, párrafos, tiempo de lectura, sílabas y páginas.
- Corregir el redondeo del porcentaje. Se documenta como comportamiento actual, no como cambio de esta historia.

## Supuestos

- "Número de caracteres" significa el contador con espacios del pie del editor.
- Las tres palabras más repetidas son las tres primeras filas que muestra Keyword Density, con el desempate por orden de aparición.
- El texto de `docs/texto-a-copiar.md` se pega tal como está en el archivo. El navegador pasa los saltos de Windows a un solo salto, y esos saltos no suman caracteres.
- Si el sitio cambia el algoritmo o la lista de stop words, los resultados de CA-03 y CA-09 dejan de ser válidos y hay que volver a acordarlos.
