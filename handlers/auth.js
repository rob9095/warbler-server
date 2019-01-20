const db = require('../models');
const jwt = require('jsonwebtoken');

exports.signin = async function(req, res, next) {
	try {
		let user = await db.User.findOne({
			email: req.body.email
		});
		let { id, username, profileImageUrl, messages, following, followers, likes, likedMessages } = user;
		let isMatch = await user.comparePassword(req.body.password);
		if(isMatch){
			let token = jwt.sign(
			{
				id,
				username,
				profileImageUrl,
				messages,
				followers,
				following,
				likes,
				likedMessages
			},
				process.env.SECRET_KEY
			);
			return res.status(200).json({
				id,
				username,
				profileImageUrl,
				messages,
				following,
				followers,
				likes,
				likedMessages,
				token
			});
		} else {
			return next({
				status: 400,
				message: 'Invalid email or password'
			})
		}
	} catch(err) {
		return next({
			status: 400,
			message: 'Invalid email or password'
		})
	}
};

exports.signup = async function(req, res, next){
	try {
		let user = await db.User.create(req.body);
		let { id, username, profileImageUrl, messages, following, followers, likes, likedMessages } = user;
		let token = jwt.sign(
		{
			id,
			username,
			profileImageUrl
		},
		process.env.SECRET_KEY
		);
		return res.status(200).json({
			id,
			username,
			profileImageUrl,
			messages,
			following,
			followers,
			likes,
			likedMessages,
			token
		});
	} catch(err) {
		if(err.code === 11000) {
			err.message = 'Sorry, that username and/or email has been taken.'
		}
		return next({
			status:400,
			message: err.message
		});

	}
};
