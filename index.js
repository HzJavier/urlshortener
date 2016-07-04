var express = require('express');
var app = express();

var handlebars = require('express3-handlebars').create({ defaultLayout: 'main' });
app.engine('handlebars', handlebars.engine);
app.set('view engine', 'handlebars');

app.set('port', 3000);
app.use(express.static(__dirname + '/public'));
app.use(require('body-parser')());

var MongoClient = require('mongodb').MongoClient;
var assert = require('assert');
var ObjectId = require('mongodb').ObjectID;
var url = 'mongodb://localhost:27017/urls';

// Routes

app.get('/', function(req, res){
  if (typeof req.query.id == "undefined"){
    res.render('home');
  }else{
    MongoClient.connect(url, function(err, db){
      db.collection('urls').findOne({ "shortUrl": req.query.id}, function(err, data){
        if (data == null){
          res.render('error');
        } else {
          db.collection('urls').updateOne({ 'shortUrl': req.query.id }, { $set: { 'count': data.count+1}}, function(err, results){
            res.redirect(data.fullUrl);
          });
        }
      });
    });
  }
});

app.get('/admin', function(req, res){
  res.render('admin');
});

app.post('/custom', function(req, res){
  MongoClient.connect(url, function(err, db){
    db.collection('urls').findOne({ "shortUrl": req.body.text}, function(err, data){
      res.send(data == null);
    });
  });
});

app.post('/getUrls', function(req, res){
  var docs = new Array();
  MongoClient.connect(url, function(err, db){
    db.collection('urls').find().toArray(function(err, docs){
      res.json(docs);
    });
  });
});

app.post('/deleteUrl', function(req, res){
  var id = req.body.id;
  MongoClient.connect(url, function(err, db){
    db.collection('urls').deleteOne({ "id": id }, function(err, results){
      res.send(true);
    });
  });
});

app.post('/deleteEmpty', function(req, res){
  MongoClient.connect(url, function(err, db){
    db.collection('urls').deleteMany({ "count": 0 }, function(err, results){
      res.send(true);
    });
  });
});

function generateShort() {
  return Math.random().toString(36).slice(-6);
}

function checkHashInDB(db, res, oldUrl, newUrl, success, fail) {
  var seed = generateShort();
  db.collection('urls').findOne({ "shortUrl": seed }, function(err, url){
    if (url === null) {
      return success(db, res, oldUrl, newUrl, seed);
    } else {
      return fail(db);
    }
  });
}

function successCB(db, res, oldUrl, newUrl, seed) {
  db.collection('urls').insertOne({ "fullUrl" : oldUrl, "shortUrl" : seed, "count": 0 });
  db.close();
  res.send({ url: newUrl + seed });
  return;
}

function failCB(db) {
  checkHashInDB(db, successCB, failCB);
}

app.post('/shorten', function(req, res){
  var newUrl = "http://localhost:" + app.get('port') + "/?id=";
  var oldUrl = req.body.url;
  var chk = req.body.chk;
  var custom = req.body.custom;
  var seed = '';

  MongoClient.connect(url, function(err, db){
    db.collection('urls').findOne({ "fullUrl": oldUrl }, function(err, data){
      if (data == null){
        if (chk == 'true' && custom.length != 0){
          successCB(db, res, oldUrl, newUrl, custom);
        }else{
          checkHashInDB(db, res, oldUrl, newUrl, successCB, failCB);
        }
      } else {
        seed = data.shortUrl;
        db.close();
        res.send({ url: newUrl + seed });
        return;
      }
    });
  });
});

// Middlewares
app.use(function(req, res, next){
  res.status(404);
  res.render('404');
});

app.use(function(err, req, res, next){
  console.error(err.stack);
  res.status(500);
  res.render('500');
});

app.listen(app.get('port'), function(){
  console.log('Arrancando en http://localhost:' + app.get('port'));
});
