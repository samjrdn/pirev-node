const {
  EGOMAN,
  EMBEST,
  SONY_JAPAN,
  SONY_UK,
  STADIUM,
} = require('./manufacturer');
const {
  MB_256,
  MB_512,
  GB_1,
  GB_2,
  GB_4,
} = require('./memory');
const {
  BCM_2835,
  BCM_2836,
  BCM_2837,
  BCM_2711,
} = require('./processor');
const {
  A,
  B,
  A_PLUS,
  B_PLUS,
  B_2,
  ALPHA,
  CM_1,
  B_3,
  ZERO,
  CM_3,
  ZERO_W,
  B_3_PLUS,
  A_3_PLUS,
  CM_3_PLUS,
  B_4,
} = require('./type');

const UNKNOWN = 'unknown';

const MEMORY_CODE = {
  0x0: MB_256,
  0x1: MB_512,
  0x2: GB_1,
  0x3: GB_2,
  0x4: GB_4,
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
  0x0: SONY_UK,
  0x1: EGOMAN,
  0x2: EMBEST,
  0x3: SONY_JAPAN,
  0x4: EMBEST,
  0x5: STADIUM,
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
  0x0: BCM_2835,
  0x1: BCM_2836,
  0x2: BCM_2837,
  0x3: BCM_2711,
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
  0x0: A,
  0x1: B,
  0x2: A_PLUS,
  0x3: B_PLUS,
  0x4: B_2,
  0x5: ALPHA,
  0x6: CM_1,
  0x8: B_3,
  0x9: ZERO,
  0xa: CM_3,
  0xc: ZERO_W,
  0xd: B_3_PLUS,
  0xe: A_3_PLUS,
  0x10: CM_3_PLUS,
  0x11: B_4,
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
  return 1 + (code & 0b1111)/10;
}

module.exports = function (code) {
  if (typeof code === 'string') {
    code = parseInt(code, 16);
  }

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
