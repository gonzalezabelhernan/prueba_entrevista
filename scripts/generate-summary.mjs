import fs from 'node:fs';
import path from 'node:path';

const resultsDir = path.resolve('reports/allure-results');

function loadResults() {
  if (!fs.existsSync(resultsDir)) {
    return [];
  }
  return fs
    .readdirSync(resultsDir)
    .filter((file) => file.endsWith('-result.json'))
    .map((file) => JSON.parse(fs.readFileSync(path.join(resultsDir, file), 'utf8')));
}

function shortError(error) {
  return error.split('--- DEBUG=pw:api ---')[0].trim();
}

export function generateSummary() {
  const scenarios = loadResults().map((result) => {
    const error = [result.statusDetails?.message, result.statusDetails?.trace].filter(Boolean).join('\n');
    return {
      name: result.name,
      status: result.status,
      error: shortError(error),
    };
  });

  const totals = {
    ejecutados: scenarios.length,
    pasaron: scenarios.filter((scenario) => scenario.status === 'passed').length,
    fallaron: scenarios.filter((scenario) => scenario.status === 'failed' || scenario.status === 'broken').length,
    otros: scenarios.filter((scenario) => !['passed', 'failed', 'broken'].includes(scenario.status)).length,
  };

  const lines = [
    '# Resumen de ejecución',
    '',
    `- Escenarios ejecutados: ${totals.ejecutados}`,
    `- Pasaron: ${totals.pasaron}`,
    `- Fallaron: ${totals.fallaron}`,
    `- Otros (omitidos o sin definir): ${totals.otros}`,
    '',
    'El reporte navegable está en `reports/allure-report/index.html`.',
    '',
  ];

  const failures = scenarios.filter((scenario) => scenario.status !== 'passed');
  if (failures.length === 0) {
    lines.push('No hubo escenarios fallidos.');
  } else {
    lines.push('## Detalle de escenarios no exitosos', '');
    for (const scenario of failures) {
      lines.push(`### ${scenario.name}`, '', '```', (scenario.error || 'Sin mensaje.').trim(), '```', '');
    }
  }

  fs.mkdirSync(path.resolve('reports'), { recursive: true });
  fs.writeFileSync(path.resolve('reports/resumen.md'), `${lines.join('\n')}\n`, 'utf8');

  return totals;
}

if (process.argv[1] && process.argv[1].endsWith('generate-summary.mjs')) {
  generateSummary();
}
