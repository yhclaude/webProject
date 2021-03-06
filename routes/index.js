var express = require("express");
var router  = express.Router();
var passport = require("passport");
var User = require("../models/user");
var Blog = require("../models/blog");

//root route
router.get("/", function(req, res){
    res.render("landing");
});

// show register form
router.get("/register", function(req, res){
   res.render("register"); 
});

//handle sign up logic
router.post("/register", function(req, res){
    var newUser = new User({username: req.body.username, image: req.body.image, identity: "normal"});
    User.register(newUser, req.body.password, function(err, user){
        if(err){
            req.flash("error", err.message);
            return res.render("register");
        }
        passport.authenticate("local")(req, res, function(){
            req.flash("success", "Welcome to Travel Blog, " + user.username);
            res.redirect("/blogs"); 
        });
    });
});

//show login form
router.get("/login", function(req, res){
   res.render("login"); 
});

//handling login logic
router.post("/login", passport.authenticate("local", {
    successRedirect: "/blogs",
    failureRedirect: "/login"
}), function(req, res) {});

//show adminLogin form
router.get("/adminLogin", function(req, res){
    res.render("adminLogin"); 
});
 
//handling adminLogin logic
router.post("/adminLogin", passport.authenticate("local", 
    {
        successRedirect: "/blogs",
        failureRedirect: "/adminLogin"
    }), function(req, res){
});

// logout route
router.get("/logout", function(req, res){
    req.logout();
    req.flash("success", "Logged you out!");
    res.redirect("/blogs");
});

module.exports = router;