const fs = require('fs');
const path = require('path');
const { expect } = require('chai');
const csv = require('neat-csv');
const pirev = require('..');

function testDataPath(filename) {
  return path.join(__dirname, 'data', filename);
}

function readTsvData(filename) {
  return csv(fs.createReadStream(filename), {
    mapHeaders: ({ header }) => header.toLowerCase(),
    separator: '\t',
  });
}

const MISSING_FILE = testDataPath('missing');
const CPUINFO_PI1 = testDataPath('cpuinfo_pi1');
const CPUINFO_PI3 = testDataPath('cpuinfo_pi3');
const CPUINFO_MBP = testDataPath('cpuinfo_mbp');
const OLD_CODES = testDataPath('codes_old.tsv');
const NEW_CODES = testDataPath('codes_new.tsv');

describe('getInfo', () => {
  describe('missing file', () => {
    it('fails to find the file', (done) => {
      pirev.getInfo(MISSING_FILE)
        .catch((error) => {
          expect(error.message).to.include('ENOENT: no such file');
        })
        .then(done);
    });
  });

  describe('cpuinfo_pi1 file', () => {
    it('matches the given output', (done) => {
      pirev.getInfo(CPUINFO_PI1)
        .then((info) => {
          expect(info.revision).to.deep.equal({
            type: 'B',
            memory: '512MB',
            processor: 'BCM2835',
            revision: 2.0,
            manufacturer: 'Sony UK',
            code: '000e',
          });
        })
        .then(done);
    });
  });

  describe('cpuinfo_pi3 file', () => {
    it('matches the given output', (done) => {
      pirev.getInfo(CPUINFO_PI3)
        .then((info) => {
          expect(info.revision).to.deep.equal({
            type: '3B',
            memory: '1GB',
            processor: 'BCM2837',
            revision: 1.2,
            manufacturer: 'Embest',
            overvoltage: true,
            otp: {
              program: true,
              read: true,
            },
            warranty: true,
            code: 'a22082',
          });
        })
        .then(done);
    });
  });

  describe('cpuinfo_mbp file', () => {
    it('fails to find a revision', (done) => {
      pirev.getInfo(CPUINFO_MBP)
        .catch((error) => {
          expect(error.message).to.equal('No revision code found');
        })
        .then(done);
    });
  });
});

describe('getInfoSync', () => {
  describe('missing file', () => {
    it('fails to find the file', () => {
      expect(() => {
        pirev.getInfoSync(MISSING_FILE);
      }).to.throw(Error);
    });
  });

  describe('cpuinfo_pi1 file', () => {
    it('matches the given output', () => {
      const info = pirev.getInfoSync(CPUINFO_PI1);

      expect(info.revision).to.deep.equal({
        type: 'B',
        memory: '512MB',
        processor: 'BCM2835',
        revision: 2.0,
        manufacturer: 'Sony UK',
        code: '000e',
      });
    });
  });

  describe('cpuinfo_pi3 file', () => {
    it('matches the given output', () => {
      const info = pirev.getInfoSync(CPUINFO_PI3);

      expect(info.revision).to.deep.equal({
        type: '3B',
        memory: '1GB',
        processor: 'BCM2837',
        revision: 1.2,
        manufacturer: 'Embest',
        overvoltage: true,
        otp: {
          program: true,
          read: true,
        },
        warranty: true,
        code: 'a22082',
      });
    });
  });

  describe('cpuinfo_mbp file', () => {
    it('fails to find a revision', () => {
      expect(() => {
        pirev.getInfoSync(CPUINFO_MBP);
      }).to.throw(ReferenceError, 'No revision code found');
    });
  });
});

describe('revinfo', () => {
  it('correctly parses old codes', async () => {
    const data = await readTsvData(OLD_CODES);

    data.forEach(({code, model, revision, ram, manufacturer}) => {
      const info = pirev.getRevInfo(code);

      expect(info).to.have.property('type', model);
      expect(info).to.have.property('memory', ram);
      expect(info).to.have.property('revision', parseFloat(revision));
      expect(info).to.have.property('manufacturer', manufacturer);
    });
  });

  it('correctly parse new codes', async () => {
    const data = await readTsvData(NEW_CODES);

    data.forEach(({code, model, revision, ram, manufacturer}) => {
      const info = pirev.getRevInfo(code);

      expect(info).to.have.property('type', model);
      expect(info).to.have.property('memory', ram);
      expect(info).to.have.property('revision', parseFloat(revision));
      expect(info).to.have.property('manufacturer', manufacturer);
      expect(info).to.have.property('overvoltage', true);
      expect(info.otp).to.have.property('program', true);
      expect(info.otp).to.have.property('read', true);
      expect(info).to.have.property('warranty', true);
    });
  });

  it('correctly parses overvoltage bit', () => {
    const code = 0x80800000;
    const {overvoltage} = pirev.getRevInfo(code);

    expect(overvoltage).to.be.false;
  });

  it('correctly parses OTP program bit', () => {
    const code = 0x40800000;
    const {otp} = pirev.getRevInfo(code);

    expect(otp.program).to.be.false;
  });

  it('correctly parses OTP read bit', () => {
    const code = 0x20800000;
    const {otp} = pirev.getRevInfo(code);

    expect(otp.read).to.be.false;
  });

  it('correctly parses warranty bit', () => {
    const code = 0x2800000;
    const {warranty} = pirev.getRevInfo(code);

    expect(warranty).to.be.false;
  });
});
