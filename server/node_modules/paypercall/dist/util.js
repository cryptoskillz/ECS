"use strict";

var pwrap = function pwrap(fn) {
  return function (req, res, next) {
    return fn(req, res, next).catch(next);
  };
};

var only = function only(o) {
  for (var _len = arguments.length, keys = Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
    keys[_key - 1] = arguments[_key];
  }

  return keys.reduce(function (r, k) {
    return r[k] = o[k], r;
  }, {});
};

var now = function now(_) {
  return Date.now() / 1000 | 0;
};

module.exports = { pwrap: pwrap, only: only, now: now };