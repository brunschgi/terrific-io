define([], function () {
    Tc.Module.Navigation = Tc.Module.extend({
        init: function ($ctx, sandbox, modId) {
            // call base constructor
            this._super($ctx, sandbox, modId);
        },

        on: function (callback) {
            var self = this,
                $ctx = this.$ctx,
                cfg = this.sandbox.getConfig();

            this.sandbox.subscribe('editor', this);

            $ctx.on('click', '.b-create', function () {
                $.ajax({
                    type: 'post',
                    url: '/api/modules',
                    timeout: 5000,
                    success: function (data) {
                        document.location.hash = 'edit/' + data._id;
                    }
                });

                return false;
            });


            callback();
        },

        after: function () {
        }
    });
});