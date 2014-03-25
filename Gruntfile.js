"use strict";



function serve(connect, options) {
    // overload for not downloading the file, instead, view it
    connect.mime.define({
        'text/plain': ['ts']
    });
    var middlewares = [];
    if (!Array.isArray(options.base)) {
        options.base = [options.base];
    }
    var directory = options.directory || options.base[options.base.length - 1];
    options.base.forEach(function(base) {
        // Serve static files.
        middlewares.push(connect.static(base));
    });
    // Make directory browse-able.
    middlewares.push(connect.directory(directory));
    return middlewares;
}



module.exports = function(grunt) {

    // Project configuration.
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        connect: {
            server: {
                options: {
                    port: 8080,
                    base: './',
                    middleware: serve
                }
            }
        },

        typescript: {
            base: {
                src: ['src/**/*.ts'],

                options: {
                    module: 'amd', //or commonjs
                    target: 'es5', //or es3
                    basePath: './',
                    sourceMap: true,
                    force: true,
                    declaration: false,
                    comments: true
                }
            }

        },
        watch: {
            files: '**/*.ts',
            tasks: ['typescript','tslint']
        },
        open: {
            dev: {
                path: 'http://localhost:8080/'
            }
        },
        tsd: {
            refresh: {
                options: {
                    // execute a command
                    command: 'reinstall',

                    //optional: always get from HEAD
                    latest: true,

                    // optional: specify config file
                    config: 'tsd.json'
                }
            }
        },
        tslint: {
            options: {
                // Task-specific options go here.
                configuration: grunt.file.readJSON("tslint.json")
            },
            your_target: {
                // Target-specific file lists and/or options go here.
                src: ["src/**/*.ts"]
            },
        }



    });

    grunt.loadNpmTasks('grunt-typescript');
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-contrib-connect');
    grunt.loadNpmTasks('grunt-open');

    grunt.loadNpmTasks('grunt-tsd');
    grunt.loadNpmTasks('grunt-tslint');
	grunt.loadNpmTasks('grunt-contrib-jshint');

    // Default task(s).
    //grunt.registerTask('default', ['typescript', 'connect', 'yuidoc', 'open', 'watch']);
    grunt.registerTask('default', ['tsd:refresh','typescript', 'connect', 'open', 'watch']);


};
