(function () {
	Tc.Module.Editor = Tc.Module.extend({
		init: function ($ctx, sandbox, modId) {
			// call base constructor
			this._super($ctx, sandbox, modId);
			this.html = null;
			this.css = null;
			this.js = null;
			this.htmlContent, // precompiled content
			this.cssContent, // precompiled content
			this.jsContent; // precompiled content
			this.module,
			this.silent = false;
		},

		on: function (callback) {
			var self = this,
				$ctx = this.$ctx,
				cfg = this.sandbox.getConfig();

			self.sandbox.subscribe('editor', self);

			// apply editors
			var html = self.html = ace.edit($('code.html', $ctx).get(0));
			html.setTheme("ace/theme/github");

			var css = self.css = ace.edit($('code.css', $ctx).get(0));
			css.setTheme("ace/theme/github");

			var js = self.js = ace.edit($('code.js', $ctx).get(0));
			js.setTheme("ace/theme/github");

			// bind events
			var timeout = null;
			html.on('change', function () {
				if (self.silent) {
					return true;
				}
				clearTimeout(timeout);
				timeout = setTimeout(function () {
					self.renderPreview({ html: true });
				}, 500);
			});

			css.on('change', function () {
				if (self.silent) {
					return true;
				}
				clearTimeout(timeout);
				timeout = setTimeout(function () {
					self.renderPreview({ css: true });
				}, 500);
			});

			js.on('change', function () {
				if (self.silent) {
					return true;
				}
				clearTimeout(timeout);
				timeout = setTimeout(function () {
					self.renderPreview({ js: true });
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
							content: html.getValue(),
							type: self.module.html.type
						},
						css: {
							content: css.getValue(),
							type: self.module.css.type
						},
						js: {
							content: js.getValue(),
							type: self.module.js.type
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
					self.displayCode(data);
				}
			});

			// event handlers
			$ctx.on('click', '.js-precompilers a', function () {
				var $this = $(this);
				var type = $this.closest('header').data('type');

				if (type === 'css') {
					self.module.css.type = $this.attr('href').substring(1);
					css.session.setMode('ace/mode/' + self.module.css.type);
					self.renderPreview({ css: true });
				}

				return false;
			});

			callback();
		},

		after: function () {
		},

		displayCode: function () {
			var self = this,
				$ctx = this.$ctx,
				module = this.module;

			self.silent = true;
			self.html.session.setMode('ace/mode/' + module.html.type);
			self.html.setValue(module.html.content);

			self.css.session.setMode('ace/mode/' + module.css.type);
			self.css.setValue(module.css.content);

			self.js.session.setMode('ace/mode/' + module.js.type);
			self.js.setValue(module.js.content);
			self.silent = false;

			self.renderPreview({ html: true, css: true, js: true })
		},

		renderPreview: function (changed) {
			var self = this,
				$ctx = this.$ctx,
				html = this.html,
				css = this.css,
				js = this.js,
				module = this.module,
				defHtml = $.Deferred(),
				defCss = $.Deferred(),
				defJs = $.Deferred();

			if (changed.html) {
				self.htmlContent = html.getValue();
			}
			defHtml.resolve();

			if (changed.css) {
				// only preprocess if necessary
				if (module.css.type == 'less' || module.css.type == 'sass') {
					$.ajax({
						type: 'post',
						url: '/api/modules/precompile',
						timeout: 5000,
						data: {
							content: css.getValue(),
							type: module.css.type
						},
						success: function (data) {
							self.cssContent = data.compiled;
							defCss.resolve();
						}
					});
				}
				else {
					self.cssContent = css.getValue();
					defCss.resolve();
				}
			}
			else {
				defCss.resolve();
			}

			if (changed.js) {
				self.jsContent = js.getValue();
			}
			defJs.resolve();


			// initial rendering
			$.when(defHtml, defCss, defJs).then(function () {
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

				// dependencies
				for(var i = 0, len = module.resources.length; i < len; i++) {
					var resource = module.resources[i];
					var src = '/js/module-deps/';

					if(resource.global === true) {
						src += 'global/';
					}
					else {
						src += 'modules/' + it.module._id + '/';
					}

					src += resource.src + resource.name;
					doc.write('<script type="text/javascript" src="' + src + '"></script>');
				}

				// styles
				doc.write('<style>' + self.cssContent + '</style>');

				doc.write('</head><body>');

				// markup
				doc.write(self.htmlContent);

				// js
				doc.write('<script>' + self.jsContent + '</script>');
				doc.write('</body></html>');
				doc.close();

				// set iframe height
				iframe.height = $(doc).height();
			});
		}
	});
})();