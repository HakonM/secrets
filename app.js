// Requiring all modules to be used
const express = require('express');
const bodyParser = require('body-parser');
const ejs = require('ejs');
const mongoose = require('mongoose');
const encrypt = require('mongoose-encryption');

const app = express();

// Stuff for EJS, Express, and body-parser
app.use(express.static("public"));
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({
  extended: true
}));

// Connecting to MongoDB
mongoose.connect("mongodb://localhost:27017/userDB", {useNewUrlParser: true, useUnifiedTopology: true});

// Schema examples
const userSchema = new mongoose.Schema({
  email: String,
  password: String
});

// Creating secret string for mongoose-encryption encryption. NOTE: Must include this BEFORE making the model
const secret = "Thisisourlittlesecret.";
userSchema.plugin(encrypt, { secret: secret, encryptedFields: ['password'] });

const User = new mongoose.model("User", userSchema);


// Routes for your website
app.route("/").get(function(req, res){
  res.render("home")
});


app.route("/login")
.get(function(req, res){
  res.render("login")
})
.post(function(req, res){
  const username = req.body.username;
  const password = req.body.password;

  User.findOne({email: username}, function(err, foundUser){
    if (err) {
      console.log(err);
      res.send("Error with the database.")
    } else {
      if (foundUser) {
        if (foundUser.password === password) {
          res.render("secrets");
        } else {
          console.log("Username or password incorrect");
          res.send("Wrong password")
        }
      } else {
        console.log("Username not in database. The entered username is: " + username + " and the foundUser is: " + foundUser);
        res.send("No user found.")
      }
    }
  })
});


app.route("/register")
.get(function(req, res){
  res.render("register")
})
.post(function(req, res){
  // Adds new user to userDB
  const newUser = new User({
    email: req.body.username,
    password: req.body.password
  });
  newUser.save(function(err){
    if (err) {
      console.log(err);
    } else {
      res.render("secrets");
    }
  })
});

// Console logs to make sure server is running successfully
app.listen(3000, function(){
  console.log("Server running on port 3000");
})
