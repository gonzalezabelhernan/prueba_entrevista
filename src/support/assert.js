const { pwApiLogTail } = require('./pw-log');

function fail(message, expected, actual) {
  throw new Error(
    [
      message,
      `Esperado: ${JSON.stringify(expected)}`,
      `Actual: ${JSON.stringify(actual)}`,
      '--- DEBUG=pw:api ---',
      pwApiLogTail(),
    ].join('\n'),
  );
}

function assertEqual(actual, expected, message) {
  if (actual !== expected) {
    fail(message, expected, actual);
  }
}

function assertDeepEqual(actual, expected, message) {
  if (JSON.stringify(actual) !== JSON.stringify(expected)) {
    fail(message, expected, actual);
  }
}

function assertTrue(condition, message, actual) {
  if (!condition) {
    fail(message, true, actual ?? false);
  }
}

module.exports = { assertEqual, assertDeepEqual, assertTrue };
