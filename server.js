var express = require('express'),
  http = require('http'),
  path = require('path'),
  scores = require('./public/routes/scores'),
  app = express();

app.set('port', 3000);

app.use(express.static(path.join(__dirname, 'public')));
app.use('/scripts', express.static(__dirname + '/scripts'));

app.get('/', function(request, response) {
  response.sendFile('index.html');
});

app.get('/scores', scores.all);
app.post('/scores', scores.add);

app.all('/*', function(request, response) {
  console.log("Bad route called");
  response.writeHead(501);
  response.end();
});

http.createServer(app).listen(app.get('port'), function() {
  console.log('Don\'t give us a bad grade Dean');
});
