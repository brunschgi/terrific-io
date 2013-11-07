module.exports = function (app) {
	return {
		/*
		 * GET app page.
		 */
		app: function (req, res) {
			var title = 'terrific.io';
			res.render('site.html', { title: title });
		},

		/*
		 * GET login page.
		 */
		login: function (req, res) {
			var title = 'login';
			res.render('login.html', { title: title });
		}
	}
};
