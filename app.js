let express = require('express');
let app = express();
//let http = require('http');
//let server = http.createServer(app);
let https = require('https');
let path = require('path');
let favicon = require('serve-favicon');
let fs = require('fs');
let logger = require('morgan');
let cookieParser = require('cookie-parser');
let bodyParser = require('body-parser');
let mongoose = require('mongoose');
let jwt = require('json-web-token');
let access = require('./models/access.js');
mongoose.Promise = global.Promise;
//mongoose.connect('localhost:27017/dbcharitick');
mongoose.connect('mongodb://test:test@ds111489.mlab.com:11489/dbcharitick');

let routes = require('./routes/index');
let signup = require('./routes/signup');
let login = require('./routes/login');
let payments = require('./routes/payments');
let organizationform = require('./routes/organizationform');
let pwdrecovery = require('./routes/pwdrecovery');
let aboutit = require('./routes/aboutit');
let aboutorganization = require('./routes/aboutorganization');
let terms = require('./routes/terms');
let privacy = require('./routes/privacy');

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

let urlencodedParser = bodyParser.urlencoded({ extended: false });

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
  let token = req.cookies['_accessToken'];
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
  let err = new Error('Not Found');
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