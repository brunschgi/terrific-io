var Tag = require('../models/Tag');

module.exports = function (app) {

	return {
		search: function (req, res, next) {
			Tag.find(function (err, list) {
				if (err) next(err);
				res.json(list);
			});
		},

		create: function (req, res, next) {
			new Tag({
				name: req.body.name
			}).save(function (err, doc) {
				if (err) next(err);
				res.json(doc);
			});
		},

		delete: function (req, res, next) {
			Tag.remove({ _id: req.params.id }, function (err, doc) {
				if (err) next(err);
				res.send();
			});
		}
	}
};
