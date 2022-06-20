module.exports = {
  html:  (title, list, body, control="") => {
    return `
    <!doctype html>
    <html>
    <head>
      <title>WEB2 - ${title}</title>
      <meta charset="utf-8">
    </head>
    <body>
      <h1><a href="/">WEB</a></h1>
      ${list}
      ${control}
      ${body}
    </body>
    </html>
    `
  },
  list : (files) =>{
    let list = `<ul>`;
    files.forEach(file => {
      list = list + `<li><a href="/?id=${file}">${file}</a></li>`
    })
    list = list+`</ul>`;
    return list
  }

}