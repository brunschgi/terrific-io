(function () {
	Tc.Module.ModuleBrowser = Tc.Module.extend({
		init: function ($ctx, sandbox, modId) {
			// call base constructor
			this._super($ctx, sandbox, modId);
			this.tpl = t.get('ModuleBrowser.module-browser-list');
		},

		on: function (callback) {
			var self = this,
				$ctx = this.$ctx,
				tpl = this.tpl,
				cfg = this.sandbox.getConfig(),
				query = [];

			// build query string
			for (var key in cfg['query']) {
				var value = cfg['query'][key];
				query.push(key + '=' + value);
			}

			$.ajax({
				url: '/api/modules?' + query.join('&'),
				timeout: 5000,
				success: function (data) {
					$('.modules', $ctx).html(tpl({ 'modules': data }));
				}
			});

			callback();
		},

		after: function () {
		}
	});
})();