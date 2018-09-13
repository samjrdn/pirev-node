const MANUFACTURER = require('./manufacturer');
const MEMORY = require('./memory');
const PROCESSOR = require('./processor');
const TYPE = require('./type');

const UNKNOWN = 'unknown';

const MEMORY_CODE = {
  0x0: MEMORY.MB_256,
  0x1: MEMORY.MB_512,
  0x2: MEMORY.GB_1,
};

function getMemory(code) {
  const memory = (code >> 20) & 0b111;

  if (memory in MEMORY_CODE) {
    return MEMORY_CODE[memory];
  } else {
    return UNKNOWN;
  }
}

const MANUFACTURER_CODE = {
  0x0: MANUFACTURER.SONY_UK,
  0x1: MANUFACTURER.EGOMAN,
  0x2: MANUFACTURER.EMBEST,
  0x3: MANUFACTURER.SONY_JAPAN,
  0x4: MANUFACTURER.EMBEST,
  0x5: MANUFACTURER.STADIUM,
};

function getManufacturer(code) {
  const manufacturer = (code >> 16) & 0b1111;

  if (manufacturer in MANUFACTURER_CODE) {
    return MANUFACTURER_CODE[manufacturer];
  } else {
    return UNKNOWN;
  }
}

const PROCESSOR_CODE = {
  0x0: PROCESSOR.BCM_2835,
  0x1: PROCESSOR.BCM_2836,
  0x2: PROCESSOR.BCM_2837,
};

function getProcessor(code) {
  const processor = (code >> 12) & 0b1111;

  if (processor in PROCESSOR_CODE) {
    return PROCESSOR_CODE[processor];
  } else {
    return UNKNOWN;
  }
}

const TYPE_CODE = {
  0x0: TYPE.A,
  0x1: TYPE.B,
  0x2: TYPE.A_PLUS,
  0x3: TYPE.B_PLUS,
  0x4: TYPE.B_2,
  0x5: TYPE.ALPHA,
  0x6: TYPE.CM_1,
  0x8: TYPE.B_3,
  0x9: TYPE.ZERO,
  0xa: TYPE.CM_3,
  0xc: TYPE.ZERO_W,
  0xd: TYPE.B_3_PLUS,
};

function getType(code) {
  const type = (code >> 4) & 0b11111111;

  if (type in TYPE_CODE) {
    return TYPE_CODE[type];
  } else {
    return UNKNOWN;
  }
}

function getRevision(code) {
  return code & 0b1111;
}

module.exports = function (code) {
  const flag = (code >> 23) & 0b1;

  if (flag !== 1) {
    return null;
  }

  return {
    type: getType(code),
    memory: getMemory(code),
    processor: getProcessor(code),
    revision: getRevision(code),
    manufacturer: getManufacturer(code)
  };
};
