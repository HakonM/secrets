// Requiring all modules to be used
const express = require('express');
const bodyParser = require('body-parser');
const ejs = require('ejs');
const mongoose = require('mongoose');

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
const userSchema = {
  email: String,
  password: String
}
const User = new mongoose.model("User", userSchema)

// Routes for your website
app.route("/").get(function(req, res){
  res.render("home")
});


app.route("/login")
.get(function(req, res){
  res.render("login")
})
.post(function(req, res){
  User.findOne({email: req.body.username}, function(err, foundUsername){
    if (err) {
      console.log(err);
    } else {
      if (foundUsername) {
        if (foundUsername.password === req.body.password) {
          res.render("secrets");
        } else {
          console.log("Username or password incorrect");
        }
      } else {
        console.log("Username not in database");
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
