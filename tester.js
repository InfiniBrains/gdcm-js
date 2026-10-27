var fs = require("fs");
var gdcm = require("./app.js");

var FILES = [
  "deflated.dcm",
  "explicit_big.dcm",
  "explicit_little.dcm",
  "implicit_little.dcm",
  "jpeg_2000.dcm",
  "jpeg_baseline_8bit.dcm",
  "jpeg_lossless_sel1.dcm",
  "jpeg_ls.dcm",
  "rle.dcm"
];

var TOTAL = 12;
var failures = 0;

async function main() {
  // (a) conversion matrix: 9 files
  for (var i = 0; i < FILES.length; i++) {
    var f = FILES[i];
    try {
      var result = await gdcm.gdcmconv({
        MEMFS: [{ name: "input.dcm", data: new Uint8Array(fs.readFileSync("data/" + f)) }],
        arguments: ["-i", "input.dcm", "-o", "output.dcm"]
      });
      if (result.MEMFS[0] && result.MEMFS[0].data.length > 0) {
        console.log("PASS convert " + f + " (" + result.MEMFS[0].data.length + " bytes)");
      } else {
        failures++;
        console.log("FAIL convert " + f + ": no output produced");
      }
    } catch (e) {
      failures++;
      console.log("FAIL convert " + f + ": " + (e && e.message ? e.message : e));
    }
  }

  // (b) legacy-args parity (0.0.4 vector, with -w)
  try {
    var parity = await gdcm.gdcmconv({
      MEMFS: [{ name: "input.dcm", data: new Uint8Array(fs.readFileSync("data/deflated.dcm")) }],
      arguments: ["-i", "input.dcm", "-o", "output.dcm", "-w"]
    });
    if (parity.MEMFS[0] && parity.MEMFS[0].data.length > 0) {
      console.log("PASS parity-args (" + parity.MEMFS[0].data.length + " bytes)");
    } else {
      failures++;
      console.log("FAIL parity-args: no output produced");
    }
  } catch (e) {
    failures++;
    console.log("FAIL parity-args: " + (e && e.message ? e.message : e));
  }

  // (c) missing input file: must resolve, empty MEMFS, non-empty stderr
  try {
    var missing = await gdcm.gdcmconv({
      MEMFS: [{ name: "dummy.bin", data: new Uint8Array([0]) }],
      arguments: ["-i", "nope.dcm", "-o", "output.dcm"]
    });
    var stderrMissing = (missing.stderr || []).join("\n");
    if (missing.MEMFS.length === 0 && stderrMissing.length > 0) {
      console.log("PASS missing-input");
    } else {
      failures++;
      console.log("FAIL missing-input: MEMFS.length=" + missing.MEMFS.length + ", stderr empty=" + (stderrMissing.length === 0));
    }
  } catch (e) {
    failures++;
    console.log("FAIL missing-input: rejected promise: " + (e && e.message ? e.message : e));
  }

  // (d) corrupt input: must resolve, empty MEMFS or non-empty stderr
  try {
    var corruptBytes = new Uint8Array(fs.readFileSync("data/deflated.dcm"));
    corruptBytes[0] = 0; corruptBytes[1] = 0; corruptBytes[2] = 0; corruptBytes[3] = 0;
    var corrupt = await gdcm.gdcmconv({
      MEMFS: [{ name: "input.dcm", data: corruptBytes }],
      arguments: ["-i", "input.dcm", "-o", "output.dcm"]
    });
    var stderrCorrupt = (corrupt.stderr || []).join("\n");
    if (corrupt.MEMFS.length === 0 || stderrCorrupt.length > 0) {
      console.log("PASS corrupt-input");
    } else {
      failures++;
      console.log("FAIL corrupt-input: produced output with no stderr");
    }
  } catch (e) {
    failures++;
    console.log("FAIL corrupt-input: rejected promise: " + (e && e.message ? e.message : e));
  }

  var passed = TOTAL - failures;
  console.log(passed + "/" + TOTAL + " passed");
  process.exit(failures > 0 ? 1 : 0);
}

main().catch(function (e) {
  console.error(e);
  process.exit(1);
});
