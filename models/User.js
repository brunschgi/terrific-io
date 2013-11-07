var mongoose = require('mongoose');

var schema = new mongoose.Schema({
	_id: String,
	password: String,
	name: String,
	email: String,
	img_url: String,
	bio: String,
	active: { type: Boolean, default: true },
	created: { type: Date, default: Date.now},
	modified: { type: Date, default: Date.now}
}, { strict: true });

schema.index({ name: 1, active: -1 });

module.exports = mongoose.model('User', schema);

module.exports.schema = schema;