var koa = require('koa');
var serve = require('koa-static');
global.S = require('springbokjs-utils');

var argv = require('minimist')(process.argv.slice(2), {
    alias: {
        'production': 'prod'
    }
});

var app = koa();

if (!argv.production) {
    console.log('Dev mode');
    app.use(require('koa-livereload')({
        port: argv.livereloadPort
    }));
    /*['src', 'node_modules'].forEach((folder) => {
        app.use('/' + folder, serve('../../' + folder));
    });*/
} else {
    console.log('Production mode');
}

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

//app.get('/', (req, res) => res.render('index', { URL: req.path }));


app.use(serve('../../public'));

var port = argv.port || 3000;
app.listen(port, console.log.bind(null, 'Listening on port ' + port));