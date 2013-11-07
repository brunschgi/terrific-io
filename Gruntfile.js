module.exports = function (grunt) {
	grunt.initConfig({
		pkg: grunt.file.readJSON('package.json'),
		sources: {
			/* server_js: [
			 '<%= pkg.scripts.start %>',
			 'config/*.js',
			 'models/*.js',
			 'controllers/*.js'
			 ], */
			app_js: [
				'terrific/modules/*/js/*.js'
			],
			app_css: [
				'terrific/colors.less',
				'terrific/mixins.less',
				'public/css/lib/bootstrap.css',
				'public/css/lib/bootstrap-responsive.css',
				'terrific/modules/*/css/*.less'
			],
			templates: [
				'terrific/views/*.dot',
				'terrific/modules/*/*.dot'
			]
		},
		tmp: 'tmp',
		dest: 'public',
		concat: {
			app_js: {
				src: '<%= sources.app_js %>', dest: '<%= dest %>/js/app.js'
			},
			app_css: {
				src: '<%= sources.app_css %>', dest: '<%= tmp %>/app.less'
			}
		},
		uglify: {
			app_js: {
				src: '<%= dest %>/app.js', dest: '<%= dest %>/app.min.js'
			}
		},
		less: {
			app_css: {
				options: {}, src: '<%= tmp %>/app.less', dest: '<%= dest %>/css/app.css'
			}
		},
		cssmin: {
			app_css: {
				files: {
					'<%= dest %>/css/app.min.css': ['<%= dest %>/css/app.css']
				}
			}
		},
		dot: {
			compile: {
				options: {
					root: 'terrific'
				},
				files: {
					'public/js/templates.js': '<%= sources.templates %>'
				}
			}
		},
		/* develop: {
		 server: {
		 file: '<%= pkg.scripts.start %>'
		 }
		 }, */
		watch: {
			/* develop: {
			 files: ['<%= sources.server_js %>'],
			 tasks: 'develop',
			 options: {
			 nospawn: true
			 }
			 }, */
			css: {
				files: ['<%= sources.app_css %>'],
				tasks: ['build-css']
			},
			js: {
				files: ['<%= sources.app_js %>'],
				tasks: ['build-js']
			},
			templates: {
				files: ['<%= sources.templates %>'],
				tasks: ['dot']
			}
		}
	});

	/* grunt.loadNpmTasks('grunt-develop'); */
	grunt.loadNpmTasks('grunt-contrib-concat');
	grunt.loadNpmTasks('grunt-contrib-cssmin');
	grunt.loadNpmTasks('grunt-contrib-less');
	grunt.loadNpmTasks('grunt-contrib-uglify');
	grunt.loadNpmTasks('grunt-contrib-watch');
	grunt.loadNpmTasks('grunt-dot');

	// create pipelines
	grunt.registerTask('build-js', ['concat:app_js']);
	grunt.registerTask('build-css', ['concat:app_css', 'less:app_css']);
	grunt.registerTask('min-js', ['uglify:app_js']);
	grunt.registerTask('min-css', ['cssmin:app_css']);

	// aggregate pipelines
	grunt.registerTask('default', [
		'build-js',
		'build-css',
		'dot',
		'watch'
	]);
};