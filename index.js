var express = require('express');

var app = express();

var handlebars = require('express3-handlebars').create({ defaultLayout: 'main' });
app.engine('handlebars', handlebars.engine);
app.set('view engine', 'handlebars');

app.set('port', 3000);
app.use(express.static(__dirname + '/public'));

// Middlewares
app.use(function(req, res, next){
  console.log('404');
  res.status(404);
  res.render('404');
});

app.use(function(err, req, res, next){
  console.error(err.stack);
  res.status(500);
  res.render('500');
});

// Routes
app.get('/', function(req, res){
  console.log('home');
  res.render('home');
});

app.listen(app.get('port'), function(){
  console.log('Arrancando en http://localhost:' + app.get('port'));
});
