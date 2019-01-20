const db = require('../models');

//POST - /api/users/:id/comments/:message_id
exports.createComment = async function(req, res, next) {
	try {
    // find parent message
    let foundParentMessage = await db.Message.findById(req.params.message_id);
    // make sure it exists
    if (foundParentMessage === null) {
      return next({
				status: 400,
				message: 'Message not found!'
			});
    }
    // create the comment
		let comment = await db.Comment.create({
			text: req.body.text,
			user: req.params.id,
      parentMessage: req.params.message_id
		});
    // push the new comment id into the parentMessage comments array
		foundParentMessage.comments.push(comment.id);
    // save the message
		await foundParentMessage.save();
    // find the newly created comment and add some additional info to user ref
    let foundComment = await db.Comment.findById(comment.id).populate('user', {
      username: true,
      profileImageUrl: true,
    });
		return res.status(200).json(foundComment);
	} catch(err) {
		return next(err);
	}
};

//GET /api/messages/:message_id/comments
exports.getMessageComments = async function(req, res, next) {
	try {
		let comments = await db.Comment.find({parentMessage: req.params.message_id})
		.populate('user', {
			username: true,
			profileImageUrl: true
		});
		return res.status(200).json(comments);
	} catch(err) {
		return next(err);
	}
}

//DELETE - /api/users/:id/comments/:comment_id
exports.deleteComment = async function(req, res, next) {
  try{
    let foundComment = await db.Comment.findById(req.params.comment_id);
    await foundComment.remove();
    return res.status(200).json(foundComment);
  } catch(err){
    return next(err);
  }
}
