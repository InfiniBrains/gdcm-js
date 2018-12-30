
function convertToUint8Array(data) {
    if (Array.isArray(data) || data instanceof ArrayBuffer) {
        data = new Uint8Array(data);
    } else if (!data) {
        // `null` for empty files.
        data = new Uint8Array(0);
    } else if (!(data instanceof Uint8Array)) {
        // Avoid unnecessary copying.
        data = new Uint8Array(data.buffer);
    }
    return data;
}

function gdcmconvFunc(params) {
    params = params || {};
    var returndata = {};
    var Module = {};
    var stdout = [];
    var stderr = [];

    Object.keys(params).forEach(function (key) {
        if (key != "mounts" && key != "MEMFS") {
            Module[key] = params[key];
        }
    });

    // XXX(Kagami): Prevent Emscripten to call `process.exit` at the end of
    // execution on Node.
    // There is no longer `NODE_STDOUT_FLUSH_WORKAROUND` and it seems to
    // be the best way to accomplish that.
    Module["preInit"] = function () {
        if (ENVIRONMENT_IS_NODE) {
            exit = Module["exit"] = function (status) {
                ABORT = true;
                EXITSTATUS = status;
                STACKTOP = initialStackTop;
                exitRuntime();
                if (Module["onExit"]) Module["onExit"](status);
                throw new ExitStatus(status);
            };
        }
    };

    Module["preRun"] = function () {
        (params["mounts"] || []).forEach(function (mount) {
            var fs = FS.filesystems[mount["type"]];
            if (!fs) {
                throw new Error("Bad mount type");
            }
            var mountpoint = mount["mountpoint"];
            // NOTE(Kagami): Subdirs are not allowed in the paths to simplify
            // things and avoid ".." escapes.
            if (!mountpoint.match(/^\/[^\/]+$/) ||
                mountpoint === "/." ||
                mountpoint === "/.." ||
                mountpoint === "/tmp" ||
                mountpoint === "/home" ||
                mountpoint === "/dev" ||
                mountpoint === "/work") {
                throw new Error("Bad mount point");
            }
            FS.mkdir(mountpoint);
            FS.mount(fs, mount["opts"], mountpoint);
        });

        FS.mkdir("/work");
        FS.chdir("/work");

        (params["MEMFS"] || []).forEach(function (file) {
            if (file["name"].match(/\//)) {
                throw new Error("Bad file name");
            }
            var fd = FS.open(file["name"], "w+");
            var data = convertToUint8Array(file["data"]);
            FS.write(fd, data, 0, data.length);
            FS.close(fd);
        });
    };

    Module["postRun"] = function () {
        // NOTE(Kagami): Search for files only in working directory, one
        // level depth. Since FFmpeg shouldn't normally create
        // subdirectories, it should be enough.
        function listFiles(dir) {
            var contents = FS.lookupPath(dir).node.contents;
            var filenames = Object.keys(contents);
            // Fix for possible file with "__proto__" name. See
            // <https://github.com/kripken/emscripten/issues/3663> for
            // details.
            if (contents.__proto__ && contents.__proto__.name === "__proto__") {
                filenames.push("__proto__");
            }
            return filenames.map(function (filename) {
                return contents[filename];
            });
        }

        var inFiles = Object.create(null);
        (params["MEMFS"] || []).forEach(function (file) {
            inFiles[file.name] = null;
        });
        var outFiles = listFiles("/work").filter(function (file) {
            return !(file.name in inFiles);
        }).map(function (file) {
            var data = convertToUint8Array(file.contents);
            return {"name": file.name, "data": data};
        });
        returndata = {
            "MEMFS": outFiles,
            "stdout": stdout,
            "stderr": stderr
        };
    };

    Module.print = function (text) {
        console.log(text);
        stdout.push(text);
    };

    Module.printErr = function (text) {
        console.log(text);
        stderr.push(text);
    };
