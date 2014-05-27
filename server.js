var koa = require('koa');
var app = koa();

// logger

app.use(function *(next){
  yield next;
  console.log('%s %s - %sms', this.method, this.url, this._requestTook);
});

// x-response-time

app.use(function *(next){
  var start = new Date();
  this._requestStartedAt = start;
  yield next;
  var ms = new Date() - start;
  this._requestTook = ms;
  this.set('X-Response-Time', ms + 'ms');
});


// response

app.use(function *(){
  this.body = 'Hello World';
});

app.listen(3000);