var requires = {};

exports.gdcmconv = function(data)
{
  if(requires.gdcmconv === undefined)
      requires.gdcmconv = require('./dist/gdcmconv.js');

  return requires.gdcmconv(data);
};

exports.gdcmanon = function(data)
{
    if(requires.gdcmanon === undefined)
        requires.gdcmanon = require('./dist/gdcmanon.js');

    return requires.gdcmanon(data);
};

exports.gdcmcheck = function(data)
{
    if(requires.gdcmcheck === undefined)
        requires.gdcmcheck = require('./dist/gdcmcheck.js');

    return requires.gdcmcheck(data);
};

exports.gdcmdictdump = function(data)
{
    if(requires.gdcmdictdump === undefined)
        requires.gdcmdictdump = require('./dist/gdcmdictdump.js');

    return requires.gdcmdictdump(data);
};

exports.gdcmdiff = function(data)
{
    if(requires.gdcmdiff === undefined)
        requires.gdcmdiff = require('./dist/gdcmdiff.js');

    return requires.gdcmdiff(data);
};

exports.gdcmdump = function(data)
{
    if(requires.gdcmdump === undefined)
        requires.gdcmdump = require('./dist/gdcmdump.js');

    return requires.gdcmdump(data);
};

exports.gdcmgendir = function(data)
{
    if(requires.gdcmgendir === undefined)
        requires.gdcmgendir = require('./dist/gdcmgendir.js');

    return requires.gdcmgendir(data);
};

exports.gdcmimg = function(data)
{
    if(requires.gdcmimg === undefined)
        requires.gdcmimg = require('./dist/gdcmimg.js');

    return requires.gdcmimg(data);
};

exports.gdcmkey = function(data)
{
    if(requires.gdcmkey === undefined)
        requires.gdcmkey = require('./dist/gdcmkey.js');

    return requires.gdcmkey(data);
};

exports.gdcmoverlay = function(data)
{
    if(requires.gdcmoverlay === undefined)
        requires.gdcmoverlay = require('./dist/gdcmoverlay.js');

    return requires.gdcmoverlay(data);
};

exports.gdcmpap3 = function(data)
{
    if(requires.gdcmpap3 === undefined)
        requires.gdcmpap3 = require('./dist/gdcmpap3.js');

    return requires.gdcmpap3(data);
};

exports.gdcmraw = function(data)
{
    if(requires.gdcmraw === undefined)
        requires.gdcmraw = require('./dist/gdcmraw.js');

    return requires.gdcmraw(data);
};

exports.gdcmscanner = function(data)
{
    if(requires.gdcmscanner === undefined)
        requires.gdcmscanner = require('./dist/gdcmscanner.js');

    return requires.gdcmscanner(data);
};

exports.gdcmtar = function(data)
{
    if(requires.gdcmtar === undefined)
        requires.gdcmtar = require('./dist/gdcmtar.js');

    return requires.gdcmtar(data);
};

exports.gdcmxml = function(data)
{
    if(requires.gdcmxml === undefined)
        requires.gdcmxml = require('./dist/gdcmxml.js');

    return requires.gdcmxml(data);
};

exports.pdf2dcm = function(data)
{
    if(requires.pdf2dcm === undefined)
        requires.pdf2dcm = require('./dist/pdf2dcm.js');

    return requires.pdf2dcm(data);
};