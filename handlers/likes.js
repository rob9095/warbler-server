const db = require('../models');

// POST - /api/users/:id/likes/:message_id
exports.addLike = async function(req, res, next) {
	try {
		// the user being followed
		let foundUserLiking = await db.User.findById(req.params.id);
		// the current user requesting to follow
		let foundMessageLiked = await db.Message.findById(req.params.message_id);
    // the user with a message that was liked
		let foundUserLiked = await db.User.findById(foundMessageLiked.user);
		// make sure the users and message exist
		if (foundUserLiking === null || foundMessageLiked === null || foundUserLiked === null) {
			return next({
				status: 400,
				message: 'User/Message not found!'
			});
		}
    // create the like in the db, likeKey is unique and stops from liking the same message twice
    let like = await db.Like.create({
      likeKey: `${foundUserLiking._id}-${foundMessageLiked._id}`,
      userLiking: foundUserLiking._id,
      userLiked: foundUserLiked._id,
      messageLiked: foundMessageLiked._id
    });
    // make sure like was created
		let foundLike = await db.Like.findById(like._id);
    // if like was found add info to db and save
    if (foundLike !== null) {
      // push messageId into the likes array for the user that liked message
  		foundUserLiking.likes.push(foundMessageLiked._id);
  	   // push the new like into the likedMessages array for the user with the message that was liked
  		foundUserLiked.likedMessages.push(like._id);
      // push the userLiking userID into the likes array on the message that was likedMessages
      foundMessageLiked.likes.push(foundUserLiking._id);
      // save
  		await foundUserLiking.save();
  		await foundUserLiked.save();
  		await foundMessageLiked.save();
    }
		  return res.status(200).json({foundLike});
	} catch(err) {
		if(err.code === 11000) {
			err.message = 'Message already liked';
		}
		return next(err);
	}
};

// DELETE a like from message - /api/users/:id/likes/:message_id
exports.removeLike = async function(req, res, next) {
	try {
		let foundLike = await db.Like.findOne({userLiking: req.params.id, messageLiked: req.params.message_id});
    if(foundLike === null) {
      return next({
				status: 400,
				message: 'Message not liked'
			});
		}
		await foundLike.remove();
		return res.status(200).json(foundLike);
	} catch(err) {
		return next(err);
	}
};
