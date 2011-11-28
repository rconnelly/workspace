
/**
 * Module dependencies.
 */

var express = require('express');
var mongoose = require('mongoose');
require('./schema').Kynde;
var Kynde = mongoose.model('Kynde');
mongoose.connect('mongodb://localhost/kynde')

var app = module.exports = express.createServer();

// Configuration

app.configure(function(){
  app.set('views', __dirname + '/views');
  app.set('view engine', 'jade');
  app.use(express.bodyParser());
  app.use(express.methodOverride());
  app.use(require('stylus').middleware({ src: __dirname + '/public' }));
  app.use(app.router);
  app.use(express.static(__dirname + '/public'));
});

app.configure('development', function(){
  app.use(express.errorHandler({ dumpExceptions: true, showStack: true })); 
});

app.configure('production', function(){
  app.use(express.errorHandler()); 
});

// Providers

// Routes
/*
app.get('/', function(req, res){
  articleProvider.findAll(function(error, docs) {
      res.render('index2', { 
          layout: false,
          locals: {
              title: 'Blog',
              articles:docs
          }
      });
  });
  */
  /*res.render('index', {
    title: 'My Blog'
  }); */
//});

app.get('/blog/new', function(req, res) {
    res.render('new.jade', { locals: {
        title: 'New Post'
    }
    });
});

app.get('/', function(req, res) {
    res.render('kynde', { locals: {
        title: 'Send a Kynde'
    }
    });
});

app.post('/kynde', function(req, res) {
    var k = new Kynde();
    k.email = req.param('email');
    k.message = req.param('message');
    k.save(function(err) {
      if (err) throw err;
       res.render('kynde-sent', { locals: {
                title: 'Thanks!'
            }
        });
    });
});

app.post('/blog/new', function(req, res){
    articleProvider.save({
        title: req.param('title'),
        body: req.param('body')
    }, function( error, docs) {
        res.redirect('/')
    });
});

var port = process.env.PORT || 3000
app.listen(port);
console.log("Express server listening on port %d in %s mode", app.address().port, app.settings.env);
