# GDCM
[![NPM](https://nodei.co/npm/gdcm-js.png?downloads=true)](https://www.npmjs.com/package/gdcm-js)


This is the GDCM Library ported to JavaScript using Emscripten (WebAssembly). 
It is useful to convert DICOMs between formats inside browser, ionic, hybrid apps, node... 
I personally created this to convert and decompress some exotic DICOM types.

## Breaking changes in 0.1.0

Calls are now asynchronous and return a Promise. Add `await` (or `.then`) at every call site:

```js
// 0.0.4
var result = gdcm.gdcmconv({MEMFS: memfs, arguments: args});
console.log(result.MEMFS[0].data.length);
// 0.1.0
var result = await gdcm.gdcmconv({MEMFS: memfs, arguments: args});
console.log(result.MEMFS[0].data.length);
```

If you consumed the build artifacts directly (`require('./gdcmconv.js')` or a `<script>` tag), the module no longer exposes a directly callable run function. It now exposes a `createGdcmconv` factory that returns a thenable Module; `await` it once before use.

## Install

```sh
npm install gdcm-js
```

Node 18 or newer is recommended.

## Example via node

```js
var fs = require("fs");
var gdcm = require("gdcm-js");

async function main() {
  // read dicom bytes
  var dicomoriginal = new Uint8Array(fs.readFileSync("data/deflated.dcm"));
  // create a memfs with the file
  var memfs = [{name: "input.dcm", data: dicomoriginal}];
  // write down the params you have to write into terminal
  var args = ["-i", "input.dcm", "-o", "output.dcm", "-w"];
  // run the app
  const {MEMFS, stdout, stderr} = await gdcm.gdcmconv({MEMFS: memfs, arguments: args});
  // output files will be stored into MEMFS variable
  console.log("input size: " + dicomoriginal.length + ", output size: " + MEMFS[0].data.length);
}
main();
```

## Using directly from browser

Load the desired application script instead of the npm version. For this instance the app is `gdcmconv`. The `.wasm` file must sit next to the `.js` file, and your server should serve it with the `application/wasm` MIME type (the runtime falls back to a slower path otherwise).

```html
<script src="gdcmconv.js"></script>
```

And use it:

```js
var dicomoriginal = new Uint8Array(????); // you must provide this

createGdcmconv().then(function(gdcmconv) {
  return gdcmconv({
    MEMFS: [], // populated in preRun below if you prefer lazy injection
    arguments: ["-i", "input.dcm", "-o", "output.dcm", "-w"],
    preRun: function() {
      gdcmconv.FS.mkdir("/work");
      gdcmconv.FS.writeFile("/work/input.dcm", dicomoriginal);
    }
  });
}).then(function(result) {
  // collect outputs written to /work
  var outputs = result.MEMFS.filter(function(f) { return f.name.indexOf("/work/") === 0; });
  var blob = new Blob([outputs[0].data]);
  // download blob as needed
  console.log("output size:", outputs[0].data.length);
});
```

For each application it will create two files: `appname.js` and `appname.wasm`. Serve both.

### Running Example

- https://infinibrains.github.io/gdcm-js/ 

## Building

Prerequisites: git, cmake (3.9.2 or newer), curl, make.

```sh
./buildLinuxMac.sh
```

It generates the JavaScript/WebAssembly version of [malaterre's](https://github.com/malaterre/GDCM) GDCM built with Emscripten. Pinned versions:

| Component | Version |
|-----------|---------|
| emsdk     | 6.0.13  |
| GDCM      | v3.2.11 |

For each application it creates two files: `appname.js` and `appname.wasm`.

Built apps (17):

gdcmanon gdcmcheck gdcmconv gdcmdictdump gdcmdiff gdcmdump gdcmfile gdcmgendir gdcmimg gdcmkey gdcmoverlay gdcmpap3 gdcmraw gdcmscanner gdcmtar gdcmxml pdf2dcm

Excluded apps and why:

| App | Reason |
|-----|--------|
| gdcmscu | uses sockets, not available in WASM |
| gdcmpdf | depends on poppler |
| gdcminfo | puff.c |
| gdcmclean, gdcmstream, deflate, gdcm | no legacy artifact |

Platform note: macOS arm64 verified; Linux unverified. `buildwin.bat` is legacy/broken; the Windows build is not maintained.

## Using GDCM End User Applications

You can use them in the same way you use them in the terminal. Please read how to use them here: [gdcm reference](http://gdcm.sourceforge.net/wiki/index.php/End_User_Applications)

## API contract

Input:

```js
{MEMFS: [{name: "input.dcm", data: Uint8Array}], arguments: ["-i", "input.dcm", "-o", "output.dcm"]}
```

Output: a Promise resolving to

```js
{MEMFS: [{name: "output.dcm", data: Uint8Array}], stdout: ["..."], stderr: ["..."]}
```

Failures resolve with an empty MEMFS and a non-empty stderr. Only module initialization failure rejects the Promise.

## Authors

* Alexandre Tolstenko
* Cândido Sales

