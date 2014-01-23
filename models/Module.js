var mongoose = require('mongoose'),
	textSearch = require('mongoose-text-search');

var schema = new mongoose.Schema({
	name: { type: String, default: "" },
	description: { type: String, default: "" },
	html: {
		type: { type: String, default: "html"},
		content: { type: String, default: "" }
	},
	css: {
		type: { type: String, default: "css"},
		content: { type: String, default: "" }
	},
	js: {
		type: { type: String, default: "javascript"},
		content: { type: String, default: "" }
	},
	user: { type: String, ref: 'User', default: 'brunschgi' },
	collaborators: [
		{ type: String, ref: 'User' }
	],
	tags: [
		{ type: mongoose.Schema.ObjectId, ref: 'Tag' }
	],
	meta: {
		votes: { type: Number, default: 0 },
		favs: { type: Number, default: 0 },
		views: { type: Number, default: 0 },
		pick: { type: Boolean, default: false }
	},
	resources: [
		{ type: mongoose.Schema.ObjectId, ref: 'Resource' }
	],
	active: { type: Boolean, default: true },
	created: { type: Date, default: Date.now},
	modified: { type: Date, default: Date.now}
}, { strict: true });

// give our schema text search capabilities
schema.plugin(textSearch);

// add some indices
schema.index({ name: 'text', description: 'text' });
schema.index({ name: 1, active: -1 });

schema.pre('save', function (next) {
	this.modified = new Date;
	next();
});

module.exports = mongoose.model('Module', schema);
module.exports.schema = schema;