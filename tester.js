var fs = require("fs");
var gdcmconv = require("./app.js");

var dicomoriginal = new Uint8Array(fs.readFileSync('data/deflated.dcm'));
var memfs = [{name: "input.dcm", data: dicomoriginal}];
var args = ["-i", "input.dcm", "-o", "output.dcm", "-w"];

var result = gdcmconv.gdcmconv(memfs,args);

console.log("input size: " + dicomoriginal.length + ", output size: " + result.MEMFS[0].data.length);