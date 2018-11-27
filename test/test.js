const path = require('path');
const { expect } = require('chai');
const pirev = require('..');

function testDataPath(filename) {
  return path.join(__dirname, 'data', filename);
}

const MISSING_FILE = testDataPath('missing');
const CPUINFO_PI1 = testDataPath('cpuinfo_pi1');
const CPUINFO_PI3 = testDataPath('cpuinfo_pi3');
const CPUINFO_MBP = testDataPath('cpuinfo_mbp');

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
            memory: '512 MB',
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
            memory: '1 GB',
            processor: 'BCM2837',
            revision: 1.2,
            manufacturer: 'Embest',
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
        memory: '512 MB',
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
        memory: '1 GB',
        processor: 'BCM2837',
        revision: 1.2,
        manufacturer: 'Embest',
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

  describe('missing file', () => {
    it('should fail to find the file', () => {
      expect(() => {
        pirev.getInfoSync(MISSING_FILE);
      }).to.throw(Error);
    });
  });
});
