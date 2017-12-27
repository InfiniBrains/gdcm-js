var gdcm = require('./gdcmconv.js');
var fs = require('fs');

var dicomoriginal = new Uint8Array(fs.readFileSync('data/deflated.dcm'));

var result = gdcm({
  MEMFS: [{name: "input.dcm", data: dicomoriginal}],
  arguments: ["-i", "input.dcm", "-o", "output.dcm", "-w"],
  stdin: function() {},
});

console.log("input size: " + dicomoriginal.length + ", output size: " + result.MEMFS[0].data.length);