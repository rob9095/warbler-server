const mongoose = require('mongoose');
const db = require('../models');
const User = require('./user');
const Message = require('./message');

const commentSchema = new mongoose.Schema(
	{
		text: {
			type: String,
			required: true
		},
		user: {
			type: mongoose.Schema.Types.ObjectId,
			ref: 'User'
		},
    parentMessage: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Message'
    },
		likes: [{
			type: mongoose.Schema.Types.ObjectId,
			ref: 'User'
		}],
	},
	{
		timestamps: true
	}
);

commentSchema.pre('remove', async function(next) {
	try {
		// find the parent message
		let parentMessage = await db.Message.findById(this.parentMessage);
    // if parent message not found it was deleted and this comment is also being delteted so return next
    if (parentMessage === null) {
      return next();
    }
		// remove the id for the comment from the parentMessage
		parentMessage.comments.remove(this.id);
		// save that parentMessage
		await parentMessage.save();
		// return next
		return next();
	} catch(err) {
		return next(err);
	}
})

const Comment = mongoose.model('Comment', commentSchema);
module.exports = Comment;
