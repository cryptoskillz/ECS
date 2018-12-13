'use strict';

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

var _fs = require('fs');

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

var app = require('express')(),
    proxy = require('http-proxy').createProxyServer({ target: process.env.UPSTREAM_URL }),
    rates = require('js-yaml').safeLoad(process.env.RATES_YAML || (0, _fs.readFileSync)(process.env.RATES_PATH || 'rates.yaml'));

var pay = require('./paypercall')({
  chargeUrl: process.env.CHARGE_URL,
  chargeToken: process.env.CHARGE_TOKEN,
  dbPath: process.env.DB_PATH,
  currency: process.env.CURRENCY,
  secret: process.env.TOKEN_SECRET,
  invoiceExp: process.env.INVOICE_EXPIRY,
  accessExp: process.env.ACCESS_EXPIRY
});

app.set('env', process.env.NODE_ENV || 'production');
app.set('port', process.env.PORT || 4000);
app.set('host', process.env.HOST || 'localhost');
app.set('trust proxy', process.env.PROXIED || 'loopback');

app.enable('strict routing');
app.enable('case sensitive routing');
app.disable('x-powered-by');
app.disable('etag');

app.use(require('morgan')('dev'));

var proxyweb = proxy.web.bind(proxy);

Object.keys(rates).forEach(function (ep) {
  var _ep$split = ep.split(' ', 2),
      _ep$split2 = _slicedToArray(_ep$split, 2),
      method = _ep$split2[0],
      path = _ep$split2[1],
      rate = rates[ep].toString();

  app[method.toLowerCase()](path, pay.apply(undefined, _toConsumableArray(rate.split(' '))), proxyweb);
});

app.listen(app.settings.port, app.settings.host, function (_) {
  return console.log('HTTP reverse proxy running on http://' + app.settings.host + ':' + app.settings.port + ', proxying to ' + process.env.UPSTREAM_URL);
});