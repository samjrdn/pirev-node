const oldrev = require('./oldrev');
const newrev = require('./newrev');

function getRevInfo(code) {
  return newrev(code) || oldrev(code);
}

module.exports = {
  getRevInfo,
};
