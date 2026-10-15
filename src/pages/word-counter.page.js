const { withPwApiLog } = require('../support/pw-log');

const FOOTER = '#editor_container .panel-footer span.counted';
const DENSITY = '#kwd-density';
const DENSITY_ROWS = '#kwd-density a.list-group-item';
const SUMMARY_PATTERN = /^(\d[\d,]*)\s+word(?:s)?\s+(\d[\d,]*)\s+character(?:s)?$/;

function parseSummary(summary) {
  const match = summary.match(SUMMARY_PATTERN);
  if (!match) {
    return null;
  }
  return {
    summary,
    words: Number(match[1].replace(/,/g, '')),
    characters: Number(match[2].replace(/,/g, '')),
  };
}

class WordCounterPage {
  constructor(page) {
    this.page = page;
    this.editor = page.locator('#box');
    this.summary = page.locator(FOOTER);
    this.density = page.locator(DENSITY);
  }

  async open(url) {
    try {
      await this.page.goto(url, { waitUntil: 'domcontentloaded', timeout: 60_000 });
      await this.editor.waitFor({ state: 'visible', timeout: 20_000 });
      await this.summary.waitFor({ state: 'visible', timeout: 20_000 });
      await this.density.waitFor({ state: 'attached', timeout: 20_000 });
      await this.waitUntilSettled('');
    } catch (error) {
      throw withPwApiLog(error);
    }
  }

  async setText(text) {
    try {
      await this.editor.fill(text);
      await this.waitUntilSettled(text);
    } catch (error) {
      throw withPwApiLog(error);
    }
  }

  async readCounts() {
    const parsed = parseSummary((await this.readState()).summary);
    if (!parsed) {
      const summary = (await this.readState()).summary;
      throw withPwApiLog(
        new Error(`El resumen debajo del editor no tiene el formato "N words M characters". Texto recibido: "${summary}".`),
      );
    }
    return parsed;
  }

  async readKeywords() {
    const { keywords } = await this.readState();
    const broken = keywords.find((row) => row.repetitions === null);
    if (broken) {
      throw withPwApiLog(
        new Error(`El badge de Keyword Density no tiene el formato "N (%)": "${broken.percentage}" para "${broken.word}".`),
      );
    }
    return keywords;
  }

  async readState() {
    try {
      return await this.page.evaluate(({ footer, rows }) => {
        const summary = (document.querySelector(footer)?.textContent ?? '')
          .replace(/\u00a0/g, ' ')
          .replace(/\s+/g, ' ')
          .trim();
        const box = document.querySelector('#box')?.value ?? '';
        const keywords = [...document.querySelectorAll(rows)].map((row) => {
          const word = (row.querySelector('.word')?.textContent ?? '').trim().toLowerCase();
          const badge = (row.querySelector('.badge')?.textContent ?? '').replace(/\s+/g, ' ').trim();
          const match = badge.match(/^(\d+)\s+\(([^)]+)\)$/);
          return {
            word,
            repetitions: match ? Number(match[1]) : null,
            percentage: match ? match[2] : badge,
          };
        });
        return { summary, box, keywords };
      }, { footer: FOOTER, rows: DENSITY_ROWS });
    } catch (error) {
      throw withPwApiLog(error);
    }
  }

  async captureDefect() {
    await this.editor.scrollIntoViewIfNeeded();
    return this.page.screenshot({ fullPage: false });
  }

  async waitUntilSettled(text) {
    const expectedCharacters = text.replace(/\r|\n/g, '').length;
    let previous = '';
    let stableSince = 0;
    const started = Date.now();

    while (Date.now() - started < 15_000) {
      const state = await this.readState();
      const parsed = parseSummary(state.summary);
      const boxCharacters = state.box.replace(/\r|\n/g, '').length;
      const countsReady = Boolean(parsed)
        && parsed.characters === expectedCharacters
        && boxCharacters === expectedCharacters;
      const signature = `${state.summary}|${JSON.stringify(state.keywords)}`;

      if (countsReady && signature === previous) {
        if (!stableSince) {
          stableSince = Date.now();
        }
        const stableFor = Date.now() - stableSince;
        const keywordsVisible = state.keywords.length > 0;
        if ((keywordsVisible && stableFor >= 450) || stableFor >= 900) {
          return;
        }
      } else {
        stableSince = 0;
      }
      previous = countsReady ? signature : '';
      await this.page.waitForTimeout(150);
    }

    throw withPwApiLog(new Error('El resumen debajo del editor o Keyword Density no se estabilizaron a tiempo.'));
  }
}

module.exports = { WordCounterPage };
