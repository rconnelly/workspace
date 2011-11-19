
/**
 * Module dependencies.
 */


var mongoose = require('mongoose');
var mail = require('mail').Mail({
    host: 'smtp.gmail.com',
    username: 'nomadapps.test@gmail.com',
    password: 'test123123',
    secure: true,
    port: 587,
    domain: 'gmail.com'
});
var Schema = mongoose.Schema;

/**
 * Schema definition
 */

// recursive embedded-document schema

var Kynde = new Schema();

Kynde.add({
    title     : { type: String, index: true }
  , email        : String
  , message      : String
});

/**
 * Accessing a specific schema type by key
 */
/*
Kynde.path('date')
.default(function(){
   return new Date()
 })
.set(function(v){
   return v == 'now' ? new Date() : v;
 });
*/
/**
 * Pre hook.
 */

Kynde.pre('save', function(next, done){
  mail.message({
  from: 'nomadapps.test@gmail.com',
  to: this.email,
  subject: 'You received a Kynde!'
})
.body(this.message)
.send(function(err) {
  if (err) throw err;
  console.log('Sent! to: ' + this.email + ' kynde message: ' + this.message);
});
  next();
});

/**
 * Methods
 */
/*
BlogPost.methods.findCreator = function (callback) {
  return this.db.model('Person').findById(this.creator, callback);
}

BlogPost.statics.findByTitle = function (title, callback) {
  return this.find({ title: title }, callback);
}

BlogPost.methods.expressiveQuery = function (creator, date, callback) {
  return this.find('creator', creator).where('date').gte(date).run(callback);
}
*/

/**
 * Plugins
 */

function slugGenerator (options){
  options = options || {};
  var key = options.key || 'title';

  return function slugGenerator(schema){
    schema.path(key).set(function(v){
      this.slug = v.toLowerCase().replace(/[^a-z0-9]/g, '').replace(/-+/g, '');
      return v;
    });
  };
};

Kynde.plugin(slugGenerator());

/**
 * Define model.
 */

mongoose.model('Kynde', Kynde);
