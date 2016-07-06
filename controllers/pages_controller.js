// Dependencies
var MongoClient = require('mongodb').MongoClient;

// Imports
var app = require('../libs/application');
var Util = require('../helpers/util');

// Variables
var URL = 'mongodb://localhost:27017/urls';

var PagesController = {
  index: function(req, res){
    res.render('home');
  },
  admin: function(req, res){
    res.render('admin');
  },
  redirect: function(req, res){
    MongoClient.connect(URL, function(err, db){
      db.collection('urls').findOne({ 'shortUrl': req.params.id}, function(err, data){
        if (data === null){
          res.render('error');
        } else {
          db.collection('urls').updateOne({ 'shortUrl': req.params.id }, { $set: { 'count': data.count+1}}, function(err, results){
            res.redirect(data.fullUrl);
          });
        }
      });
    });
  },
  custom: function(req, res){
    MongoClient.connect(URL, function(err, db){
      db.collection('urls').findOne({ 'shortUrl': req.body.text}, function(err, data){
        res.send(data == null);
      });
    });
  },
  getUrls: function(req, res){
    var docs = new Array();
    MongoClient.connect(URL, function(err, db){
      db.collection('urls').find().toArray(function(err, docs){
        res.json(docs);
      });
    });
  },
  deleteUrl: function(req, res){
    var fullUrl = req.body.fullUrl;
    MongoClient.connect(URL, function(err, db){
      db.collection('urls').deleteOne({ 'fullUrl': fullUrl}, function(err, results){
        res.send(true);
      });
    });
  },
  deleteEmpty: function(req, res){
    MongoClient.connect(URL, function(err, db){
      db.collection('urls').deleteMany({ 'count': 0 }, function(err, results){
        res.send(true);
      });
    });
  },
  shorten: function(req, res){
    var newUrl = "http://localhost:" + app.get('port') + "/";
    var oldUrl = req.body.url;
    var chk = req.body.chk;
    var custom = req.body.custom;
    var seed = '';

    MongoClient.connect(URL, function(err, db){
      db.collection('urls').findOne({ "fullUrl": oldUrl }, function(err, data){
        if (data == null){
          if (chk == 'true' && custom.length != 0){
            console.log('1');
            Util.successCB(db, res, oldUrl, newUrl, custom);
          }else{
            Util.checkHashInDB(db, res, oldUrl, newUrl, Util.successCB, Util.failCB);
          }
        } else {
          seed = data.shortUrl;
          db.close();
          res.send({ url: newUrl + seed });
        }
      });
    });
  }
}

module.exports = PagesController;
