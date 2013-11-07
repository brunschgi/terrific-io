requirejs.config({
    // base url
    baseUrl: '/js/lib',

    // paths
    paths: {
        // jQuery
        jquery: 'jquery-1.10.1.min'
    },

    shim: {
        'terrific': {
            // These script dependencies should be loaded before loading terrific
            deps: ['jquery'],

            // Once loaded, use the global 'Tc' as the module value
            exports: 'Tc'
        },
        '../app' : {
            deps: ['terrific']
        },
        'ace/ace' : {
            exports: 'ace'
        }
    }
});

require([
    // base libraries
    'jquery', // jquery version
    'crossroads.min', // client side routing framework
    'hasher.min', // hash change framework
    'terrific', // terrific js for modularization
    'terrific-utils', // client side terrific utils'
    'doT.min', // client side template engine
    'moment.min',
    'jquery.ui.widget',
    'jquery.fileupload',
    '../app' // all terrific stuff
], function ($, crossroads, hasher) {
    $(document).ready(function() {

        "use strict";

        var application = null;
        var sections = {};
        var $content = $('#content');

        /* bootstrap */
        var bootstrap = function (cfg) {
            cfg = cfg || {};

            var $page = $('body'),
                config = $.extend({
                    baseUrl: $page.data('baseurl')
                }, cfg);

            application = new Tc.Application($page, config);
            application.registerModules();
            application.start();
        };

        /* routes */
        crossroads.addRoute('/', function () {
            // define view modules
            sections['header'] = ['Navigation.navigation'];
            sections['workspace'] = ['ModuleBrowser.module-browser'];

            // render view
            t.view($content, 'default', sections);

            bootstrap();
        });

        crossroads.addRoute('/edit/{id}', function (id) {
            // define view modules
            sections['header'] = ['Navigation.navigation-editor'];
            sections['workspace'] = ['Editor.editor'];

            // render view
            t.view($content, 'editor', sections);

            bootstrap({ id: id });
        });

        crossroads.addRoute('/edit/{id}/resources', function (id) {
            // define view modules
            sections['header'] = ['Navigation.navigation-editor-resources'];
            sections['workspace'] = ['Resources.resources'];

            // render view
            t.view($content, 'default', sections);

            bootstrap({ id: id });
        });


        crossroads.addRoute('/user/{id}', function (id) {
            // define view modules
            sections['header'] = ['Navigation.navigation'];
            sections['workspace'] = ['Profile.profile', 'ModuleBrowser.module-browser'];

            // render view
            t.view($content, 'editor', sections);

            bootstrap({ id: id, query: { user : id }});
        });

        /* setup routing system */
        function parseHash(newHash, oldHash) {
            crossroads.parse(newHash);
        }

        hasher.initialized.add(parseHash); //parse initial hash
        hasher.changed.add(parseHash); //parse hash changes
        hasher.init(); //start listening for history change
    });
});
