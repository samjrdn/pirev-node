# pirev

A small utility to provide hardware revision information for Raspberry Pi devices. All information is parsed from the device's [revision code](https://www.raspberrypi.org/documentation/hardware/raspberrypi/revision-codes/README.md) located in `/proc/cpuinfo`.

## Installation

```
npm install pirev
```
or
```
yarn add pirev
```

## Usage

### Asynchronous

```
const pirev = require('pirev');

pirev.getInfo().then(({ type }) => {
  console.log(`Raspberry Pi ${type}`);
});
```

### Synchronous

```
const pirev = require('pirev');

const { type } = pirev.getInfoSync();

console.log(`Raspberry Pi ${type}`);
```

## Error handling

Running the utility on a device which is **not** a Raspberry Pi will result in an error being thrown.

```
pirev.getInfo()
  .then(({ type }) => console.log(`Raspberry Pi ${type}`))
  .catch(() => console.warn('Not a Raspberry Pi device!'));
```
or
```
try {
  const { type } = pirev.getInfoSync();
  console.log(`Raspberry Pi ${type}`);
} catch {
  console.warn('Not a Raspberry Pi device!');
}
```
