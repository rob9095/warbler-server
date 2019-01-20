const db = require('../models');

// GET a users public details - /api/users/:username
exports.getUser = async function(req, res, next) {
	try {
		let user = await db.User.findOne({username: req.params.username});
		return res.status(200).json({
			id: user._id,
			username: user.username,
      profileImageUrl: user.profileImageUrl,
      messages: user.messages,
      followers: user.followers,
      following: user.following,
			likes: user.likes,
			likedMessages: user.likedMessages
    })
	} catch(err) {
		return next(err);
	}
};

// GET all messages for specific user - /api/users/:username/messages - maybe this should be in messages?
exports.getUserMessages = async function(req, res, next) {
	try {
		let user = await db.User.findOne({username: req.params.username});
		let messages = await db.Message.find({user : user._id});
		return res.status(200).json(messages)
	} catch(err) {
		return next(err);
	}
};
