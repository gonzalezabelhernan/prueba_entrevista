const fs = require('node:fs');
const path = require('node:path');
const { Given, Then, When } = require('@cucumber/cucumber');
const { assertDeepEqual, assertEqual, assertTrue } = require('../support/assert');

const datos = require('../../data/datos-prueba.json');
const baseUrl = process.env.WORDCOUNTER_URL ?? datos.url;

function textoDe(clave) {
  const dato = datos.textos[clave];
  if (typeof dato === 'string') {
    return dato;
  }
  if (dato && typeof dato.archivo === 'string') {
    return fs.readFileSync(path.resolve(dato.archivo), 'utf8');
  }
  throw new Error(`No está el dato "${clave}" en data/datos-prueba.json.`);
}

function rowsFromTable(table) {
  return table.hashes().map((row) => ({
    word: String(row.palabra).trim().toLowerCase(),
    repetitions: Number(row.repeticiones),
    percentage: String(row.porcentaje).trim(),
  }));
}

function defectNote(world) {
  if (!world.defectId) {
    return '';
  }
  return ` Esto es lo que el sitio debería mostrar. Si no coincide, el defecto ${world.defectId} sigue abierto.`;
}

Given('que abro WordCounter con la configuración por defecto', async function () {
  await this.wordCounter.open(baseUrl);
});

When('pego el dato {string}', async function (clave) {
  await this.wordCounter.setText(textoDe(clave));
});

When('borro el texto del editor', async function () {
  await this.wordCounter.setText('');
});

Then('el número de palabras es {int}', async function (expected) {
  const actual = await this.wordCounter.readCounts();
  assertEqual(
    actual.words,
    expected,
    `El número de palabras del resumen debajo del editor no coincide con el oráculo.${defectNote(this)}`,
  );
});

Then('el número de caracteres es {int}', async function (expected) {
  const actual = await this.wordCounter.readCounts();
  assertEqual(
    actual.characters,
    expected,
    `El número de caracteres del resumen debajo del editor no coincide. Los saltos de línea no forman parte de ese total.${defectNote(this)}`,
  );
});

Then('el resumen visible es {string}', async function (expected) {
  const actual = await this.wordCounter.readCounts();
  assertEqual(
    actual.summary,
    expected,
    `El resumen debajo del editor (palabras y caracteres) no coincide con el texto esperado.${defectNote(this)}`,
  );
});

Then('Keyword Density no lista palabras', async function () {
  const actual = await this.wordCounter.readKeywords();
  assertDeepEqual(actual, [], `La sección Keyword Density, a la derecha, debía quedar vacía y mostró palabras.${defectNote(this)}`);
});

Then('Keyword Density no contiene la palabra {string}', async function (word) {
  const actual = await this.wordCounter.readKeywords();
  const found = actual.some((row) => row.word === word.toLowerCase());
  assertTrue(
    !found,
    `La palabra "${word}" no debería aparecer en Keyword Density con la configuración por defecto.${defectNote(this)}`,
    actual,
  );
});

Then('las palabras de Keyword Density coinciden en este orden con:', async function (table) {
  const actual = await this.wordCounter.readKeywords();
  const expected = rowsFromTable(table);
  assertDeepEqual(
    actual,
    expected,
    `La lista de Keyword Density, a la derecha del editor, no coincide en orden, repeticiones o porcentaje.${defectNote(this)}`,
  );
});

Then('las palabras de Keyword Density comienzan en este orden con:', async function (table) {
  const expected = rowsFromTable(table);
  const actual = (await this.wordCounter.readKeywords()).slice(0, expected.length);
  assertDeepEqual(
    actual,
    expected,
    `Las primeras filas de Keyword Density, a la derecha del editor, no coinciden en orden, repeticiones o porcentaje.${defectNote(this)}`,
  );
});

Then('guardo la evidencia del defecto {string} como {string}', async function (issueId, fileName) {
  this.defectId = issueId;
  const image = await this.wordCounter.captureDefect();
  await this.attach(image, { mediaType: 'image/png', fileName: `${fileName}.png` });
});
