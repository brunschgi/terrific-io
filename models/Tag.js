var mongoose = require('mongoose');

var schema = new mongoose.Schema({
	name: String
}, { strict: true });

schema.index({ name: 1, active: -1 });

module.exports = mongoose.model('Tag', schema);

module.exports.schema = schema;