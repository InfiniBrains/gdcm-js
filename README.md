# GDCM
This is the GDCM library ported to JavaScript using Emscripten. 
It is useful to convert DICOMs between formats. 
I personally created this to convert and decompress some exotic DICOM types.

## Building
In order to build it, just run the `buildLinuxMac.sh` or `buildwin.bat`. 
It generates the javascript version of the malaterre's `gdcmconv` built with `emscripten` then transpiled to JavaScript. 
It will creates two files: `gdcmconv.js` and `gdcmconv.mem`. 

## Using
I created a wrapper that 
- Receives the dicom file as `Uint8Array` and dicomconv params. 
- Returns the dicom converted as `Uint8Array`.

The params are (copy paste directly from malatterre dicomconv)

```
Options:
  -X --explicit            Change Transfer Syntax to explicit.
  -M --implicit            Change Transfer Syntax to implicit.
  -U --use-dict            Use dict for VR (only public by default).
     --with-private-dict   Use private dict for VR (advanced user only).
  -C --check-meta          Check File Meta Information (advanced user only).
     --root-uid            Root UID.
     --remove-gl           Remove group length (deprecated in DICOM 2008).
     --remove-private-tags Remove private tags.
     --remove-retired      Remove retired tags.
Image only Options:
  -l --apply-lut                      Apply LUT (non-standard, advanced user only).
     --decompress-lut                 Decompress LUT (linearize segmented LUT).
  -P --photometric-interpretation %s  Change Photometric Interpretation (when possible).
  -w --raw                            Decompress image.
  -d --deflated                       Compress using deflated (gzip).
  -J --jpeg                           Compress image in jpeg.
  -K --j2k                            Compress image in j2k.
  -L --jpegls                         Compress image in jpeg-ls.
  -R --rle                            Compress image in rle (lossless only).
  -F --force                          Force decompression/merging before recompression/splitting.
     --generate-icon                  Generate icon.
     --icon-minmax %d,%d              Min/Max value for icon.
     --icon-auto-minmax               Automatically commpute best Min/Max values for icon.
     --compress-icon                  Decide whether icon follows main TransferSyntax or remains uncompressed.
     --planar-configuration [01]      Change planar configuration.
  -Y --lossy                          Use the lossy (if possible) compressor.
  -S --split %d                       Write 2D image with multiple fragments (using max size)
General Options:
  -V --verbose    more verbose (warning+error).
  -W --warning    print warning info.
  -D --debug      print debug info.
  -E --error      print error info.
  -h --help       print help.
  -v --version    print version.
     --quiet      do not print to stdout.
JPEG Options:
  -q --quality %*f           set quality.
JPEG-LS Options:
  -e --allowed-error %*i             set allowed error.
J2K Options:
  -r --rate    %*f           set rate.
  -q --quality %*f           set quality.
  -t --tile %d,%d            set tile size.
  -n --number-resolution %d  set number of resolution.
     --irreversible          set irreversible.
```

## Example
```
var fs = require("fs");
var gdcmconv = require("gdcmconv");

var dicomoriginal = new Uint8Array(fs.readFileSync('data/deflated.dcm')); 
var memfs = [{name: "input.dcm", data: dicomoriginal}]
var args = ["-i", "input.dcm", "-o", "output.dcm", "-w"]

var result = gdcmconv.gdcmconv(memfs,args);

console.log("input size: " + dicomoriginal.length + ", output size: " + result.MEMFS[0].data.length);
```