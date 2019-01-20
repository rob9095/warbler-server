const mongoose = require('mongoose');
const User = require('./user');
const Comment = require('./comment');

const messageSchema = new mongoose.Schema(
	{
		text: {
			type: String,
			required: true,
			maxLength: 160
		},
		user: {
			type: mongoose.Schema.Types.ObjectId,
			ref: 'User'
		},
		likes: [{
			type: mongoose.Schema.Types.ObjectId,
			ref: 'User'
		}],
		comments: [{
			type: mongoose.Schema.Types.ObjectId,
			ref: 'Comment'
		}],
	},
	{
		timestamps: true
	}
);

messageSchema.pre('remove', async function(next) {
	try {
		// find the user
		let user = await User.findById(this.user);
		// find the comments
		let comments = await Comment.find({parentMessage: this.id})
		// remove this message id from users messages/likes array
		user.messages.remove(this.id);
		user.likes.remove(this.id);
		// remove any comments associated with this message
		comments.remove();
		// save the user
		await user.save();
		// return next
		return next();
	} catch(err) {
		return next(err);
	}
})

const Message = mongoose.model('Message', messageSchema);
module.exports = Message;
