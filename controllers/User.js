var User = require('../models/User');

module.exports = function (app) {

	return {
		list: function (req, res, next) {
			var query = User.find();

			// only list active users
			query.where('active').equals(true);

			// sort lexically
			query.sort({ username: 'asc' });

			query.exec(function (err, list) {
				if (err) next(err);
				res.json(list);
			});
		},

		search: function (req, res, next) {
			var query = User.find();


			if (req.query.active) {
				if (req.query.active === 'true') {
					query.where('active').equals(true);
				}
				else {
					query.where('active').equals(false);
				}
			}

			// sort lexically
			query.sort({ username: 'asc' });

			query.exec(function (err, list) {
				if (err) next(err);
				res.json(list);
			});
		},

		create: function (req, res, next) {
			new User({
				username: reg.body.username,
				name: req.body.name,
				email: req.body.email,
				img_url: req.body.img_url,
				bio: req.body.bio
			}).save(function (err, doc) {
				if (err) next(err);
				res.json(doc);
			});
		},

		read: function (req, res, next) {
			User.findOne({ username: req.params.username }, function (err, doc) {
				if (err) next(err);
				res.json(doc);
			});
		},

		update: function (req, res, next) {
			User.findOne({ username: req.params.username }, function (err, doc) {
				if (err) next(err);
				doc.name = req.body.name;
				doc.email = req.body.email;
				doc.img_url = req.body.img_url;
				doc.bio = req.body.bio;
				doc.active = req.body.active;
				doc.modified = new Date.now();

				doc.save(function (err) {
					if (err) next(err);
					res.json(doc);
				});
			});
		},

		delete: function (req, res, next) {
			User.remove({ username: req.params.username }, function (err, doc) {
				if (err) next(err);
				res.send();
			});
		}
	}
};
