var mongoose = require("mongoose");
var passportLocalMongoose = require("passport-local-mongoose");


var AdminSchema = new mongoose.Schema({
	username: String,
	password: String,
	type: String,
	image: String,
	// users: [
	// 	{
	// 		types: mongoose.Schema.Types.ObjectId,
	// 		ref: "User"
	// 	}
	// ]
});

AdminSchema.plugin(passportLocalMongoose);

module.exports = mongoose.model("Admin", AdminSchema);