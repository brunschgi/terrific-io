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
		'../app': {
			deps: ['terrific']
		},
		'ace/ace': {
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
	$(document).ready(function () {
		"use strict";

		// make hasher globally available
		window.hasher = hasher;

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

			if (typeof cfg.end === 'function') {
				application.end(cfg.end);
			}

			application.start();
		};

		/* routes */
		crossroads.addRoute('/', function () {
			// define view modules
			sections['header'] = ['Navigation.navigation'];
			sections['workspace'] = ['ModuleBrowser.module-browser'];

			// render view
			t.view($content, 'default', sections);

			bootstrap({ end: function () {
				// start module search
				application.connectors['search'].notify(null, 'onSearch');
			}});
		});

		crossroads.addRoute('/search/:q*:', function (q) {
			// define view modules
			sections['header'] = ['Navigation.navigation'];
			sections['workspace'] = ['Search.search', 'ModuleBrowser.module-browser'];

			// render view
			t.view($content, 'default', sections);

			// build query object
			var query = {};

			if(q) {
				var params = q.split('/');

				for(var i = 0, len = params.length; i < len; i++) {
					var param = params[i].split('=');

					if(param['value'] != '') {
						query[param[0]] = param[1];
					}
				}
			}

			bootstrap({ end: function () {
				// start module search
				application.connectors['search'].notify(null, 'onSearch', query);
			}});
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

			bootstrap({ id: id, end: function () {
				// start search for user
				application.connectors['search'].notify(null, 'onSearch', { user: id });
			}});
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
