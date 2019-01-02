var requires = {};

exports.gdcmconv = function(data)
{
  if(requires.gdcmconv === undefined)
      requires.gdcmconv = require('./gdcmconv.js');

  return requires.gdcmconv(data);
};

exports.gdcmanon = function(data)
{
    if(requires.gdcmanon === undefined)
        requires.gdcmanon = require('./gdcmanon.js');

    return requires.gdcmanon(data);
};

exports.gdcmcheck = function(data)
{
    if(requires.gdcmcheck === undefined)
        requires.gdcmcheck = require('./gdcmcheck.js');

    return requires.gdcmcheck(data);
};

exports.gdcmdictdump = function(data)
{
    if(requires.gdcmdictdump === undefined)
        requires.gdcmdictdump = require('./gdcmdictdump.js');

    return requires.gdcmdictdump(data);
};

exports.gdcmdiff = function(data)
{
    if(requires.gdcmdiff === undefined)
        requires.gdcmdiff = require('./gdcmdiff.js');

    return requires.gdcmdiff(data);
};

exports.gdcmdump = function(data)
{
    if(requires.gdcmdump === undefined)
        requires.gdcmdump = require('./gdcmdump.js');

    return requires.gdcmdump(data);
};

exports.gdcmgendir = function(data)
{
    if(requires.gdcmgendir === undefined)
        requires.gdcmgendir = require('./gdcmgendir.js');

    return requires.gdcmgendir(data);
};

exports.gdcmimg = function(data)
{
    if(requires.gdcmimg === undefined)
        requires.gdcmimg = require('./gdcmimg.js');

    return requires.gdcmimg(data);
};

exports.gdcmkey = function(data)
{
    if(requires.gdcmkey === undefined)
        requires.gdcmkey = require('./gdcmkey.js');

    return requires.gdcmkey(data);
};

exports.gdcmoverlay = function(data)
{
    if(requires.gdcmoverlay === undefined)
        requires.gdcmoverlay = require('./gdcmoverlay.js');

    return requires.gdcmoverlay(data);
};

exports.gdcmpap3 = function(data)
{
    if(requires.gdcmpap3 === undefined)
        requires.gdcmpap3 = require('./gdcmpap3.js');

    return requires.gdcmpap3(data);
};

exports.gdcmraw = function(data)
{
    if(requires.gdcmraw === undefined)
        requires.gdcmraw = require('./gdcmraw.js');

    return requires.gdcmraw(data);
};

exports.gdcmscanner = function(data)
{
    if(requires.gdcmscanner === undefined)
        requires.gdcmscanner = require('./gdcmscanner.js');

    return requires.gdcmscanner(data);
};

exports.gdcmtar = function(data)
{
    if(requires.gdcmtar === undefined)
        requires.gdcmtar = require('./gdcmtar.js');

    return requires.gdcmtar(data);
};

exports.gdcmxml = function(data)
{
    if(requires.gdcmxml === undefined)
        requires.gdcmxml = require('./gdcmxml.js');

    return requires.gdcmxml(data);
};

exports.pdf2dcm = function(data)
{
    if(requires.pdf2dcm === undefined)
        requires.pdf2dcm = require('./pdf2dcm.js');

    return requires.pdf2dcm(data);
};