var app = require('./libs/application');
app.use(require('body-parser')());
require('./libs/routes.js');


var server = app.listen(app.get('port'), function(){
  var host = server.address().address;
  var port = server.address().port;
  console.log("-> application starting on http://%s:%s", host, port);
  console.log("-> Ctrl-C to shutdown server");
});
