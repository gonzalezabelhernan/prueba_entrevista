# WordCounter

Suite en JavaScript con Playwright y Cucumber para https://wordcounter.net/, con la configuración que trae el sitio. Comprueba el número de palabras, el número de caracteres y las palabras más repetidas de Keyword Density.

Las palabras y los caracteres se leen del resumen que queda debajo del editor. Las palabras repetidas se leen del panel de la derecha. La URL y los textos que se pegan están en `data/datos-prueba.json`. El escenario pide el dato por nombre. `WORDCOUNTER_URL` pisa la URL del archivo si hace falta apuntar a otro entorno.

## Qué hace falta

- Node.js 20 o superior
- No hace falta tener Chrome instalado. Playwright baja Chromium

## Cómo correrlo

En la raíz del proyecto:

```bash
npm install
npx playwright install chromium
npm test
```

`npm test` abre el sitio, corre los 17 escenarios y al final arma los reportes. Termina con código 1 porque 4 escenarios fallan: son un defecto real del sitio (el número de abajo y la lista de la derecha no cuentan igual). Los otros 13, los que cubren el pedido, pasan. Ahí entran el camino feliz, los negativos y los de borde.

Para correr solo esos 13:

```bash
npm run test:regression
```

Para un filtro más chico:

```bash
npm run test:smoke
node scripts/run-tests.mjs --tags "@TC_WC_001"
```

En PowerShell el tag va entre comillas, porque `@` se interpreta distinto. El filtro es el de Cucumber (`--tags`). Esta suite no se corre con `npx playwright test`.

## Qué mirar después

- `reports/resumen.md`: cuántos corrieron, cuántos pasaron, cuántos fallaron y el texto del error
- `reports/allure-report/index.html`: el mismo resultado en un HTML solo, para abrirlo en el navegador. Cada escenario trae captura y el log `DEBUG=pw:api`. En los cuatro que fallan hay además una foto tomada cuando el error ya se veía en la página

Esos archivos se generan al correr. No quedan en git.

## Documentos

- `docs/documentacion-funcional.md`: qué hace la página, con las suposiciones
- `docs/historia-de-usuario.md`: la historia y los criterios
- `docs/plan-y-casos-de-prueba.md`: los casos
- `docs/reporte-de-fallas.md`: el defecto y notas
- `docs/texto-a-copiar.md`: el texto largo que se pega en un escenario
