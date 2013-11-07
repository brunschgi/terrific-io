var fixtures = require('pow-mongoose-fixtures');
var mongoose = require('mongoose');

var User = require('../models/User'),
	Resource = require('../models/Resource'),
	Tag = require('../models/Tag'),
	Module = require('../models/Module');

module.exports = function (app) {
	return {
		/*
		 * Load data.
		 */
		load: function (req, res) {
			fixtures.load(__dirname + '/../fixtures/fixtures.js', mongoose.connection, function () {
				res.send(JSON.stringify({ success: true }));
			});
		}
	}
};
