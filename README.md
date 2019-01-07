# GDCM
[![NPM](https://nodei.co/npm/gdcm-js.png?downloads=true)](https://www.npmjs.com/package/gdcm-js)


This is the GDCM Library ported to JavaScript using Emscripten. 
It is useful to convert DICOMs between formats inside browser, ionic, hybrid apps, node... 
I personally created this to convert and decompress some exotic DICOM types.

## Building
In order to build it, just run the `buildLinuxMac.sh` or `buildwin.bat`. 
It generates the javascript version of the [malaterre's](https://github.com/malaterre/GDCM) `gdcm` built with `emscripten` then transpiled to JavaScript. 
For each application it will create two files: `gdcmXXX.js` and `gdcmXXX.mem` where is XXX is the original app name.

## Using
I created a npm wrapper that 
- Receives the dicom files as `Uint8Array` through MEMFS and the array of terminal parameters;
- Returns the MEMFS with converted files as `Uint8Array`;
- Stdout and Stderr with console output;

## Using GDCM End User Applications

You can use it in same way you you use in the terminal. Please read how to use them here: [gdcm referece](http://gdcm.sourceforge.net/wiki/index.php/End_User_Applications)

## Example via node
```
var fs = require("fs");
var gdcm = require("gdcm");
// read dicom bytes
var dicomoriginal = new Uint8Array(fs.readFileSync('data/deflated.dcm')); 
// create a memfs with the file
var memfs = [{name: "input.dcm", data: dicomoriginal}]
// write down the params you have to write into terminal
var args = ["-i", "input.dcm", "-o", "output.dcm", "-w"]
// run the app
var result = gdcm.gdcmconv({MEMFS:memfs,arguments:args});
// get results from result
// output files will be stored into MEMFS variable
console.log("input size: " + dicomoriginal.length + ", output size: " + result.MEMFS[0].data.length);
```

## Using directly from browser

You can load directly the desired application instead of the app from npm version. Just download and serve both files "appname.js" and "appname.mem" and use like this: 

For this instance my appname is `gdcmconv`. 
```
<script src="gdcmconv.js"></script>
```

And use it:
```
var dicomoriginal = new Uint8Array(????); // you must provide this
var memfs = [{name: "input.dcm", data: dicomoriginal}]; 
var args = ["-i", "input.dcm", "-o", "output.dcm", "-w"];
var result =  gdcmFunc({MEMFS:memfs,arguments:args}); // run the app
console.log(result.MEMFS[0].data); // print the file output contents
```

## ToDo:

If you are planning to use more than one application, all of them will have the functioname `gdcmFunc` so be careful when importing many apps via browser. Via node this must be fine.

## Testing local

Install `http-server` globally:

```bash
npm install http-server -g
```

Execute the command:

```bash
npm run serve:prod
```

After access [http://localhost:8082/](http://localhost:8082/)


## Authors

* Alexandre Tolstenko
* Cândido Sales