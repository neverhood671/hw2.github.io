'use strict';
const http = require('http');
var fs = require("fs");
http.createServer(function(requset, response) {
  fs.readFile("countries_1995_2012.json", function(err, data) {
    response.writeHead(200, {
      'Content-Type': 'text/json',
      'Access-Control-Allow-Origin': '*'
    });
    response.write(data);
    response.end();
  });
}).listen(8080);
console.log('Server running on 8080');
