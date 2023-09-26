const server = require('./blog-service');
const express = require('express'); // "require" the Express module
const app = express(); // obtain the "app" object
const HTTP_PORT = process.env.PORT || 8080; // assign a port

// start the server on the port and output a confirmation ot the console
app.listen(HTTP_PORT, () => console.log(`server listening on: ${HTTP_PORT}`));

  app.use(express.static('public')); 
  app.get('/', (req, res) => {
    res.redirect('/about');
  });

  app.get('/about', (req, res) => {
    res.sendFile('/Users/devonconnelly/Documents/web322/web322-app/views/about.html')
  });

  app.get('/blog', (req, res) => {

  });

  app.get('/posts', (req, res) => {
    
  });

  app.get('/categories', (req, res) => {
    
  });

