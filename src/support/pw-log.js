const lines = [];
let patched = false;

function installPwApiLogCapture() {
  if (patched) {
    return;
  }
  patched = true;
  process.env.DEBUG = process.env.DEBUG ? `${process.env.DEBUG},pw:api` : 'pw:api';

  const original = process.stderr.write.bind(process.stderr);
  process.stderr.write = (chunk, encoding, callback) => {
    const text = Buffer.isBuffer(chunk) ? chunk.toString('utf8') : String(chunk);
    if (text.includes('pw:api')) {
      lines.push(text);
      if (typeof callback === 'function') {
        callback();
      }
      return true;
    }
    return original(chunk, encoding, callback);
  };
}

function pwApiLog() {
  return lines.join('').trim();
}

function pwApiLogMark() {
  return lines.length;
}

function pwApiLogFrom(mark) {
  const content = lines.slice(mark).join('').trim();
  return content || 'Sin líneas pw:api capturadas en este escenario.';
}

function pwApiLogTail(maxLines = 40) {
  const content = pwApiLog();
  if (!content) {
    return 'Sin líneas pw:api capturadas todavía.';
  }
  return content.split(/\r?\n/).slice(-maxLines).join('\n');
}

function withPwApiLog(error) {
  const base = error instanceof Error ? error : new Error(String(error));
  if (!base.message.includes('DEBUG=pw:api')) {
    base.message = `${base.message}\n--- DEBUG=pw:api ---\n${pwApiLogTail()}`;
  }
  return base;
}

module.exports = { installPwApiLogCapture, pwApiLog, pwApiLogFrom, pwApiLogMark, pwApiLogTail, withPwApiLog };
