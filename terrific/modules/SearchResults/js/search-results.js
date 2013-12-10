(function() {
    Tc.Module.SearchResults = Tc.Module.extend({
        init: function($ctx, sandbox, modId) {
            // call base constructor
            this._super($ctx, sandbox, modId);
        },

        on: function(callback) {
            var self = this,
                $ctx = this.$ctx,
                cfg = this.sandbox.getConfig();


           /*$.ajax({
                url : '/api/user?' + query.join('&'),
                timeout : 5000,
                success : function(data) {
                    $('.modules', $ctx).html(tpl({ 'modules' : data }));
                }
            });*/

            callback();
        },

        after: function() {
        }
    });
})();