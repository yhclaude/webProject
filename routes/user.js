var express = require("express");
var router  = express.Router();
var User = require("../models/user");
var Blog = require("../models/blog");
var Comment = require("../models/comment");
var middleware = require("../middleware");


//INDEX - show all blogs
router.get("/", function(req, res){
    if (req.user.identity === "normal") {
        Blog.find({"author": {id: req.user._id, username: req.user.username, image: req.user.image}}, function(err, allBlogs){
            if(err){
                req.flash("error", err.message);
                res.render("landing");
            } else {
                Comment.find({"author": {id: req.user._id, username: req.user.username}}, function(error, allComments){
                    if(error){
                        req.flash("error", error.message);
                        res.render("landing");
                    } else {
                        var info = {user: req.user, blogs:allBlogs, comments: allComments};
                        res.render("homepages/userHome", {info: info});
                    }
                });
                
            }
        });
        // res.render("homepages/userHome");
    } else {
        Blog.find({}, function(err, allBlogs){
            if(err){
                req.flash("error", err.message);
                res.render("landing");
            } else {
                res.render("homepages/adminHome", {blogs:allBlogs});
            }
        });
        
    }
});

router.put("/edit/:id", middleware.isLoggedIn, function(req, res) {
    if (req.body.password != req.body.password1) {
        res.redirect("back");
        req.flash("error", "Confirm that you input same passwords.");
    } else {
        User.findByIdAndUpdate(req.params.id, {$set:{image:req.body.photo}}, function(err, foundUser) {
            if (err) {
                req.flash("error", err.message);
                res.redirect("back");
            } else {
                foundUser.setPassword(req.body.password, function() {
                    foundUser.save();
                    req.flash("success", "Profile edited!");
                    res.redirect("/login");
                });
            }
        });
    }
});

module.exports = router;

