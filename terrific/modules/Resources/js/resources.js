(function () {
	Tc.Module.Resources = Tc.Module.extend({
		init: function ($ctx, sandbox, modId) {
			// call base constructor
			this._super($ctx, sandbox, modId);
			this.tpl = t.get('Resources.resources-list');
		},

		on: function (callback) {
			var self = this,
				$ctx = this.$ctx,
				tpl = this.tpl,
				cfg = this.sandbox.getConfig(),
				localResources = null,
				globalResources = [];


			// show existing resources
			$.when($.ajax({
					url: '/api/resources',
					timeout: 5000,
					success: function(data) {
						globalResources = data;
					}
				}), $.ajax({
					url: '/api/modules/' + cfg.id,
					timeout: 5000,
					success: function(data) {
						localResources = data.resources;
					}
				})).then(function () {
					$ctx.find('.content').html(tpl({ 'local': localResources, 'global': globalResources }));
				});

			// upload new resource
			var $fileupload = $ctx.find('.fileupload');

			// TODO: onSuccess /resource/create (local) & add req param with id to upload to correct directory
			$fileupload.fileupload({
				dataType:'json',
				url: '/api/resources/test',
				autoUpload: true,
				sequentialUploads:true,
				acceptFileTypes:/(\.|\/)(js|css|less|sass)$/i,
				dropZone: $('.dropzone', $ctx),
				filesContainer:$('.thumbnails.local', $ctx),
				uploadTemplate:function (o) {
					console.log('test up');
					var rows = $();
					$.each(o.files, function (index, file) {
						var row = $('<li>test upload</li>');
						rows = rows.add(row);
					});
					return rows;
				},
				downloadTemplate: function (o) {
					console.log('test down');
					var rows = $();
					$.each(o.files, function (index, file) {
						var row = $('<li>test upload</li>');
						rows = rows.add(row);
					});
					return rows;
				}
			});

			// remove dep from module
			$ctx.on('click', '.delete-resource', function () {
				// build resource array
				var $this = $(this).closest('.resource'),
					id = $this.data('id'),
					resources = [];

				for (var i = 0, len = localResources.length; i < len; i++) {
					var resource = localResources[i];

					if (resource._id != id) {
						resources.push(resource._id);
					}
				}

				$.ajax({
					type: 'PUT',
					url: '/api/modules/' + cfg.id + '/resources',
					data: {
						resources: resources
					},
					timeout: 5000,
					success: function (data) {
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

			$nav.on('click', '.b-resource', function () {
				$fileupload.click();

				return false;
			});

			callback();
		},

		after: function () {
		}
	});
})();