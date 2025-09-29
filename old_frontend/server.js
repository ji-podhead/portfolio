var http = require('http');
var fs = require('fs');

var handleRequest = function(request, response) {
    console.log(request)
    console.log('Received request for URL: ' + request.url);
  
  fs.readFile('index.html', function(err, data) {
    if (err) {
      response.writeHead(404);
      response.end('File not found');
    } else {
      response.writeHead(200, {'Content-Type': 'text/html'});
      response.end(data);
    }
  });
};
var www = http.createServer(handleRequest);
www.listen(8080);
