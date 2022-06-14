var http = require('http');
var fs = require('fs');
var url = require('url');

var app = http.createServer(function(request,response){
    var _url = request.url;
    var queryData = url.parse(_url, true).query;
    var pathname = url.parse(_url, true).pathname;

    if( pathname == '/'){
      fs.readFile(`data/${queryData.id}`, 'utf-8', function(err, description= "Hello! Node.js"){
        fs.readdir("./data/", (err, files) => {
            let title = queryData.id;
            if(title === undefined){
                title = 'Welcome';
            }
            let list = `<ul>`;
            files.forEach(file => {
              list = list + `<li><a href="/?id=${file}">${file}</a></li>`
            })
            list = list+`</ul>`;
            var template = `
            <!doctype html>
            <html>
            <head>
              <title>WEB1 - ${title}</title>
              <meta charset="utf-8">
            </head>
            <body>
              <h1><a href="/">WEB</a></h1>
              ${list}
              <h2>${title}</h2>
              <p>${description}</p>
            </body>
            </html>
            `;
          response.writeHead(200);
          response.end(template);
        });
      });
    } else{
      response.writeHead(404);
      response.end('Not found');
    }

});
app.listen(3000);