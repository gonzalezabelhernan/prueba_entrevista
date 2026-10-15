const { setWorldConstructor, World } = require('@cucumber/cucumber');

class CustomWorld extends World {}

setWorldConstructor(CustomWorld);

module.exports = { CustomWorld };
