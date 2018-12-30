var gdcm = require('./gdcmconv.js');

exports.gdcmconv = function(memfs, args)
{
  var result = gdcm({
    MEMFS: memfs,
    arguments: args,
    stdin: function() {},
  });

  return result;
}