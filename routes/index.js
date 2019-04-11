var express = require("express");
var router  = express.Router();
var passport = require("passport");
var User = require("../models/user");

//root route
router.get("/", function(req, res){
    res.render("landing");
});

// // show register form
// router.get("/register", function(req, res){
//    res.render("register"); 
// });

//handle sign up logic
// router.post("/register", function(req, res){
//     var newUser = new User({username: req.body.username});
//     User.register(newUser, req.body.password, function(err, user){
//         if(err){
//             req.flash("error", err.message);
//             return res.render("register");
//         }
//         passport.authenticate("local")(req, res, function(){
//            req.flash("success", "Welcome to YelpCamp " + user.username);
//            res.redirect("/campgrounds"); 
//         });
//     });
// });
router.post("/register", function(req, res) {
    var newUser = new User({username: req.body.username,
                            password: req.body.password});

    newUser.save(function(err) {
      if (err) {
        res.status(500).send(err);
        //req.flash("error", err.message);
        //return res.render("register");
      }
      passport.authenticate("local")(req, res, function() {
        res.status(200).send("ok");
        //req.flash("success", "Welcom to YelpTravel " + user.username);
        //res.redirect("/campgrounds");
      });
    });
});

//show login form
router.get("/login", function(req, res){
   res.render("login"); 
});

// //handling login logic
// router.post("/login", passport.authenticate("local", 
//     {
//         successRedirect: "/campgrounds",
//         failureRedirect: "/login"
//     }), function(req, res){
// });

//handling login logic  (user login)
router.post("/user/login", passport.authenticate("local", 
    {
        successRedirect: "/campgrounds",
        failureRedirect: "/login"
    }), function(req, res){
        User.findOne( {username: req.username}, function(err, user) {
            if (err) throw err;

            user.comparePassword(req.password, function(err, isMatch) {
                if (err) throw err;

            });
        });

});

//handling login logic  (user login)
router.post("/admin/login", passport.authenticate("local", 
    {
        successRedirect: "/campgrounds",
        failureRedirect: "/login"
    }), function(req, res){
        Admin.findOne( {adminname: req.username}, function(err, admin) {
            if (err) throw err;
            admin.comparePassword(req.password, function(err, isMatch) {
                if (err) throw err;
            });
        });

});

// logout route
router.get("/logout", function(req, res){
   req.logout();
   req.flash("success", "Logged you out!");
   res.redirect("/campgrounds");
});



module.exports = router;