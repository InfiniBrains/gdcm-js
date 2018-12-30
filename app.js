var requires = {};

exports.gdcmconv = function(memfs, args)
{
  if(requires.gdcmconv === undefined)
      requires.gdcmconv = require('./gdcmconv.js');

  return requires.gdcmconv({
      MEMFS: memfs,
      arguments: args,
      stdin: function () {}
  });
};

exports.gdcmanon = function(memfs, args)
{
    if(requires.gdcmanon === undefined)
        requires.gdcmanon = require('./gdcmanon.js');

    return requires.gdcmanon({
        MEMFS: memfs,
        arguments: args,
        stdin: function () {}
    });
};

exports.gdcmcheck = function(memfs, args)
{
    if(requires.gdcmcheck === undefined)
        requires.gdcmcheck = require('./gdcmcheck.js');

    return requires.gdcmcheck({
        MEMFS: memfs,
        arguments: args,
        stdin: function () {}
    });
};

exports.gdcmdictdump = function(memfs, args)
{
    if(requires.gdcmdictdump === undefined)
        requires.gdcmdictdump = require('./gdcmdictdump.js');

    return requires.gdcmdictdump({
        MEMFS: memfs,
        arguments: args,
        stdin: function () {}
    });
};

exports.gdcmdiff = function(memfs, args)
{
    if(requires.gdcmdiff === undefined)
        requires.gdcmdiff = require('./gdcmdiff.js');

    return requires.gdcmdiff({
        MEMFS: memfs,
        arguments: args,
        stdin: function () {}
    });
};

exports.gdcmgendir = function(memfs, args)
{
    if(requires.gdcmgendir === undefined)
        requires.gdcmgendir = require('./gdcmgendir.js');

    return requires.gdcmgendir({
        MEMFS: memfs,
        arguments: args,
        stdin: function () {}
    });
};

exports.gdcmimg = function(memfs, args)
{
    if(requires.gdcmimg === undefined)
        requires.gdcmimg = require('./gdcmimg.js');

    return requires.gdcmimg({
        MEMFS: memfs,
        arguments: args,
        stdin: function () {}
    });
};

exports.gdcmkey = function(memfs, args)
{
    if(requires.gdcmkey === undefined)
        requires.gdcmkey = require('./gdcmkey.js');

    return requires.gdcmkey({
        MEMFS: memfs,
        arguments: args,
        stdin: function () {}
    });
};

exports.gdcmoverlay = function(memfs, args)
{
    if(requires.gdcmoverlay === undefined)
        requires.gdcmoverlay = require('./gdcmoverlay.js');

    return requires.gdcmoverlay({
        MEMFS: memfs,
        arguments: args,
        stdin: function () {}
    });
};

exports.gdcmpap3 = function(memfs, args)
{
    if(requires.gdcmpap3 === undefined)
        requires.gdcmpap3 = require('./gdcmpap3.js');

    return requires.gdcmpap3({
        MEMFS: memfs,
        arguments: args,
        stdin: function () {}
    });
};

exports.gdcmraw = function(memfs, args)
{
    if(requires.gdcmraw === undefined)
        requires.gdcmraw = require('./gdcmraw.js');

    return requires.gdcmraw({
        MEMFS: memfs,
        arguments: args,
        stdin: function () {}
    });
};

exports.gdcmscanner = function(memfs, args)
{
    if(requires.gdcmscanner === undefined)
        requires.gdcmscanner = require('./gdcmscanner.js');

    return requires.gdcmscanner({
        MEMFS: memfs,
        arguments: args,
        stdin: function () {}
    });
};

exports.gdcmtar = function(memfs, args)
{
    if(requires.gdcmtar === undefined)
        requires.gdcmtar = require('./gdcmtar.js');

    return requires.gdcmtar({
        MEMFS: memfs,
        arguments: args,
        stdin: function () {}
    });
};

exports.gdcmxml = function(memfs, args)
{
    if(requires.gdcmxml === undefined)
        requires.gdcmxml = require('./gdcmxml.js');

    return requires.gdcmxml({
        MEMFS: memfs,
        arguments: args,
        stdin: function () {}
    });
};

exports.pdf2dcm = function(memfs, args)
{
    if(requires.pdf2dcm === undefined)
        requires.pdf2dcm = require('./pdf2dcm.js');

    return requires.pdf2dcm({
        MEMFS: memfs,
        arguments: args,
        stdin: function () {}
    });
};