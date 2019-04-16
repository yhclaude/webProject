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
    GithubStrategy = require('passport-github').Strategy,
    dotenvConfig = require('dotenv').config();

//requiring routes
var commentRoutes    = require("./routes/comments"),
    blogRoutes = require("./routes/blogs"),
    indexRoutes      = require("./routes/index"),
    userRoutes      = require("./routes/user")

// connect mongo
const mongoDB = ("mongodb+srv://"+
                 process.env.USERNAME+
                 ":"
                 +process.env.PASSWORD+
                 "@"
                 +process.env.HOST+
                 "/"
                 +process.env.DATABASE);

mongoose.connect(mongoDB, {useNewUrlParser: true, retryWrites: true});

// middleware used
app.use(bodyParser.urlencoded({extended: true}));
app.set("view engine", "ejs");
app.use(express.static(__dirname + "/public"));
app.use(methodOverride("_method"));
app.use(flash());

// github
// passport.use(new GithubStrategy({
//     clientID: process.env.GITHUB_CLIENT_ID,
//     clientSecret: process.env.GITHUB_CLIENT_SECRET,
//     callbackURL: 'https://'+process.env.PROJECT_DOMAIN+'.glitch.me/login/github/return',
// },
// function(token, tokenSecret, profile, cb) {
//     return cb(null, profile);
// }));
// passport.serializeUser(function(user, done) {
//     done(null, user);
// });
// passport.deserializeUser(function(obj, done) {
//     done(null, obj);
// });


// PASSPORT CONFIGURATION
app.use(require("express-session")({
    secret: "secret",
    resave: false,
    saveUninitialized: false
}));

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use(function(req, res, next){
   res.locals.currentUser = req.user;
   res.locals.error = req.flash("error");
   res.locals.success = req.flash("success");
   next();
});

app.use("/", indexRoutes);
app.use("/user", userRoutes);
app.use("/blogs", blogRoutes);
app.use("/blogs/:id/comments", commentRoutes);

const listener = app.listen(process.env.PORT, function() {
   console.log('Your app is listening on port ' + listener.address().port);
});