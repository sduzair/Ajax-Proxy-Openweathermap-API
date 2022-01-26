var express = require('express');
var proxy = require('http-proxy-middleware');

// proxy middleware options
var filter = function (pathname, req) {
  // return true;
  // replace www.myapp.example with origin(s) that your content will be served from
  // return (req.headers.origin === 'https://www.myapp.example');
  // multiple origin version:
  return ((req.headers.origin === 'http://127.0.0.1:5500') || (req.headers.origin === 'https://127.0.0.1:5500') || (req.headers.origin === 'https://sduzair.github.io'));   
};

var apiOptions = {
  // replace api.datasource.example with the url of your target host
  target: 'https://api.openweathermap.org',
  changeOrigin: true, // needed for virtual hosted sites like Heroku
  pathRewrite: {
    '^/weatherapi/': '/', // remove endpoint from request path ('^/api/': '/')
  },
  onProxyReq: (proxyReq) => {
    // append key-value pair for API key to end of path
    // using KEYNAME provided by web service
    // and KEYVALUE stored in Heroku environment variable
    proxyReq.path += ('&appid=' + process.env.OWM_APIKEY + '&units=metric');
  },
  logLevel: 'debug' // verbose server logging
};

// create the proxy (without context)
var apiProxy = proxy(filter, apiOptions);

var app = express();
app.set('port', (process.env.PORT || 5000));

app.use('/weatherapi', apiProxy);

app.listen(app.get('port'));
