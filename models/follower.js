const mongoose = require('mongoose');
const User = require('./user');

const followerSchema = new mongoose.Schema(
	{
		followerKey: {
			type: String,
			required: true,
			unique: true
		},
		userFollowed: {
			type: mongoose.Schema.Types.ObjectId,
			ref: 'User'
		},
		userFollowing: {
			type: mongoose.Schema.Types.ObjectId,
			ref: 'User'
		}
	},
	{
		timestamps: true
	}
);

followerSchema.pre('remove', async function(next) {
	try {
		// find the users
		let foundUserFollowing = await User.findById(this.userFollowing);
		let foundUserFollowed = await User.findById(this.userFollowed);		
		// remove the id the follower from their following/follower list
		foundUserFollowing.following.remove(this.userFollowed);
		foundUserFollowed.followers.remove(this.userFollowing);		
		// save the users
		await foundUserFollowed.save();
		await foundUserFollowing.save();		
		// return next
		return next();
	} catch(err) {
		return next(err);
	}
})

const Follower = mongoose.model('Follower', followerSchema);
module.exports = Follower;
