const util = require('util');
const fs = require('fs');

const readFile = util.promisify(fs.readFile);

const READ_FILE_OPTIONS = 'utf8';
const CPU_INFO_FILE = '/proc/cpuinfo';

const HEX_REGEX = /^0x[0-9a-fA-F]+$/;
const FLOAT_REGEX = /^\d+\.\d+$/;
const INT_REGEX = /^\d+$/;

function filterKeyName(name) {
  return name.toLowerCase().replace(/\s/g, '_');
}

function parseValue(value) {
  if (HEX_REGEX.test(value)) {
    return parseInt(value, 16);
  } else if (FLOAT_REGEX.test(value)) {
    return parseFloat(value);
  } else if (INT_REGEX.test(value)) {
    return parseInt(value, 10);
  } else {
    return value;
  }
}

function lineToKeyValue(line) {
  return line.split(':')
    .map((item) => item.trim());
}

function getContentSections(content) {
  const sections = [];
  let current = {};

  content.split('\n')
    .map(lineToKeyValue)
    .forEach((items) => {
      if (items.length < 2) {
        sections.push(current);
        current = {};
      } else {
        const key = filterKeyName(items[0]);
        current[key] = parseValue(items[1]);
      }
    });
  sections.push(current);

  return sections;
}

function buildInfo(content) {
  const info = {};
  const cpus = [];

  getContentSections(content).forEach((section) => {
    if ('processor' in section) {
      cpus.push(section);
    } else {
      Object.assign(info, section);
    }
  });

  return { cpus, ...info };
}

async function getCpuInfo(filename) {
  const content = await readFile(filename || CPU_INFO_FILE, READ_FILE_OPTIONS);
  
  return buildInfo(content);
}

function getCpuInfoSync(filename) {
  const content = fs.readFileSync(filename || CPU_INFO_FILE, READ_FILE_OPTIONS);

  return buildInfo(content);
}

module.exports = {
  getCpuInfo,
  getCpuInfoSync,
};
