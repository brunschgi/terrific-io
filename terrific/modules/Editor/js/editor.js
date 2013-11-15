(function () {
	Tc.Module.Editor = Tc.Module.extend({
		init: function ($ctx, sandbox, modId) {
			// call base constructor
			this._super($ctx, sandbox, modId);
			this.html = null;
			this.css = null;
			this.js = null;
			this.module;
		},

		on: function (callback) {
			var self = this,
				$ctx = this.$ctx,
				cfg = this.sandbox.getConfig();

			this.sandbox.subscribe('editor', this);

			// apply editors
			var html = this.html = ace.edit($('code.html', $ctx).get(0));
			html.setTheme("ace/theme/github");
			html.getSession().setMode("ace/mode/html");

			var css = this.css = ace.edit($('code.css', $ctx).get(0));
			css.setTheme("ace/theme/github");
			css.getSession().setMode("ace/mode/css");

			var js = this.js = ace.edit($('code.js', $ctx).get(0));
			js.setTheme("ace/theme/github");
			js.getSession().setMode("ace/mode/javascript");

			// bind events
			var timeout = null;
			html.on('change', function () {
				clearTimeout(timeout);
				timeout = setTimeout(function () {
					self.renderPreview('html');
				}, 500);
			});

			css.on('change', function () {
				clearTimeout(timeout);
				timeout = setTimeout(function () {
					self.renderPreview('css');
				}, 500);
			});

			js.on('change', function () {
				clearTimeout(timeout);
				timeout = setTimeout(function () {
					self.renderPreview('js');
				}, 500);
			});

			// save and add action
			var $nav = $('.mod-navigation');

			$nav.on('click', '.b-save',function () {
				$.ajax({
					type: 'put',
					url: '/api/modules/' + cfg.id,
					timeout: 5000,
					data: {
						html: {
							content: html.getValue()
						},
						css: {
							content: css.getValue()
						},
						js: {
							content: js.getValue()
						}
					},
					success: function (data) {
						self.fire('saved', data);
					}
				});

				return false;
			}).on('click', '.b-resources', function () {
					document.location.hash = 'edit/' + cfg.id + '/resources'
					return false;
				});


			// initial preview
			$.ajax({
				url: '/api/modules/' + cfg.id,
				timeout: 5000,
				success: function (data) {
					self.module = data;
					self.displayCode(data); // render preview is triggered automatically by changing the code
				}
			});

			// event handlers
			$ctx.on('click', '.js-precompilers a', function() {
				var $this = $(this);
				var type = $this.closest('header').data('type');

				if(type === 'css') {
					css.getSession().setMode('ace/mode/' + $this.attr('href').substring(1));
				}

				return false;
			});

			callback();
		},

		after: function () {
		},

		displayCode: function (data) {
			var self = this,
				$ctx = this.$ctx;

			this.html.setValue(data.html.content);
			this.css.setValue(data.css.content);
			this.js.setValue(data.js.content);
		},

		renderPreview: function (changed) {
			var self = this,
				$ctx = this.$ctx,
				html = this.html,
				css = this.css,
				js = this.js,
				htmlContent = html.getValue(),
				cssContent = css.getValue(),
				jsContent = js.getValue,
				deferred = $.Deferred();



			// preprocess if necessary
			if(changed === 'css' && css.getSession().getMode().$id === 'ace/mode/less') {
				$.ajax({
					type: 'post',
					url: '/api/modules/precompile',
					timeout: 5000,
					data: {
						css: {
							content: cssContent,
							type: 'less'
						}
					},
					success: function (data) {
						cssContent = data.processed;
						deferred.resolve();
					}
				});
			}
			else {
				deferred.resolve();
			}

			// initial rendering
			var module = this.module;


			deferred.done(function() {
				var iframe = $ctx.find('iframe')[0],
					doc = (iframe.contentWindow || iframe.contentDocument).document;

				doc.open();
				doc.write('<!doctype html><html><head>');

				// error handler
				doc.write('<script type="text/javascript">' +
					'window.alert = function(){};' +
					'window.confirm = function(){};' +
					'window.prompt = function(){};' +
					'window.open = function(){};' +
					'window.print = function(){};' +
					'window.onerror = function(msg, url, line) { console.log(msg); return true; };' +
					'</script>');

				// styles
				doc.write('<style>' + cssContent + '</style>');

				doc.write('</head><body>');

				// markup
				doc.write(htmlContent);

				// js
				doc.write('<script>' +  jsContent + '</script>');
				doc.write('</body></html>');
				doc.close();

				// set iframe height
				iframe.height = $(doc).height();
			});
		}
	});
})();