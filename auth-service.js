const mongoose = require('mongoose');
let Schema = mongoose.Schema;
let userSchema = new Schema({
    userName: {
        type: String,
        unique: true,
    },
    password : String,
    email: String,
    loginHistory: [{dateTime: Date, userAgent: String}],
});
let User; 

async function initialize() {
    return new Promise((resolve, reject) => {
       let db = mongoose.createConnection("mongodb+srv://devonconnelly123:WtlP5OwuwAQKqnY7@web322.daphdse.mongodb.net/?retryWrites=true&w=majority");
       // pword might be wrong
       db.on('error', (err) => {
        reject(err);
      });
      db.once('open', () => {
        User = db.model('users', userSchema);
        resolve();
      });
    });
}

async function registerUser(userData) {
    return new Promise((resolve, reject) => {
        if(userData.password === userData.password2) {
            User.find({userName: userData.userName})
            .exec()
            .then((data) => {
                if(data.length === 0) {
                    let newUser = new User(userData);
                    newUser.save()
                    .then(() => {
                        resolve();
                    })
                    .catch((err) => {
                        if(err.code == 11000) {
                            reject("User name already taken");
                        } else {
                            reject("There was an error creating the user: " + err );
                        }
                    });
                } else {
                    reject("User name already taken");
                }
            });
        } else {
            reject("Passwords do not match");
        }
    });
}

async function checkUser(userData) {
    return new Promise((resolve, reject) => {
        User.find({userName: userData.userName})
        .exec()
        .then((users) => {
            if(users.length == 0) {
                reject("Unable to find user: " + user );
            }
            if(users[0].password != userData.password) {
                reject("Incorrect Password for user: " + userName );
            } 
            else {
                users[0].loginHistory.push({dateTime: (new Date()).toString(), userAgent: userData.userAgent});
                User.updateOne(
                    { userName: users[0].userName }, 
                    { $set: { loginHistory: users[0].loginHistory } }
                  ).exec()
                  .then(() => {
                    resolve(users[0]);
                  })
                  .catch((err) => {
                    reject("There was an error verifying the user: " + err);
                  });
                
            }
        })
        .catch(() => {
            reject("Unable to find user: " + userData.userName);
        });
    });
}

module.exports = {initialize, registerUser, checkUser};