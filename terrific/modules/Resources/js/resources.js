(function() {
    Tc.Module.Resources = Tc.Module.extend({
        init: function($ctx, sandbox, modId) {
            // call base constructor
            this._super($ctx, sandbox, modId);
            this.tpl = t.get('Resources.resources-list');
        },

        on: function(callback) {
            var self = this,
                $ctx = this.$ctx,
                tpl = this.tpl,
                cfg = this.sandbox.getConfig(),
                module = null;


            // show existing resources
            $.ajax({
                url : '/api/modules/' + cfg.id,
                timeout : 5000,
                success : function(data) {
                    module = data;
                    $ctx.find('.content').html(tpl({ 'resources' : data.resources }));
                }
            });

            // upload new resource
            $ctx.find('.fileupload').fileupload({ dataType: 'json' });

            // remove global dep from module
            $ctx.on('click', '.delete-resource', function() {
                // build resource array
                var $this = $(this).closest('.resource'),
                    id = $this.data('id'),
                    resources = [];

                for(var i = 0, len = module.resources.length; i < len; i++) {
                    var resource = module.resources[i];

                    if(resource._id != id) {
                        resources.push(resource._id);
                    }
                }

                $.ajax({
                    type : 'PUT',
                    url : '/api/modules/' + cfg.id + '/resources',
                    data: {
                        resources : resources
                    },
                    timeout : 5000,
                    success : function(data) {
                        $this.fadeOut();
                    }
                });

                return false;
            });

            // save and add action
            var $nav = $('.mod-navigation');

            $nav.on('click', '.b-back', function () {
                document.location.hash = 'edit/' + cfg.id

                return false;
            });

            $nav.on('click', '.b-resource', function() {
                $ctx.find('.fileupload').click();

                return false;
            });

            callback();
        },

        after: function() {
        }
    });
})();