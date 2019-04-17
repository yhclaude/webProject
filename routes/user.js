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
                    // res.send('password reset successful');
                    req.flash("success", "Profile edited!");
                    res.redirect("/login");
                });
            }
        });
    }
});

// //CREATE - add new blog to admin and wait for checking by admin 
// router.post("/", middleware.isLoggedIn, function(req, res){
//     // get data from form and add to blogs array
//     var name = req.body.name;
//     var image = req.body.image;
//     var desc = req.body.description;
//     var author = {
//         id: req.user._id,
//         username: req.user.username
//     }
//     // new 2 lines!
//     var check = false;
//     var newBlog = {name: name, image: image, description: desc, author:author, check:check}
//     // Create a new blog and save to DB
//     Blog.create(newBlog, function(err, newlyCreated){
//         if(err){
//             console.log(err);
//         } else {
//             //redirect back to blogs page
//             console.log(newlyCreated);
//             res.redirect("/blogs");
//         }
//     });
// });

// //NEW - show form to create new blog
// router.get("/new", middleware.isLoggedIn, function(req, res){
//    res.render("blogs/new"); 
// });

// // SHOW - shows more info about one blog
// router.get("/:id", function(req, res){
//     //find the blog with provided ID
//     Blog.findById(req.params.id).populate("comments").exec(function(err, foundBlog){
//         if(err){
//             console.log(err);
//         } else {
//             console.log(foundBlog)
//             //render show template with that blog
//             res.render("blogs/show", {blog: foundBlog});
//         }
//     });
// });

// // EDIT BLOG ROUTE
// router.get("/:id/edit", middleware.checkBlogOwnership, function(req, res){
//     Blog.findById(req.params.id, function(err, foundBlog){
//         res.render("blogs/edit", {blog: foundBlog});
//     });
// });

// // UPDATE BLOG ROUTE
// router.put("/:id",middleware.checkBlogOwnership, function(req, res){
//     // find and update the correct blog
//     Blog.findByIdAndUpdate(req.params.id, req.body.blog, function(err, updatedBlog){
//        if(err){
//            res.redirect("/blogs");
//        } else {
//            //redirect somewhere(show page)
//            res.redirect("/blogs/" + req.params.id);
//        }
//     });
// });

// // DESTROY BLOG ROUTE
// router.delete("/:id",middleware.checkBlogOwnership, function(req, res){
//     Blog.findByIdAndRemove(req.params.id, function(err){
//       if(err){
//           console.log(err);
//           res.redirect("/blogs");
//       } else {
//           res.redirect("/blogs");
//       }
//    });
// });


module.exports = router;

