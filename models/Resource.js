var mongoose = require('mongoose');

var schema = new mongoose.Schema({
	name: String,
	src: String,
	size: Number,
	global: { type: Boolean, default: false },
	type: String,
	created: { type: Date, default: Date.now}
}, { strict: true });

schema.index({ name: 1, active: -1 });

module.exports = mongoose.model('Resource', schema);

module.exports.schema = schema;