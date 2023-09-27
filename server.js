/*********************************************************************************
*  WEB322 – Assignment 02
*  I declare that this assignment is my own work in accordance with Seneca  Academic Policy.  No part *  of this assignment has been copied manually or electronically from any other source 
*  (including 3rd party web sites) or distributed to other students.
* 
*  Name: Devon Connelly Student ID: 105322218 Date: Sep. 27 2023
*
*  Online (Cyclic) Link: ________________________________________________________
*
********************************************************************************/ 

const server = require('./blog-service');
const path = require('path');
const express = require('express'); // "require" the Express module
const app = express(); // obtain the "app" object
const HTTP_PORT = process.env.PORT || 8080; // assign a port

// start the server on the port and output a confirmation ot the console
server.initialize()
  .then(() =>  { 
    app.listen(HTTP_PORT, () => console.log(`server listening on: ${HTTP_PORT}`)); 
  })
  .catch(() => {
    console.log("error initializing files");
  });

  app.use(express.static('public')); 
  app.get('/', (req, res) => {
    res.redirect('/about');
  });

  app.get('/about', (req, res) => {
    res.sendFile(path.join(__dirname, '/views/about.html'));
  });

  app.get('/blog', (req, res) => {
      server.getPublishedPosts()
      .then((data) => {
        res.json(data);
      })
      .catch((err) => {
        res.send({"message": err});
      });
  });

  app.get('/posts', (req, res) => {
     server.getAllPosts()
      .then((data) => {
        res.json(data);
      })
      .catch((err) => {
        res.send({"message": err});
      });
  });

  app.get('/categories', (req, res) => {
    server.getCategories()
      .then((data) => {
        res.json(data);
      })
      .catch((err) => {
        res.send({"message": err});
      });
  });

  app.use((req, res) => {
    res.status(404).sendFile(path.join(__dirname, 'views/404.html'));
  });

