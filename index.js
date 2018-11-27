#!/usr/bin/env node

if (require.main === module) {
  const { getInfoSync } = require('./lib/pirev');

  try {
    console.log(getInfoSync(process.argv[2]));
  } catch (error) {
    console.error(error);
  }
} else {
  module.exports = require('./lib/pirev');
}
