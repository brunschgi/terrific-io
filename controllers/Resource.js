var Resource = require('../models/Resource');

module.exports = function (app) {

	return {
		list: function (req, res, next) {
			Resource.find(function (err, list) {
				if (err) next(err);
				res.json(list);
			});
		},

		create: function (req, res, next) {
			new Resource({
				name: req.body.name,
				src: req.body.src,
				size: req.body.size,
				type: req.body.type
			}).save(function (err, doc) {
				if (err) next(err);
				res.json(doc);
			});
		},

		delete: function (req, res, next) {
			Resource.remove({ _id: req.params.id }, function (err, doc) {
				if (err) next(err);
				res.send();
			});
		}
	}
};
