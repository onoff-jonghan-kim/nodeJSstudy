const http = require('http');
const fs = require('fs');
const url = require('url');
const qs = require('querystring');
const { json } = require('stream/consumers');
const template = require('./lib/template.js');

const app = http.createServer((request,response) => {
    const _url = request.url;
    const queryData = url.parse(_url, true).query;
    const pathname = url.parse(_url, true).pathname;

    if( pathname === '/'){
      fs.readFile(`data/${queryData.id}`, 'utf-8', (err, description= "Hello! Node.js") => {
        fs.readdir("./data/", (err, files) => {
          let title = queryData.id;
          if(title === undefined){ 
            title = 'Welcome!';
            let list = template.list(files);
            const html = template.html(title, list, 
              `<h2>${title}</h2> <p>${description}</p>`,
              `<a href="/create">create</a>`
              );
            response.writeHead(200);
            response.end(html);
          } else{
            let list = template.list(files);
            const html = template.html(title, list, 
              `<h2>${title}</h2> <p>${description}</p>`,
              `<a href="/create">create</a> 
               <a href="/update?id=${title}">update</a>
               <form action="/delete_process" method="post" style="display:inline;">
                <input type="hidden" name="id" value="${title}">
                <input type="submit" value="delete" style="display:inline;background-color:#ffff;border:none;text-decoration:underline;color:#0000EE;cursor:pointer;text-decoration-color:initial;padding:0;font-size:16px;">
               </form>
              `
              );
            response.writeHead(200);
            response.end(html);
          }
        });
      });
    } else if( pathname === '/create'){
      fs.readdir("./data/", (err, files) => {
        let title = "WEB - Create";
        let list = template.list(files);
        const html = template.html(title, list, `
          <form action= "/create_process" method="post">
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
        response.end(html);
      });
    }else if (pathname === '/create_process'){
        let body = '';
        request.on('data', (data) => {
          body += data;
          // if (body.lenght > 1e6){request.socket.destroy();};
        });
        request.on('end', () => {
          let post = qs.parse(body);
          let title = post.title;
          let description = post.description;
          fs.writeFile(`data/${title}`, description, 'utf8', (err)=>{
            response.writeHead(302, {Location: `.?id=${title}`});
            response.end();
          });
        });
    }else if (pathname === '/update'){
      fs.readdir("./data/", (err, files) => {
        fs.readFile(`data/${queryData.id}`, 'utf-8', (err, description) => {
          let title = queryData.id;
          let list = template.list(files);
          const html = template.html(title, list, 
            `
              <form action= "/update_process" method="post">
                <input type="hidden" name="id" value="${title}"/>
                <p><input type="text" name="title" placeholder="title" value="${title}"/></p>
                <p>
                  <textarea name="description" placeholder="description">${description}</textarea>
                </p>
                <p>
                  <input type="submit">
                </p>
              </form>
            `,
            `<a href="/create">create</a> <a href="/update?id=${title}">update</a>`
            );
          response.writeHead(200);
          response.end(html);
        });
      });
    }else if(pathname === "/update_process"){
        let body = '';
        request.on('data', (data) => {
          body += data;
          // if (body.lenght > 1e6){request.socket.destroy();};
        });
        request.on('end', () => {
          let post = qs.parse(body);
          let id = post.id;
          let title = post.title;
          let description = post.description;
          fs.rename(`data/${id}`, `data/${title}`, (err) =>{
            fs.writeFile(`data/${title}`, description, 'utf8', (err)=>{
              response.writeHead(302, {Location: `/?id=${title}`});
              response.end();
            });
          });
        });
    }else if(pathname === "/delete_process"){
        let body = '';
        request.on('data', (data) => {
          body += data;
          // if (body.lenght > 1e6){request.socket.destroy();};
        });
        request.on('end', () => {
          let post = qs.parse(body);
          let id = post.id;
          fs.unlink(`data/${id}`, (err)=>{
            response.writeHead(302, {Location: `/`});
            response.end();
          })
        });
    }else{
      response.writeHead(404);
      response.end('Not found');
    }
});
app.listen(3000);