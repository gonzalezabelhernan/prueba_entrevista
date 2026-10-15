import { defineConfig } from 'allure';

export default defineConfig({
  name: 'WordCounter',
  output: './reports/allure-report',
  plugins: {
    awesome: {
      options: {
        singleFile: true,
        reportLanguage: 'es',
        reportName: 'WordCounter',
        open: false,
      },
    },
  },
});
