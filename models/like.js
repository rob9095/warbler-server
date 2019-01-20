const mongoose = require('mongoose');
const User = require('./user');
const Message = require('./message');

const likeSchema = new mongoose.Schema(
	{
		likeKey: {
			type: String,
			required: true,
			unique: true
		},
		userLiking: {
			type: mongoose.Schema.Types.ObjectId,
			ref: 'User'
		},
    userLiked: {
			type: mongoose.Schema.Types.ObjectId,
			ref: 'User'
		},
		messageLiked: {
			type: mongoose.Schema.Types.ObjectId,
			ref: 'Message'
		}
	},
	{
		timestamps: true
	}
);

likeSchema.pre('remove', async function(next) {
	try {
		// find the users and the message
		let foundUserLiking = await User.findById(this.userLiking);
		let foundUserLiked = await User.findById(this.userLiked);
		let foundMessageLiked = await Message.findById(this.messageLiked);
		// remove the id the message from the user liking's likes array
		foundUserLiking.likes.remove(this.messageLiked);
    // remove the id of the like from the messages likes array for the user who was liked
		foundUserLiked.likedMessages.remove(this.id);
    // remove the id of the user from the message liked likes array
		foundMessageLiked.likes.remove(this.userLiking);
		// save the changes
		await foundUserLiking.save();
		await foundUserLiked.save();
		await foundMessageLiked.save();
		// return next
		return next();
	} catch(err) {
		return next(err);
	}
})

const Like = mongoose.model('Like', likeSchema);
module.exports = Like;
