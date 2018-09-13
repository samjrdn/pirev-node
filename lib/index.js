#!/usr/bin/env node

const cpuinfo = require('./cpuinfo');
const revinfo = require('./revinfo');

function getRevInfoFromCpuInfo(cpuInfo) {
  if (cpuInfo !== null && 'revision' in cpuInfo) {
    const code = parseInt(cpuInfo.revision, 16);

    return revinfo.getRevInfo(code);
  } else {
    throw(new ReferenceError('No revision code found'));
  }
}

async function getInfo(filename) {
  const cpuInfo = await cpuinfo.getCpuInfo(filename);

  return getRevInfoFromCpuInfo(cpuInfo);
}

function getInfoSync(filename) {
  const cpuInfo = cpuinfo.getCpuInfoSync(filename);

  return getRevInfoFromCpuInfo(cpuInfo);
}

if (require.main === module) {
  try {
    console.log(getInfoSync(process.argv[2]));
  } catch (error) {
    console.error(error);
  }
} else {
  module.exports = {
    getInfo,
    getInfoSync,
    ...cpuinfo,
    ...revinfo,
  };
}
