var express = require("express");
var router  = express.Router();
//var Campground = require("../models/campground");
var Blog = require("../models/blog");
var middleware = require("../middleware");


//INDEX - show all campgrounds
// router.get("/", function(req, res){
//     // Get all campgrounds from DB
//     Campground.find({}, function(err, allCampgrounds){
//        if(err){
//            console.log(err);
//        } else {
//           res.render("campgrounds/index",{campgrounds:allCampgrounds});
//        }
//     });
// });


router.get("/", function(req, res){
    // Get all blogs from DB
    Blog.find({}, function(err, allBlogs){
       if(err){
            res.status(500).send(err);
            console.log(err);
       } else {
           res.json(allBlogs);
            // res.render("blogs/index",{blogs:allBlogs});
       }
    });
});

//CREATE - add new campground to DB
// router.post("/", middleware.isLoggedIn, function(req, res){
//     // get data from form and add to campgrounds array
//     var name = req.body.name;
//     var image = req.body.image;
//     var desc = req.body.description;
//     var author = {
//         id: req.user._id,
//         username: req.user.username
//     }
//     var newCampground = {name: name, image: image, description: desc, author:author}
//     // Create a new campground and save to DB
//     Campground.create(newCampground, function(err, newlyCreated){
//         if(err){
//             console.log(err);
//         } else {
//             //redirect back to campgrounds page
//             console.log(newlyCreated);
//             res.redirect("/campgrounds");
//         }
//     });
// });


//CREATE - add new blog to DB
router.post("/", middleware.isLoggedIn, function(req, res) {

    //get data from form and add to blog array
    var name = req.body.name;
    var image = req.body.image;
    var desc = req.body.description;
    var author = {
      id: req.user._id,
      username: req.user.username
    }
    var newBlog = {name: name, image: image, description: desc, author: author}
    Blog.create(newBlog, function(err, newlyCreated) {
        if(err) {
          console.log(err);
        } else {
          console.log(newlyCreated);
          res.redirect("/blogs");
        }
    });
});

// //NEW - show form to create new campground
router.get("/new", middleware.isLoggedIn, function(req, res){
   res.render("blogs/new"); 
});

// // SHOW - shows more info about one Blog
router.get("/:id", function(req, res){
    //find the campground with provided ID
    Blog.findById(req.params.id).populate("comments").exec(function(err, foundBlog){
        if(err){
            console.log(err);
        } else {
            console.log(foundBlog)
            //render show template with that campground
            res.render("blogs/show", {campground: foundBlog});
        }
    });
});

// // EDIT CAMPGROUND ROUTE
// router.get("/:id/edit", middleware.checkCampgroundOwnership, function(req, res){
//     Campground.findById(req.params.id, function(err, foundCampground){
//         res.render("campgrounds/edit", {campground: foundCampground});
//     });
// });

// // UPDATE CAMPGROUND ROUTE
// router.put("/:id",middleware.checkCampgroundOwnership, function(req, res){
//     // find and update the correct campground
//     Campground.findByIdAndUpdate(req.params.id, req.body.campground, function(err, updatedCampground){
//        if(err){
//            res.redirect("/campgrounds");
//        } else {
//            //redirect somewhere(show page)
//            res.redirect("/campgrounds/" + req.params.id);
//        }
//     });
// });

// // DESTROY CAMPGROUND ROUTE
// router.delete("/:id",middleware.checkCampgroundOwnership, function(req, res){
//    Campground.findByIdAndRemove(req.params.id, function(err){
//       if(err){
//           res.redirect("/campgrounds");
//       } else {
//           res.redirect("/campgrounds");
//       }
//    });
// });


module.exports = router;

