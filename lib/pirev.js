const cpuinfo = require('./cpuinfo');
const revinfo = require('./revinfo');

function getAllInfo(cpuInfo) {
  if (cpuInfo !== null && 'revision' in cpuInfo) {
    const code = parseInt(cpuInfo.revision, 16);
    const revInfo = revinfo.getRevInfo(code);

    return { ...cpuInfo, rev: revInfo };
  } else {
    throw(new ReferenceError('No revision code found'));
  }
}

async function getInfo(filename) {
  const cpuInfo = await cpuinfo.getCpuInfo(filename);

  return getAllInfo(cpuInfo);
}

function getInfoSync(filename) {
  const cpuInfo = cpuinfo.getCpuInfoSync(filename);

  return getAllInfo(cpuInfo);
}

module.exports = {
  getInfo,
  getInfoSync,
  ...cpuinfo,
  ...revinfo,
};
