(function() {
    Tc.Module.Search = Tc.Module.extend({
        init: function($ctx, sandbox, modId) {
            // call base constructor
            this._super($ctx, sandbox, modId);
        },

        on: function(callback) {
            var self = this,
                $ctx = this.$ctx,
				$form = $('form', $ctx);

			self.sandbox.subscribe('search', this);

			$form.on('submit', function(e) {
				e.preventDefault();

				var serializedQuery = $form.serializeArray();

				// build search object
				var query = {};
				for(var i = 0, len = serializedQuery.length; i < len; i++) {
					var param = serializedQuery[i];

					if(param['value'] != '') {
						query[param['name']] = param['value'];
					}
				}

				// build nice url
				var url = [];
				for(var key in query) {
					var value = query[key];
					url.push(key + '=' + value);
				}

				// set hash without redirecting
				hasher.changed.active = false; //disable changed signal
				hasher.setHash('search/' + url.join('/')); //set hash without dispatching changed signal
				hasher.changed.active = true; //re-enable signal

				self.fire('search', query);
			});

            callback();
        }
    });
})();