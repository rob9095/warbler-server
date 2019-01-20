const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const userSchema = new mongoose.Schema({
	email: {
		type: String,
		required: true,
		unique: true
	},
	username: {
		type: String,
		required: true,
		unique: true
	},
	password: {
		type: String,
		required: true
	},
	profileImageUrl: {
		type: String
	},
	messages: [{
		type: mongoose.Schema.Types.ObjectId,
		ref: 'Message'
	}],
	// messageIds for the messages that the user has liked
	likes: [{
		type: mongoose.Schema.Types.ObjectId,
		ref: 'Message'
	}],
	// likeIds for the likes that the user has recieved
	likedMessages: [{
		type: mongoose.Schema.Types.ObjectId,
		ref: 'Like'
	}],
	// followerIds for the users followers
	followers: [{
		type: mongoose.Schema.Types.ObjectId,
		ref: 'Follower'
	}],
	// followerIds for the users following
	following: [{
		type: mongoose.Schema.Types.ObjectId,
		ref: 'Follower'
	}]
});

userSchema.pre('save', async function(next) {
	try {
		if(!this.isModified('password')){
			return next();
		}
		let hashedPassword = await bcrypt.hash(this.password, 10);
		this.password = hashedPassword;
		return next();
	  } catch (err) {
		  return next(err);
	  }
});

userSchema.methods.comparePassword = async function(candidatePassword, next) {
	try {
		let isMatch = await bcrypt.compare(candidatePassword, this.password);
		return isMatch;
	} catch(err){
		return next(err);
	}
};

const User = mongoose.model('User', userSchema);

module.exports = User;
