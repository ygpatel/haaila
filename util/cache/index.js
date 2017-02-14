'use strict';

exports = module.exports = function(req, res) {
  var haailaCache = new (require("node-cache"));
  return haailaCache;
};