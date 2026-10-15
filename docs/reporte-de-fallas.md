# Reporte de fallas

Probé https://wordcounter.net/ sin cuenta y sin tocar opciones. El pedido era palabras, caracteres y las tres palabras más repetidas. Eso está cubierto y pasa.

Aparte encontré un defecto. No estaba en el pedido, pero se ve enseguida.

## El número de abajo y la lista de la derecha no cuentan igual

**DEF-WC-003.** Severidad alta. Sigue abierto.

Casos: TC_WC_301, TC_WC_302, TC_WC_303 y TC_WC_306. La ficha corta está en `docs/issues/DEF-WC-003.md`.

Pasos: abrir el sitio, pegar el texto y mirar el número debajo del cuadro y las filas de Keyword Density.

| Texto | Abajo | A la derecha |
| --- | --- | --- |
| `user@mail.com` | 1 palabra, 13 caracteres | `user`, `mail` y `com` |
| `word--word` | 2 palabras, 10 caracteres | una fila, `word--word`, una sola vez |
| `https://example.com/foo` | 3 palabras, 23 caracteres | `https`, `example`, `com` y `foo` |
| `---` | 0 palabras, 3 caracteres | una fila, `---` |

Esperaba que la lista mostrara las mismas palabras que el número de abajo. Con `...` el sitio sí queda en 0 y sin filas. Con `---` no.

La lista parece correcta porque los porcentajes cierran en 100%, pero no está hablando de las mismas palabras que el contador. Quien la usa para ver qué repite, se lleva otra cuenta.

En la suite esos cuatro quedan Failed. La captura se saca cuando el texto y los dos indicadores ya están en pantalla, y el resumen guarda el esperado contra el actual.

## Notas que no llevé a la suite

Las vi, pero no son tan claras o se salen de lo pedido:

- El símbolo `…` cuenta como palabra y `...` no.
- `Dr. Smith went home. He left.` suma 3 oraciones. El punto de `Dr.` cierra una frase. El pedido no incluye oraciones.
- Un tabulador suma un carácter y un salto de línea no.
- Un emoji cuenta como 2 caracteres.
- `a,b` sin espacio se parte en letras.
- `C++` queda en la letra `C` y no aparece en la lista.

## Esto no lo reporto como defecto

- `the` no entra en la lista porque "Include common words in word density count" viene apagada.
- Caracteres sin espacios queda en 0 porque esa fila está oculta. No es el contador que pide la prueba.
- 5 y 4 repeticiones pueden mostrar las dos 3%. Es redondeo. El orden por cantidad está bien. Lo dejo como mejora.
- El número tarda un instante en actualizarse. La suite espera. No lo cuento como fallo de un caso.
