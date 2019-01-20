const express = require('express');
const router = express.Router({mergeParams: true});

const { getUser, getUserMessages } = require('../handlers/users');

// prefixed with /api/users/:username
router.route('/').get(getUser);

// prefixed with /api/users/:username/ -> maybe this should go into messages?
router.route('/user_messages').get(getUserMessages);


module.exports = router;
