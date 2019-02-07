const {EGOMAN, EMBEST, QISDA, SONY_UK} = require('./manufacturer');
const {MB_256, MB_512} = require('./memory');
const {BCM_2835} = require('./processor');
const {A, A_PLUS, B, B_PLUS, CM_1} = require('./type');

const REV_MAP = {
  0x02: [ B, MB_256, BCM_2835, 1.0, EGOMAN ],
  0x03: [ B, MB_256, BCM_2835, 1.0, EGOMAN ],
  0x04: [ B, MB_256, BCM_2835, 2.0, SONY_UK ],
  0x05: [ B, MB_256, BCM_2835, 2.0, QISDA ],
  0x06: [ B, MB_256, BCM_2835, 2.0, EGOMAN ],
  0x07: [ A, MB_256, BCM_2835, 2.0, EGOMAN ],
  0x08: [ A, MB_256, BCM_2835, 2.0, SONY_UK ],
  0x09: [ A, MB_256, BCM_2835, 2.0, QISDA ],
  0x0d: [ B, MB_512, BCM_2835, 2.0, EGOMAN ],
  0x0e: [ B, MB_512, BCM_2835, 2.0, SONY_UK ],
  0x0f: [ B, MB_512, BCM_2835, 2.0, EGOMAN ],
  0x10: [ B_PLUS, MB_512, BCM_2835, 1.2, SONY_UK ],
  0x11: [ CM_1, MB_512, BCM_2835, 1.0, SONY_UK ],
  0x12: [ A_PLUS, MB_256, BCM_2835, 1.1, SONY_UK ],
  0x13: [ B_PLUS, MB_512, BCM_2835, 1.2, EMBEST ],
  0x14: [ CM_1, MB_512, BCM_2835, 1.0, EMBEST ],
  0x15: [ A_PLUS, MB_256, BCM_2835, 1.1, EMBEST ],
};

function revInfo([ type, memory, processor, revision, manufacturer ]) {
  return { type, memory, processor, revision, manufacturer };
}

module.exports = function (code) {
  if (typeof code === 'string') {
    code = parseInt(code, 16);
  }

  if (code in REV_MAP) {
    return revInfo(REV_MAP[code]);
  } else {
    return null;
  }
};
