#!/usr/bin/env node

if (require.main === module) {
  const { getInfoSync } = require('./pirev');

  try {
    console.log(getInfoSync(process.argv[2]));
  } catch (error) {
    console.error(error);
  }
} else {
  module.exports = require('./pirev');
}
