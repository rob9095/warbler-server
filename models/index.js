const mongoose = require('mongoose');
mongoose.set('debug', true);
mongoose.Promise = Promise;
var options = {
  server: { socketOptions: { keepAlive: 1, connectTimeoutMS: 30000 } },
  replset: { socketOptions: { keepAlive: 1, connectTimeoutMS: 30000 } }
};

mongoose.connect('mongodb://admin:warblerdem19>@ds227199.mlab.com:27199/warbler', options);

module.exports.User = require('./user');
module.exports.Message = require('./message');
module.exports.Follower = require('./follower');
module.exports.Like = require('./like');
module.exports.Comment = require('./comment');
