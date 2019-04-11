var mongoose = require("mongoose"),
	Schema = mongoose.Schema,
	bcrypt = require("bcrypt"),
	SALT_WORK_FACTOR = 5;

var passportLocalMongoose = require("passport-local-mongoose");


var AdminSchema = new mongoose.Schema({
	adminname: {type: String, required: true, index: { unique: true }},
	password: {type: String, required: true},
	image: String,
	users: [
		{
			types: mongoose.Schema.Types.ObjectId,
			ref: "User"
		}
	]
});

AdminSchema.plugin(passportLocalMongoose);

AdminSchema.pre('save', function(next) {
	var admin = this;

	if (!admin.isModified('password')) return next();

	// generate a salt
	bcrypt.genSalt(SALT_WORK_FACTOR, function(err, salt) {
		if (err) return next(err);

		bcrypt.hash(admin.password, salt, function(err, hash) {
			if (err) return next(err);

			admin.password = hash;
			next();
		});
	});
});

AdminSchema.methods.comparePassword = function(candidatePassword, cb) {
	bcrypt.compare(candidatePassword. this.password, function(err, isMatch) {
		if (err) return cb(err);
		cb(null, isMatch);
	});
};
module.exports = mongoose.model("Admin", AdminSchema);

