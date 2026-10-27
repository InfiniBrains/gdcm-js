function convertToUint8Array(data) {
  if (Array.isArray(data) || data instanceof ArrayBuffer) return new Uint8Array(data);
  if (!data) return new Uint8Array(0);
  if (!(data instanceof Uint8Array)) return new Uint8Array(data.buffer);
  return data;
}

function runApp(appName, params) {
  params = params || {};
  var createModule = require('./' + appName + '.js');
  var stdout = [];
  var stderr = [];
  var inputNames = {};
  (params.MEMFS || []).forEach(function (f) { inputNames[f.name] = true; });

  var Module = createModule({
    print: function (t) { stdout.push(t); },
    printErr: function (t) { stderr.push(t); },
    onAbort: function (what) { stderr.push('abort: ' + what); },
  });
  Module.preRun.push(function () {
    var FS = Module.FS;
    try { FS.mkdir('/work'); } catch (e) { /* already there */ }
    FS.chdir('/work');
    (params.MEMFS || []).forEach(function (f) {
      FS.writeFile(f.name, convertToUint8Array(f.data));
    });
  });
  return Module.then(function () {
    try {
      Module.callMain(params.arguments || []);
    } catch (e) {
      if (!(e && e.name === 'ExitStatus')) stderr.push(String(e));
    }
    var FS = Module.FS;
    var outFiles = FS.readdir('/work')
      .filter(function (n) { return n !== '.' && n !== '..' && !inputNames[n]; })
      .map(function (n) { return { name: n, data: new Uint8Array(FS.readFile('/work/' + n)) }; });
    return { MEMFS: outFiles, stdout: stdout, stderr: stderr };
  });
}

function makeExport(name) { return function (data) { return runApp(name, data); }; }

exports.gdcmconv = makeExport('gdcmconv');
exports.gdcmanon = makeExport('gdcmanon');
exports.gdcmcheck = makeExport('gdcmcheck');
exports.gdcmdictdump = makeExport('gdcmdictdump');
exports.gdcmdiff = makeExport('gdcmdiff');
exports.gdcmdump = makeExport('gdcmdump');
exports.gdcmgendir = makeExport('gdcmgendir');
exports.gdcmimg = makeExport('gdcmimg');
exports.gdcmkey = makeExport('gdcmkey');
exports.gdcmoverlay = makeExport('gdcmoverlay');
exports.gdcmpap3 = makeExport('gdcmpap3');
exports.gdcmraw = makeExport('gdcmraw');
exports.gdcmscanner = makeExport('gdcmscanner');
exports.gdcmtar = makeExport('gdcmtar');
exports.gdcmxml = makeExport('gdcmxml');
exports.pdf2dcm = makeExport('pdf2dcm');
