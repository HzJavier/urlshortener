var app = require('./application')
var pages = require('../controllers/pages_controller')

// Routes

app.get('/', pages.index);
app.get('/admin', pages.admin);
app.get('/:id', pages.redirect);

app.post('/custom', pages.custom);
app.post('/getUrls', pages.getUrls);
app.post('/deleteUrl', pages.deleteUrl);
app.post('/deleteEmpty', pages.deleteEmpty);
app.post('/shorten', pages.shorten);
