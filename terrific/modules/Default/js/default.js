(function () {
	Tc.Module.Default = Tc.Module.extend({
		init: function ($ctx, sandbox, modId) {
			// call base constructor
			this._super($ctx, sandbox, modId);
		},

		on: function (callback) {
			callback();
		},

		after: function () {
		}
	});
})();