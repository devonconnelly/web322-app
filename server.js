/*********************************************************************************
*  WEB322 – Assignment 03
*  I declare that this assignment is my own work in accordance with Seneca  Academic Policy.  No part *  of this assignment has been copied manually or electronically from any other source 
*  (including 3rd party web sites) or distributed to other students.
* 
*  Name: Devon Connelly Student ID: 105322218 Date: Oct. 10 2023
*
*  Online (Cyclic) Link: https://fair-ruby-bullfrog-gown.cyclic.cloud/about
*
********************************************************************************/ 

const server = require('./blog-service');
const multer = require("multer");
const cloudinary = require('cloudinary').v2
const streamifier = require('streamifier')
const path = require('path');
const express = require('express'); // "require" the Express module
const app = express(); // obtain the "app" object
const HTTP_PORT = process.env.PORT || 8080; // assign a port

app.use(express.static('public'));

cloudinary.config({
  cloud_name: 'des6uotap',
  api_key: '377357674115752',
  api_secret: '2MfUcVMCkqbw2z3KIiQPc4bMPe4',
  secure: true
});

const upload = multer(); 

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
    if(req.query.category) {
      server.getPostsByCategory(req.query.category)
      .then((data) => {
        res.json(data);
      })
      .catch((err) => {
        res.send({"message": err});
      });
    }
    else if(req.query.minDate) {
      server.getPostsByMinDate(req.query.minDate)
      .then((data) => {
        res.json(data);
      })
      .catch((err) => {
        res.send({"message": err});
      });
    }
    else {
     server.getAllPosts()
      .then((data) => {
        res.json(data);
      })
      .catch((err) => {
        res.send({"message": err});
      });
    }
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

  app.get('/posts/add', (req, res) => {
    res.sendFile(path.join(__dirname, '/views/addPost.html'));
  });

  app.post('/posts/add', upload.single("featureImage"), (req, res) => {
    let streamUpload = (req) => {
      return new Promise((resolve, reject) => {
          let stream = cloudinary.uploader.upload_stream(
              (error, result) => {
              if (result) {
                  resolve(result);
              } else {
                  reject(error);
              }
              }
          );
  
          streamifier.createReadStream(req.file.buffer).pipe(stream);
      });
  };
  
  async function upload(req) {
      let result = await streamUpload(req);
      console.log(result);
      return result;
  }
  
  upload(req).then((uploaded)=>{
      req.body.featureImage = uploaded.url;
      server.addPost(req.body).then(() => {
      res.redirect('/posts');
      });
  });
  
  });

  app.get('/posts/:value', (req, res) => {
    server.getPostById(req.params.value)
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

