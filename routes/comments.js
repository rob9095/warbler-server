const express = require('express');
const router = express.Router({mergeParams: true});
const { createComment, getMessageComments, deleteComment } = require('../handlers/comments');

// prefixed with /api/messages/:message_id
router.route('/comments').get(getMessageComments);

// prefixed with /api/users/:id/comments
router.route('/:message_id').post(createComment);
router.route('/:comment_id').delete(deleteComment);

module.exports = router;
