# DEF-WC-003 — El número de abajo y la lista de la derecha no coinciden

| Campo | Valor |
| --- | --- |
| ID | DEF-WC-003 |
| Tipo | Defecto |
| Estado | Abierto |
| Severidad | Alta |
| Módulo | El número que está debajo del editor y la lista Keyword Density |
| Dónde | https://wordcounter.net/, sin cambiar opciones y sin iniciar sesión |
| Casos | TC_WC_301, TC_WC_302, TC_WC_303, TC_WC_306 |
| Automatización | `@bug`, `@issue=DEF-WC-003`, `@severity:critical` |

## Qué pasa

El cliente pidió validar palabras, caracteres y las palabras más repetidas. No pidió estos textos. Al probarlos vimos un error fácil de ver: el número de palabras de abajo y la lista de la derecha no están contando lo mismo.

## Cómo se reproduce

1. Abrir https://wordcounter.net/.
2. Pegar uno de estos textos.
3. Mirar el número de debajo del cuadro y las filas de la derecha.

| Texto | Abajo | A la derecha | Caso |
| --- | --- | --- | --- |
| `https://example.com/foo` | 3 palabras | cuatro filas: `https`, `example`, `com`, `foo` | TC_WC_301 |
| `user@mail.com` | 1 palabra | tres filas: `user`, `mail`, `com` | TC_WC_302 |
| `word--word` | 2 palabras | una fila, `word--word`, una sola vez | TC_WC_303 |
| `---` | 0 palabras | una fila, `---` | TC_WC_306 |

## Qué debería pasar

La lista de la derecha tiene que mostrar las mismas palabras que cuenta el número de abajo. Un correo es una palabra en los dos lados. Si abajo dice 0, la lista no tiene filas. Si abajo dice que `word` está dos veces, la lista dice `word` con 2.

