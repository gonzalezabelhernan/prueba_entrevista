import { spawnSync } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';
import { generateSummary } from './generate-summary.mjs';

const resultsDir = path.resolve('reports/allure-results');
const reportDir = path.resolve('reports/allure-report');

function promoteAttachments(dir) {
  const containers = fs.readdirSync(dir).filter((file) => file.endsWith('-container.json'));
  for (const file of containers) {
    const containerPath = path.join(dir, file);
    const container = JSON.parse(fs.readFileSync(containerPath, 'utf8'));
    const attachments = [];
    for (const after of container.afters ?? []) {
      for (const step of after.steps ?? []) {
        attachments.push(...(step.attachments ?? []));
        step.attachments = [];
      }
    }
    fs.writeFileSync(containerPath, JSON.stringify(container));
    for (const child of container.children ?? []) {
      const resultPath = path.join(dir, `${child}-result.json`);
      if (!fs.existsSync(resultPath)) {
        continue;
      }
      const testResult = JSON.parse(fs.readFileSync(resultPath, 'utf8'));
      testResult.attachments = [...(testResult.attachments ?? []), ...attachments];
      fs.writeFileSync(resultPath, JSON.stringify(testResult));
    }
  }
}

fs.rmSync(resultsDir, { recursive: true, force: true });
fs.rmSync(reportDir, { recursive: true, force: true });
fs.rmSync(path.resolve('reports/screenshots'), { recursive: true, force: true });
fs.rmSync(path.resolve('reports/logs'), { recursive: true, force: true });
fs.mkdirSync(resultsDir, { recursive: true });

process.env.DEBUG = process.env.DEBUG ? `${process.env.DEBUG},pw:api` : 'pw:api';
process.env.CUCUMBER_PUBLISH_ENABLED = 'false';

function quoteArg(arg) {
  if (!/[\s"]/.test(arg)) {
    return arg;
  }
  return `"${arg.replace(/"/g, '\\"')}"`;
}

const args = process.argv.slice(2);
const result = spawnSync('npx', ['cucumber-js', ...args.map(quoteArg)], {
  stdio: 'inherit',
  shell: true,
  env: process.env,
});

promoteAttachments(resultsDir);

const generated = spawnSync('npx', ['allure', 'generate', resultsDir, '--output', reportDir], {
  stdio: 'inherit',
  shell: true,
  env: process.env,
});

const totals = generateSummary();
const reportFile = path.join(reportDir, 'index.html');
console.log(
  `\nResumen: ejecutados=${totals.ejecutados} pasaron=${totals.pasaron} fallaron=${totals.fallaron} otros=${totals.otros}`,
);
console.log(`Reporte: ${reportFile}`);

if (generated.status !== 0 || !fs.existsSync(reportFile)) {
  process.exit(generated.status === null ? 1 : generated.status || 1);
}

process.exit(result.status === null ? 1 : result.status);
