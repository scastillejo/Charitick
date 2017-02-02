var express = require('express');
var app = express();
//var http = require('http');
//var server = http.createServer(app);
var https = require('https');
var path = require('path');
var favicon = require('serve-favicon');
var fs = require('fs');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var jwt = require('json-web-token');
var access = require('./models/access.js');
mongoose.Promise = global.Promise;
//mongoose.connect('localhost:27017/dbcharitick');
mongoose.connect('mongodb://test:test@ds111489.mlab.com:11489/dbcharitick');

var routes = require('./routes/index');
var signup = require('./routes/signup');
var login = require('./routes/login');
var payments = require('./routes/payments');
var organizationform = require('./routes/organizationform');
var pwdrecovery = require('./routes/pwdrecovery');
var aboutit = require('./routes/aboutit');
var aboutorganization = require('./routes/aboutorganization');
var terms = require('./routes/terms');
var privacy = require('./routes/privacy');

const httpsOptions = {
  cert: fs.readFileSync(path.join(__dirname, 'ssl', 'server.crt')),
  key: fs.readFileSync(path.join(__dirname, 'ssl', 'server.key'))
}
connections = [];

app.set('view engine', 'ejs');
app.use(express.static('./public'));

https.createServer(httpsOptions, app).listen(3443, function(){
  console.log('server running on port 3443');
})
/*server.listen(process.env.PORT || 3000);
console.log('server running...');*/

var urlencodedParser = bodyParser.urlencoded({ extended: false });

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());

app.use('/', jwtdecode, routes);
app.use('/signup', jwtdecode, signup);
app.use('/login', login);
app.use('/payments', jwtdecode, payments);
app.use('/organizationform', jwtdecode, organizationform);
app.use('/pwdrecovery', pwdrecovery);
app.use('/aboutit', aboutit);
app.use('/aboutorganization', aboutorganization);
app.use('/terms', terms);
app.use('/privacy', privacy);

function jwtdecode(req, res, next) {
  var token = req.cookies['_accessToken'];
  if (token != undefined) {
    try {
      jwt.decode(access.secret, token, function (err, decode) {
        if (err) {
          return console.error(err.name, err.message);
        } 
        else {
          req.userid = decode.iss;
          req.username = decode.sub;
          return next();
        }
      });
    }
    catch (err) { console.log('ERROR when parsing access token.', err); }
  }
  else {
    req.userid = '';
    return next();
  }
};
// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});

module.exports = app;