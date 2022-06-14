const http = require('http');
const fs = require('fs');
const url = require('url');
const qs = require('querystring');

const templateHTML = (title, list, body) => {
  return `
  <!doctype html>
  <html>
  <head>
    <title>WEB1 - ${title}</title>
    <meta charset="utf-8">
  </head>
  <body>
    <h1><a href="/">WEB</a></h1>
    ${list}
    <a href="/create">create</a>
    ${body}
  </body>
  </html>
  `
}
const templateList = (files) =>{
  let list = `<ul>`;
  files.forEach(file => {
    list = list + `<li><a href="/?id=${file}">${file}</a></li>`
  })
  list = list+`</ul>`;
  return list
}

const app = http.createServer((request,response) => {
    const _url = request.url;
    const queryData = url.parse(_url, true).query;
    const pathname = url.parse(_url, true).pathname;

    if( pathname == '/'){
      fs.readFile(`data/${queryData.id}`, 'utf-8', (err, description= "Hello! Node.js") => {
        fs.readdir("./data/", (err, files) => {
          let title = queryData.id;
          if(title === undefined){ title = 'Welcome!'; }
          let list = templateList(files);
          const template = templateHTML(title, list, `
            <h2>${title}</h2> <p>${description}</p>
          `);
          response.writeHead(200);
          response.end(template);
        });
      });
    } else if( pathname == '/create'){
      fs.readdir("./data/", (err, files) => {
        let title = "WEB - Create";
        let list = templateList(files);
        const template = templateHTML(title, list, `
          <form action= "http://localhost:3000/create_process" method="post">
            <p><input type="text" name="title" placeholder="title"></p>
            <p>
              <textarea name="description" placeholder="description"></textarea>
            </p>
            <p>
              <input type="submit">
            </p>
          </form>
        `);
        response.writeHead(200);
        response.end(template);
      });
    }else if (pathname == '/create_process'){
        let body = '';
        request.on('data', (data) => {
          body += data;
          // if (body.lenght > 1e6){request.socket.destroy();};
        });
        request.on('end', () => {
          let post = qs.parse(body);
          let title = post.title;
          let description = post.description;
          console.log(title);
          console.log(description);
        });
        response.writeHead(200);
        response.end("success");
    }else{
      response.writeHead(404);
      response.end('Not found');
    }
});
app.listen(3000);