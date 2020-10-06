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

function gdcmFunc(params) {
    console.log("func");

    params = params || {};
    var __abort = abort;
    var returnData;
    var Module = {};

    Object.keys(params).forEach(function(key) {
        if (["mounts", "MEMFS", "onExit", "chdir"].indexOf(key) < 0) {
            Module[key] = params[key];
        }
    });

    // Mute exception on unreachable.
    abort = function(what) {
        console.log("abort");
        if (arguments.length) {
            __abort(what);
        } else {
            throw new ExitStatus(0);
        }
    };

    // Fix CR.
    function __out(cb) {
        console.log("out");
        var buf = [];
        return function(ch, flush) {
            if (flush && buf.length) return cb(UTF8ArrayToString(buf, 0));
            if (ch === 10 || ch === 13) {
                if (ENVIRONMENT_IS_NODE) buf.push(ch);
                cb(UTF8ArrayToString(buf, 0));
                buf = [];
            } else if (ch !== 0) {
                buf.push(ch);
            }
        };
    }
    Module["stdin"] = Module["stdin"] || function() {};
    Module["stdout"] = Module["stdout"] || __out(function(line) { out(line) });
    Module["stderr"] = Module["stderr"] || __out(function(line) { err(line) });
    if (typeof process === "object") {
        Module["print"] = Module["print"] || process.stdout.write.bind(process.stdout);
        Module["printErr"] = Module["printErr"] || process.stderr.write.bind(process.stderr);
    }

    // Disable process.exit in nodejs and don't call onExit twice.
    Module["quit"] = function(status) {
        console.log("quit");
        Module["stdout"](0, true);
        Module["stderr"](0, true);
        if (params["onExit"]) params["onExit"](status);
    };

    Module["preRun"] = function() {
        console.log("prerun");
        (params["mounts"] || []).forEach(function(mount) {
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
        FS.chdir(params["chdir"] || "/work");

        (params["MEMFS"] || []).forEach(function(file) {
            if (file["name"].match(/\//)) {
                throw new Error("Bad file name");
            }
            var fd = FS.open(file["name"], "w+");
            var data = convertToUint8Array(file["data"]);
            FS.write(fd, data, 0, data.length);
            FS.close(fd);
        });
    };

    Module["postRun"] = function() {
        console.log("postrun");

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
            return filenames.map(function(filename) {
                return contents[filename];
            });
        }

        var inFiles = Object.create(null);
        (params["MEMFS"] || []).forEach(function(file) {
            inFiles[file.name] = null;
        });
        var outFiles = listFiles("/work").filter(function(file) {
            return !(file.name in inFiles);
        }).map(function(file) {
            var data = convertToUint8Array(file.contents);
            return {"name": file.name, "data": data};
        });
        returnData = {"MEMFS": outFiles};
    };