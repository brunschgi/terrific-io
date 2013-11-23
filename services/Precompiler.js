var less = require('less'),
	sass = require('node-sass');

/**
 * Compiles data.
 *
 * @param content the content to precompile
 * @param type the type into which the content is compiled
 * @param callback the callback to execute
 */
exports.compile = function (content, type, callback) {
	if (!callback) {
		return false;
	}
	if(!content) {
		callback('');
		return false;
	}
	if(!type) {
		callback(content);
		return false;
	}

	if (type == 'less') {
		less.render(content, function (e, css) {
			callback(css);
		});
	}
	else if (type == 'sass') {
		sass.render({
			data: content,
			success: function (css) {
				callback(css);
			}
		});
	}
	else {
		callback(content);
	}
};
