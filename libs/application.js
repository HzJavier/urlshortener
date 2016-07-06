var express = require('express');
var bodyParser = require('body-parser');
var handlebars = require('express3-handlebars').create({ defaultLayout: 'main' });

var app = express();

// set enviroment
app.set('port', process.env.PORT || 3000);

//view engine setup
app.engine('handlebars', handlebars.engine);
app.set('view engine', 'handlebars');

//general setup
app.use(express.static('./public'));

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

module.exports = app;
