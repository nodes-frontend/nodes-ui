// https://github.com/gruntjs/grunt-contrib-copy
module.exports = {
	docs: {
		files: [{
			expand: true,
			dot: true,
			cwd: '<%= paths.doc %>assets/',
			src: [
				'*.{ico,png}',
				'.htaccess',
				'assets/img/**/*.{jpeg,jpg,png,svg,webp}',
				'assets/fonts/*',
				'assets/icons/*.{svg,png}'
			],
			dest: '<%= paths.dist %>/'
		}]
	},
	dist: {
		files: [{
			expand: true,
			dot: true,
			cwd: '<%= paths.assets %>',
			src: [
				'*.{ico,png}',
				'img/**/*.{jpeg,jpg,png,svg,webp}',
				'fonts/*',
				'icons/*.{svg,png}'
			],
			dest: '<%= paths.dist %>assets/'
		}]
	},
	browserify: {
		files: [{
			expand: true,
			dot: true,
			cwd: '.tmp/browserify',
			src: [
				'*.js'
			],
			dest: '<%= paths.dist %>assets/js'
		}]
	},
	zeroclipboard: {
		files: [{
			src: ['<%= paths.vendor %>zeroclipboard/dist/ZeroClipboard.swf'],
			dest: '<%= paths.dist %>assets/js/ZeroClipboard.swf'
		}]
	}
};
