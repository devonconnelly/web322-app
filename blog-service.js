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
                category();
            });  
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
            let publishedPosts = [];
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

async function getPublishedPostsByCategory(category) {
    return new Promise((resolve, reject) => {
        if(posts.length != 0) {
            let publishedPosts = [];
            posts.forEach(post => {
                if(post.published == true && post.category == category) {
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

async function addPost (postData){
    return new Promise((resolve, reject) => {
        if(!postData.published) {
            postData.published = false;
        }
        else {
            postData.published = true;
        }
        postData.id = posts.length + 1;
        let newDate = new Date();
        postData.postDate = `${newDate.getFullYear()}-${newDate.getMonth() + 1}-${newDate.getDate()}`;
        posts.push(postData);
        resolve(postData);
    });
}

async function getPostsByCategory(category) {
    return new Promise ((resolve, reject) => {
        let catPosts = [];
        posts.forEach(post => {
            if(post.category == category) {
                catPosts.push(post);
            }
        });
        if(catPosts.length != 0) {
            resolve(catPosts);
        }
        else {
            reject("no results returned");
        }
    });
}

async function getPostsByMinDate(minDateStr) {
    return new Promise((resolve, reject) => {
        let datePosts = [];
        posts.forEach(post => {
            if(new Date(post.postDate) >= new Date(minDateStr)) {
                datePosts.push(post);
            }
        });
        if(datePosts.length != 0) {
            resolve(datePosts);
        }
        else {
            reject("no results returned");
        }
    });
}

async function getPostById(id) {
    return new Promise ((resolve, reject)=> {
        let idPost;
        posts.forEach(post => {
            if(post.id == id) {
                idPost = post;
                resolve(idPost);
            }
        });
        reject("no results returned");
    });
}

module.exports = { initialize, getAllPosts, getPublishedPosts, getCategories, addPost, getPostsByCategory, getPostsByMinDate, getPostById, getPublishedPostsByCategory };
