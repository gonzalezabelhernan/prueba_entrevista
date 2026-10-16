const { After, AfterAll, Before, BeforeAll, setDefaultTimeout } = require('@cucumber/cucumber');
const { chromium } = require('playwright');
const { WordCounterPage } = require('../pages/word-counter.page');
const { installPwApiLogCapture, pwApiLogFrom, pwApiLogMark } = require('./pw-log');

let browser;

setDefaultTimeout(60_000);
installPwApiLogCapture();

BeforeAll(async () => {
  const headed = process.env.HEADED === 'true';
  const slowMo = Number(process.env.SLOWMO ?? 0);
  const delay = Number.isFinite(slowMo) && slowMo > 0 ? slowMo : 0;
  console.log(`[browser] headed=${headed} slowMo=${delay} ms`);
  browser = await chromium.launch({
    headless: !headed,
    slowMo: delay,
  });
});

Before(async function () {
  this.pwLogMark = pwApiLogMark();
  this.browser = browser;
  this.context = await browser.newContext({ viewport: { width: 1440, height: 900 } });
  await this.context.addInitScript(() => localStorage.removeItem('text'));
  this.page = await this.context.newPage();
  this.wordCounter = new WordCounterPage(this.page);
});

After(async function () {
  const log = pwApiLogFrom(this.pwLogMark);
  if (this.page) {
    const image = await this.page.screenshot({ fullPage: true });
    await this.attach(image, { mediaType: 'image/png', fileName: 'captura.png' });
  }
  await this.attach(log, { mediaType: 'text/plain', fileName: 'pw-api.log' });
  await this.context?.close();
});

AfterAll(async () => {
  await browser?.close();
});
