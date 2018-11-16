pirev
-----

[Revision Codes](https://www.raspberrypi.org/documentation/hardware/raspberrypi/revision-codes/README.md)

## Installation

```
npm install pirev
```

## Usage

Require in your own Node.js modules, and access the exposed properties. For example, retrieve Raspberry Pi version and model:

```
var pi = require('pirev').getInfoSync();
console.log("Raspberry Pi Model: "+pi.revision.type);
```
