require('dotenv').config();
const express = require('express');
const app = express();
const cors = require('cors');
const bodyParser = require('body-parser');
const errorHandler = require('./handlers/error');
const authRoutes = require('./routes/auth');
const followersRoutes = require('./routes/followers');
const followingRoutes = require('./routes/following');
const messagesRoutes = require('./routes/messages');
const likesRoutes = require('./routes/likes');
const usersRoutes = require('./routes/users');
const commentsRoutes = require('./routes/comments');
const db = require("./models");
const { loginRequired, ensureCorrectUser } = require('./middleware/auth');
const PORT = 8081;

app.use(cors())
app.use(bodyParser.json());


// routes

// post signin and signups
app.use('/api/auth', authRoutes);

// post, delete, get individual message
app.use(
	'/api/users/:id/messages',
	loginRequired,
	ensureCorrectUser,
	messagesRoutes);

// get all comments for message
app.use(
	'/api/messages/:message_id',
	loginRequired,
	// ensureCorrectUser,
	commentsRoutes);

// post, delete comment for a message
app.use(
	'/api/users/:id/comments/',
	loginRequired,
	ensureCorrectUser,
	commentsRoutes);

// post, delete a like for a message
app.use(
		'/api/users/:id/likes',
		loginRequired,
		ensureCorrectUser,
		likesRoutes);

// get data for individual user
app.use(
		'/api/users/:username',
		// loginRequired,
		// ensureCorrectUser,
		usersRoutes);

// get messages for individual user
app.use(
  	'/api/users/:username/user_messages',
		// loginRequired,
		// ensureCorrectUser,
		usersRoutes);

// get, post, delete followers for individual user
app.use(
		'/api/users/:id/followers',
		loginRequired,
		ensureCorrectUser,
		followersRoutes);

// get following for individual user
app.use(
		'/api/users/:id/following',
		loginRequired,
		ensureCorrectUser,
		followingRoutes);

// get all messages
app.get('/api/messages', loginRequired, async function(req, res, next) {
	try {
		let messages = await db.Message.find()
		.sort({ createdAt: 'desc'})
		.populate('user', {
			username: true,
			profileImageUrl: true
		});
		return res.status(200).json(messages);
	} catch(err) {
		return next(err);
	}
});

app.use(errorHandler);

app.listen(PORT, function(){
	console.log(`Server starting on port ${PORT}`)
});
