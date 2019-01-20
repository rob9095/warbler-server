const express = require('express');
const router = express.Router({mergeParams: true});
const { addLike, removeLike } = require('../handlers/likes');

// prefixed with /api/users/:id/likes/
router
	.route('/:message_id')
	.post(addLike)
	.delete(removeLike);

module.exports = router;
