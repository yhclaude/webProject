var express     = require("express"),
    app         = express(),
    bodyParser  = require("body-parser"),
    mongoose    = require("mongoose"),
    flash       = require("connect-flash"),
    passport    = require("passport"),
    LocalStrategy = require("passport-local"),
    methodOverride = require("method-override"),
    Blog  = require("./models/blog"),
    Comment     = require("./models/comment"),
    User        = require("./models/user"),
    seedDB      = require("./seeds");
   //  port        = 9292;
    
//requiring routes
var commentRoutes    = require("./routes/comments"),
    blogRoutes = require("./routes/blogs"),
    indexRoutes      = require("./routes/index")
 
// var url = process.env.DATABASEURL || "mongodb://localhost/yelp_camp_v10";
// var uri = 'mongodb://JamesLin:<Lin!960605>@cluster0-x6qm9.mongodb.net/travelBlog?retryWrites=true'
// mongoose.connect(uri);

const mongoDB = ("mongodb+srv://"+
                 "yuh_claude"+
                 ":"
                 +"12545219500hy"+
                 "@"
                 +"cutie-wgsgm.mongodb.net"+
                 "/"
                 +"camp");
mongoose.connect(mongoDB, {useNewUrlParser: true, retryWrites: true});

app.use(bodyParser.urlencoded({extended: true}));
app.set("view engine", "ejs");
app.use(express.static(__dirname + "/public"));
app.use(methodOverride("_method"));
app.use(flash());
// seedDB(); //seed the database

// PASSPORT CONFIGURATION
app.use(require("express-session")({
    secret: "secret",
    resave: false,
    saveUninitialized: false
}));

app.use(passport.initialize());
app.use(passport.session());

//passport.use(new LocalStrategy(User.authenticate()));
passport.use(new LocalStrategy(
   function(username, password, done) {
       User.findOne({
         username: username
       }, function(err, user) {
         if (err) {
            Admin.findOne({username:username}, function(err, admin) {
               if (err) {
                  return done(err);
               }
               if (!admin) {
                  return done(null, false);
               }
               if (admin.password != password) {
                  return done(null, false);
               }
               return done(null, admin);
            });
           return done(err);
         }
 
         if (!user) {
           return done(null, false);
         }
 
         if (user.password != password) {
           return done(null, false);
         }
         return done(null, user);
       });
   }))
//passport.serializeUser(User.serializeUser());
//passport.deserializeUser(User.deserializeUser());

// passport.serializeUser(function (entity, done) {
//    done(null, { id: entity.id, type: entity.type });
// });

passport.deserializeUser(function (obj, done) {
   switch (obj.type) {
       case 'user':
           User.findById(obj.id)
               .then(user => {
                   if (user) {
                       done(null, user);
                   }
                   else {
                       done(new Error('user id not found:' + objid, null));
                   }
               });
           break;
       case 'admin':
           Admin.findById(obj.id)
               .then(admin => {
                   if (admin) {
                       done(null, admin);
                   } else {
                       done(new Error('admin id not found:' + obj.id, null));
                   }
               });
           break;
       default:
           done(new Error('no entity type:', obj.type), null);
           break;
   }
});



app.use(function(req, res, next){
   res.locals.currentUser = req.user;
   res.locals.error = req.flash("error");
   res.locals.success = req.flash("success");
   next();
});

app.use("/", indexRoutes);
app.use("/blogs", blogRoutes);
app.use("/blogs/:id/comments", commentRoutes);


// app.listen(process.env.PORT, process.env.IP, function(){
//    console.log("The Travel Blog Server Has Started!");
// });

const listener = app.listen(process.env.PORT, function() {
   console.log('Your app is listening on port ' + listener.address().port);
});