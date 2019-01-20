const express = require('express');
const router = express.Router({mergeParams: true});

const { addFollower, getFollower, getFollowers, getFollowing, deleteFollower } = require('../handlers/followers');

// prefixed with /api/users/:id/followers
router.route('/').get(getFollowers);

// prefixed with /api/users/:id/followers/
router
	.route('/:follower_id')
	.post(addFollower)
	.get(getFollower)
	.delete(deleteFollower);

module.exports = router;
