/*var express = require('express');
var app = express();

app.get('/', function(request, response){
    response.send('Hello MGT-656!');
});

app.get('/nickname', function(request, response){
    response.send('gentle-leopard');
});

app.listen(process.env.PORT || 8080);*/
var http = require('http');
http.createServer(function (req, res) {
  res.writeHead(200, {'Content-Type': 'text/plain'});
  res.end('Hello World from Cloud9\n');
}).listen(process.env.PORT);