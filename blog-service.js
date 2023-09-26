const fs = require("fs"); 
var posts = [];
var categories = [];

async function initialize() {
    return new Promise((resolve, reject) => {
        post();
        function post() {
            fs.readFile('./data/posts.json', 'utf8', (err, data) => {
                if(err) reject('unable to read file');
            posts = JSON.parse(data);
            });
            category();
        }
        function category() {
            fs.readFile('./data/categories.json', 'utf8', (err, data) => {
                if(err) reject('unable to read file');
                categories = JSON.parse(data)
                resolve('Operation Successful');
            });
        }
        
    });
}

async function getAllPosts() {
    return new Promise((resolve, reject) => {
        if(posts.length != 0) {
            resolve(posts);
        }
        else {
            reject('no results returned');
        }
    });
}

async function getPublishedPosts () {
    return new Promise((resolve, reject) => {
        if(posts.length != 0) {
            var publishedPosts = [];
            posts.forEach(post => {
                if(post.published == true) {
                    publishedPosts.push(post);
                }
                
            });
            resolve(publishedPosts);
        }
        else {
            reject('no results returned');
        }
    });
}

async function getCategories() {
    return new Promise((resolve, reject) => {
        if(categories.length != 0) {
            resolve(categories);
        }
        else {
            reject('no results returned');
        }
    });
}

module.exports = { initialize, getAllPosts, getPublishedPosts, getCategories };
