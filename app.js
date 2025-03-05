// app.js
const http = require('http');
const fs = require('fs');
const url = require('url');
const querystring = require('querystring');

const hostname = '127.0.0.1';
const port = 3000;

let data = [];

const server = http.createServer((req, res) => {
  const parsedUrl = url.parse(req.url);
  const path = parsedUrl.pathname;

  if (path === '/' && req.method === 'GET') {
    fs.readFile('index.html', (err, content) => {
      if (err) {
        res.writeHead(500, { 'Content-Type': 'text/plain' });
        res.end('Internal Server Error');
      } else {
        res.writeHead(200, { 'Content-Type': 'text/html' });
        res.end(content);
      }
    });
  } else if (path === '/submit' && req.method === 'POST') {
    let body = '';
    req.on('data', chunk => {
      body += chunk.toString();
    });
    req.on('end', () => {
      const parsedBody = querystring.parse(body);
      data.push({ name: parsedBody.name, age: parsedBody.age });
      res.writeHead(302, { 'Location': '/' });
      res.end();
    });
  } else if (path === '/data' && req.method === 'GET') {
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify(data));
  } else {
    res.writeHead(404, { 'Content-Type': 'text/plain' });
    res.end('Not Found');
  }
});

server.listen(port, hostname, () => {
  console.log(`Server running at http://${hostname}:${port}/`);
});