const Sequelize = require('sequelize');
var sequelize = new Sequelize('SenecaDB', 'devonconnelly', '9v3KOYPWjHyU', {
    host: 'ep-curly-thunder-78525342-pooler.us-east-2.aws.neon.tech',
    dialect: 'postgres',
    port: 5432,
    dialectOptions: {
        ssl: { rejectUnauthorized: false }
    },
    query: { raw: true }
});

const Post = sequelize.define('Post', {
    body: Sequelize.TEXT,
    title: Sequelize.STRING,
    postDate: Sequelize.DATE,
    featureImage:Sequelize.STRING,
    published: Sequelize.BOOLEAN
});

const Category = sequelize.define('Category', {
    category: Sequelize.STRING
});

Post.belongsTo(Category, {foreignKey: 'category'});

async function initialize() {
    return new Promise((resolve, reject) => {
        sequelize.sync()
        .then((data) => {
            resolve(data);
        })
        .catch((error) => {
            reject("unable to sync the database");
        });
});
}

async function getAllPosts() {
    return new Promise((resolve, reject) => {
        Post.findAll()
        .then((data) => {
            resolve(data);
        })
        .catch((error) => {
            reject("no results returned");
        });
});
}

async function getPublishedPosts () {
    return new Promise((resolve, reject) => {
        Post.findAll({
            where : {
                published: true
            }
        })
        .then((data) => {
            resolve(data);
        })
        .catch((error) => {
            reject("no results returned");
        });
});
}

async function getPublishedPostsByCategory(category) {
    return new Promise((resolve, reject) => {
        Post.findAll({
            where : {
            published: true,
            category: category
            }
        })
        .then((data) => {
            resolve(data);
        })
        .catch((error) => {
            reject("no results returned");
        });
});
}

async function getCategories() {
    return new Promise((resolve, reject) => {
        Category.findAll()
        .then((data) => {
            resolve(data);
        })
        .catch((error) => {
            reject("no results returned");
        });
});
}

async function addPost (postData){
    return new Promise((resolve, reject) => {
        postData.published = (postData.published) ? true : false;
        for (prop in postData) {
            if(prop == "") {
                prop = null;
            }
        }
        postData.postDate = new Date();
        Post.create({
            body: postData.body,
            title: postData.title,
            postDate: postData.postDate,
            featureImage: postData.featureImage,
            published: postData.published
        })
        .then((data) => {
            resolve(data);
        })
        .catch((error) => {
            reject("unable to create post");
        });
    });
}

async function getPostsByCategory(category) {
    return new Promise((resolve, reject) => {
        Post.findAll({
            where: {
                category: category
            }
        })
        .then((data) => {
            resolve(data);
        })
        .catch((error) => {
            reject("no results returned");
        });
});
}

async function getPostsByMinDate(minDateStr) {
    return new Promise((resolve, reject) => {
        const { gte } = Sequelize.Op;
        Post.findAll({
            where: {
              postDate: {
                [gte]: new Date(minDateStr)
              }
            }
          })
        .then((data) => {
            resolve(data);
        })
        .catch((errror) => {
            reject("no results returned");
        });
});
}

async function getPostById(id) {
    return new Promise((resolve, reject) => {
        Post.findAll({
            where: {
                id: id
            }
        })
        .then((data) => {
            resolve(data[0]);
        })
        .catch((error) => {
            reject("no results returned");
        });
});
}

async function addCategory(categoryData) {
    return new Promise((resolve, reject) => {
        for (prop in categoryData) {
            if(prop == "") {
                prop = null;
            }
        }
        Category.create({
            category: categoryData.category
        })
        .then((data) => {
            resolve(data);
        })
        .catch((error) => {
            reject("unable to create category");
        });
    });
}

async function deleteCategoryById(id) {
    return new Promise((resolve, reject) => {
        Category.destroy({
            where: {
                id: id
            }
        })
        .then(() => {
            resolve();
        })
        .catch(() => {
            reject();
        })
    });
}

async function deletePostById(id) {
    return new Promise((resolve, reject) => {
        Post.destroy({
            where: {
                id: id
            }
        })
        .then(() => {
            resolve();
        })
        .catch(() => {
            reject("rejected");
        })
    });
}

module.exports = { initialize, getAllPosts, getPublishedPosts, getCategories, addPost, getPostsByCategory, getPostsByMinDate, getPostById, getPublishedPostsByCategory, addCategory, deleteCategoryById, deletePostById };
