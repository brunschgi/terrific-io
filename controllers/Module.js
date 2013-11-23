var Module = require('../models/Module'),
	Tag = require('../models/Tag'),
	Precompiler = require('../services/Precompiler');

module.exports = function (app) {

	return {
		search: function (req, res, next) {
			var query = Module.find();

			/* filters */

			// show only picks
			if (req.query.picks === 'true') {
				query.where('meta.pick').equals(true);
			}

			if (req.query.user) {
				query.where('user').equals(req.query.user);
			}

			/* sort order */

			if (req.query.sort) {
				if (req.query.sort == 'newest') {
					// sort chronologically descending
					query.sort({ updated: 'desc'});
				}
				else if (req.query.sort == 'natural') {
					// sort chronologically asc
					query.sort({ updated: 'asc'});
				}
				else if (req.query.sort === 'popular') {
					// sort most popular
					query.sort({ 'meta.views': 'desc', 'meta.favs': 'desc', 'meta.votes': 'desc' });
				}
			}
			else {
				// sort chronologically
				query.sort({ updated: 'desc'});
			}

			// fill document
			query.populate('resources')
				.populate('user');

			query.exec(function (err, list) {
				if (err) next(err);
				res.json(list);
			});
		},

		create: function (req, res, next) {
			new Module({
				name: req.body.name,
				description: req.body.description,
				html: req.body.html,
				css: req.body.css,
				js: req.body.js
			}).save(function (err, doc) {
					if (err) next(err);
					res.json(doc);
				});
		},

		read: function (req, res, next) {
			Module.findOne({ _id: req.params.id })
				.populate('resources')
				.populate('user')
				.exec(function (err, doc) {
					if (err) next(err);
					res.json(doc);
				});
		},

		render: function (req, res, next) {
			Module.findOne({ _id: req.params.id })
				.populate('resources')
				.exec(function (err, doc) {
					if (err) next(err);

					Precompiler.compile(doc.html.content, doc.html.type, function(htmlContent) {
						Precompiler.compile(doc.css.content, doc.css.type, function(cssContent) {
							Precompiler.compile(doc.js.content, doc.js.type, function(jsContent) {
								res.render('module.html', { layout: false, module: doc, htmlContent: htmlContent, cssContent: cssContent, jsContent: jsContent });
							});
						});
					});
				});
		},

		update: function (req, res, next) {
			Module.findOne({ _id: req.params.id }, function (err, doc) {
				if (err) next(err);

				if (req.body.name) {
					doc.name = req.body.name;
				}

				if (req.body.description) {
					doc.description = req.body.description;
				}

				if (req.body.html) {
					if (req.body.html.content) {
						doc.html.content = req.body.html.content;
					}
					if (req.body.html.type) {
						doc.html.type = req.body.html.type;
					}
				}

				if (req.body.css) {
					if (req.body.css.content) {
						doc.css.content = req.body.css.content;
					}
					if (req.body.css.type) {
						doc.css.type = req.body.css.type;
					}
				}

				if (req.body.js) {
					if (req.body.js.content) {
						doc.js.content = req.body.js.content;
					}
					if (req.body.js.type) {
						doc.js.type = req.body.js.type;
					}
				}

				doc.save(function (err) {
					if (err) next(err);
					res.json(doc);
				});
			});
		},

		updateTags: function (req, res, next) {
			Module.findOne({ _id: req.params.id }, function (err, doc) {
				if (err) next(err);
				doc.tags = req.body.tags;

				doc.save(function (err) {
					if (err) next(err);
					res.json(doc);
				});
			});
		},

		updateResources: function (req, res, next) {
			Module.findOne({ _id: req.params.id }, function (err, doc) {
				if (err) next(err);
				doc.resources = req.body.resources;

				doc.save(function (err) {
					if (err) next(err);
					res.json(doc);
				});
			});
		},

		delete: function (req, res, next) {
			Module.remove({ _id: req.params.id }, function (err, doc) {
				if (err) next(err);
				res.send();
			});
		},

		precompile: function (req, res, next) {
			Precompiler.compile(req.body.content, req.body.type, function(compiled) {
				res.json({ "compiled": compiled });
			});
		}
	}
};
