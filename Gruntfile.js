module.exports = function(grunt) {

  'use strict';

  grunt.initConfig({

    pkg: grunt.file.readJSON('package.json'),
    banner: '/*!\n' +
            ' * Jedo version <%= pkg.version %>\n' +
            ' * Copyright 2014-Preset\n' +
            ' * Author: <%= pkg.author %>\n' +
            ' * Licensed under <%= pkg.license %>\n' +
            ' */\n',

    /**
     * ------------------------------------------------------------
     * Clean
     * ------------------------------------------------------------
     */
    

    clean: {
      dist: 'dist'
    },


    /**
     * ------------------------------------------------------------
     * JSHint (http://www.jshint.com/docs/options)
     * ------------------------------------------------------------
     */

    jshint: {
      options: {
        jshintrc: '.jshintrc',
        reporter: require('jshint-stylish')
      },
      grunt: 'Gruntfile.js',
      src: 'src/**/*.js'
    },


    /**
     * ------------------------------------------------------------
     * Concat
     * ------------------------------------------------------------
     */

    concat: {
      options: {
        banner: '<%= banner %>',
        stripBanners: false
      },
      dist: {
        src: ['bower_components/microtemplates/index.js', 'src/jedo.js'],
        dest: 'dist/<%= pkg.name %>.js'
      }
    },


    /**
     * ------------------------------------------------------------
     * Watch
     * ------------------------------------------------------------
     */
    
    watch: {
      src: {
        files: '<%= jshint.src.src %>',
        tasks: ['jshint:src:newer', 'concat']
      }
    },


    /**
     * ------------------------------------------------------------
     * Uglify
     * ------------------------------------------------------------
     */
    

    uglify: {
      options: {
        banner: '<%= banner %>',
        sourceMap: false
      },
      dist: {
        files: {
          'dist/jedo.min.js': ['dist/jedo.js']
        }
      }
    }


  });


  // https://github.com/gruntjs/grunt-contrib-clean
  grunt.loadNpmTasks('grunt-contrib-clean');

  // https://github.com/gruntjs/grunt-contrib-concat
  grunt.loadNpmTasks('grunt-contrib-concat');

  // https://github.com/tschaub/grunt-newer
  grunt.loadNpmTasks('grunt-newer');

  // https://github.com/gruntjs/grunt-contrib-watch
  grunt.loadNpmTasks('grunt-contrib-watch');

  // https://github.com/gruntjs/grunt-contrib-jshint
  grunt.loadNpmTasks('grunt-contrib-jshint');

  // https://github.com/gruntjs/grunt-contrib-uglify
  grunt.loadNpmTasks('grunt-contrib-uglify');



  grunt.registerTask('default', ['jshint']);

  grunt.registerTask('dev', ['default', 'watch']);

  grunt.registerTask('dist', ['clean', 'default', 'concat', 'uglify']);

};