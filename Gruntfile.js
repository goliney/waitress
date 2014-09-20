module.exports = function (grunt) {

    // 1. All configuration goes here
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),

        uglify: {
            waitress: {
                src: 'Waitress.js',
                dest: 'Waitress.min.js'
            }
        },

        jsdoc : {
            waitress : {
                src: [
                    'Waitress.js'
                ],
                options: {
                    destination: 'docs/'
                }
            }
        },

        jshint: {
            all: ['Waitress.js']
        }

    });

    // 2. Where we tell Grunt we plan to use this plug-in.
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.loadNpmTasks('grunt-jsdoc');

    // 3. Where we tell Grunt what to do when we type "grunt" into the terminal.
    grunt.registerTask('build', ['jsdoc', 'uglify']);
};