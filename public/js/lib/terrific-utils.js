define(['jquery', '../templates'], function ($, templates) {

    "use strict";

    var t = window.t = {
        /*  render view */
        view : function($ctx, view, sections) {
            view = view || 'default';
            sections = sections || {};

            var fn = templates.views[view];

            if($.isFunction(fn)) {
               $ctx.html(fn({'t' : t, 'sections' : sections }));
            }
        },

        /* render module */
        module : function(module, data) {
            module = module || 'Default.default';
            data = data || {};

            var parts = module.split('.');
            var fn = templates.modules[parts[0]][parts[1]];

            if($.isFunction(fn)) {
                return fn(data);
            }
        },

        /* get module */
        get: function(module) {
            module = module || 'Default.default';

            var parts = module.split('.');
            var fn = templates.modules[parts[0]][parts[1]];

            if($.isFunction(fn)) {
                return fn;
            }
        }
    };

    return t;
});