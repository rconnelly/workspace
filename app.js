
/**
 * Module dependencies.
 */

var express = require('express');
var ArticleProvider = require('./article-provider-memory').ArticleProvider;
//var mongoose = require('mongoose');
var app = module.exports = express.createServer();
//require.paths.unshift('support/mongoose/lib')

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

var articleProvider= new ArticleProvider();

// Routes

app.get('/', function(req, res){
  articleProvider.findAll(function(error, docs) {
      res.render('index', { 
          locals: {
              title: 'Blog',
              articles:docs
          }
      });
  });
  /*res.render('index', {
    title: 'My Blog'
  }); */
});

app.get('/blog/new', function(req, res) {
    res.render('new.jade', { locals: {
        title: 'New Post'
    }
    });
});

app.get('/activity/kynde', function(req, res) {
    res.render('kynde', { locals: {
        title: 'Send a Kynde'
    }
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

app.listen(3000);
console.log("Express server listening on port %d in %s mode", app.address().port, app.settings.env);
