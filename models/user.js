var mongoose = require("mongoose");
var passportLocalMongoose = require("passport-local-mongoose");

var UserSchema = new mongoose.Schema({
    username: String,
    password: String,
    type: String,
    image: String,
    description: String,
    blogs: [
    	{
    		type: mongoose.Schema.Types.ObjectId,
    		ref: "Blog"
    	}
    ]
    
   
});

UserSchema.plugin(passportLocalMongoose);

module.exports = mongoose.model("User", UserSchema);