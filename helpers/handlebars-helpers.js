// handlebars-helpers.js

const Handlebars = require('handlebars');

// Create a Handlebars instance
const handlebarsInstance = Handlebars.create();

// Custom "eq" helper
handlebarsInstance.registerHelper('eq', function(arg1, arg2, options) {
  return arg1 == arg2 ? options.fn(this) : options.inverse(this);
});

module.exports = handlebarsInstance;