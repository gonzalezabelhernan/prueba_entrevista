module.exports = {
  default: {
    require: ['src/support/**/*.js', 'src/steps/**/*.js'],
    paths: ['src/features/**/*.feature'],
    format: ['progress', 'allure-cucumberjs/reporter'],
    formatOptions: {
      resultsDir: 'reports/allure-results',
      labels: [
        { name: 'severity', pattern: [/@severity:\S+/] },
      ],
      links: {
        issue: {
          pattern: [/@issue=\S+/],
          urlTemplate: 'docs/issues/%s.md',
        },
      },
    },
    publishQuiet: true,
  },
};
