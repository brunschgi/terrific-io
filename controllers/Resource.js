var Resource = require('../models/Resource');

module.exports = function (app, upload) {

	return {
		search: function (req, res, next) {
			var query = Resource.find();

			/* filters */

			// search only global resources
			if (req.query.global === 'false') {
				query.where('global').equals(false);
			}
			else {
				query.where('global').equals(true);
			}

			// sort lexically
			query.sort({ name: 'asc' });

			query.exec(function (err, list) {
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
		},

		upload: function (req, res, next) {
			upload.fileHandler({
				uploadDir: function () {
					return __dirname + '/../public/uploads'
				},
				uploadUrl: function () {
					return '/uploads'
				}
			})(req, res, next);
		}
	}
};
