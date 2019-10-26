// key.js - Figure out which credentials to return based on environment (dev or prod).
const isProduction = false; // Placeholder always returns false until prod env is in place.

if (isProduction) {
    // We are in production, return prod set of keys.
    module.exports = require('./prod');
}
else {
    // We are in development, return dev set of keys.
    module.exports = require('./dev');
}